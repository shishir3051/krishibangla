import Text from "./Text";
import { useStats } from "./StatsProvider";

export default function Hero() {
  const { statsData } = useStats();
  
  // Use data from API or fallback to defaults
  const stats = statsData?.macroStats || [
    { number: "13.1%", en: "GDP Share", bn: "জিডিপি অংশ" },
    { number: "40.6%", en: "Workforce", bn: "কর্মসংস্থান" },
    { number: "#3", en: "Rice Producer", bn: "ধান উৎপাদনকারী" },
    { number: "#5", en: "Aquaculture", bn: "মাছ চাষ" },
    { number: "80%", en: "World's Hilsa", bn: "বিশ্বের ইলিশ" },
  ];

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden bg-[radial-gradient(ellipse_at_20%_50%,rgba(44,106,53,0.18)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(200,168,75,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_60%_80%,rgba(30,95,138,0.15)_0%,transparent_50%),linear-gradient(160deg,#0d2410_0%,#1a3d1f_40%,#0e2d38_100%)] before:content-[''] before:absolute before:inset-0 before:bg-[repeating-linear-gradient(0deg,transparent,transparent_60px,rgba(76,175,80,0.04)_60px,rgba(76,175,80,0.04)_61px),repeating-linear-gradient(90deg,transparent,transparent_60px,rgba(76,175,80,0.04)_60px,rgba(76,175,80,0.04)_61px)] before:pointer-events-none">
      
      {/* Hero Content */}

      {/* Subtitle */}
      <Text 
        as="div" 
        className="font-mono text-[0.68rem] tracking-[0.25em] text-green-light uppercase border border-[rgba(168,213,171,0.3)] py-[0.4rem] px-4 rounded-[2px] mb-8 animate-fadeUp opacity-0" 
        en="AI-Powered Agriculture Intelligence Portal" 
        bn="AI-চালিত কৃষি তথ্য পোর্টাল" 
      />
      
      {/* Main Heading */}
      <h1 className="font-playfair text-[clamp(3rem,8vw,7rem)] font-black text-cream text-center leading-none animate-fadeUp opacity-0 [animation-delay:0.15s]">
        <Text as="span" en="Bangladesh" bn="বাংলাদেশ" />
        <Text as="span" className="text-gold italic block" en="Agriculture" bn="কৃষি" />
      </h1>
      
      {/* Tagline */}
      <Text 
        as="p" 
        className="font-tiro text-[clamp(1.1rem,2.5vw,1.8rem)] text-green-light mt-2 text-center animate-fadeUp opacity-0 [animation-delay:0.3s]" 
        en="কৃষি বাংলাদেশ — সবুজ সোনার দেশ" 
        bn="কৃষি বাংলাদেশ — সবুজ সোনার দেশ" 
      />
      
      {/* Description */}
      <Text 
        as="p" 
        className="font-mono text-[0.8rem] text-cream/50 mt-6 text-center max-w-[520px] leading-[1.9] animate-fadeUp opacity-0 [animation-delay:0.45s]" 
        en="Real-time AI insights · Rice A-to-Z · Fisheries · Climate · Expert AI Chat" 
        bn="AI-ভিত্তিক তথ্য · ধান চাষ · মৎস্য সম্পদ · জলবায়ু · বিশেষজ্ঞ AI চ্যাট" 
      />
      
      {/* Stats Cards */}
      <div className="flex gap-6 mt-12 flex-wrap justify-center animate-fadeUp opacity-0 [animation-delay:0.6s]">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white/5 border border-gold/20 py-4 px-6 rounded-xl text-center backdrop-blur-md hover:border-gold/50 hover:scale-105 transition-all duration-500 group relative"
          >
            {/* Live Indicator Badge */}
            {stat.live && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg border border-emerald-400/50 animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                LIVE DATA
              </div>
            )}

            <div className="flex flex-col items-center">
              <span className="font-playfair text-4xl font-black text-gold mb-1">
                {stat.number}
              </span>
              <Text 
                as="span" 
                className="font-mono text-[10px] text-green-light/70 tracking-widest uppercase font-bold" 
                en={stat.en} 
                bn={stat.bn} 
              />
              
              {stat.live && (
                <div className="mt-2 text-[8px] font-mono text-white/30 uppercase tracking-tighter group-hover:text-amber-500/50 transition-colors">
                  Source: World Bank WDI
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Scroll Indicator - Fixed */}
      <Text 
        as="div" 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-fadeUp opacity-0 [animation-delay:1s] text-green-light/50 font-mono text-[0.68rem] tracking-[0.15em] text-center" 
        en="SCROLL" 
        bn="নিচে দেখুন"
      >
        <span className="animate-bounce">↓</span>
      </Text>
    </div>
  );
}