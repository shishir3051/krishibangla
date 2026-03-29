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
      <div className="py-20 px-8 flex items-center justify-center min-h-[400px]">
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
      id="climate" className="py-24 px-8 max-w-[1200px] mx-auto relative"
    >
      <Text as="div" className="font-mono text-[0.68rem] tracking-[0.3em] uppercase text-emerald-600 mb-2" en="Climate Resilience" bn="জলবায়ু সহনশীলতা" />
      <h2 className="font-playfair text-[clamp(2rem,4vw,3.2rem)] font-black text-[#0a1628] leading-[1.1] mb-6">
        <Text as="span" html={true} en="Agriculture Under <em class='text-red-500'>Pressure</em>" bn="চাপের মুখে <em class='text-red-500'>কৃষি</em>" />
      </h2>
      <Text as="p" className="max-w-[700px] text-gray-600 leading-[1.9] mb-12 text-[1.1rem]" 
        en="Bangladesh is the 7th most climate-vulnerable nation. Agriculture bears the heaviest burden — yet remarkable innovations show extraordinary adaptive capacity." 
        bn="বাংলাদেশ বিশ্বের ৭ম সর্বোচ্চ জলবায়ু-ঝুঁকিপূর্ণ দেশ। কৃষি সবচেয়ে বেশি ক্ষতিগ্রস্ত — তবুও অসাধারণ উদ্ভাবন অভিযোজন ক্ষমতার প্রমাণ দিচ্ছে।" 
      />
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 mt-12">
        {data.map((card, i) => (
          <motion.div 
            key={i} 
            variants={item}
            className={`border-l-4 ${card.border} p-8 bg-white/60 backdrop-blur-xl border-y border-r border-[#0a1628]/5 rounded-r-3xl hover:bg-white transition-all duration-500 group shadow-lg shadow-[#0a1628]/[0.02] hover:shadow-2xl hover:-translate-y-1`}
          >
            <div className="text-4xl mb-6 relative group-hover:scale-110 transition-transform origin-bottom-left duration-300">
              {card.icon}
            </div>
            <div className="font-playfair text-[1.3rem] font-bold text-[#0a1628] mb-3">{lang === 'bn' ? card.title_bn : card.title_en}</div>
            <p className="text-[0.95rem] text-gray-600 leading-[1.7] mb-6 min-h-[100px]">
              {lang === 'bn' ? card.desc_bn : card.desc_en}
            </p>
            <div className="mt-auto h-1.5 bg-gray-100 rounded-full overflow-hidden w-full">
              <div 
                 className={`h-full rounded-full transition-all duration-1000 ease-in-out ${card.color}`} 
                 style={{ width: card.barWidth }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
