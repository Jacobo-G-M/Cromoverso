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
 *   - card: Array of worlds or specific world object with cards.
 *   - loading: Boolean indicating whether an active request is in flight.
 *   - error: Boolean indicating if the request failed.
 *   - notFound: Boolean indicating if the card has not been found.
 *   - refresh: Callback function to manually re-trigger the fetch.
 */
export function useCromos(id) {
  // Holds fetched card data (or catalog overview)
  const [card, setCard] = useState(null);

  // Tracks loading state for spinners or loading indicators
  const [loading, setLoading] = useState(false);

  // Tracks fetch failure status
  const [error, setError] = useState(false);

  const [notFound, setNotFound] = useState(false);

  // Counter used to trigger manual re-fetches
  const [tryCards, setTryCards] = useState(0);
  

  useEffect(() => {
    if (!id) {
      setCard(null);
      setLoading(false);
      setError(false);
      setNotFound(false);
      return;
    }
    // Controller to cancel pending requests on rapid switching or component unmount
    const controller = new AbortController();

    // Safety timeout: aborts request if it takes longer than 12 seconds
    const limit = setTimeout(() => controller.abort(), 12000);

    let current = true;
    setLoading(true);
    setError(false);
    setNotFound(false);

    // Cards are rendered on screen until new data arrives (smooth transition).

    async function loadcard() {
      try {
        // Build endpoint: '/mundos' for all cards or '/cards/:id' for a specific world
        const result = await fetch(`${API_URL}/cromos/${id}`, {
          signal: controller.signal,
        });
        if (result.status === 404) {
          if (current) {
            setNotFound(true);
            setCard(null);
          }

          return;
        }
        if (!result.ok) throw new Error(`HTTP ${result.status}`)
        const data = await result.json();

      // Only update state if this effect instance is still active
        if (current) setCard(data.datos || data);
      } catch (error) {
        // Ignore expected cancellation abort errors
        if (error.name === 'AbortError') return;
        console.error("Error loading the cards: ", error);
        setError(true);
      } finally {
        clearTimeout(limit);
        if (current) setLoading(false);
      }
    }

    loadcard();

    // Cleanup function: flags instance as stale and aborts ongoing HTTP request
    return () => {
      current = false;
      clearTimeout(limit);
      controller.abort();
    }
  }, [id, tryCards])

  return {
    card,
    loading,
    error,
    notFound,
    refresh: () => {
      setTryCards((value) => value + 1)
    },
  };
}