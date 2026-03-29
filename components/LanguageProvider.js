"use client";
import { createContext, useState, useContext, useEffect } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "bn" : "en"));
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    if (lang === "bn") {
      document.body.style.fontFamily = "'Tiro Bangla', 'Lora', serif";
    } else {
      document.body.style.fontFamily = "'Lora', serif";
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
