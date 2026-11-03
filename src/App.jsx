import React, { useEffect, useState } from 'react'
import Navbar from './components/layout/Navbar'
import Home from './views/Home';
import { useTexts } from './hooks/useTexts';
import Footer from './components/layout/Footer';

const App = () => {
  const [language, setLanguage] = useState('es');
  const { texts, loading } = useTexts(language, ['navbar', 'accesibilidad', 'paginas', 'footer']);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language])

  return (
    <>
      <Navbar
       texts={texts}
       language={language}
       changeLanguage={setLanguage}
       />
       <main>
        <Home texts={texts?.paginas?.inicio}/>
       </main>
       <Footer texts={texts?.footer} />
    </>
    
  )
}

export default App