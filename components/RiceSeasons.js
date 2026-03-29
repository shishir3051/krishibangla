import Text from "./Text";

export default function RiceSeasons() {
  return (
    <section id="rice" className="py-20 px-8 max-w-[1200px] mx-auto">
      <Text as="div" className="font-mono text-[0.68rem] tracking-[0.3em] uppercase text-green-mid mb-2" en="Three Growing Seasons" bn="তিন মৌসুম" />
      <h2 className="font-playfair text-[clamp(2rem,4vw,3.2rem)] font-black text-green-deep leading-[1.1] mb-6">
        <Text as="span" html={true} en="Three Seasons of <em>Golden Grain</em>" bn="সোনালী ধানের <em>তিন মৌসুম</em>" />
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6 mt-12 transition-all duration-700 ease-in-out fade-in">
        
        <div className="bg-white p-10 rounded-[4px] relative overflow-hidden border border-green-deep/8 after:content-[attr(data-season)] after:absolute after:-top-[10px] after:-right-[10px] after:font-playfair after:text-[8rem] after:font-black after:text-green-deep/[0.03] after:pointer-events-none after:leading-none" data-season="AUS">
          <Text as="div" className="font-playfair text-[1.8rem] font-black text-green-deep mb-[0.2rem]" en="Aus" bn="আউশ" />
          <Text as="div" className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-gold mb-[0.8rem] block" en="Aus Rice — Early Season" bn="আউশ ধান — Early Season" />
          <Text as="div" className="font-mono text-[0.8rem] text-green-mid mb-6 block" en="March — August" bn="মার্চ — আগস্ট" />
          <Text as="p" className="text-[0.88rem] text-muted leading-[1.6]" 
            en="Early rain-fed season. Contributes ~16% of annual output. Key varieties: BRRI dhan48, BR26. Short 90–110 day duration. Lower yield but vital early income for marginal farmers." 
            bn="বৃষ্টি-নির্ভর আগাম মৌসুম। বার্ষিক উৎপাদনের প্রায় ১৬% আসে। প্রধান জাত: BRRI ধান৪৮, BR26। ৯০–১১০ দিনের স্বল্পমেয়াদি জাত। প্রান্তিক কৃষকদের জন্য গুরুত্বপূর্ণ আগাম আয়ের উৎস।" 
          />
        </div>
        
        <div className="bg-white p-10 rounded-[4px] relative overflow-hidden border border-green-deep/8 after:content-[attr(data-season)] after:absolute after:-top-[10px] after:-right-[10px] after:font-playfair after:text-[8rem] after:font-black after:text-green-deep/[0.03] after:pointer-events-none after:leading-none" data-season="AMAN">
          <Text as="div" className="font-playfair text-[1.8rem] font-black text-green-deep mb-[0.2rem]" en="Aman" bn="আমন" />
          <Text as="div" className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-gold mb-[0.8rem] block" en="Aman Rice — Main Season" bn="আমন ধান — Main Season" />
          <Text as="div" className="font-mono text-[0.8rem] text-green-mid mb-6 block" en="June — December" bn="জুন — ডিসেম্বর" />
          <Text as="p" className="text-[0.88rem] text-muted leading-[1.6]" 
            en="Main traditional season tied to Bangladesh's cultural identity. Monsoon rain-fed. Contributes ~38% of output. Flood-tolerant BRRI dhan51/52 survive 2 weeks underwater. Harvested during festive Kartik month." 
            bn="বাংলাদেশের সাংস্কৃতিক পরিচয়ের সাথে জড়িত মূল ঐতিহ্যবাহী মৌসুম। বর্ষার পানিতে চাষ হয়। বার্ষিক উৎপাদনের ~৩৮%। বন্যা-সহনশীল BRRI ধান৫১/৫২ দুই সপ্তাহ ডুবে থেকেও বাঁচে। উৎসবের কার্তিক মাসে ফসল কাটা হয়।" 
          />
        </div>
        
        <div className="bg-white p-10 rounded-[4px] relative overflow-hidden border border-green-deep/8 after:content-[attr(data-season)] after:absolute after:-top-[10px] after:-right-[10px] after:font-playfair after:text-[8rem] after:font-black after:text-green-deep/[0.03] after:pointer-events-none after:leading-none" data-season="BORO">
          <Text as="div" className="font-playfair text-[1.8rem] font-black text-green-deep mb-[0.2rem]" en="Boro" bn="বোরো" />
          <Text as="div" className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-gold mb-[0.8rem] block" en="Boro Rice — Dry Season" bn="বোরো ধান — Dry Season" />
          <Text as="div" className="font-mono text-[0.8rem] text-green-mid mb-6 block" en="November — May" bn="নভেম্বর — মে" />
          <Text as="p" className="text-[0.88rem] text-muted leading-[1.6]" 
            en="High-yield dry season, entirely irrigation-dependent. Largest contributor (~46%) to annual production. BRRI dhan29 dominates. Groundwater depletion in Barind Tract is a critical sustainability concern." 
            bn="সেচ-নির্ভর উচ্চফলনশীল শুষ্ক মৌসুম। বার্ষিক উৎপাদনে সবচেয়ে বড় অবদান (~৪৬%)। BRRI ধান২৯ প্রধান। বরেন্দ্র অঞ্চলে ভূগর্ভস্থ পানির স্তর নামা একটি গুরুত্বপূর্ণ স্থায়িত্বের সমস্যা।" 
          />
        </div>

      </div>
    </section>
  );
}
