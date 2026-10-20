import React, { useEffect, useState } from 'react'
import Navbar from './components/layout/Navbar'
import { useTexts } from './hooks/useTexts';

const App = () => {
  const [language, setLanguage] = useState('es');
  const data = useTexts(language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language])

  return (
    <div>
      <Navbar
       texts={data.texts}
       language={language}
       changeLanguage={setLanguage}
       />
    </div>
    
  )
}

export default App