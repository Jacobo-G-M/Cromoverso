import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useMundos(id) {
  const [mundos, setMundos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tryMundos, setTryMundos] = useState(0);
  

  useEffect(() => {
    const controller = new AbortController();
    const limit = setTimeout(() => controller.abort(), 12000);
    let current = true;
    setLoading(true);
    setError(false);
    setMundos(null);

    async function loadWorlds() {
      try {
        
        const result = await fetch(`${API_URL}/mundos${id ? `/${id}` : ''}`, {
          signal: controller.signal,
        });
        if (!result.ok) throw new Error(`HTTP ${result.status}`)
        const data = await result.json();
        if (current) setMundos(data.datos || data);
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error("Error loading the worlds: ", error);
        setError(true);
      } finally {
        clearTimeout(limit);
        if (current) setLoading(false);
      }
    }

    loadWorlds();
    return () => {
      current = false;
      clearTimeout(limit);
      controller.abort();
    }
  }, [id, tryMundos])

  return {
    mundos,
    loading,
    error,
    refresh: () => {
      setTryMundos((value) => value + 1)
    },
  };
}