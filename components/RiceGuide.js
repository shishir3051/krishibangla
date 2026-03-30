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
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 90 } }
  };

  if (!steps) {
    return (
      <div className="bg-[#05111e] py-20 px-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-emerald-400 font-mono tracking-widest text-sm uppercase">Loading Rice Farming Guide...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#05111e] py-32 px-8 w-full border-t border-white/5" id="rice-az">
      <div className="max-w-[1200px] mx-auto">
        <div className="font-mono text-[0.7rem] tracking-[0.4em] uppercase text-emerald-500 mb-4 font-black">
          {lang === 'bn' ? 'সম্পূর্ণ ধান চাষ গাইড' : 'Complete Rice Farming Guide'}
        </div>
        <h2 className="font-playfair text-[clamp(2.5rem,5vw,4rem)] font-black text-white leading-none mb-8">
          {lang === 'bn'
            ? <>কিভাবে <span className="text-gold">ধান</span> উৎপাদন হয়</>
            : <>The <em className="text-gold not-italic">Golden Grain</em> Field Manual</>
          }
        </h2>
        <p className="max-w-[700px] text-white/50 leading-relaxed mb-16 text-lg">
          {lang === 'bn'
            ? 'বীজ নির্বাচন থেকে বাজার পর্যন্ত বাংলাদেশে ধান চাষের প্রতিটি ধাপ।'
            : 'Every step of rice cultivation in Bangladesh — from seed selection to market. Standard practices based on BRRI & DAE research.'
          }
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={item}
              className="group bg-[#0a1628] border border-white/10 rounded-[2.5rem] p-8 flex gap-6 items-start hover:border-gold/30 hover:bg-[#0c1c32] transition-all duration-500 relative overflow-hidden group/card shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover/card:bg-gold/10 transition-colors" />
              
              <div className="font-playfair text-[3.5rem] font-black text-gold/20 shrink-0 leading-none min-w-[60px] group-hover/card:text-gold/40 transition-all duration-500 group-hover/card:scale-110">
                {s.step}
              </div>
              <div className="relative z-10">
                <div className="font-playfair text-2xl font-black text-white mb-2 group-hover/card:text-gold transition-colors">
                  {lang === 'bn' ? s.title_bn : s.title_en}
                </div>
                <div className="font-mono text-[0.65rem] text-emerald-400 mb-4 font-black uppercase tracking-[0.2em] opacity-80">
                  {lang === 'bn' ? s.sub_bn : s.sub_en}
                </div>
                <p className="text-[0.95rem] text-white/50 leading-relaxed font-sans group-hover/card:text-white/70 transition-colors">
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
