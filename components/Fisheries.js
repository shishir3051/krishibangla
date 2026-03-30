'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Text from "./Text";
import { useLanguage } from "./LanguageProvider";
import { useStats } from "./StatsProvider";

export default function Fisheries() {
  const { lang } = useLanguage();
  const { statsData, loading } = useStats();
  const data = statsData?.fisheries;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } }
  };

  if (!data) {
    return (
      <div className="bg-[#05111e] py-20 px-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-blue-400 font-mono tracking-widest text-sm uppercase">Loading Fisheries Data...</div>
      </div>
    );
  }

  return (
    <motion.section 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
      id="fisheries" className="py-32 px-8 max-w-[1200px] mx-auto relative bg-[#05111e]"
    >
      <Text as="div" className="font-mono text-[0.7rem] tracking-[0.4em] uppercase text-blue-500 mb-4 font-black" en="Fisheries Sector" bn="মৎস্য খাত" />
      <h2 className="font-playfair text-[clamp(2.5rem,5vw,4.5rem)] font-black text-white leading-none mb-10">
        <Text as="span" html={true} en="A Nation That <em class='text-blue-500 not-italic'>Lives by Water</em>" bn="জলের দেশের <em class='text-blue-500 not-italic'>মৎস্য সম্পদ</em>" />
      </h2>
      <p className="max-w-[750px] text-white/50 leading-relaxed mb-16 text-lg">
        {lang === 'bn' ? data.intro_bn : data.intro_en}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {data.cards.map((card, i) => (
          <motion.div 
            key={i} 
            variants={item}
            className="group bg-[#0a1628] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden transition-all duration-700 hover:-translate-y-4 hover:border-blue-500/40 hover:shadow-[0_40px_60px_rgba(30,144,255,0.1)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-blue-600 before:to-sky-400 hover:scale-[1.02]"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500/0 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur pointer-events-none" />
            <div className="text-5xl mb-8 relative z-10 group-hover:scale-125 transition-transform origin-bottom-left duration-500">{card.icon}</div>
            <div className="font-playfair text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{lang === 'bn' ? card.title_bn : card.title_en}</div>
            <div className="font-mono text-[2.8rem] font-black tracking-[0.05em] text-blue-500 mb-2 leading-none">{card.stat}</div>
            <p className="text-[1rem] text-white/50 leading-relaxed font-sans mb-8 group-hover:text-white/70 transition-colors">
              {lang === 'bn' ? card.desc_bn : card.desc_en}
            </p>
            <span className={`font-mono text-[0.7rem] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full inline-block ${card.badge_color.replace('bg-', 'text-').replace('text-blue', 'text-blue-500')} border border-blue-500/30 bg-blue-500/5`}>
              {lang === 'bn' ? card.badge_bn : card.badge_en}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
