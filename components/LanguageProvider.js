"use client";
import { createContext, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALE_COOKIE, switchLocalePath } from "@/lib/i18n";

const LanguageContext = createContext();

// The language comes from the URL (/bn/..., /en/...); toggling navigates and remembers the choice.
export function LanguageProvider({ lang, children }) {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLang = () => {
    const next = lang === "en" ? "bn" : "en";
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.push(switchLocalePath(pathname, next), { scroll: false });
  };

  useEffect(() => {
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
