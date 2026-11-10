import { useEffect, useState } from "react";

// Base API endpoint URL loaded from environment variables
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Validates the API response structure and verifies all requested
 * sections exist in the returned payload.
 *
 * @param {Object} data - Raw response object from the texts endpoint.
 * @param {string[]} [sections=[]] - Array of expected section keys.
 * @throws {Error} If the texts payload is malformed or a required section is missing.
 * @returns {Object} Validated texts dictionary.
 */
function validateTexts(data, sections = []) {
  const texts = data?.textos;

  if (!texts || typeof texts !== "object") {
    throw new Error("Invalid response: Texts not found")
  }
  
  // Ensure every requested section exists in the response payload
  const missing = sections.find((sec) => !data.textos[sec])
  if (missing) {
    throw new Error(`Missing requested section: ${missing}`)
  }

  return texts;
}

/**
 * Custom hook to fetch dynamic localized texts from the backend API.
 *
 *
 * @param {string} language - Target language code ('es' or 'en').
 * @param {string[]} [sections=[]] - List of UI sections to request (e.g., ['navbar', 'footer']).
 * @returns {Object} State object containing:
 *   - texts: Localized text dictionary.
 *   - loading: Boolean indicating active request in progress.
 *   - error: Boolean indicating if request failed.
 *   - refresh: Callback function to force re-fetching texts.
 */
export function useTexts(language, sections = []) {
  // Holds validated localized text dictionary
  const [texts, setTexts] = useState(null);

  // Tracks loading state while fetching translations
  const [loading, setLoading] = useState(true);

  // Tracks error state
  const [error, setError] = useState(false);

  // Counter to trigger manual refresh
  const [tryText, setTryText] = useState(0);

  // Serializes sections array into a primitive string key for stable useEffect dependencies
  const sectionsKey = sections.join(',');
  

  useEffect(() => {
    // AbortController to cancel previous in-flight requests when language or sections change
    const controller = new AbortController();

    // Safety timeout: aborts request after 12 seconds if backend fails to respond
    const limit = setTimeout(() => controller.abort(), 12000);

    let current = true;
    setLoading(true);
    setError(false);
    setTexts(null);

    async function loadNavbarTexts() {
      try {
        // Build optional section query param (e.g. '&seccion=navbar,footer')
        const sectionParam = sectionsKey ? `&seccion=${sectionsKey}` : '';
        
        const result = await fetch(`${API_URL}/textos?idioma=${language}${sectionParam}`, {
          signal: controller.signal,
        });
        if (!result.ok) throw new Error(`HTTP ${result.status}`)
        
        const data = await result.json();
        const newTexts = validateTexts(data, sections);

        // Prevent setting state if component unmounted or dependencies changed
        if (current) setTexts(newTexts);
      } catch (error) {
        // Ignore expected cancellation abort errors
        if (error.name === 'AbortError') return;
        console.error("Error loading the texts: ", error);
        setError(true);
      } finally {
        clearTimeout(limit);
        if (current) setLoading(false);
      }
    }

    loadNavbarTexts();

    // Cleanup: cancel request and clear safety timeout
    return () => {
      current = false;
      clearTimeout(limit);
      controller.abort();
    }
  }, [language, sectionsKey, tryText])

  return {
    texts,
    loading,
    error,
    refresh: () => {
      setTryText((value) => value + 1)
    },
  };
}