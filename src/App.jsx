import { useEffect, useState } from 'react'

import Navbar from './components/layout/Navbar'
import Home from './views/Home';
import Worlds from './views/Worlds';
import { Cookies } from './components/layout/Cookies';
import CookiePreferences from './components/layout/CookiePreferences';
import { getCookie, setCookie, deleteCookie, COOKIES_ALL, COOKIES_NECCESSARY_ONLY } from './utils/cookies';

import { useTexts } from './hooks/useTexts';
import Footer from './components/layout/Footer';
import Card from './components/ui/Card/Card';

const App = () => {
  const [currentView, setCurrentView] = useState(
    window.location.pathname.slice(1) || 'inicio'
  );
  
  const [selectedWorld, setSelectedWorld] = useState('neon');
  const [showCookiesBanner, setShowCookiesBanner] = useState(true)
  const [showCookiesPreferences, setShowCookiesPreferences] = useState(false);
  const [cookiesConsent, setCookiesConsent] = useState(null);
  const [language, setLanguage] = useState(
    getCookie('idioma') ?? 'es'
  );
  
  const { texts, loading } = useTexts(language,
    [
      'navbar',
      'accesibilidad',
      'paginas',
      'footer',
      'componentes',
      'menuMovil',
      'cookies'
    ]);

  const handleNavigate = (view, worldId) => {
    setCurrentView(view);
    if (worldId) setSelectedWorld(worldId);
    window.history.pushState({}, '', view === 'inicio' ? '/' : `/${view}`);
    window.scrollTo(0, 0);
  }

  const handleSaveCookies = (selection) => {
    setCookie('consentimiento_cookies', selection);
    setCookiesConsent(selection);
    if (selection.preferencias) {
      setCookie('idioma', language)
    } else {
      deleteCookie('idioma')
    }
    setShowCookiesBanner(false);
    setShowCookiesPreferences(false);
  }

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (!!cookiesConsent?.preferencias) {
      setCookie('idioma', newLang)
    }
  }

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language])

  useEffect(() => {
    const savedCookies = getCookie('consentimiento_cookies');
    if (savedCookies) {
      setShowCookiesBanner(false);
      setCookiesConsent(savedCookies);
    }
  }, [])

  return (
    <>
      <Navbar
        texts={texts}
        language={language}
        changeLanguage={handleLanguageChange}
        currentView={currentView}
        onNavigate={handleNavigate}
      />
      <main>
        {currentView === 'inicio' && (
          <Home texts={texts?.paginas?.inicio} onNavigate={handleNavigate} />
        )}
        {currentView === 'mundos' && (
          <Worlds
            texts={texts}
            onNavigate={handleNavigate}
            initialWorld={selectedWorld}
          />
        )}
      </main>
      {showCookiesBanner && (
        <Cookies
          texts={texts?.cookies}
          onAccept={() => handleSaveCookies(COOKIES_ALL)}
          onReject={() => handleSaveCookies(COOKIES_NECCESSARY_ONLY)}
        />
      )}
      <CookiePreferences
        open={showCookiesPreferences}
        texts={texts?.cookies?.preferencias}
        allow={cookiesConsent}
        onSave={handleSaveCookies}
        onClose={() => setShowCookiesPreferences(false)}
      />
      <Footer texts={texts?.footer} onOpenCookies={() => setShowCookiesPreferences(true)} />
    </>

  )
}

export default App