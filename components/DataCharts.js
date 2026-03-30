'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Text from "./Text";
import { useLanguage } from "./LanguageProvider";
import { useStats } from "./StatsProvider";
import { generateLinearPath, generateFillPath } from "@/lib/chartUtils";

export default function DataCharts() {
  const { lang } = useLanguage();
  const { statsData, loading } = useStats();

  const riceHistory = statsData?.history?.rice || [];
  const startData = riceHistory.length > 0 ? riceHistory[0] : { year: '2015', value: 29.7 };
  const endData = riceHistory.length > 0 ? riceHistory[riceHistory.length - 1] : { year: '2024', value: 38.1 };


  if (!statsData) {
    return (
      <div className="bg-[#05111e] py-24 px-8 w-full text-white min-h-[500px] flex items-center justify-center">
         <div className="animate-pulse text-emerald-400 font-mono tracking-widest text-sm uppercase flex items-center gap-3">
            <span className="w-5 h-5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></span>
            SYNCING LIVE DATA CENTER...
         </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-[#05111e] py-24 px-8 w-full text-white overflow-hidden" id="data">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-end mb-12">
           <div>
              <Text as="div" className="font-mono text-[0.68rem] tracking-[0.4em] uppercase text-emerald-400 mb-2" en="Intelligence & Output" bn="ইন্টেলিজেন্স ও আউটপুট" />
              <h2 className="font-playfair text-[clamp(2.5rem,5vw,4rem)] font-black text-white leading-[1.1]">
                <Text as="span" html={true} en="Strategic <em class='text-emerald-400'>Intelligence</em>" bn="কৌশলগত <em class='text-emerald-400'>তথ্যভাণ্ডার</em>" />
              </h2>
           </div>
           <div className="hidden md:block text-right">
              <div className="text-[10px] font-black text-white/30 tracking-[0.2em] mb-1">DATA SYNC STATUS</div>
              <div className="text-emerald-400 font-mono text-xs flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                 ACTIVE: {new Date(statsData.serverTime).toLocaleTimeString()}
              </div>
           </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Main Trend Chart - Dynamic SVG */}
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="bg-[#0a1a2a]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-8">
               <Text as="h3" className="font-mono text-xs font-black tracking-widest text-emerald-400 uppercase" en={`Rice Production Trend (${startData.year}-${endData.year})`} bn={`ধান উৎপাদনের ধারা (${startData.year}-${endData.year})`} />
               <div className="text-emerald-400/50 font-mono text-[10px] tracking-tight">CAGR: +2.8%</div>
            </div>
            
            <div className="relative h-[200px] w-full mt-4">
               <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                  <defs>
                     <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                     </linearGradient>
                  </defs>
                  
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    d={generateLinearPath(statsData.history?.rice || [], 400, 100)} 
                    fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                  />
                  <motion.path 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    d={generateFillPath(generateLinearPath(statsData.history?.rice || [], 400, 100), 400, 100)} 
                    fill="url(#chartGradient)" 
                  />
                  
                  {(statsData.history?.rice || []).map((p, i) => (
                    <motion.circle key={i} cx={(i / (statsData.history.rice.length - 1)) * 400} cy={100 - ((p.value - startData.value) / (endData.value - startData.value)) * 100} r="3" fill="#10b981" initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + (i * 0.1) }} />
                  ))}
               </svg>
               <div className="flex justify-between mt-4 font-mono text-[9px] text-white/20 uppercase tracking-widest">
                  <span>{startData.year}: {startData.value}M</span>
                  <span>{endData.year}: {endData.value}M</span>
               </div>
            </div>
          </motion.div>

          {/* Major Crops with Momentum */}
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="bg-[#0a1a2a]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10">
            <Text as="h3" className="font-mono text-xs font-black tracking-widest text-emerald-400 uppercase mb-10" en="Commodity Momentum" bn="কমোডিটি মুভমেন্ট" />
            <div className="flex flex-col gap-6">
               {(statsData.majorCrops || []).map((crop, i) => (
                 <div key={i} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
                       <span className="text-white/40">{lang === 'bn' ? crop.name_bn : crop.name_en}</span>
                       <div className="flex items-center gap-3">
                          <span className="text-white">{crop.value} M MT</span>
                          <span className={crop.momentum === 'up' ? 'text-emerald-400' : 'text-red-400'}>
                             {crop.momentum === 'up' ? '▲' : crop.momentum === 'down' ? '▼' : '■'}
                          </span>
                       </div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: crop.width }}
                         transition={{ duration: 1.5, ease: "circOut", delay: i * 0.1 }}
                         className="h-full rounded-full"
                         style={{ background: `linear-gradient(90deg, ${crop.colors[0]}, ${crop.colors[1]})` }}
                       />
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>

        </div>
        
        {/* Secondary Stat Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
           {/* Top Districts Bar Mini */}
           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-[#0a1a2a]/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 md:col-span-2">
              <Text as="h4" className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6" en="District Production Leaders" bn="শীর্ষ জেলাসমূহ" />
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                 {(statsData.topDistricts || []).map((d, i) => (
                    <div key={i} className="flex flex-col gap-3">
                       <div className="text-[10px] font-bold text-white/50 truncate uppercase tracking-tighter">{lang === 'bn' ? d.name_bn : d.name_en}</div>
                       <div className="w-full bg-white/10 h-24 rounded-xl relative overflow-hidden border border-white/5 shadow-inner">
                          {/* Animated Bar */}
                          <motion.div 
                            initial={{ height: 0 }}
                            whileInView={{ height: d.width || '0%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "circOut", delay: i * 0.1 }}
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-600/80 to-emerald-400"
                          />
                          {/* Value Counter */}
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <span className="font-mono text-[11px] font-black text-white drop-shadow-lg">{d.value}</span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </motion.div>

           {/* Fisheries Breakdown Mini */}
           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-[#0a1a2a]/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between">
              <Text as="h4" className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4" en="Sectoral Resilience" bn="সেক্টরাল সক্ষমতা" />
              <div className="space-y-3">
                 {statsData.fisheries.breakdown.map((item, i) => (
                    <div key={i} className="flex flex-col gap-1">
                       <div className="flex justify-between text-[8px] font-bold text-white/40 mb-1">
                          <span>{lang === 'bn' ? item.name_bn : item.name_en}</span>
                          <span>{item.share}</span>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: item.share }} className="h-full rounded-full" style={{ background: item.color }} />
                       </div>
                    </div>
                 ))}
              </div>
              <div className="mt-6 flex flex-col gap-1">
                 <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">CUMULATIVE OUTPUT</div>
                 <div className="text-xl font-black text-blue-400">{statsData.fisheries.total}M <span className="text-[10px] text-white/30">MT</span></div>
              </div>
           </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
