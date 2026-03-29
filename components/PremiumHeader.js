'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageProvider';
import { useEffect, useState, useRef } from 'react';

// Real Bangladesh Agricultural Alert Data (March 2026)
const DISTRICT_ALERTS = [
  { district_en: 'Sunamganj', district_bn: 'সুনামগঞ্জ', risk_en: 'Flash Flood Risk — Haor wetlands at early inundation. Boro harvest endangered.', risk_bn: 'আকস্মিক বন্যার ঝুঁকি — হাওর এলাকায় প্রাথমিক জলাবদ্ধতা। বোরো ধান বিপন্ন।', level: 'high', icon: '🌊' },
  { district_en: "Cox's Bazar", district_bn: "কক্সবাজার", risk_en: 'Cyclone Pre-Season Alert — Coastal agriculture and fisheries at risk.', risk_bn: 'ঘূর্ণিঝড় পূর্ব সতর্কতা — উপকূলীয় কৃষি ও মৎস্য ঝুঁকিতে।', level: 'medium', icon: '🌀' },
  { district_en: 'Satkhira', district_bn: 'সাতক্ষীরা', risk_en: 'Salinity Intrusion — Soil EC above 8 dS/m, threatening Aman crop planting.', risk_bn: 'লবণাক্ততার অনুপ্রবেশ — মাটির EC ৮ dS/m এর উপরে, আমন চাষ হুমকিতে।', level: 'high', icon: '🧂' },
  { district_en: 'Rajshahi', district_bn: 'রাজশাহী', risk_en: 'Water Stress — Barind Tract groundwater levels critically low. AWD mandatory.', risk_bn: 'পানির সংকট — বরেন্দ্র ভূগর্ভস্থ পানি সংকটজনকভাবে নিচে। AWD বাধ্যতামূলক।', level: 'medium', icon: '☀️' },
];

function LiveCounter({ base, rate, unit, serverTime, label, lang }) {
  const [displayValue, setDisplayValue] = useState(base);
  
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const currentVal = base + (rate * elapsed);
      setDisplayValue(currentVal);
    }, 100);
    return () => clearInterval(interval);
  }, [base, rate]);

  const format = (val) => {
    const num = (val / 1000000).toFixed(4);
    if (lang === 'bn') {
      return num.replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]) + ' M';
    }
    return num + ' M';
  };

  return (
    <div className="flex flex-col">
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 leading-tight">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <h3 className="text-xl sm:text-2xl font-black text-white tabular-nums tracking-tighter">
          {format(displayValue)}
        </h3>
        <span className="text-[9px] font-bold text-white/30">{unit}</span>
      </div>
    </div>
  );
}

import { useStats } from './StatsProvider';

export default function PremiumHeader() {
  const { lang } = useLanguage();
  const { statsData: apiData } = useStats();
  const [alertOpen, setAlertOpen] = useState(false);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    fetch('/api/weather').then(res => res.json()).then(setWeather);
  }, []);

  const t = {
    en: { live: 'COMMAND CENTER', status: 'National Agri-Status: STABLE', viewAlerts: 'View Alerts', alertTitle: 'Active District Alerts',
      cards: [
        { key: 'rice', label: 'National Rice Output', unit: 'MT', trend: '+1.2% YoY', icon: '🌾', color: 'emerald' },
        { key: 'fish', label: 'Fish Production', unit: 'MT', trend: '5th Global', icon: '🐟', color: 'blue' },
        { key: 'jute', label: 'Jute Export', unit: 'USD', trend: '#1 World', icon: '🪢', color: 'amber' },
        { key: 'shrimp', label: 'Shrimp Export', unit: 'USD', trend: 'EU + USA', icon: '🦐', color: 'cyan' },
        { label: 'Live Humidity', value: weather ? `${weather.humidity}%` : '--', unit: 'Relative', trend: weather ? weather.condition : 'Syncing...', icon: '💧', color: 'purple' },
        { label: 'Air Temp', value: weather ? `${weather.temp}°C` : '--', unit: 'Celsius', trend: 'Dhaka Station', icon: '🌡️', color: 'rose' },
        { label: 'Agri GDP Share', value: '13%', unit: 'GDP', trend: '40% workforce', icon: '📊', color: 'orange' },
        { label: 'Active Alerts', value: '4', unit: 'Districts', trend: 'Click to view', icon: '⚠️', color: 'red', isAlert: true },
      ]
    },
    bn: { live: 'কমান্ড সেন্টার', status: 'জাতীয় কৃষি অবস্থা: স্বাভাবিক', viewAlerts: 'সতর্কতা দেখুন', alertTitle: 'সক্রিয় জেলা সতর্কবার্তা',
      cards: [
        { key: 'rice', label: 'জাতীয় চাল উৎপাদন', unit: 'MT', trend: '+১.২% বার্ষিক', icon: '🌾', color: 'emerald' },
        { key: 'fish', label: 'মাছ উৎপাদন', unit: 'MT', trend: 'বিশ্বে ৫ম', icon: '🐟', color: 'blue' },
        { key: 'jute', label: 'পাট রপ্তানি', unit: 'USD', trend: 'বিশ্বে ১ম', icon: '🪢', color: 'amber' },
        { key: 'shrimp', label: 'চিংড়ি রপ্তানি', unit: 'USD', trend: 'EU + USA', icon: '🦐', color: 'cyan' },
        { label: 'লাইভ আর্দ্রতা', value: weather ? `${weather.humidity}%` : '--', unit: 'আপেক্ষিক', trend: weather ? weather.condition_bn : 'সিঙ্ক হচ্ছে...', icon: '💧', color: 'purple' },
        { label: 'বায়ুর তাপমাত্রা', value: weather ? (lang === 'bn' ? String(weather.temp).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]) : weather.temp) + '°C' : '--', unit: 'সেলসিয়াস', trend: 'ঢাকা স্টেশন', icon: '🌡️', color: 'rose' },
        { label: 'কৃষির GDP অংশ', value: '১৩%', unit: 'GDP', trend: '৪০% কর্মশক্তি', icon: '📊', color: 'orange' },
        { label: 'জেলা সতর্কবার্তা', value: '৪', unit: 'সক্রিয়', trend: 'ক্লিক করুন', icon: '⚠️', color: 'red', isAlert: true },
      ]
    }
  }[lang];

  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    red: 'text-red-400 bg-red-400/10 border-red-400/20 animate-pulse',
  };

  return (
    <div className="w-full mb-12">
      {/* Dynamic Status Bar */}
      <div className="flex flex-wrap justify-between items-center bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-2xl mb-8 gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">{t.live}</span>
          <div className="h-4 w-px bg-white/10 mx-2 hidden sm:block" />
          <span className="text-xs font-bold text-white/50 tracking-tighter uppercase">{t.status}</span>
        </div>
        
        {/* Animated Market Ribbon */}
        <div className="flex-1 max-w-xl mx-8 overflow-hidden hidden lg:block">
          <div className="flex whitespace-nowrap gap-12 font-mono text-[10px] font-bold text-white/30 uppercase tracking-widest animate-[marquee_40s_linear_infinite]">
            {['Rice Boro: ৳56.5 ↑', 'Rice Aman: ৳62.0 ↓', 'Jute: ৳3200 ↑', 'Potato: ৳28 ↑', 'Hilsa: ৳1200 ↑', 'Shrimp: ৳850 ↔', 'Egg: ৳12.5 ↓', 'Urea: ৳22.0 ↔'].map((p, i) => (
               <span key={i} className="flex items-center gap-4">
                 <span className="text-white">{p.split(':')[0]}</span>
                 <span className={p.includes('↑') ? 'text-emerald-400' : p.includes('↓') ? 'text-red-400' : 'text-amber-400'}>{p.split(':')[1]}</span>
                 <span className="text-white/5">•</span>
               </span>
            ))}
          </div>
        </div>

        <button onClick={() => setAlertOpen(true)} className="bg-red-500 hover:bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse">
          {t.viewAlerts}
        </button>
      </div>

      {/* 8-Card Stat Grid */}
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {t.cards.map((card, i) => (
          <motion.div key={i} variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} onClick={card.isAlert ? () => setAlertOpen(true) : undefined}
            className={`group bg-[#0a1a2a]/60 p-5 rounded-3xl border border-white/5 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-[#0a1a2a]/80 ${card.isAlert ? 'cursor-pointer' : ''}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 border ${colorMap[card.color]}`}>
              {card.icon}
            </div>
            {card.key && apiData ? (
              <LiveCounter base={apiData.counters[card.key].base} rate={apiData.counters[card.key].rate} unit={card.unit} label={card.label} lang={lang} />
            ) : (
              <div className="flex flex-col">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 leading-tight">{card.label}</p>
                <div className="flex items-baseline gap-1.5">
                  <h3 className="text-2xl font-black text-white">{card.value}</h3>
                  <span className="text-[9px] font-bold text-white/30">{card.unit}</span>
                </div>
              </div>
            )}
            <div className={`mt-3 text-[9px] font-black px-2 py-0.5 rounded-lg w-fit border ${colorMap[card.color]}`}>
              {card.trend}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Alert Modal */}
      <AnimatePresence>
        {alertOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAlertOpen(false)} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="bg-[#05111e] border border-white/10 rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white">{t.alertTitle}</h3>
                <button onClick={() => setAlertOpen(false)} className="text-white/30 hover:text-white transition-all font-mono">CLOSE_X</button>
              </div>
              <div className="space-y-4">
                {DISTRICT_ALERTS.map((alert, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${alert.level === 'high' ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'} flex gap-5`}>
                    <div className="text-4xl">{alert.icon}</div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                         <span className="text-lg font-black text-white">{lang === 'bn' ? alert.district_bn : alert.district_en}</span>
                         <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${alert.level === 'high' ? 'text-red-500 border-red-500' : 'text-amber-500 border-amber-500'}`}>{alert.level.toUpperCase()}</span>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed">{lang === 'bn' ? alert.risk_bn : alert.risk_en}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx>{` @keyframes marquee { 0% { transform: translateX(50%); } 100% { transform: translateX(-150%); } } `}</style>
    </div>
  );
}
