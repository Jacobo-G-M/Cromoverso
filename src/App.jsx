import { useEffect, useState } from 'react'

import Navbar from './components/layout/Navbar'
import Home from './views/Home';
import Worlds from './views/Worlds';

import { useTexts } from './hooks/useTexts';
import Footer from './components/layout/Footer';
import Card from './components/ui/Card/Card';

const App = () => {
  const [currentView, setCurrentView] = useState('inicio')
  const [selectedWorld, setSelectedWorld] = useState('neon');
  const [language, setLanguage] = useState('es');
  const { texts, loading } = useTexts(language, ['navbar', 'accesibilidad', 'paginas', 'footer', 'componentes']);

  const handleNavigate = (view, worldId) => {
    setCurrentView(view);
    if (worldId) setSelectedWorld(worldId);
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
          <Home texts={texts?.paginas?.inicio} onNavigate={handleNavigate}/>
        )}
        {currentView === 'mundos' && (
          <Worlds
            texts={texts}
            onNavigate={handleNavigate}
            initialWorld={selectedWorld}
          />
        )}
      </main>
      <Footer texts={texts?.footer} />
    </>

  )
}

export default App