import { useEffect, useState } from 'react'

import Navbar from './components/layout/Navbar'
import Home from './views/Home';
import Worlds from './views/Worlds';

import { useTexts } from './hooks/useTexts';
import Footer from './components/layout/Footer';

const App = () => {
  const [currentView, setCurrentView] = useState('inicio')
  const [language, setLanguage] = useState('es');
  const { texts, loading } = useTexts(language, ['navbar', 'accesibilidad', 'paginas', 'footer']);

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.history.pushState({}, '', view === 'inicio' ? '/' : `/${view}`);
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language])

  return (
    <>
      <Navbar
        texts={texts}
        language={language}
        changeLanguage={setLanguage}
        currentView={currentView}
        onNavigate={handleNavigate}
      />
      <main>
        {currentView === 'inicio' && (
          <Home texts={texts?.paginas?.inicio} />
        )}
        {currentView === 'mundos' && (
          <Worlds
            texts={texts?.paginas?.albumMundo}
            onNavigate={handleNavigate}
          />
        )}
      </main>
      <Footer texts={texts?.footer} />
    </>

  )
}

export default App