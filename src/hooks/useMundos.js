import { useEffect, useState } from "react";

// Base API endpoint URL loaded from environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook to fetch worlds catalog or individual world details with cards.
 *
 *
 * @param {string} [id] - Optional world identifier (e.g., 'coral', 'neon').
 *                        If omitted, fetches the overview list of all six worlds.
 * @returns {Object} State object containing:
 *   - mundos: Array of worlds or specific world object with cards.
 *   - loading: Boolean indicating whether an active request is in flight.
 *   - error: Boolean indicating if the request failed.
 *   - refresh: Callback function to manually re-trigger the fetch.
 */
export function useMundos(id) {
  // Holds fetched world data (or catalog overview)
  const [mundos, setMundos] = useState(null);

  // Tracks loading state for spinners or loading indicators
  const [loading, setLoading] = useState(true);

  // Tracks fetch failure status
  const [error, setError] = useState(false);

  // Counter used to trigger manual re-fetches
  const [tryMundos, setTryMundos] = useState(0);
  

  useEffect(() => {
    // Controller to cancel pending requests on rapid switching or component unmount
    const controller = new AbortController();

    // Safety timeout: aborts request if it takes longer than 12 seconds
    const limit = setTimeout(() => controller.abort(), 12000);

    let current = true;
    setLoading(true);
    setError(false);

    // Cards are rendered on screen until new data arrives (smooth transition).

    async function loadWorlds() {
      try {
        // Build endpoint: '/mundos' for all worlds or '/mundos/:id' for a specific world
        const result = await fetch(`${API_URL}/mundos${id ? `/${id}` : ''}`, {
          signal: controller.signal,
        });
        if (!result.ok) throw new Error(`HTTP ${result.status}`)
        const data = await result.json();

      // Only update state if this effect instance is still active
        if (current) setMundos(data.datos || data);
      } catch (error) {
        // Ignore expected cancellation abort errors
        if (error.name === 'AbortError') return;
        console.error("Error loading the worlds: ", error);
        setError(true);
      } finally {
        clearTimeout(limit);
        if (current) setLoading(false);
      }
    }

    loadWorlds();

    // Cleanup function: flags instance as stale and aborts ongoing HTTP request
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