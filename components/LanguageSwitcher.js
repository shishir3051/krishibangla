"use client";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-[200] animate-fadeUp [animation-delay:0.2s] opacity-0 fill-mode-forwards">
      <div className="flex items-center gap-0 bg-white/8 border border-gold/35 rounded-full p-[0.28rem] backdrop-blur-[12px] cursor-pointer transition-colors duration-300 hover:border-gold/70" onClick={toggleLang} title="Switch Language / ভাষা পরিবর্তন করুন">
        <div className={`font-mono text-[0.72rem] tracking-[0.08em] py-[0.38rem] px-4 rounded-full transition-all duration-300 whitespace-nowrap select-none ${lang === "en" ? "bg-gold text-ink font-medium" : "text-cream/45 hover:text-cream/80"}`}>EN</div>
        <div className={`font-mono text-[0.72rem] tracking-[0.08em] py-[0.38rem] px-4 rounded-full transition-all duration-300 whitespace-nowrap select-none ${lang === "bn" ? "bg-gold text-ink font-medium" : "text-cream/45 hover:text-cream/80"}`}>বাংলা</div>
      </div>
    </div>
  );
}
