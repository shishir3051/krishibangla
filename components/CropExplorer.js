'use client';
import { motion } from "framer-motion";
import Link from "next/link";
import Text from "./Text";
import { useLanguage } from "./LanguageProvider";
import { useStats } from "./StatsProvider";
import { cropsList } from "@/data/cropsData";

export default function CropExplorer() {
  const { lang } = useLanguage();
  const { statsData } = useStats();

  // Map shared cropsData fields to the shape CropExplorer needs
  const crops = cropsList.map(c => ({
    id: c.id,
    en: c.en,
    bn: c.bn,
    desc_en: c.desc_en,
    desc_bn: c.desc_bn,
    icon: c.icon,
    color: c.cardColor,
    border: c.cardBorder,
    production: c.production,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <section id="crop-explorer" className="py-24 px-4 bg-[#05111e] relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                {lang === 'bn' ? 'ক্যাটাগরি এক্সপ্লোরার' : 'Category Explorer'}
              </span>
            </div>
            <h2 className="font-playfair text-[clamp(2.5rem,5vw,3.5rem)] font-black text-white leading-[1.1]">
              <Text as="span" en="Explore Agricultural " bn="কৃষি খাত " />
              <Text as="span" className="text-emerald-400" en="Sectors" bn="অনুসন্ধান করুন" />
            </h2>
          </div>
          <p className="text-white/50 text-lg max-w-[400px] leading-relaxed pb-2">
            <Text 
              en="Dive deep into specific crops for specialized intelligence, market data, and cultivation guidelines." 
              bn="বিশেষায়িত তথ্য, বাজারের উপাত্ত এবং চাষাবাদের নির্দেশিকার জন্য নির্দিষ্ট ফসলে গভীরভাবে নজর দিন।" 
            />
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {crops.map((crop) => (
            <motion.div key={crop.id} variants={itemVariants}>
              <Link href={`/crop/${crop.id}`}>
                <div className={`block h-[280px] rounded-[2.5rem] p-8 border border-white/5 bg-gradient-to-br transition-all duration-500 group relative overflow-hidden bg-[#0a1628] ${crop.color} ${crop.border} hover:-translate-y-2 hover:shadow-2xl`}>
                  
                  {/* Background Accents */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none group-hover:bg-white/10 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-6xl group-hover:scale-110 transition-transform origin-bottom-left duration-500 drop-shadow-2xl">
                      {crop.icon}
                    </div>
                    <div className="bg-[#05111e]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                      <span className="text-xs font-mono font-bold text-white/50 tracking-widest uppercase">
                        {lang === 'bn' ? 'উৎপাদন:' : 'Vol:'} {crop.production}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 z-10 relative">
                    <h3 className="font-playfair text-3xl font-black text-white mb-3 group-hover:text-emerald-300 transition-colors">
                      {lang === 'bn' ? crop.bn : crop.en}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed font-sans line-clamp-2">
                      {lang === 'bn' ? crop.desc_bn : crop.desc_en}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="absolute bottom-8 right-8 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
