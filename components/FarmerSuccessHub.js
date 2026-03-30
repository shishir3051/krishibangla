'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Text from "./Text";
import { useLanguage } from "./LanguageProvider";
import { districtsData } from "../data/districtsData";
import { parseCalendarPhases } from "../lib/calendarUtils";

export default function FarmerSuccessHub() {
  const { lang } = useLanguage();
  const districtNames = Object.keys(districtsData).sort();
  const [selectedDistrict, setSelectedDistrict] = useState('Rajshahi');

  const [mockBuyers, setBuyers] = useState([]);
  const [govSchemes, setSchemes] = useState([]);
  const [loadingDynamicData, setLoading] = useState(true);

  const activeData = districtsData[selectedDistrict] || districtsData['Rajshahi'];

  // Parse calendar string into phases using the shared utility
  const calendarPhases = parseCalendarPhases(activeData.calendar);

  // Fetch true localized intelligence generated directly by the backend API whenever district changes
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/farmer-success?district=${encodeURIComponent(selectedDistrict)}`)
      .then(r => r.json())
      .then(data => {
        if(active && !data.error) {
           setBuyers(data.buyers || []);
           setSchemes(data.schemes || []);
           setLoading(false);
        }
      }).catch(err => {
         console.error("Failed to load localized Hub data:", err);
         setLoading(false);
      });
      return () => { active = false };
  }, [selectedDistrict]);

  return (
    <section className="py-24 px-8 relative overflow-hidden bg-[#0a1628] border-t border-white/5">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/3 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
             <Text as="div" className="font-mono text-xs font-black tracking-[0.3em] uppercase text-emerald-500 mb-4" en="Grassroots Utility" bn="প্রান্তিক পর্যায়ের সেবা" />
             <h2 className="font-playfair text-[clamp(2.5rem,4vw,4rem)] font-black text-white leading-none mb-6">
                <Text as="span" en="Farmer " bn="কৃষক " />
                <span className="text-emerald-500 italic"><Text as="span" en="Success" bn="সাফল্য" /></span>
                <Text as="span" en=" Hub" bn=" হাব" />
             </h2>
             <Text as="p" className="text-white/60 max-w-xl text-lg" 
               en="Bridging the gap between macro-analytics and everyday farm operations. Connect with local buyers, track sowing calendars, and claim government subsidies directly." 
               bn="ম্যাক্রো-ডেটা এবং নিত্যদিনের কৃষি কাজের মধ্যে সেতুবন্ধন। স্থানীয় ক্রেতাদের সাথে যোগাযোগ করুন, রোপণ পঞ্জিকা ট্র্যাক করুন এবং সরাসরি সরকারি ভর্তুকি দাবি করুন।" />
          </div>

          <div className="flex flex-col gap-2 min-w-[250px]">
            <Text as="label" className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/40 uppercase" en="Localize Intelligence Region" bn="অঞ্চল নির্বাচন করুন" />
            <select 
              value={selectedDistrict} 
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-[#05111e] border border-white/10 text-white px-5 py-4 rounded-2xl outline-none focus:border-emerald-500/50 transition-colors font-bold appearance-none cursor-pointer"
            >
              {districtNames.map(d => (
                <option key={d} value={d}>{lang === 'bn' ? districtsData[d].bn : districtsData[d].name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. Localized Crop Calendar */}
          <div className="lg:col-span-8 bg-[#05111e]/50 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-sm relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl border border-emerald-500/20">📅</div>
               <div>
                  <h3 className="text-2xl font-black text-white"><Text en="Precision Crop Calendar" bn="নির্ভুল শস্য পঞ্জিকা" /></h3>
                  <div className="text-emerald-400/80 font-mono text-xs uppercase tracking-widest mt-1">
                     <Text en="Localized for " bn="নির্ধারিত অঞ্চল: " />
                     {lang === 'bn' ? activeData.bn : activeData.name}
                  </div>
               </div>
             </div>

             <div className="flex flex-col gap-6 relative">
                <div className="absolute left-6 top-6 bottom-6 w-px bg-white/10" />
                {calendarPhases.map((phase, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    key={i} className="flex gap-6 items-center relative z-10 relative"
                  >
                     <div className="w-12 h-12 rounded-full bg-[#0a1628] border-2 border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                       <div className="w-3 h-3 rounded-full bg-emerald-400" />
                     </div>
                     <div className="flex-1 bg-white/5 border border-white/5 p-5 rounded-2xl flex justify-between items-center group-hover:bg-white/10 transition-colors">
                        <div>
                          <p className="text-white font-bold text-lg">{phase.action}</p>
                          <p className="text-white/50 text-sm mt-1">
                            {activeData.crops.slice(0, 2).join(', ')} / {activeData.soil.split('/')[0]}
                          </p>
                        </div>
                        <div className="font-mono text-emerald-400 font-bold tracking-widest bg-emerald-500/10 px-4 py-2 rounded-lg">
                          {phase.time}
                        </div>
                     </div>
                  </motion.div>
                ))}
             </div>
          </div>

          {/* 2. Gov Scheme Tracker */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex-1 bg-blue-900/10 border border-blue-500/10 rounded-[2.5rem] p-8 backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl">🏛️</div>
                 <h3 className="text-xl font-black text-white"><Text en="Gov Support & Subsidies" bn="সরকারি সহায়তা ও ভর্তুকি" /></h3>
               </div>
               
               <div className="space-y-4">
                 {govSchemes.map((scheme, i) => (
                   <div key={i} className="bg-[#05111e]/80 border border-white/5 p-5 rounded-2xl">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-bold">{lang === 'bn' ? scheme.bn : scheme.title}</h4>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded bg-${scheme.color}-500/20 text-${scheme.color}-400`}>
                          {lang === 'bn' ? scheme.tag_bn : scheme.tag}
                        </span>
                      </div>
                      <p className="text-white/60 text-xs leading-relaxed">{lang === 'bn' ? scheme.desc_bn : scheme.desc}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* 3. Bazar-Link (Market Connect) */}
          <div className="lg:col-span-12 bg-gradient-to-r from-[#05111e] to-[#0a1628] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden mt-6">
             <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
               <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl border border-amber-500/20">🤝</div>
                 <div>
                    <h3 className="text-3xl font-black text-white">Bazar-Link <span className="text-amber-500 text-lg ml-2 border border-amber-500/30 px-3 py-1 rounded-full bg-amber-500/10">BETA</span></h3>
                    <p className="text-white/50 text-sm mt-1"><Text en="Directly connect with high-volume buyers and Aratdars in" bn="সরাসরি যুক্ত হোন শীর্ষ ক্রেতা ও আড়তদারদের সাথে" /> {lang === 'bn' ? activeData.bn : activeData.name}</p>
                 </div>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
               {mockBuyers.map((buyer, i) => (
                 <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{lang === 'bn' ? buyer.bn : buyer.name}</h4>
                        <p className="text-amber-400 text-xs font-mono uppercase tracking-widest">{lang === 'bn' ? buyer.type_bn : buyer.type}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">✓</div>
                    </div>
                    
                    <div className="flex flex-col gap-3 mt-6">
                      <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                        <span className="text-white/40"><Text en="Buying Target" bn="ক্রয়কৃত শস্য" /></span>
                        <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">{buyer.crop}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                        <span className="text-white/40"><Text en="Demand" bn="বর্তমান চাহিদা" /></span>
                        <span className={`text-${buyer.demandColor || 'emerald'}-400 font-bold`}>{lang === 'bn' ? buyer.demand_bn : buyer.demand}</span>
                      </div>
                      <button className="w-full mt-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-widest transition-all group-hover:border-amber-400">
                         {lang === 'bn' ? 'যোগাযোগ করুন: ' : 'Contact: '} {buyer.phone}
                      </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
