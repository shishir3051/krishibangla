'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Text from "./Text";
import { useLanguage } from "./LanguageProvider";

import { useStats } from "./StatsProvider";

export default function RiceSeasons() {
  const { lang } = useLanguage();
  const { statsData, loading } = useStats();
  const seasonsData = statsData?.riceSeasons;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80 } }
  };

  if (!seasonsData) {
    return (
      <div className="py-20 px-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-emerald-600 font-mono tracking-widest text-sm uppercase">Loading Seasons Data...</div>
      </div>
    );
  }

  return (
    <section id="rice" className="py-24 px-8 max-w-[1200px] mx-auto relative">
      <Text as="div" className="font-mono text-[0.68rem] tracking-[0.3em] uppercase text-emerald-600 mb-2" en="Three Growing Seasons" bn="তিন মৌসুম" />
      <h2 className="font-playfair text-[clamp(2rem,4vw,3.2rem)] font-black text-[#0a1628] leading-[1.1] mb-6 drop-shadow-sm">
        <Text as="span" html={true} en="Three Seasons of <em class='text-amber-500'>Golden Grain</em>" bn="সোনালী ধানের <em class='text-amber-500'>তিন মৌসুম</em>" />
      </h2>
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8 mt-12"
      >
        {seasonsData.map((season, i) => (
          <motion.div 
            key={i} 
            variants={item} 
            className="group bg-white p-10 rounded-3xl relative overflow-hidden border border-[#0a1628]/10 shadow-[0_8px_30px_rgba(10,22,40,0.04)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.12)] hover:-translate-y-2 transition-all duration-500"
          >
            {/* Background watermark */}
            <div className="absolute -top-4 -right-4 font-playfair text-[9rem] font-black text-[#0a1628]/[0.02] pointer-events-none leading-none select-none group-hover:scale-110 group-hover:text-emerald-500/[0.04] transition-all duration-700">
              {season.id}
            </div>
            
            <div className="relative z-10">
              <div className="font-playfair text-3xl font-black text-[#0a1628] mb-1">{lang === 'bn' ? season.name_bn : season.name_en}</div>
              <div className="font-mono text-xs font-bold tracking-[0.15em] uppercase text-amber-500 mb-3">{lang === 'bn' ? season.season_type_bn : season.season_type_en}</div>
              <div className="inline-block bg-emerald-50 text-emerald-700 font-mono text-[0.8rem] font-bold px-3 py-1 rounded-full mb-6 border border-emerald-100">{lang === 'bn' ? season.months_bn : season.months_en}</div>
              <p className="text-[0.95rem] text-gray-600 leading-[1.7]">{lang === 'bn' ? season.desc_bn : season.desc_en}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
