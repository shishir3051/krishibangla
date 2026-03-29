import Text from "./Text";

export default function Fisheries() {
  return (
    <section id="fisheries" className="py-20 px-8 max-w-[1200px] mx-auto">
      <Text as="div" className="font-mono text-[0.68rem] tracking-[0.3em] uppercase text-green-mid mb-2" en="Fisheries Sector" bn="মৎস্য খাত" />
      <h2 className="font-playfair text-[clamp(2rem,4vw,3.2rem)] font-black text-green-deep leading-[1.1] mb-6">
        <Text as="span" html={true} en="A Nation That <em class='text-gold italic font-normal'>Lives by Water</em>" bn="জলের দেশের <em class='text-gold italic font-normal'>মৎস্য সম্পদ</em>" />
      </h2>
      <Text as="p" className="max-w-[680px] text-muted leading-[1.9] mb-8" 
        en='"Machhe Bhate Bangali" — Fish and Rice define the Bengali identity. Bangladesh is the world&#39;s 5th largest aquaculture producer and the dominant global hilsa producer.' 
        bn='"মাছে ভাতে বাঙালি" — মাছ ও ভাত বাঙালির পরিচয়। বাংলাদেশ বিশ্বের ৫ম বৃহত্তম মাছ চাষকারী দেশ এবং ইলিশের প্রধান উৎপাদনকারী।' 
      />
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mt-10 transition-all duration-700 ease-in-out fade-in">
        
        <div className="bg-white border border-green-deep/12 rounded-[4px] p-[1.8rem] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(26,61,31,0.12)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-water before:to-water-light">
          <div className="text-[2rem] mb-4">🐟</div>
          <Text as="div" className="font-playfair text-[1.2rem] font-bold text-green-deep mb-2" en="Hilsa / ইলিশ" bn="ইলিশ মাছ" />
          <div className="font-mono text-[2rem] font-medium text-green-mid mb-[0.3rem]">~80%</div>
          <Text as="div" className="text-[0.85rem] text-muted leading-[1.6]" 
            en="Bangladesh produces ~80% of the world's hilsa — the national fish. 22-day seasonal ban (মা ইলিশ রক্ষা) and jatka ban have boosted catches by 70% in a decade." 
            bn="বাংলাদেশ বিশ্বের ~৮০% ইলিশ উৎপাদন করে — এটি জাতীয় মাছ। ২২ দিনের মা ইলিশ রক্ষা ও জাটকা নিষেধাজ্ঞায় এক দশকে উৎপাদন ৭০% বেড়েছে।" 
          />
          <Text as="span" className="font-mono text-[0.7rem] mt-4 py-[0.3rem] px-[0.6rem] rounded-[2px] inline-block bg-[#e8f5e9] text-green-mid" en="↑ Stocks Recovering" bn="↑ মজুদ বাড়ছে" />
        </div>
        
        <div className="bg-white border border-green-deep/12 rounded-[4px] p-[1.8rem] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(26,61,31,0.12)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-water before:to-water-light">
          <div className="text-[2rem] mb-4">🦐</div>
          <Text as="div" className="font-playfair text-[1.2rem] font-bold text-green-deep mb-2" en="Shrimp Export" bn="চিংড়ি রপ্তানি" />
          <div className="font-mono text-[2rem] font-medium text-green-mid mb-[0.3rem]">$450M</div>
          <Text as="div" className="text-[0.85rem] text-muted leading-[1.6]" 
            en="Bagda (black tiger shrimp) and Galda (freshwater prawn) farmed in Khulna, Satkhira. Exported to EU and USA. Mangrove-integrated farming growing." 
            bn="খুলনা, সাতক্ষীরায় বাগদা ও গলদা চিংড়ি চাষ। EU ও USA-তে রপ্তানি হয়। ম্যানগ্রোব-সমন্বিত চাষ পদ্ধতি জনপ্রিয় হচ্ছে।" 
          />
          <Text as="span" className="font-mono text-[0.7rem] mt-4 py-[0.3rem] px-[0.6rem] rounded-[2px] inline-block bg-[#fff8e1] text-gold" en="→ Stable" bn="→ স্থিতিশীল" />
        </div>
        
        <div className="bg-white border border-green-deep/12 rounded-[4px] p-[1.8rem] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(26,61,31,0.12)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-water before:to-water-light">
          <div className="text-[2rem] mb-4">🐠</div>
          <Text as="div" className="font-playfair text-[1.2rem] font-bold text-green-deep mb-2" en="Aquaculture Growth" bn="মাছ চাষে প্রবৃদ্ধি" />
          <div className="font-mono text-[2rem] font-medium text-green-mid mb-[0.3rem]">6%+</div>
          <Text as="div" className="text-[0.85rem] text-muted leading-[1.6]" 
            en="Tilapia, Pangasius, Rohu, Katla, Carp in ponds and rice-fish systems. Household pond aquaculture supports 17M people's livelihoods." 
            bn="তেলাপিয়া, পাঙ্গাশ, রুই, কাতলা, কার্প পুকুরে ও ধান-মাছ সমন্বিত পদ্ধতিতে চাষ হচ্ছে। পারিবারিক পুকুরে মাছ চাষ ১ কোটি ৭০ লক্ষ মানুষের জীবিকা নির্বাহে সহায়তা করে।" 
          />
          <Text as="span" className="font-mono text-[0.7rem] mt-4 py-[0.3rem] px-[0.6rem] rounded-[2px] inline-block bg-[#e8f5e9] text-green-mid" en="↑ Booming" bn="↑ দ্রুত বৃদ্ধি" />
        </div>
        
        <div className="bg-white border border-green-deep/12 rounded-[4px] p-[1.8rem] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(26,61,31,0.12)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] before:bg-gradient-to-r before:from-water before:to-water-light">
          <div className="text-[2rem] mb-4">⚓</div>
          <Text as="div" className="font-playfair text-[1.2rem] font-bold text-green-deep mb-2" en="Marine Fisheries" bn="সামুদ্রিক মৎস্য" />
          <div className="font-mono text-[2rem] font-medium text-green-mid mb-[0.3rem]">118,813 km²</div>
          <Text as="div" className="text-[0.85rem] text-muted leading-[1.6]" 
            en="Bangladesh's EEZ in Bay of Bengal is rich but underexploited. Blue Economy Policy 2017. 1.4 million coastal fishers (জেলে) depend on marine capture." 
            bn="বঙ্গোপসাগরে বাংলাদেশের ১,১৮,৮১৩ কিমি² একান্ত অর্থনৈতিক অঞ্চল সম্পদসমৃদ্ধ কিন্তু অপ্রতুলভাবে আহৃত। ব্লু ইকোনমি নীতি ২০১৭। ১৪ লক্ষ উপকূলীয় জেলে সামুদ্রিক আহরণের উপর নির্ভরশীল।" 
          />
          <Text as="span" className="font-mono text-[0.7rem] mt-4 py-[0.3rem] px-[0.6rem] rounded-[2px] inline-block bg-[#e8f5e9] text-green-mid" en="↑ Strategic Focus" bn="↑ কৌশলগত অগ্রাধিকার" />
        </div>
        
      </div>
    </section>
  );
}
