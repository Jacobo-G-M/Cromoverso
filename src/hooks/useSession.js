import { useCallback, useEffect, useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
const SESSION_TOKEN_KEY = 'cromoverso_session_token';

function getStoredSessionToken() {
  try {
    return localStorage.getItem(SESSION_TOKEN_KEY) || sessionStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

function saveSessionToken(token, keepSession) {
  try {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    if (!token) return;
    if (keepSession) {
      localStorage.setItem(SESSION_TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    }
  } catch {
    // Ignore storage access errors
  }
}

function clearSessionToken() {
  try {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
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

export function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const token = getStoredSessionToken();

    async function loadSession() {
      try {
        const res = await fetch(`${API_URL}/sesion`, {
          credentials: 'include',
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          if (res.status === 401) clearSessionToken();
          return;
        }
        const data = await res.json();
        if (data?.usuario) {
          setUser(data.usuario);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error checking session:', error);
        }
      } finally {
        setLoading(false);
      }
    }

    loadSession();
    return () => controller.abort();
  }, []);

  const login = useCallback(async ({ correo, clave, keepSession = true }) => {
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
        setUser(data.usuario);
        saveSessionToken(data.token, keepSession);
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
    const token = getStoredSessionToken();
    try {
      await fetch(`${API_URL}/sesion`, {
        method: 'DELETE',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      clearSessionToken();
      setUser(null);
    }
  }, []);

  return {
    user,
    loading,
    submitting,
    login,
    logout,
  };
}
