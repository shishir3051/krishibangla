import Text from "./Text";
import { useStats } from "./StatsProvider";

export default function Overview() {
  const { statsData } = useStats();
  
  // Data Mapping
  const riceProd = statsData?.majorCrops?.[0]?.value || "38.1";
  const fishProd = statsData?.fisheries?.total || "4.7";
  const agValue = statsData?.market?.exportTotal || "$1.1B";
  const dynamicActive = !!statsData;

  return (
    <section id="overview" className="py-20 px-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <Text as="div" className="font-mono text-[0.68rem] tracking-[0.3em] uppercase text-green-mid mb-2" en="Sector Overview" bn="খাত সংক্ষিপ্ত বিবরণ" />
          <h2 className="font-playfair text-[clamp(2rem,4vw,3.2rem)] font-black text-green-deep leading-[1.1]">
            <Text as="span" en="The <em class='text-gold italic font-normal'>Golden</em> Fields of Bangladesh" bn="বাংলাদেশের <em class='text-gold italic font-normal'>সোনালী</em> ফসলের মাঠ" html={true} />
          </h2>
        </div>
        {dynamicActive && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Real-Time Data Active</span>
          </div>
        )}
      </div>
      
      <Text 
        as="p" 
        className="max-w-[680px] text-muted leading-[1.9] mb-12" 
        en="Nestled in the Ganges-Brahmaputra delta — the world's largest river delta — Bangladesh's agriculture is shaped by extraordinary fertility and monsoon rhythms." 
        bn="গঙ্গা-ব্রহ্মপুত্র বদ্বীপে অবস্থিত বাংলাদেশের কৃষি অসাধারণ উর্বরতা এবং বর্ষার ছন্দে গড়ে উঠেছে।" 
      />
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mt-10 transition-all duration-700 ease-in-out fade-in">
        {/* Card 1: Rice */}
        <div className="bg-white border border-green-deep/12 rounded-[4px] p-[1.8rem] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(26,61,31,0.12)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-emerald-500">
          <div className="text-[2rem] mb-4">🌾</div>
          <Text as="div" className="font-playfair text-[1.2rem] font-bold text-green-deep mb-2" en="Rice Production" bn="ধান উৎপাদন" />
          <div className="font-mono text-[2.2rem] font-black text-green-deep mb-[0.2rem] flex items-baseline gap-2">
            {riceProd}
            <span className="text-sm font-bold text-muted uppercase">MT</span>
          </div>
          <Text 
            as="div" 
            className="text-[0.85rem] text-muted leading-[1.6]" 
            en="Annual production (metric tons). Bangladesh tripled rice output since 1971 through high-yield varieties." 
            bn="বার্ষিক উৎপাদন (মেট্রিক টন)। বিআরআরআই-র উচ্চফলনশীল জাতের মাধ্যমে ১৯৭১ সালের তুলনায় ধান উৎপাদন তিনগুণ বেড়েছে।" 
          />
          <div className="mt-4 flex items-center justify-between">
            <Text as="span" className="font-mono text-[0.65rem] py-[0.3rem] px-2 rounded-full bg-emerald-50 text-emerald-600 font-bold" en="↑ 3.2% YoY" bn="↑ বার্ষিক ৩.২% বৃদ্ধি" />
            {dynamicActive && <span className="text-[9px] font-mono text-muted uppercase opacity-40">WB Live</span>}
          </div>
        </div>
        
        {/* Card 2: Fish */}
        <div className="bg-white border border-green-deep/12 rounded-[4px] p-[1.8rem] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(26,61,31,0.12)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-blue-500">
          <div className="text-[2rem] mb-4">🐟</div>
          <Text as="div" className="font-playfair text-[1.2rem] font-bold text-green-deep mb-2" en="Fish Production" bn="মাছ উৎপাদন" />
          <div className="font-mono text-[2.2rem] font-black text-green-deep mb-[0.2rem] flex items-baseline gap-2">
            {fishProd}
            <span className="text-sm font-bold text-muted uppercase">MT</span>
          </div>
          <Text 
            as="div" 
            className="text-[0.85rem] text-muted leading-[1.6]" 
            en="Total fish from inland capture, aquaculture, and marine sources. Leading animal protein source." 
            bn="অভ্যন্তরীণ নদী, মাছ চাষ ও সামুদ্রিক উৎস থেকে মোট মাছ উৎপাদন। জাতীয় আমিষের প্রধান উৎস।" 
          />
          <div className="mt-4 flex items-center justify-between">
            <Text as="span" className="font-mono text-[0.65rem] py-[0.3rem] px-2 rounded-full bg-blue-50 text-blue-600 font-bold" en="↑ 6.1% YoY" bn="↑ বার্ষিক ৬.১% বৃদ্ধি" />
            {dynamicActive && <span className="text-[9px] font-mono text-muted uppercase opacity-40">WDI Live</span>}
          </div>
        </div>
        
        {/* Card 3: Sector Value */}
        <div className="bg-white border border-green-deep/12 rounded-[4px] p-[1.8rem] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(26,61,31,0.12)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-gold">
          <div className="text-[2rem] mb-4">💰</div>
          <Text as="div" className="font-playfair text-[1.2rem] font-bold text-green-deep mb-2" en="Sector Value" bn="কৃষি খাতের মূল্য" />
          <div className="font-mono text-[2.2rem] font-black text-green-deep mb-[0.2rem]">
            {agValue}
          </div>
          <Text 
            as="div" 
            className="text-[0.85rem] text-muted leading-[1.6]" 
            en="Net agricultural sector value added to the national economy. Includes crops, livestock, and forestry." 
            bn="জাতীয় অর্থনীতিতে যোগ করা নেট কৃষি খাতের মূল্য। ফসল, গবাদি পশু এবং বনজ সম্পদ অন্তর্ভুক্ত।" 
          />
          <div className="mt-4 flex items-center justify-between">
            <Text as="span" className="font-mono text-[0.65rem] py-[0.3rem] px-2 rounded-full bg-amber-50 text-amber-600 font-bold" en="→ Stable" bn="→ স্থিতিশীল" />
            {dynamicActive && <span className="text-[9px] font-mono text-muted uppercase opacity-40">WB Live</span>}
          </div>
        </div>
        
        {/* Card 4: Risks */}
        <div className="bg-white border border-green-deep/12 rounded-[4px] p-[1.8rem] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(26,61,31,0.12)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[4px] before:bg-rose-500">
          <div className="text-[2rem] mb-4">⛈️</div>
          <Text as="div" className="font-playfair text-[1.2rem] font-bold text-green-deep mb-2" en="Climate Risk" bn="জলবায়ু ঝুঁকি" />
          <div className="font-mono text-[2.2rem] font-black text-rose-600 mb-[0.2rem]">HIGH</div>
          <Text 
            as="div" 
            className="text-[0.85rem] text-muted leading-[1.6]" 
            en="7th most climate-vulnerable country globally. Flash floods and salinity intrusion are major threats." 
            bn="বিশ্বের ৭ম সর্বোচ্চ জলবায়ু-ঝুঁকিপূর্ণ দেশ। আকস্মিক বন্যা এবং লবণাক্ততা বড় হুমকি।" 
          />
          <Text as="span" className="font-mono text-[0.65rem] mt-4 py-[0.3rem] px-2 rounded-full bg-rose-50 text-rose-500 font-bold inline-block" en="↑ Risk Rising" bn="↑ ঝুঁকি বাড়ছে" />
        </div>
      </div>
    </section>
  );
}
