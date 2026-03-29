import Text from "./Text";

export default function Overview() {
  return (
    <section id="overview" className="py-20 px-8 max-w-[1200px] mx-auto">
      <Text as="div" className="font-mono text-[0.68rem] tracking-[0.3em] uppercase text-green-mid mb-2" en="Sector Overview" bn="খাত সংক্ষিপ্ত বিবরণ" />
      
      <h2 className="font-playfair text-[clamp(2rem,4vw,3.2rem)] font-black text-green-deep leading-[1.1] mb-6">
        <Text as="span" en="The <em class='text-gold italic font-normal'>Golden</em> Fields of Bangladesh" bn="বাংলাদেশের <em class='text-gold italic font-normal'>সোনালী</em> ফসলের মাঠ" html={true} />
      </h2>
      
      <Text 
        as="p" 
        className="max-w-[680px] text-muted leading-[1.9] mb-8" 
        en="Nestled in the Ganges-Brahmaputra delta — the world's largest river delta — Bangladesh's agriculture is shaped by extraordinary fertility, monsoon rhythms, and the dance between water and land. From the paddy fields of Sylhet to the shrimp farms of Khulna, agriculture feeds a nation of 170 million." 
        bn="গঙ্গা-ব্রহ্মপুত্র বদ্বীপে অবস্থিত বাংলাদেশের কৃষি অসাধারণ উর্বরতা, বর্ষার ছন্দ ও জল-মাটির মেলবন্ধনে গড়ে উঠেছে। সিলেটের ধানক্ষেত থেকে খুলনার চিংড়ি খামার পর্যন্ত কৃষি ১৭ কোটি মানুষের খাদ্য জোগায়।" 
      />
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mt-10 transition-all duration-700 ease-in-out fade-in">
        <div className="bg-white border border-green-deep/12 rounded-[4px] p-[1.8rem] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(26,61,31,0.12)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-green-mid before:to-green-bright">
          <div className="text-[2rem] mb-4">🌾</div>
          <Text as="div" className="font-playfair text-[1.2rem] font-bold text-green-deep mb-2" en="Rice Production" bn="ধান উৎপাদন" />
          <div className="font-mono text-[2rem] font-medium text-green-mid mb-[0.3rem]">38.1 MT</div>
          <Text 
            as="div" 
            className="text-[0.85rem] text-muted leading-[1.6]" 
            en="Annual production (metric tons). Bangladesh tripled rice output since 1971 through BRRI high-yield varieties and three-season cultivation." 
            bn="বার্ষিক উৎপাদন (মেট্রিক টন)। BRRI-র উচ্চফলনশীল জাত ও তিন মৌসুমের চাষের মাধ্যমে ১৯৭১ সালের তুলনায় ধান উৎপাদন তিনগুণ বেড়েছে।" 
          />
          <Text as="span" className="font-mono text-[0.7rem] mt-4 py-[0.3rem] px-[0.6rem] rounded-[2px] inline-block bg-[#e8f5e9] text-green-mid" en="↑ 3.2% YoY" bn="↑ বার্ষিক ৩.২% বৃদ্ধি" />
        </div>
        
        <div className="bg-white border border-green-deep/12 rounded-[4px] p-[1.8rem] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(26,61,31,0.12)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-water before:to-water-light">
          <div className="text-[2rem] mb-4">🐟</div>
          <Text as="div" className="font-playfair text-[1.2rem] font-bold text-green-deep mb-2" en="Fish Production" bn="মাছ উৎপাদন" />
          <div className="font-mono text-[2rem] font-medium text-green-mid mb-[0.3rem]">4.7 MT</div>
          <Text 
            as="div" 
            className="text-[0.85rem] text-muted leading-[1.6]" 
            en="Total fish from inland capture, aquaculture, and marine sources. Provides 60%+ of national animal protein intake." 
            bn="অভ্যন্তরীণ নদী, মাছ চাষ ও সামুদ্রিক উৎস থেকে মোট মাছ উৎপাদন। জাতীয় প্রাণিজ আমিষের ৬০%+ জোগান দেয়।" 
          />
          <Text as="span" className="font-mono text-[0.7rem] mt-4 py-[0.3rem] px-[0.6rem] rounded-[2px] inline-block bg-[#e8f5e9] text-green-mid" en="↑ 6.1% YoY" bn="↑ বার্ষিক ৬.১% বৃদ্ধি" />
        </div>
        
        <div className="bg-white border border-green-deep/12 rounded-[4px] p-[1.8rem] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(26,61,31,0.12)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-gold before:to-gold-light">
          <div className="text-[2rem] mb-4">🪢</div>
          <Text as="div" className="font-playfair text-[1.2rem] font-bold text-green-deep mb-2" en="Jute Export" bn="পাট রপ্তানি" />
          <div className="font-mono text-[2rem] font-medium text-green-mid mb-[0.3rem]">$1.1B</div>
          <Text 
            as="div" 
            className="text-[0.85rem] text-muted leading-[1.6]" 
            en="Annual jute and jute goods export. Bangladesh is the world's largest jute exporter — the Golden Fiber (সোনালী আঁশ)." 
            bn="বার্ষিক পাট ও পাটজাত পণ্য রপ্তানি আয়। বাংলাদেশ বিশ্বের সবচেয়ে বড় পাট রপ্তানিকারক — সোনালী আঁশের দেশ।" 
          />
          <Text as="span" className="font-mono text-[0.7rem] mt-4 py-[0.3rem] px-[0.6rem] rounded-[2px] inline-block bg-[#fff8e1] text-gold" en="→ Stable" bn="→ স্থিতিশীল" />
        </div>
        
        <div className="bg-white border border-green-deep/12 rounded-[4px] p-[1.8rem] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(26,61,31,0.12)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-accent-red before:to-[#e67e22]">
          <div className="text-[2rem] mb-4">🌊</div>
          <Text as="div" className="font-playfair text-[1.2rem] font-bold text-green-deep mb-2" en="Climate Risk" bn="জলবায়ু ঝুঁকি" />
          <Text as="div" className="font-mono text-[2rem] font-medium text-green-mid mb-[0.3rem]" en="HIGH" bn="উচ্চ" />
          <Text 
            as="div" 
            className="text-[0.85rem] text-muted leading-[1.6]" 
            en="7th most climate-vulnerable nation. 20–70% of land floods annually. Saline intrusion threatens 2.8M ha of coastal farmland." 
            bn="বিশ্বের ৭ম সর্বোচ্চ জলবায়ু-ঝুঁকিপূর্ণ দেশ। প্রতি বছর ২০–৭০% জমি প্লাবিত হয়। লবণাক্ততা ২৮ লক্ষ হেক্টর উপকূলীয় জমিকে হুমকিতে ফেলছে।" 
          />
          <Text as="span" className="font-mono text-[0.7rem] mt-4 py-[0.3rem] px-[0.6rem] rounded-[2px] inline-block bg-[#ffebee] text-accent-red" en="↑ Risk Rising" bn="↑ ঝুঁকি বাড়ছে" />
        </div>
      </div>
    </section>
  );
}
