'use client';
import { motion } from "framer-motion";
import Text from "./Text";
import { useLanguage } from "./LanguageProvider";
import { useStats } from "./StatsProvider";

export default function MarketIntelligence() {
  const { lang } = useLanguage();
  const { statsData } = useStats();

  const rankings = statsData?.market?.rankings || [
    { crop: 'Jute', bn: 'পাট', rank: '#2', world: 'Global Producer', world_bn: 'বৈশ্বিক উৎপাদনকারী', color: '#d4af37' },
    { crop: 'Rice', bn: 'ধান', rank: '#3', world: 'Global Producer', world_bn: 'বৈশ্বিক উৎপাদনকারী', color: '#10b981' },
    { crop: 'Mango', bn: 'আম', rank: '#7', world: 'Global Producer', world_bn: 'বৈশ্বিক উৎপাদনকারী', color: '#f39c12' },
    { crop: 'Potato', bn: 'আলু', rank: '#7', world: 'Global Producer', world_bn: 'বৈশ্বিক উৎপাদনকারী', color: '#c8a84b' },
  ];

  return (
    <section className="py-32 px-8 max-w-[1200px] mx-auto relative overflow-hidden bg-[#05111e]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-12">
        <div className="max-w-[700px]">
          <Text as="div" className="font-mono text-[0.7rem] tracking-[0.4em] uppercase text-amber-500 mb-4 font-black" en="Global Standing" bn="বৈশ্বিক অবস্থান" />
          <h2 className="font-playfair text-[clamp(2.5rem,5vw,4.5rem)] font-black text-white leading-none mb-8">
            <Text as="span" html={true} en="Strategic <em class='text-amber-500 not-italic'>Market</em> Performance" bn="কৌশলগত <em class='text-amber-500 not-italic'>বাজার</em> সক্ষমতা" />
          </h2>
          <Text as="p" className="text-white/50 leading-relaxed text-lg font-sans" 
            en="Ranking among the world's top producers across major commodities. Our agricultural mission is driven by data-centric productivity and global export quality." 
            bn="প্রধান ফসলের বৈশ্বিক উৎপাদনে বিশ্বের শীর্ষ দেশগুলোর মধ্যে অবস্থান। আমাদের কৃষি লক্ষ্য আধুনিক প্রযুক্তি ও রপ্তানি মান নিশ্চিত করার মাধ্যমে পরিচালিত।" 
          />
        </div>
        
        <div className="bg-[#0a1628] p-10 rounded-[3rem] text-white flex flex-col gap-6 shadow-2xl border border-white/5 relative group overflow-hidden shrink-0">
           <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
           <div className="text-[0.65rem] font-black tracking-[0.3em] text-white/30 uppercase font-mono">Live Export Pulse</div>
           <div className="flex items-center gap-8">
              <div className="text-4xl font-black text-amber-500 tracking-tighter">{statsData?.market?.exportTotal || '$1.25B+'}</div>
              <div className="h-12 w-[1px] bg-white/10" />
              <div className="text-xs font-mono text-white/60 leading-tight tracking-wider font-bold">
                 <Text en="Annual Agricultural Export" bn="বার্ষিক কৃষি রপ্তানি আয়" />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rankings.map((r, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
            className="group bg-[#0a1628] border border-white/5 p-10 rounded-[3rem] relative overflow-hidden hover:shadow-2xl transition-all duration-700 hover:-translate-y-4 hover:border-white/20"
          >
             <div 
               className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 rounded-full"
               style={{ backgroundColor: r.color }}
             />
             <div className="relative z-10 flex flex-col h-full">
                <div className="text-[0.65rem] font-black tracking-[0.2em] text-white/30 uppercase mb-6 font-mono group-hover:text-white/50 transition-colors">{lang === 'bn' ? r.bn : r.crop} Output</div>
                <div className="font-playfair text-[4.5rem] font-black leading-none mb-6 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" style={{ color: r.color }}>{r.rank}</div>
                <div className="mt-auto font-mono text-[10px] font-black uppercase tracking-[0.25em] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                   {lang === 'bn' ? r.world_bn : r.world}
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
