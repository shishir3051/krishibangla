'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "./LanguageProvider";

import { useStats } from "./StatsProvider";

export default function RiceGuide() {
  const { lang } = useLanguage();
  const { statsData, loading } = useStats();
  const steps = statsData?.riceGuide;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 90 } }
  };

  if (!steps) {
    return (
      <div className="bg-[#f9f6ef] py-20 px-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-amber-600 font-mono tracking-widest text-sm uppercase">Loading Rice Farming Guide...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f6ef] py-24 px-8 w-full" id="rice-az">
      <div className="max-w-[1200px] mx-auto">
        <div className="font-mono text-[0.68rem] tracking-[0.3em] uppercase text-amber-600 mb-2">
          {lang === 'bn' ? 'সম্পূর্ণ ধান চাষ গাইড' : 'Complete Rice Farming Guide'}
        </div>
        <h2 className="font-playfair text-[clamp(2rem,4vw,3.2rem)] font-black text-[#0a1628] leading-[1.1] mb-3">
          {lang === 'bn'
            ? <>কিভাবে ধান উৎপাদন করে</>
            : <>The <em className="text-amber-500 not-italic">Golden Fields</em> of Bangladesh — Rice Farming</>
          }
        </h2>
        <p className="max-w-[680px] text-gray-500 leading-[1.9] mb-12 text-[1.05rem]">
          {lang === 'bn'
            ? 'বীজ নির্বাচন থেকে বাজার পর্যন্ত বাংলাদেশে ধান চাষের প্রতিটি ধাপ।'
            : 'Every step of rice cultivation in Bangladesh — from seed selection to market. 12-step field guide based on BRRI & DAE recommended practices.'
          }
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5"
        >
          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={item}
              className="group bg-white border border-[#0a1628]/10 rounded-[2rem] p-8 flex gap-6 items-start hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(180,120,0,0.12)] transition-all duration-500"
            >
              <div className="font-playfair text-[3rem] font-black text-amber-400/60 shrink-0 leading-none min-w-[50px] group-hover:text-amber-500 transition-colors duration-500">
                {s.step}
              </div>
              <div>
                <div className="font-playfair text-xl sm:text-2xl font-black text-[#0a1628] mb-1">
                  {lang === 'bn' ? s.title_bn : s.title_en}
                </div>
                <div className="font-mono text-xs text-amber-500 mb-4 font-black uppercase tracking-widest">
                  {lang === 'bn' ? s.sub_bn : s.sub_en}
                </div>
                <p className="text-[1.05rem] text-gray-500 leading-relaxed font-medium">
                  {lang === 'bn' ? s.desc_bn : s.desc_en}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
