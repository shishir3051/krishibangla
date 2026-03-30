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
      <div className="bg-[#05111e] py-20 px-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-emerald-400 font-mono tracking-widest text-sm uppercase">Loading Seasons Data...</div>
      </div>
    );
  }

  return (
    <section id="rice" className="py-24 px-8 max-w-[1200px] mx-auto relative bg-[#05111e]">
      <Text as="div" className="font-mono text-[0.7rem] tracking-[0.4em] uppercase text-emerald-500 mb-4 font-black" en="Three Growing Seasons" bn="তিন ধান মৌসুম" />
      <h2 className="font-playfair text-[clamp(2.5rem,5vw,4.2rem)] font-black text-white leading-none mb-10">
        <Text as="span" html={true} en="Seasons of <em class='text-gold not-italic'>Golden Grain</em>" bn="সোনালী ধানের <em class='text-gold not-italic'>তিন মৌসুম</em>" />
      </h2>
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
      >
        {seasonsData.map((season, i) => (
          <motion.div 
            key={i} 
            variants={item} 
            className="group bg-[#0a1628] p-10 rounded-[2.5rem] relative overflow-hidden border border-white/5 hover:border-gold/30 hover:bg-[#0c1c32] shadow-2xl transition-all duration-700"
          >
            {/* Background watermark */}
            <div className="absolute -top-4 -right-4 font-playfair text-[10rem] font-black text-white/[0.03] pointer-events-none leading-none select-none group-hover:scale-125 group-hover:text-emerald-500/[0.05] transition-all duration-700">
              {season.id}
            </div>
            
            <div className="relative z-10">
              <div className="font-playfair text-4xl font-black text-white mb-2 group-hover:text-gold transition-colors">{lang === 'bn' ? season.name_bn : season.name_en}</div>
              <div className="font-mono text-[0.7rem] font-black tracking-[0.2em] uppercase text-emerald-400 mb-4 opacity-80">{lang === 'bn' ? season.season_type_bn : season.season_type_en}</div>
              <div className="inline-block bg-gold/10 text-gold font-mono text-[0.75rem] font-black px-4 py-1.5 rounded-full mb-8 border border-gold/20 uppercase tracking-widest">{lang === 'bn' ? season.months_bn : season.months_en}</div>
              <p className="text-[1.05rem] text-white/50 leading-relaxed font-sans group-hover:text-white/70 transition-colors">{lang === 'bn' ? season.desc_bn : season.desc_en}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
