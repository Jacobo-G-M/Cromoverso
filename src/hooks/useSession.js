import { useCallback, useEffect, useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
const ACTIVE_SESSION_FLAG = 'cromoverso_sesion_activa';

function hadActiveSession() {
  try {
    return sessionStorage.getItem(ACTIVE_SESSION_FLAG) === '1';
  } catch {
    return false;
  }
}

function markSessionActive() {
  try {
    sessionStorage.setItem(ACTIVE_SESSION_FLAG, '1');
  } catch {
    // Ignore storage access errors
  }
}

function clearSessionActive() {
  try {
    sessionStorage.removeItem(ACTIVE_SESSION_FLAG);
  } catch {
    // Ignore storage access errors
  }
}

function parseRetryAfter(headerValue) {
  if (!headerValue) return null;

  const numericSeconds = Number(headerValue);
  if (Number.isFinite(numericSeconds) && numericSeconds > 0) {
    return Math.ceil(numericSeconds);
  }

  const parsedDate = Date.parse(headerValue);
  if (!Number.isNaN(parsedDate)) {
    const diffSeconds = Math.ceil((parsedDate - Date.now()) / 1000);
    return diffSeconds > 0 ? diffSeconds : 1;
  }

  return null;
}

export function useSession({ onSessionExpired } = {}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const submittingRef = useRef(false);
  const userRef = useRef(null);
  const onSessionExpiredRef = useRef(onSessionExpired);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    onSessionExpiredRef.current = onSessionExpired;
  }, [onSessionExpired]);

  const checkSession = useCallback(async ({ signal } = {}) => {
    try {
      const res = await fetch(`${API_URL}/sesion`, {
        credentials: 'include',
        signal,
      });

      if (res.status === 401) {
        let code = null;
        try {
          const errData = await res.json();
          code = errData?.error?.codigo ?? null;
        } catch {
          // Response body is not valid JSON
        }

        const wasAuthenticated = Boolean(userRef.current) || hadActiveSession();
        clearSessionActive();
        setUser(null);

        if (wasAuthenticated && (!code || code === 'no_autenticado')) {
          onSessionExpiredRef.current?.();
        }
        return null;
      }

      if (!res.ok) return null;

      const data = await res.json();
      if (data?.usuario) {
        markSessionActive();
        setUser(data.usuario);
        return data.usuario;
      }

      return null;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error checking session:', error);
      }
      return null;
    }
  }, []);

  // Hydrate active session on initial load via HttpOnly cookie 'sesion'
  useEffect(() => {
    const controller = new AbortController();

    async function hydrate() {
      await checkSession({ signal: controller.signal });
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }

    hydrate();
    return () => controller.abort();
  }, [checkSession]);

  // Re-validate session when returning to the browser tab while authenticated
  useEffect(() => {
    if (!user) return;

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'hidden') return;
      checkSession();
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [user, checkSession]);

  const login = useCallback(async ({ correo, clave }) => {
    if (submittingRef.current) {
      return { ok: false, ignored: true };
    }

    submittingRef.current = true;
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/sesion`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, clave }),
      });

      if (!response.ok) {
        const retryAfter = parseRetryAfter(response.headers.get('Retry-After'));
        let errData = null;
        try {
          errData = await response.json();
        } catch {
          // Response body is not valid JSON
        }

        return {
          ok: false,
          status: response.status,
          code: errData?.error?.codigo ?? null,
          fields: errData?.error?.campos ?? null,
          retryAfter,
        };
      }

      const data = await response.json();
      if (data?.usuario) {
        markSessionActive();
        setUser(data.usuario);
        return { ok: true, usuario: data.usuario };
      }

      return { ok: false, status: response.status, code: 'generico' };
    } catch (error) {
      console.error('Error signing in:', error);
      return {
        ok: false,
        status: 0,
        code: 'conexion',
        networkError: true,
      };
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    clearSessionActive();
    try {
      await fetch(`${API_URL}/sesion`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
    }
  }, []);

  return {
    user,
    loading,
    submitting,
    login,
    logout,
    checkSession,
  };
}
