'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Text from "./Text";
import { useLanguage } from "./LanguageProvider";
import { useStats } from "./StatsProvider";

export default function Climate() {
  const { lang } = useLanguage();
  const { statsData, loading } = useStats();
  const data = statsData?.climate;

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
        <div className="animate-pulse text-red-500 font-mono tracking-widest text-sm uppercase">Loading Climate Data...</div>
      </div>
    );
  }

  return (
    <motion.section 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
      id="climate" className="py-32 px-8 max-w-[1200px] mx-auto relative bg-[#05111e]"
    >
      <Text as="div" className="font-mono text-[0.7rem] tracking-[0.4em] uppercase text-emerald-500 mb-4 font-black" en="Climate Resilience" bn="জলবায়ু সহনশীলতা" />
      <h2 className="font-playfair text-[clamp(2.5rem,5vw,4.5rem)] font-black text-white leading-none mb-10">
        <Text as="span" html={true} en="Agriculture Under <em class='text-red-500 not-italic'>Pressure</em>" bn="চাপের মুখে <em class='text-red-500 not-italic'>কৃষি</em>" />
      </h2>
      <Text as="p" className="max-w-[750px] text-white/50 leading-relaxed mb-16 text-lg" 
        en="Bangladesh is the 7th most climate-vulnerable nation. Agriculture bears the heaviest burden — yet remarkable innovations show extraordinary adaptive capacity." 
        bn="বাংলাদেশ বিশ্বের ৭ম সর্বোচ্চ জলবায়ু-ঝুঁকিপূর্ণ দেশ। কৃষি সবচেয়ে বেশি ক্ষতিগ্রস্ত — তবুও অসাধারণ উদ্ভাবন অভিযোজন ক্ষমতার প্রমাণ দিচ্ছে।" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {data.map((card, i) => (
          <motion.div 
            key={i} 
            variants={item}
            className={`border-l-4 ${card.border.replace('border-', 'border-')} p-10 bg-[#0a1628] border-y border-r border-white/5 rounded-r-[2.5rem] hover:bg-[#0c1c32] hover:border-white/20 transition-all duration-700 group shadow-2xl relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
            
            <div className="text-5xl mb-8 relative group-hover:scale-125 transition-transform origin-bottom-left duration-500">
              {card.icon}
            </div>
            <div className="font-playfair text-[1.5rem] font-bold text-white mb-4 group-hover:text-red-400 transition-colors">{lang === 'bn' ? card.title_bn : card.title_en}</div>
            <p className="text-[1rem] text-white/50 leading-relaxed mb-10 min-h-[80px] font-sans group-hover:text-white/70 transition-colors">
              {lang === 'bn' ? card.desc_bn : card.desc_en}
            </p>
            <div className="mt-auto h-2 bg-white/5 rounded-full overflow-hidden w-full">
              <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: card.barWidth }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                 className={`h-full rounded-full ${card.color.replace('bg-', 'bg-')}`} 
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
