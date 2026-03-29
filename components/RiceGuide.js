import Text from "./Text";

export default function RiceGuide() {
  return (
    <div className="bg-paper py-20 px-8 w-full" id="rice-az">
      <div className="max-w-[1200px] mx-auto">
        <Text as="div" className="font-mono text-[0.68rem] tracking-[0.3em] uppercase text-green-mid mb-2" en="Complete Rice Farming Guide" bn="সম্পূর্ণ ধান চাষ গাইড" />
        <h2 className="font-playfair text-[clamp(2rem,4vw,3.2rem)] font-black text-green-deep leading-[1.1] mb-6">
          <Text as="span" html={true} en="Rice Farming" bn="কিভাবে ধান উৎপাদন করে" />
        </h2>
        <Text as="p" className="max-w-[680px] text-muted leading-[1.9] mb-8" en="Every step of rice cultivation in Bangladesh — from seed selection to market." bn="বীজ নির্বাচন থেকে বাজার পর্যন্ত বাংলাদেশে ধান চাষের প্রতিটি ধাপ।" />
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[1.2rem] mt-8 transition-all duration-700 ease-in-out fade-in">
          {/* 01 */}
          <div className="bg-white border border-green-deep/10 rounded-[4px] p-[1.4rem_1.5rem] flex gap-4 items-start transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(26,61,31,0.1)]">
            <div className="font-playfair text-[2.2rem] font-black text-green-light shrink-0 leading-none min-w-[40px]">01</div>
            <div>
              <Text as="div" className="font-playfair text-[1rem] font-bold text-green-deep mb-[0.15rem]" en="Land Selection & Preparation" bn="জমি নির্বাচন ও প্রস্তুতি" />
              <Text as="div" className="font-tiro text-[0.85rem] text-gold mb-[0.35rem]" en="জমি নির্বাচন ও প্রস্তুতি" bn="Land Selection & Preparation" />
              <Text as="div" className="text-[0.82rem] text-muted leading-1.6" 
                en="Choose flat, water-retaining clay-loam (দোআঁশ মাটি) land. Deep plough 20–25cm. Harrow 2–3 times to break clods. Level precisely for uniform water flow. Apply lime if soil pH below 5.5." 
                bn="সমতল, পানি ধরে রাখার উপযোগী দোআঁশ মাটি বেছে নিন। ২০–২৫ সেমি গভীরে পাওয়ার টিলার দিয়ে চাষ দিন। ২–৩ বার মই দিয়ে ঢেলা ভাঙুন। সুষম পানি বিতরণের জন্য জমি সমতল করুন। মাটির pH ৫.৫-এর নিচে হলে চুন দিন।" />
            </div>
          </div>

          {/* 02 */}
          <div className="bg-white border border-green-deep/10 rounded-[4px] p-[1.4rem_1.5rem] flex gap-4 items-start transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(26,61,31,0.1)]">
            <div className="font-playfair text-[2.2rem] font-black text-green-light shrink-0 leading-none min-w-[40px]">02</div>
            <div>
              <Text as="div" className="font-playfair text-[1rem] font-bold text-green-deep mb-[0.15rem]" en="Variety Selection" bn="জাত নির্বাচন" />
              <Text as="div" className="font-tiro text-[0.85rem] text-gold mb-[0.35rem]" en="জাত নির্বাচন" bn="Variety Selection" />
              <Text as="div" className="text-[0.82rem] text-muted leading-1.6" 
                en="Boro: BRRI dhan29, dhan88. Aman: BRRI dhan49, dhan51/52 (flood-tolerant). Aus: BRRI dhan48. Coastal: BRRI dhan67 (saline-tolerant). Aromatic: Kataribhog, Chinigura. High-yield = 5–8 tons/ha." 
                bn="বোরো: BRRI ধান২৯, ধান৮৮। আমন: BRRI ধান৪৯, ধান৫১/৫২ (বন্যা সহনশীল)। আউশ: BRRI ধান৪৮। উপকূলীয়: BRRI ধান৬৭ (লবণ সহনশীল)। সুগন্ধি: কাটারীভোগ, চিনিগুড়া। উচ্চফলন = ৫–৮ টন/হেক্টর।" />
            </div>
          </div>

          {/* 03 */}
          <div className="bg-white border border-green-deep/10 rounded-[4px] p-[1.4rem_1.5rem] flex gap-4 items-start transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(26,61,31,0.1)]">
            <div className="font-playfair text-[2.2rem] font-black text-green-light shrink-0 leading-none min-w-[40px]">03</div>
            <div>
              <Text as="div" className="font-playfair text-[1rem] font-bold text-green-deep mb-[0.15rem]" en="Seed Treatment" bn="বীজ শোধন" />
              <Text as="div" className="font-tiro text-[0.85rem] text-gold mb-[0.35rem]" en="বীজ শোধন ও অঙ্কুরোদগম" bn="Seed Treatment & Germination" />
              <Text as="div" className="text-[0.82rem] text-muted leading-1.6" 
                en="Float test: 1kg salt in 10L water — good seeds sink, discard floaters. Treat with carbendazim (2g/kg). Soak 24–48hrs then wrap in moist cloth 24hrs for germination." 
                bn="ভাসমান পরীক্ষা: ১০ লিটার পানিতে ১ কেজি লবণ মিশিয়ে ভালো বীজ বেছে নিন (ভালো বীজ ডুবে যায়)। কার্বেন্ডাজিম (২ গ্রাম/কেজি) দিয়ে শোধন করুন। ২৪–৪৮ ঘণ্টা ভিজিয়ে ভেজা কাপড়ে ২৪ ঘণ্টা রেখে অঙ্কুর গজান।" />
            </div>
          </div>

          {/* 04 */}
          <div className="bg-white border border-green-deep/10 rounded-[4px] p-[1.4rem_1.5rem] flex gap-4 items-start transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(26,61,31,0.1)]">
            <div className="font-playfair text-[2.2rem] font-black text-green-light shrink-0 leading-none min-w-[40px]">04</div>
            <div>
              <Text as="div" className="font-playfair text-[1rem] font-bold text-green-deep mb-[0.15rem]" en="Nursery / Seedbed" bn="বীজতলা তৈরি" />
              <Text as="div" className="font-tiro text-[0.85rem] text-gold mb-[0.35rem]" en="বীজতলা তৈরি" bn="Nursery Preparation" />
              <Text as="div" className="text-[0.82rem] text-muted leading-1.6" 
                en="Prepare raised seedbeds 3m×1m. Broadcast seeds at 60–80g/m². Maintain 2–3cm water. Apply urea 5g/m² on day 7. Seedlings ready in 20–25 days (Boro) or 25–30 days (Aman)." 
                bn="৩মি×১মি উঁচু বীজতলা তৈরি করুন। ৬০–৮০ গ্রাম/মি² হারে বীজ ছিটান। ২–৩ সেমি পানি রাখুন। ৭ম দিনে ৫ গ্রাম/মি² ইউরিয়া দিন। বোরোতে ২০–২৫ দিনে ও আমনে ২৫–৩০ দিনে চারা রোপণযোগ্য হয়।" />
            </div>
          </div>

          {/* 05 */}
          <div className="bg-white border border-green-deep/10 rounded-[4px] p-[1.4rem_1.5rem] flex gap-4 items-start transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(26,61,31,0.1)]">
            <div className="font-playfair text-[2.2rem] font-black text-green-light shrink-0 leading-none min-w-[40px]">05</div>
            <div>
              <Text as="div" className="font-playfair text-[1rem] font-bold text-green-deep mb-[0.15rem]" en="Main Field Puddling" bn="মূল জমি কাদা করা" />
              <Text as="div" className="font-tiro text-[0.85rem] text-gold mb-[0.35rem]" en="মূল জমি কাদা করা" bn="Puddling" />
              <Text as="div" className="text-[0.82rem] text-muted leading-1.6" 
                en="Flood field and puddle with power tiller. Puddling destroys weeds, reduces water loss by 30–40%, creates soft soil for transplanting. Let settle 2–3 days." 
                bn="জমিতে পানি দিয়ে পাওয়ার টিলার দিয়ে কাদা করুন। কাদা করলে আগাছা নষ্ট হয়, পানি অপচয় ৩০–৪০% কমে এবং চারা লাগানোর উপযোগী নরম মাটি তৈরি হয়। চারা লাগানোর আগে ২–৩ দিন ফেলে রাখুন।" />
            </div>
          </div>

          {/* 06 */}
          <div className="bg-white border border-green-deep/10 rounded-[4px] p-[1.4rem_1.5rem] flex gap-4 items-start transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(26,61,31,0.1)]">
            <div className="font-playfair text-[2.2rem] font-black text-green-light shrink-0 leading-none min-w-[40px]">06</div>
            <div>
              <Text as="div" className="font-playfair text-[1rem] font-bold text-green-deep mb-[0.15rem]" en="Transplanting" bn="চারা রোপণ" />
              <Text as="div" className="font-tiro text-[0.85rem] text-gold mb-[0.35rem]" en="চারা রোপণ" bn="Transplanting" />
              <Text as="div" className="text-[0.82rem] text-muted leading-1.6" 
                en="Plant 2–3 seedlings per hill at 20×20cm spacing. Depth 2–3cm. Use rope for straight rows. Mechanical transplanters reduce labor cost by 40% and improve uniformity." 
                bn="প্রতি গুচ্ছে ২–৩টি চারা ২০×২০ সেমি দূরত্বে লাগান। গভীরতা ২–৩ সেমি। সরলরেখায় রোপণের জন্য দড়ি ব্যবহার করুন। যন্ত্রচালিত রোপণ মেশিন শ্রমিক খরচ ৪০% কমায় ও রোপণে সমতা আনে।" />
            </div>
          </div>

          {/* 07 */}
          <div className="bg-white border border-green-deep/10 rounded-[4px] p-[1.4rem_1.5rem] flex gap-4 items-start transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(26,61,31,0.1)]">
            <div className="font-playfair text-[2.2rem] font-black text-green-light shrink-0 leading-none min-w-[40px]">07</div>
            <div>
              <Text as="div" className="font-playfair text-[1rem] font-bold text-green-deep mb-[0.15rem]" en="Water Management (AWD)" bn="পানি ব্যবস্থাপনা (AWD)" />
              <Text as="div" className="font-tiro text-[0.85rem] text-gold mb-[0.35rem]" en="পানি ব্যবস্থাপনা" bn="Water Management" />
              <Text as="div" className="text-[0.82rem] text-muted leading-1.6" 
                en="Maintain 2–5cm water in vegetative stage. Use AWD (Alternate Wetting & Drying): let soil dry to 15cm below surface before re-irrigating — saves 20–30% water. Drain 10–15 days before harvest." 
                bn="কুশি পর্যায়ে ২–৫ সেমি পানি রাখুন। AWD (পর্যায়ক্রমিক ভেজানো ও শুকানো) পদ্ধতি ব্যবহার করুন — সেচের আগে মাটি ১৫ সেমি নিচে শুকিয়ে যেতে দিন, এতে ২০–৩০% পানি সাশ্রয় হয়। কাটার ১০–১৫ দিন আগে পানি সরিয়ে দিন।" />
            </div>
          </div>

          {/* 08 */}
          <div className="bg-white border border-green-deep/10 rounded-[4px] p-[1.4rem_1.5rem] flex gap-4 items-start transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(26,61,31,0.1)]">
            <div className="font-playfair text-[2.2rem] font-black text-green-light shrink-0 leading-none min-w-[40px]">08</div>
            <div>
              <Text as="div" className="font-playfair text-[1rem] font-bold text-green-deep mb-[0.15rem]" en="Fertilizer Application" bn="সার প্রয়োগ" />
              <Text as="div" className="font-tiro text-[0.85rem] text-gold mb-[0.35rem]" en="সার প্রয়োগ পদ্ধতি" bn="Fertilizer Method" />
              <Text as="div" className="text-[0.82rem] text-muted leading-1.6" 
                en="For BRRI dhan29 (Boro): Urea 200kg/ha, TSP 100kg/ha, MoP 100kg/ha, Gypsum 120kg/ha. Apply TSP, MoP, Gypsum as basal. Split urea: ⅓ basal + ⅓ DAT15 + ⅓ DAT45." 
                bn="BRRI ধান২৯ (বোরো): ইউরিয়া ২০০ কেজি/হেক্টর, টিএসপি ১০০, এমওপি ১০০, জিপসাম ১২০ কেজি/হেক্টর। টিএসপি, এমওপি, জিপসাম রোপণের আগে মেশান। ইউরিয়া ৩ ভাগে: ⅓ মেশানে + ⅓ কুশি (DAT১৫) + ⅓ থোড় (DAT৪৫)।" />
            </div>
          </div>

          {/* 09 */}
          <div className="bg-white border border-green-deep/10 rounded-[4px] p-[1.4rem_1.5rem] flex gap-4 items-start transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(26,61,31,0.1)]">
            <div className="font-playfair text-[2.2rem] font-black text-green-light shrink-0 leading-none min-w-[40px]">09</div>
            <div>
              <Text as="div" className="font-playfair text-[1rem] font-bold text-green-deep mb-[0.15rem]" en="Weed Management" bn="আগাছা ব্যবস্থাপনা" />
              <Text as="div" className="font-tiro text-[0.85rem] text-gold mb-[0.35rem]" en="আগাছা দমন" bn="Weed Control" />
              <Text as="div" className="text-[0.82rem] text-muted leading-1.6" 
                en="Critical first 30 days. Hand weed at DAT20 and DAT40. Pre-emergent herbicides (Butachlor) 3–5 days after transplanting. Post-emergent Bispyribac-sodium for sedges and grasses." 
                bn="রোপণের প্রথম ৩০ দিন আগাছা দমন অত্যন্ত গুরুত্বপূর্ণ। DAT২০ ও DAT৪০-এ হাত দিয়ে আগাছা তোলা বা রোটারি উইডার ব্যবহার করুন। রোপণের ৩–৫ দিন পর বিউটাক্লোর ব্যবহার করুন। বিস্পাইরিব্যাক-সোডিয়াম পরবর্তী আগাছার জন্য কার্যকর।" />
            </div>
          </div>

          {/* 10 */}
          <div className="bg-white border border-green-deep/10 rounded-[4px] p-[1.4rem_1.5rem] flex gap-4 items-start transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(26,61,31,0.1)]">
            <div className="font-playfair text-[2.2rem] font-black text-green-light shrink-0 leading-none min-w-[40px]">10</div>
            <div>
              <Text as="div" className="font-playfair text-[1rem] font-bold text-green-deep mb-[0.15rem]" en="Pest & Disease Management" bn="পোকামাকড় ও রোগ দমন" />
              <Text as="div" className="font-tiro text-[0.85rem] text-gold mb-[0.35rem]" en="IPM পদ্ধতি" bn="IPM Method" />
              <Text as="div" className="text-[0.82rem] text-muted leading-1.6" 
                en="Key pests: Brown planthopper (বাদামী গাছফড়িং), stem borer (মাজরা পোকা). Diseases: Blast (ব্লাস্ট), Sheath blight (খোলপচা). Use IPM: light traps, pheromone traps. Apply pesticides only when ETL exceeded." 
                bn="প্রধান পোকা: বাদামী গাছফড়িং, মাজরা পোকা। প্রধান রোগ: ব্লাস্ট, খোলপচা, ব্যাকটেরিয়াল লিফ ব্লাইট (BLB)। IPM পদ্ধতি ব্যবহার করুন: আলোক ফাঁদ, ফেরোমোন ফাঁদ ও প্রাকৃতিক শত্রু। ETL অতিক্রম করলেই কেবল কীটনাশক প্রয়োগ করুন।" />
            </div>
          </div>

          {/* 11 */}
          <div className="bg-white border border-green-deep/10 rounded-[4px] p-[1.4rem_1.5rem] flex gap-4 items-start transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(26,61,31,0.1)]">
            <div className="font-playfair text-[2.2rem] font-black text-green-light shrink-0 leading-none min-w-[40px]">11</div>
            <div>
              <Text as="div" className="font-playfair text-[1rem] font-bold text-green-deep mb-[0.15rem]" en="Harvest" bn="ফসল কাটা" />
              <Text as="div" className="font-tiro text-[0.85rem] text-gold mb-[0.35rem]" en="কাটা ও মাড়াই" bn="Harvesting & Threshing" />
              <Text as="div" className="text-[0.82rem] text-muted leading-1.6" 
                en="Harvest when 80–85% of grains are golden. Moisture: 20–25%. Use sickle (কাস্তে) or combine harvester — reduces losses from 5% to under 2% and cuts harvesting cost by 50–60%." 
                bn="৮০–৮৫% দানা সোনালি রঙ ধারণ করলে ফসল কাটুন। দানার আর্দ্রতা ২০–২৫% হওয়া উচিত। কাস্তে বা কম্বাইন হার্ভেস্টার ব্যবহার করুন — কম্বাইন ব্যবহারে অপচয় ৫% থেকে ২%-এর নিচে নামে এবং খরচ ৫০–৬০% কমে।" />
            </div>
          </div>

          {/* 12 */}
          <div className="bg-white border border-green-deep/10 rounded-[4px] p-[1.4rem_1.5rem] flex gap-4 items-start transition-all duration-250 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(26,61,31,0.1)]">
            <div className="font-playfair text-[2.2rem] font-black text-green-light shrink-0 leading-none min-w-[40px]">12</div>
            <div>
              <Text as="div" className="font-playfair text-[1rem] font-bold text-green-deep mb-[0.15rem]" en="Drying, Storage & Milling" bn="শুকানো, সংরক্ষণ ও মিলিং" />
              <Text as="div" className="font-tiro text-[0.85rem] text-gold mb-[0.35rem]" en="শুকানো ও সংরক্ষণ" bn="Drying & Storage" />
              <Text as="div" className="text-[0.82rem] text-muted leading-1.6" 
                en="Sun-dry to 14% moisture (2–3 days). Store in hermetic PICS bags for 12+ months near-zero losses. 80,000+ rice mills in Bangladesh; modern auto-hullers give 65–68% milling outturn." 
                bn="রোদে শুকিয়ে আর্দ্রতা ১৪%-এ নামান (২–৩ দিন)। বায়ুরোধী PICS ব্যাগে সংরক্ষণ করলে ১২+ মাস প্রায় শূন্য অপচয়। বাংলাদেশে ৮০,০০০+ চালকল; আধুনিক অটো-হুলার মিলে ৬৫–৬৮% চাল পাওয়া যায়।" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
