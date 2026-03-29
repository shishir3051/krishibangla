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
      <div className="py-20 px-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-blue-600 font-mono tracking-widest text-sm uppercase">Loading Fisheries Data...</div>
      </div>
    );
  }

  return (
    <motion.section 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
      id="fisheries" className="py-24 px-8 max-w-[1200px] mx-auto relative"
    >
      <Text as="div" className="font-mono text-[0.68rem] tracking-[0.3em] uppercase text-blue-600 mb-2" en="Fisheries Sector" bn="মৎস্য খাত" />
      <h2 className="font-playfair text-[clamp(2rem,4vw,3.2rem)] font-black text-[#0a1628] leading-[1.1] mb-6">
        <Text as="span" html={true} en="A Nation That <em class='text-blue-500'>Lives by Water</em>" bn="জলের দেশের <em class='text-blue-500'>মৎস্য সম্পদ</em>" />
      </h2>
      <p className="max-w-[700px] text-gray-600 leading-[1.9] mb-12 text-[1.1rem]">
        {lang === 'bn' ? data.intro_bn : data.intro_en}
      </p>
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mt-10">
        {data.cards.map((card, i) => (
          <motion.div 
            key={i} 
            variants={item}
            className="group bg-white border border-[#0a1628]/10 rounded-3xl p-8 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(30,95,138,0.12)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-2 before:bg-gradient-to-r before:from-blue-500 before:to-sky-400"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500/0 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur pointer-events-none" />
            <div className="text-4xl mb-6 relative z-10 group-hover:scale-110 transition-transform origin-bottom-left duration-300">{card.icon}</div>
            <div className="font-playfair text-xl font-bold text-[#0a1628] mb-2">{lang === 'bn' ? card.title_bn : card.title_en}</div>
            <div className="font-mono text-[2.5rem] font-black tracking-tight text-blue-500 mb-[0.5rem] leading-none">{card.stat}</div>
            <p className="text-[0.95rem] text-gray-600 leading-[1.6] mb-6">
              {lang === 'bn' ? card.desc_bn : card.desc_en}
            </p>
            <span className={`font-mono text-[0.7rem] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full inline-block ${card.badge_color} border border-current`}>
              {lang === 'bn' ? card.badge_bn : card.badge_en}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
