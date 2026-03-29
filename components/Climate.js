import Text from "./Text";

export default function Climate() {
  return (
    <section id="climate" className="py-20 px-8 max-w-[1200px] mx-auto">
      <Text as="div" className="font-mono text-[0.68rem] tracking-[0.3em] uppercase text-green-mid mb-2" en="Climate Resilience" bn="জলবায়ু সহনশীলতা" />
      <h2 className="font-playfair text-[clamp(2rem,4vw,3.2rem)] font-black text-green-deep leading-[1.1] mb-6">
        <Text as="span" html={true} en="Agriculture Under <em>Pressure</em>" bn="চাপের মুখে <em>কৃষি</em>" />
      </h2>
      <Text as="p" className="max-w-[680px] text-muted leading-[1.9] mb-8" 
        en="Bangladesh is the 7th most climate-vulnerable nation. Agriculture bears the heaviest burden — yet remarkable innovations show extraordinary adaptive capacity." 
        bn="বাংলাদেশ বিশ্বের ৭ম সর্বোচ্চ জলবায়ু-ঝুঁকিপূর্ণ দেশ। কৃষি সবচেয়ে বেশি ক্ষতিগ্রস্ত — তবুও অসাধারণ উদ্ভাবন অভিযোজন ক্ষমতার প্রমাণ দিচ্ছে।" 
      />
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 mt-8 transition-all duration-700 ease-in-out fade-in">
        
        <div className="border-l-3 border-water p-[1.2rem_1.4rem] bg-white rounded-[0_4px_4px_0]">
          <div className="text-[1.8rem] mb-[0.6rem]">🌊</div>
          <Text as="div" className="font-playfair text-[1.05rem] font-bold text-green-deep mb-[0.3rem]" en="Annual Floods" bn="বার্ষিক বন্যা" />
          <Text as="div" className="text-[0.83rem] text-muted leading-[1.6]" 
            en="20–70% of land floods annually. BRRI dhan51/52 (Sub1A gene) survive 2 weeks submerged — adopted on 3M+ ha across South Asia." 
            bn="প্রতি বছর ২০–৭০% জমি প্লাবিত হয়। Sub1A জিনযুক্ত BRRI ধান৫১/৫২ দুই সপ্তাহ পানির নিচে বেঁচে থাকে — দক্ষিণ এশিয়ায় ৩০ লক্ষ+ হেক্টরে চাষ হচ্ছে।" 
          />
          <div className="mt-[0.8rem] h-1 bg-[#eee] rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] animate-growBar" style={{width: '85%', background: 'var(--water)'}}></div></div>
        </div>
        
        <div className="border-l-3 border-accent-red p-[1.2rem_1.4rem] bg-white rounded-[0_4px_4px_0]">
          <div className="text-[1.8rem] mb-[0.6rem]">🌀</div>
          <Text as="div" className="font-playfair text-[1.05rem] font-bold text-green-deep mb-[0.3rem]" en="Cyclones" bn="ঘূর্ণিঝড়" />
          <Text as="div" className="text-[0.83rem] text-muted leading-[1.6]" 
            en="Cyclones Sidr (2007), Aila (2009), Amphan (2020) devastated coastal agriculture. Storm surges deposit salt on farmland, rendering it infertile for 2–3 seasons." 
            bn="সিডর (২০০৭), আইলা (২০০৯), আম্পান (২০২০) উপকূলীয় কৃষিকে ধ্বংস করেছে। জলোচ্ছ্বাস জমিতে লবণ জমায়, যা ২–৩ মৌসুম জমিকে অনুর্বর করে রাখে।" 
          />
          <div className="mt-[0.8rem] h-1 bg-[#eee] rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] animate-growBar" style={{width: '75%', background: 'var(--accent-red)'}}></div></div>
        </div>
        
        <div className="border-l-3 border-[#8e44ad] p-[1.2rem_1.4rem] bg-white rounded-[0_4px_4px_0]">
          <div className="text-[1.8rem] mb-[0.6rem]">🧂</div>
          <Text as="div" className="font-playfair text-[1.05rem] font-bold text-green-deep mb-[0.3rem]" en="Salinity Intrusion" bn="লবণাক্ততার অনুপ্রবেশ" />
          <Text as="div" className="text-[0.83rem] text-muted leading-[1.6]" 
            en="Sea-level rise pushes saltwater 100+ km inland. 2.8M ha affected. BRRI dhan67/97 (saline-tolerant up to 12 dS/m) are lifelines for coastal farmers." 
            bn="সমুদ্রের জলস্তর বৃদ্ধিতে ১০০+ কিমি ভেতর পর্যন্ত লোনা পানি ঢুকছে। ২৮ লক্ষ হেক্টর ক্ষতিগ্রস্ত। BRRI ধান৬৭/৯৭ (১২ dS/m পর্যন্ত লবণ সহনশীল) উপকূলীয় কৃষকদের আশার আলো।" 
          />
          <div className="mt-[0.8rem] h-1 bg-[#eee] rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] animate-growBar" style={{width: '80%', background: '#8e44ad'}}></div></div>
        </div>
        
        <div className="border-l-3 border-[#e67e22] p-[1.2rem_1.4rem] bg-white rounded-[0_4px_4px_0]">
          <div className="text-[1.8rem] mb-[0.6rem]">☀️</div>
          <Text as="div" className="font-playfair text-[1.05rem] font-bold text-green-deep mb-[0.3rem]" en="Drought" bn="খরা" />
          <Text as="div" className="text-[0.83rem] text-muted leading-[1.6]" 
            en="Barind Tract (Rajshahi, Chapai) faces seasonal water stress. BRRI dhan56/57 are drought-tolerant. AWD technique reduces irrigation by 25–30%." 
            bn="বরেন্দ্র অঞ্চল (রাজশাহী, চাঁপাই) মৌসুমি পানির চাপে ভোগে। BRRI ধান৫৬/৫৭ খরা সহনশীল। AWD পদ্ধতিতে সেচ ২৫–৩০% কমানো সম্ভব।" 
          />
          <div className="mt-[0.8rem] h-1 bg-[#eee] rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] animate-growBar" style={{width: '60%', background: '#e67e22'}}></div></div>
        </div>
        
        <div className="border-l-3 border-[#3498db] p-[1.2rem_1.4rem] bg-white rounded-[0_4px_4px_0]">
          <div className="text-[1.8rem] mb-[0.6rem]">🌡️</div>
          <Text as="div" className="font-playfair text-[1.05rem] font-bold text-green-deep mb-[0.3rem]" en="Heat Stress" bn="তাপ চাপ" />
          <Text as="div" className="text-[0.83rem] text-muted leading-[1.6]" 
            en="Each 1°C rise can reduce rice yield 3–10%. BRRI developing heat-tolerant varieties. Adjusting Boro transplanting earlier to avoid April heat spikes." 
            bn="প্রতি ১°C তাপ বৃদ্ধিতে ধানের ফলন ৩–১০% কমতে পারে। BRRI তাপ-সহনশীল জাত উদ্ভাবন করছে। এপ্রিলের তাপদাহ এড়াতে বোরো রোপণ আগিয়ে আনা হচ্ছে।" 
          />
          <div className="mt-[0.8rem] h-1 bg-[#eee] rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] animate-growBar" style={{width: '65%', background: '#3498db'}}></div></div>
        </div>
        
        <div className="border-l-3 border-[#27ae60] p-[1.2rem_1.4rem] bg-white rounded-[0_4px_4px_0]">
          <div className="text-[1.8rem] mb-[0.6rem]">🌿</div>
          <Text as="div" className="font-playfair text-[1.05rem] font-bold text-green-deep mb-[0.3rem]" en="Adaptation Success" bn="অভিযোজনের সাফল্য" />
          <Text as="div" className="text-[0.83rem] text-muted leading-[1.6]" 
            en="Floating gardens (ভাসমান বাগান) in haor areas — recognized by UN-FAO as Globally Important Agricultural Heritage. Embankment polders, solar irrigation, climate-smart villages nationwide." 
            bn="হাওরে ভাসমান বাগান — জাতিসংঘের FAO কর্তৃক বৈশ্বিক গুরুত্বপূর্ণ কৃষি ঐতিহ্য (GIAHS) হিসেবে স্বীকৃত। বাঁধ পোল্ডার, সৌর সেচ ও জলবায়ু-বান্ধব গ্রাম সারাদেশে সম্প্রসারিত হচ্ছে।" 
          />
          <div className="mt-[0.8rem] h-1 bg-[#eee] rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] animate-growBar" style={{width: '70%', background: '#27ae60'}}></div></div>
        </div>
        
      </div>
    </section>
  );
}
