// React core hooks
import { useEffect, useState } from 'react'

// Layout structural components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer';
import { Cookies } from './components/layout/Cookies';
import CookiePreferences from './components/layout/CookiePreferences';

// Application view components
import Home from './views/Home';
import Worlds from './views/Worlds';
import { Login } from './views/Login';
import { Signup } from './views/Signup';

// Cookie management utilities and consent presets
import { getCookie, setCookie, deleteCookie, COOKIES_ALL, COOKIES_NECCESSARY_ONLY } from './utils/cookies';

// Custom hook to fetch dynamic localized copy from the backend API
import { useTexts } from './hooks/useTexts';

/**
 * Root Application Component
 *
 * Coordinates:
 * - Client-side state-based routing without external router libraries
 * - Two-way URL pathname synchronization (window.history.pushState)
 * - Global language preference state and HTML lang attribute updates
 * - GDPR-compliant cookie consent system (banner + detailed preferences modal)
 * - Global asynchronous localized texts fetching
 *
 * @returns {JSX.Element} The root application tree.
 */
const App = () => {
  // Active view routing state: parses initial pathname (e.g., '/mundos' -> 'mundos') or defaults to 'inicio'
  const [currentView, setCurrentView] = useState(
    window.location.pathname.slice(1) || 'inicio'
  );

  // Selected world identifier passed down to views (defaults to 'neon')
  const [selectedWorld, setSelectedWorld] = useState('neon');
  // Controls visibility of the initial bottom floating cookie banner
  const [showCookiesBanner, setShowCookiesBanner] = useState(true);
  // Controls visibility of the detailed cookie preferences modal dialog
  const [showCookiesPreferences, setShowCookiesPreferences] = useState(false);
  // Stores user cookie consent categories: { necesarias, preferencias, analiticas, marketing }
  const [cookiesConsent, setCookiesConsent] = useState(null);
  // Active language state: hydrates from stored 'idioma' cookie if available, defaults to Spanish ('es')
  const [language, setLanguage] = useState(
    getCookie('idioma') ?? 'es'
  );

  // Fetches localized texts for all registered UI sections in the active language
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

  /**
   * Handles internal view navigation and browser URL history synchronization.
   *
   * @param {string} view - Target view identifier ('inicio', 'mundos', 'iniciar-sesion', 'crear-cuenta').
   * @param {string} [worldId] - Optional world identifier to focus on.
   */
  const handleNavigate = (view, worldId) => {
    setCurrentView(view);
    if (worldId) setSelectedWorld(worldId);

    // Updates browser address bar without triggering a full page reload
    window.history.pushState({}, '', view === 'inicio' ? '/' : `/${view}`);
    // Scrolls to the top of the viewport on route change
    window.scrollTo(0, 0);
  }

  /**
   * Persists user cookie consent choices and synchronizes preferences.
   *
   * @param {Object} selection - Consent category booleans.
   */
  const handleSaveCookies = (selection) => {
    // Save consent object in cookie for future visits
    setCookie('consentimiento_cookies', selection);
    setCookiesConsent(selection);

    // If user consented to preferences, store active language; otherwise remove cookie
    if (selection.preferencias) {
      setCookie('idioma', language)
    } else {
      deleteCookie('idioma')
    }

    // Dismiss both banner and preferences modal
    setShowCookiesBanner(false);
    setShowCookiesPreferences(false);
  }

  /**
   * Updates current application language and persists it if user gave consent.
   *
   * @param {string} newLang - Target language code ('es' or 'en').
   */
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);

    // Only persist in cookie if preferences category is approved
    if (!!cookiesConsent?.preferencias) {
      setCookie('idioma', newLang)
    }
  }

  // Synchronizes document HTML lang attribute whenever language state changes (accessibility)
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language])

  // Initial mount effect: checks for existing cookie consent to hide banner if already approved
  useEffect(() => {
    const savedCookies = getCookie('consentimiento_cookies');
    if (savedCookies) {
      setShowCookiesBanner(false);
      setCookiesConsent(savedCookies);
    }
  }, [])

  return (
    <>
    {/* Top navigation bar */}
      <Navbar
        texts={texts}
        language={language}
        changeLanguage={handleLanguageChange}
        currentView={currentView}
        onNavigate={handleNavigate}
      />
      {/* Main content area: conditionally renders views based on currentView state */}
      <main>
        {/* Home view */}
        {currentView === 'inicio' && (
          <Home texts={texts?.paginas?.inicio} onNavigate={handleNavigate} />
        )}
        {/* Worlds view */}
        {currentView === 'mundos' && (
          <Worlds
            texts={texts}
            onNavigate={handleNavigate}
            initialWorld={selectedWorld}
          />
        )}
        {/* Log in view */}
        {currentView === 'iniciar-sesion' && (
          <Login />
        )}
        {/* Sign up view */}
        {currentView === 'crear-cuenta' && (
          <Signup />
        )}
      </main>
      {/* Floating cookie consent banner (shown on first visit until user decides) */}
      {showCookiesBanner && (
        <Cookies
          texts={texts?.cookies}
          onAccept={() => handleSaveCookies(COOKIES_ALL)}
          onReject={() => handleSaveCookies(COOKIES_NECCESSARY_ONLY)}
        />
      )}
      {/* Detailed cookie preferences modal dialog */}
      <CookiePreferences
        open={showCookiesPreferences}
        texts={texts?.cookies?.preferencias}
        allow={cookiesConsent}
        onSave={handleSaveCookies}
        onClose={() => setShowCookiesPreferences(false)}
      />
      {/* Global footer with link to open cookie preferences modal */}
      <Footer texts={texts?.footer} onOpenCookies={() => setShowCookiesPreferences(true)} />
    </>

  )
}

export default App