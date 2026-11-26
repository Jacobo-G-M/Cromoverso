// React core hooks
import { useCallback, useEffect, useState } from 'react'

// Layout structural components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer';
import { Cookies } from './components/layout/Cookies';
import CookiePreferences from './components/layout/CookiePreferences';

// Application view components
import Home from './views/Home/Home';
import Worlds from './views/Worlds/Worlds';
import { Login } from './views/Login/Login';
import { Signup } from './views/Signup/Signup';
import { CardDetail } from './views/CardDetail/CardDetail';
import { LoadingOverlay } from './components/ui/LoadingOverlay/LoadingOverlay';

// Cookie management utilities and consent presets
import { getCookie, setCookie, deleteCookie, COOKIES_ALL, COOKIES_NECCESSARY_ONLY } from './utils/cookies';

// Custom hooks to fetch dynamic localized copy and manage user session
import { useTexts } from './hooks/useTexts';
import { useSession } from './hooks/useSession';

function parseRoute(pathname) {
  const cardMatch = pathname.match(/^\/cromos\/([^/]+)$/);
  if (cardMatch) {
    return {
      view: 'mundos',
      cardId: decodeURIComponent(cardMatch[1])
    }
  }

  return {
    view: pathname.slice(1) || 'inicio',
    cardId: null
  }
}

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
  const initialRoute = parseRoute(window.location.pathname);
  // Active view routing state: parses initial pathname (e.g., '/mundos' -> 'mundos') or defaults to 'inicio'
  const [currentView, setCurrentView] = useState(initialRoute.view);
  const [selectedCardId, setSelectedCardId] = useState(initialRoute.cardId)
  // Selected world identifier passed down to views (defaults to 'neon')
  const [selectedWorld, setSelectedWorld] = useState('neon');
  // Controls visibility of the initial bottom floating cookie banner
  const [showCookiesBanner, setShowCookiesBanner] = useState(true);
  // Controls visibility of the detailed cookie preferences modal dialog
  const [showCookiesPreferences, setShowCookiesPreferences] = useState(false);
  // Stores user cookie consent categories: { necesarias, preferencias, analiticas, marketing }
  const [cookiesConsent, setCookiesConsent] = useState(null);
  // Tracks whether the user was redirected to login after a 401 no_autenticado expiration
  const [sessionExpired, setSessionExpired] = useState(false);

  const handleSessionExpired = useCallback(() => {
    setSessionExpired(true);
    setSelectedCardId(null);
    setCurrentView('iniciar-sesion');
    window.history.pushState({}, '', '/iniciar-sesion');
    window.scrollTo(0, 0);
  }, []);

  // Active authenticated user session managed via HttpOnly cookie ('sesion')
  const { user, submitting: isLoggingIn, login, logout, checkSession } = useSession({
    onSessionExpired: handleSessionExpired,
  });
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
      'cookies',
      'estados',
      'errores'
    ]);

  /**
   * Handles internal view navigation and browser URL history synchronization.
   *
   * @param {string} view - Target view identifier ('inicio', 'mundos', 'iniciar-sesion', 'crear-cuenta').
   * @param {string} [worldId] - Optional world identifier to focus on.
   */
  const handleNavigate = (view, param) => {
    if (view !== 'iniciar-sesion' && sessionExpired) {
      setSessionExpired(false);
    }

    if (view === 'cromo') {
      setCurrentView('mundos');
      setSelectedCardId(param);
      window.history.pushState({}, '', `/cromos/${param}`)
      if (user) checkSession();
      return;
    }
    setCurrentView(view);
    setSelectedCardId(null);
    if (param) setSelectedWorld(param);

    // Updates browser address bar without triggering a full page reload
    window.history.pushState({}, '', view === 'inicio' ? '/' : `/${view}`);
    // Scrolls to the top of the viewport on route change
    window.scrollTo(0, 0);

    if (user && view !== 'iniciar-sesion') {
      checkSession();
    }
  }

  const handleCloseCard = () => {
    setSelectedCardId(null);
    window.history.pushState({}, '', '/mundos');
  }

  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.ok) {
      setSessionExpired(false);
      handleNavigate('inicio');
    }
    return result;
  };

  const handleLogout = async () => {
    await logout();
    setSessionExpired(false);
    setSelectedCardId(null);
    setCurrentView('inicio');
    window.history.pushState({}, '', '/');
    window.scrollTo(0, 0);
  };

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

  // Handle browser back and forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const route = parseRoute(window.location.pathname);
      setCurrentView(route.view);
      setSelectedCardId(route.cardId);

      // If there is a world parameter in the URL, synchronize selectedWorld
      const params = new URLSearchParams(window.location.search);
      const worldParam = params.get('mundo');
      if (worldParam) {
        setSelectedWorld(worldParam);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const isAuthView = currentView === 'iniciar-sesion';

  return (
    <>
      {/* Top navigation bar */}
      {!isAuthView && (
        <Navbar
          texts={texts}
          language={language}
          changeLanguage={handleLanguageChange}
          currentView={currentView}
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
      {/* Main content area: conditionally renders views based on currentView state */}
      <main>
        <LoadingOverlay loading={loading} label={texts?.estados?.cargando ?? 'Cargando…'} fullscreen>
          {/* Home view */}
          {currentView === 'inicio' && (
            <Home
              texts={texts?.paginas?.inicio}
              loadingLabel={texts?.estados?.cargando}
              user={user}
              onNavigate={handleNavigate}
            />
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
            <Login
              texts={texts}
              isSubmitting={isLoggingIn}
              sessionExpired={sessionExpired}
              onNavigate={handleNavigate}
              onLogin={handleLogin}
            />
          )}
          {/* Sign up view */}
          {currentView === 'crear-cuenta' && (
            <Signup />
          )}
        </LoadingOverlay>
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
      <CardDetail 
        cardId={selectedCardId}
        onClose={handleCloseCard}
        onNavigate={handleNavigate}
        texts={texts}
      />
      {/* Global footer with link to open cookie preferences modal */}
      {!isAuthView && (
        <Footer texts={texts?.footer} onOpenCookies={() => setShowCookiesPreferences(true)} />
      )}
    </>

  )
}

export default App