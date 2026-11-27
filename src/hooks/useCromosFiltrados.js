import { useEffect, useState } from "react";

// Base API endpoint URL loaded from environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook to fetch a filtered list of cards from the backend catalog (GET /cromos).
 *
 * @param {Object} [filters] - Query parameters and optional request headers.
 * @param {string} [filters.mundo] - World identifier (e.g., 'neon', 'coral').
 * @param {string|null} [filters.rareza] - Rarity identifier (e.g., 'epica', 'legendaria').
 * @param {string|null} [filters.tipo] - Card type identifier (e.g., 'heroe', 'aliado', 'villano').
 * @param {Record<string, string>} [filters.headers] - Optional extra HTTP headers (e.g., { 'X-Simular-Latencia': '2000' }).
 * @returns {Object} State object containing:
 *   - cards: Array of matching cards, or null before the first response.
 *   - loading: Boolean indicating whether an active request is in flight.
 *   - error: Boolean indicating if the request failed.
 *   - errorCode: API error code string (e.g., 'falla_simulada', 'generico') or null.
 *   - refresh: Callback function to manually re-trigger the fetch.
 */
export function useCromosFiltrados({ mundo, rareza, tipo, headers } = {}) {
  // Holds fetched filtered cards array
  const [cards, setCards] = useState(null);

  // Tracks loading state for spinners or loading indicators
  const [loading, setLoading] = useState(true);

  // Tracks fetch failure status and API error code
  const [error, setError] = useState(false);
  const [errorCode, setErrorCode] = useState(null);

  // Counter used to trigger manual re-fetches
  const [tryCards, setTryCards] = useState(0);

  // Primitive key to stabilize effect dependencies when an inline headers object is passed
  const headersKey = headers ? JSON.stringify(headers) : '';

  useEffect(() => {
    // Controller to cancel pending requests on rapid filter switching or component unmount
    const controller = new AbortController();

    // Safety timeout: aborts request if it takes longer than 12 seconds
    const limit = setTimeout(() => controller.abort(), 12000);

    let current = true;
    setLoading(true);
    setError(false);
    setErrorCode(null);

    // Previous cards remain rendered until new data arrives (smooth transition with LoadingOverlay).
    async function loadCards() {
      try {
        const params = new URLSearchParams();
        if (mundo) params.set('mundo', mundo);
        if (rareza) params.set('rareza', rareza);
        if (tipo) params.set('tipo', tipo);

        const query = params.toString();
        const url = `${API_URL}/cromos${query ? `?${query}` : ''}`;

        const parsedHeaders = headersKey ? JSON.parse(headersKey) : undefined;
        const hasHeaders = parsedHeaders && Object.keys(parsedHeaders).length > 0;

        const result = await fetch(url, {
          signal: controller.signal,
          cache: 'no-store',
          ...(hasHeaders ? { headers: parsedHeaders } : {}),
        });

        if (!result.ok) {
          let apiCode = 'generico';
          try {
            const errData = await result.json();
            apiCode = errData?.error?.codigo ?? apiCode;
          } catch {
            // Keep generic code when response body is not valid JSON
          }
          const httpError = new Error(`HTTP ${result.status}`);
          httpError.code = apiCode;
          throw httpError;
        }

        const data = await result.json();

        // Only update state if this effect instance is still active
        if (current) {
          setCards(Array.isArray(data.datos) ? data.datos : []);
        }
      } catch (err) {
        // Ignore expected cancellation abort errors
        if (err.name === 'AbortError') return;
        console.error("Error loading filtered cards: ", err);
        if (current) {
          setError(true);
          setErrorCode(err.code ?? 'generico');
        }
      } finally {
        clearTimeout(limit);
        if (current) setLoading(false);
      }
    }

    loadCards();

    // Cleanup function: flags instance as stale and aborts ongoing HTTP request
    return () => {
      current = false;
      clearTimeout(limit);
      controller.abort();
    };
  }, [mundo, rareza, tipo, headersKey, tryCards]);

  return {
    cards,
    loading,
    error,
    errorCode,
    refresh: () => {
      setTryCards((value) => value + 1);
    },
  };
}
