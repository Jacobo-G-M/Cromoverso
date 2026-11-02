import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function validateTexts(data, sections = []) {
  const texts = data?.textos;

  if (!texts || typeof texts !== "object") {
    throw new Error("Invalid response: Texts not found")
  }

  // const tags = [
  //   nav?.logo?.texto,
  //   nav?.logo?.aria,
  //   nav?.enlaces?.inicio,
  //   nav?.enlaces?.mundos,
  //   nav?.buscador?.placeholder,
  //   nav?.buscador?.aria,
  //   nav?.botones?.ingresar,
  //   nav?.botones?.crearCuenta,
  //   nav?.botones?.sobresDisponibles?.uno,
  //   nav?.botones?.sobresDisponibles?.otro,
  //   nav?.usuario?.menu,
  //   nav?.usuario?.perfil,
  //   nav?.usuario?.cerrarSesion,
  //   nav?.aria?.idioma,
  //   nav?.aria?.accesibilidad,
  //   nav?.aria?.notificaciones,
  //   nav?.aria?.notificacionesSinLeer?.uno,
  //   nav?.aria?.notificacionesSinLeer?.otro
  // ];

  const missing = sections.find((sec) => !data.textos[sec])
  if (missing) {
    throw new Error(`Missing requested section: ${missing}`)
  }

  // if (!tags.every((value) => typeof value === "string" && value.trim())) {
  //   throw new Error("Response does not contain navbar texts");
  // }

  return texts;
}

export function useTexts(language, sections = []) {
  const [texts, setTexts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tryText, setTryText] = useState(0);
  const sectionsKey = sections.join(',');
  

  useEffect(() => {
    const controller = new AbortController();
    const limit = setTimeout(() => controller.abort(), 12000);
    let current = true;
    setLoading(true);
    setError(false);
    setTexts(null);

    async function loadNavbarTexts() {
      try {
        const sectionParam = sectionsKey ? `&seccion=${sectionsKey}` : '';
        
        const result = await fetch(`${API_URL}/textos?idioma=${language}${sectionParam}`, {
          signal: controller.signal,
        });
        if (!result.ok) throw new Error(`HTTP ${result.status}`)
        const data = await result.json();
        const newTexts = validateTexts(data, sections);
        if (current) setTexts(newTexts);
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error("Error loading the texts: ", error);
        setError(true);
      } finally {
        clearTimeout(limit);
        if (current) setLoading(false);
      }
    }

    loadNavbarTexts();
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