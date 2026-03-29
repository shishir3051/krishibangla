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
    <section className="py-24 px-8 max-w-[1200px] mx-auto relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div className="max-w-[600px]">
          <Text as="div" className="font-mono text-[0.68rem] tracking-[0.3em] uppercase text-amber-600 mb-2" en="Global Standing" bn="বৈশ্বিক অবস্থান" />
          <h2 className="font-playfair text-[clamp(2.5rem,5vw,3.5rem)] font-black text-[#0a1628] leading-[1.1] mb-6">
            <Text as="span" html={true} en="Strategic <em class='text-amber-500'>Market</em> Performance" bn="কৌশলগত <em class='text-amber-500'>বাজার</em> সক্ষমতা" />
          </h2>
          <Text as="p" className="text-gray-600 leading-relaxed text-lg" 
            en="Ranking among the world's top producers across major commodities. Our agricultural mission is driven by data-centric productivity and global export quality." 
            bn="প্রধান ফসলের বৈশ্বিক উৎপাদনে বিশ্বের শীর্ষ দেশগুলোর মধ্যে অবস্থান। আমাদের কৃষি লক্ষ্য আধুনিক প্রযুক্তি ও রপ্তানি মান নিশ্চিত করার মাধ্যমে পরিচালিত।" 
          />
        </div>
        
        <div className="bg-[#0a1628] p-8 rounded-[2rem] text-white flex flex-col gap-4 shadow-2xl relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
           <div className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">Live Export Pulse</div>
           <div className="flex items-center gap-6">
              <div className="text-3xl font-black text-amber-500">{statsData?.market?.exportTotal || '$1.25B+'}</div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div className="text-xs font-mono text-white/60 leading-tight">
                 <Text en="Annual Agricultural Export" bn="বার্ষিক কৃষি রপ্তানি আয়" />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {rankings.map((r, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white border border-[#0a1628]/5 p-8 rounded-[2.5rem] relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 shadow-sm"
          >
             <div 
               className="absolute top-0 right-0 w-24 h-24 blur-[50px] opacity-0 group-hover:opacity-30 transition-opacity duration-700"
               style={{ backgroundColor: r.color }}
             />
             <div className="relative z-10">
                <div className="text-sm font-black tracking-[0.1em] text-gray-300 uppercase mb-4">{lang === 'bn' ? r.bn : r.crop} Output</div>
                <div className="font-playfair text-[3.5rem] font-black leading-none mb-3" style={{ color: r.color }}>{r.rank}</div>
                <div className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                   {lang === 'bn' ? r.world_bn : r.world}
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
