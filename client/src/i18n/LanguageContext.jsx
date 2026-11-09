
import { createContext, useContext, useEffect, useState } from 'react';
import { getTranslation } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem('imariwise-language') || 'rw'
  );

  useEffect(() => {
    localStorage.setItem('imariwise-language', language);
    document.documentElement.lang = language;
  }, [language]);

  function changeLanguage(newLanguage) {
    if (['rw', 'en', 'fr'].includes(newLanguage)) {
      setLanguage(newLanguage);
    }
  }

  function t(key) {
    return getTranslation(language, key);
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }

  return context;
}
