import Text from "./Text";

export default function DataCharts() {
  return (
    <div className="bg-[#0d1a10] py-20 px-8 w-full text-white" id="data">
      <div className="max-w-[1200px] mx-auto">
        <Text as="div" className="font-mono text-[0.68rem] tracking-[0.3em] uppercase text-green-mid mb-2" en="Production Statistics" bn="উৎপাদন পরিসংখ্যান" />
        <h2 className="font-playfair text-[clamp(2rem,4vw,3.2rem)] font-black text-green-deep leading-[1.1] mb-6">
          <Text as="span" html={true} en="Agricultural <em>Data</em>" bn="কৃষি <em>তথ্য ও পরিসংখ্যান</em>" />
        </h2>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-10 mt-12 transition-all duration-700 ease-in-out fade-in">
          
          {/* Chart 1 */}
          <div className="bg-white/[0.03] border border-green-light/15 rounded-[4px] p-8 h-full">
            <Text as="h3" className="font-mono text-[0.8rem] tracking-[0.15em] uppercase text-green-light mb-8 flex items-center gap-[0.8rem] before:content-[''] before:w-[30px] before:h-px before:bg-gold" en="Major Crop Production (Million MT)" bn="প্রধান ফসলের উৎপাদন (মিলিয়ন মেট্রিক টন)" />
            <div className="flex flex-col gap-[1.2rem]">
              <div className="flex items-center gap-4">
                <Text as="div" className="font-mono text-[0.67rem] text-[#faf6ee]/70 w-[90px] shrink-0 text-right" en="Rice" bn="ধান" />
                <div className="flex-1 h-6 bg-white/6 rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] flex items-center pl-2 font-mono text-[0.67rem] text-black/75 animate-growBar origin-left" style={{width: '90%', background: 'linear-gradient(90deg,#2d6a35,#4caf50)'}}>38.1</div></div>
              </div>
              <div className="flex items-center gap-4">
                <Text as="div" className="font-mono text-[0.67rem] text-[#faf6ee]/70 w-[90px] shrink-0 text-right" en="Potato" bn="আলু" />
                <div className="flex-1 h-6 bg-white/6 rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] flex items-center pl-2 font-mono text-[0.67rem] text-black/75 animate-growBar origin-left" style={{width: '55%', background: 'linear-gradient(90deg,#8b5e3c,#c49a6c)'}}>10.2</div></div>
              </div>
              <div className="flex items-center gap-4">
                <Text as="div" className="font-mono text-[0.67rem] text-[#faf6ee]/70 w-[90px] shrink-0 text-right" en="Maize" bn="ভুট্টা" />
                <div className="flex-1 h-6 bg-white/6 rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] flex items-center pl-2 font-mono text-[0.67rem] text-black/75 animate-growBar origin-left" style={{width: '38%', background: 'linear-gradient(90deg,#e67e22,#f39c12)'}}>5.8</div></div>
              </div>
              <div className="flex items-center gap-4">
                <Text as="div" className="font-mono text-[0.67rem] text-[#faf6ee]/70 w-[90px] shrink-0 text-right" en="Vegetables" bn="সবজি" />
                <div className="flex-1 h-6 bg-white/6 rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] flex items-center pl-2 font-mono text-[0.67rem] text-black/75 animate-growBar origin-left" style={{width: '42%', background: 'linear-gradient(90deg,#27ae60,#2ecc71)'}}>7.5</div></div>
              </div>
              <div className="flex items-center gap-4">
                <Text as="div" className="font-mono text-[0.67rem] text-[#faf6ee]/70 w-[90px] shrink-0 text-right" en="Wheat" bn="গম" />
                <div className="flex-1 h-6 bg-white/6 rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] flex items-center pl-2 font-mono text-[0.67rem] text-black/75 animate-growBar origin-left" style={{width: '20%', background: 'linear-gradient(90deg,#c8a84b,#f0d080)'}}>1.1</div></div>
              </div>
              <div className="flex items-center gap-4">
                <Text as="div" className="font-mono text-[0.67rem] text-[#faf6ee]/70 w-[90px] shrink-0 text-right" en="Jute" bn="পাট" />
                <div className="flex-1 h-6 bg-white/6 rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] flex items-center pl-2 font-mono text-[0.67rem] text-black/75 animate-growBar origin-left" style={{width: '16%', background: 'linear-gradient(90deg,#c8a84b,#e8c86a)'}}>0.8</div></div>
              </div>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="bg-white/[0.03] border border-green-light/15 rounded-[4px] p-8 h-full">
            <Text as="h3" className="font-mono text-[0.8rem] tracking-[0.15em] uppercase text-green-light mb-8 flex items-center gap-[0.8rem] before:content-[''] before:w-[30px] before:h-px before:bg-gold" en="Fisheries Breakdown (4.7M MT Total)" bn="মৎস্য উৎপাদন বিভাজন (মোট ৪.৭ মিলিয়ন মেট্রিক টন)" />
            <div className="flex items-center gap-6 flex-wrap">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="50" fill="none" stroke="#1e5f8a" strokeWidth="24" strokeDasharray="182 314" strokeDashoffset="0" transform="rotate(-90 70 70)"/>
                <circle cx="70" cy="70" r="50" fill="none" stroke="#4caf50" strokeWidth="24" strokeDasharray="88 314" strokeDashoffset="-182" transform="rotate(-90 70 70)"/>
                <circle cx="70" cy="70" r="50" fill="none" stroke="#c8a84b" strokeWidth="24" strokeDasharray="44 314" strokeDashoffset="-270" transform="rotate(-90 70 70)"/>
                <text x="70" y="65" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="18" fill="#faf6ee" fontWeight="700">4.7</text>
                <text x="70" y="82" textAnchor="middle" fontFamily="DM Mono,monospace" fontSize="9" fill="rgba(250,246,238,0.5)">MILLION MT</text>
              </svg>
              <div className="flex flex-col gap-[0.6rem]">
                <div className="flex items-center gap-2 font-mono text-[0.7rem] text-[#faf6ee]/80"><div className="w-[10px] h-[10px] rounded-full shrink-0" style={{background: '#1e5f8a'}}></div><Text as="span" en="Aquaculture — 58%" bn="মাছ চাষ — ৫৮%" /></div>
                <div className="flex items-center gap-2 font-mono text-[0.7rem] text-[#faf6ee]/80"><div className="w-[10px] h-[10px] rounded-full shrink-0" style={{background: '#4caf50'}}></div><Text as="span" en="Inland Capture — 28%" bn="অভ্যন্তরীণ আহরণ — ২৮%" /></div>
                <div className="flex items-center gap-2 font-mono text-[0.7rem] text-[#faf6ee]/80"><div className="w-[10px] h-[10px] rounded-full shrink-0" style={{background: '#c8a84b'}}></div><Text as="span" en="Marine — 14%" bn="সামুদ্রিক — ১৪%" /></div>
              </div>
            </div>
          </div>

          {/* Chart 3 */}
          <div className="bg-white/[0.03] border border-green-light/15 rounded-[4px] p-8 h-full">
            <Text as="h3" className="font-mono text-[0.8rem] tracking-[0.15em] uppercase text-green-light mb-8 flex items-center gap-[0.8rem] before:content-[''] before:w-[30px] before:h-px before:bg-gold" en="Rice Production Trend 2015–2024" bn="ধান উৎপাদনের প্রবণতা ২০১৫–২০২৪" />
            <div className="h-[100px]">
              <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4caf50" stopOpacity=".4"/><stop offset="100%" stopColor="#4caf50" stopOpacity="0"/></linearGradient></defs>
                <path d="M0,70 L44,65 L89,60 L133,55 L178,52 L222,48 L267,44 L311,42 L356,38 L400,35 L400,100 L0,100 Z" fill="url(#sg)"/>
                <polyline points="0,70 44,65 89,60 133,55 178,52 222,48 267,44 311,42 356,38 400,35" fill="none" stroke="#4caf50" strokeWidth="2.5" strokeLinejoin="round"/>
                <circle cx="0" cy="70" r="3.5" fill="#4caf50"/><circle cx="400" cy="35" r="4" fill="#4caf50"/>
                <text x="2" y="92" fontFamily="DM Mono,monospace" fontSize="8" fill="rgba(250,246,238,.4)">2015</text>
                <text x="340" y="92" fontFamily="DM Mono,monospace" fontSize="8" fill="rgba(250,246,238,.4)">2024</text>
                <text x="326" y="28" fontFamily="DM Mono,monospace" fontSize="9" fill="#4caf50">38.1M</text>
                <text x="2" y="63" fontFamily="DM Mono,monospace" fontSize="9" fill="rgba(250,246,238,.5)">29.7M</text>
              </svg>
            </div>
          </div>

          {/* Chart 4 */}
          <div className="bg-white/[0.03] border border-green-light/15 rounded-[4px] p-8 h-full">
            <Text as="h3" className="font-mono text-[0.8rem] tracking-[0.15em] uppercase text-green-light mb-8 flex items-center gap-[0.8rem] before:content-[''] before:w-[30px] before:h-px before:bg-gold" en="Top Rice-Producing Districts (000 MT)" bn="শীর্ষ ধান উৎপাদনকারী জেলা (হাজার মেট্রিক টন)" />
            <div className="flex flex-col gap-[1.2rem]">
              <div className="flex items-center gap-4">
                <Text as="div" className="font-mono text-[0.67rem] text-[#faf6ee]/70 w-[90px] shrink-0 text-right" en="Mymensingh" bn="ময়মনসিংহ" />
                <div className="flex-1 h-6 bg-white/6 rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] flex items-center pl-2 font-mono text-[0.67rem] text-black/75 animate-growBar origin-left" style={{width: '85%', background: 'linear-gradient(90deg,#1a3d1f,#2d6a35)'}}>2,840</div></div>
              </div>
              <div className="flex items-center gap-4">
                <Text as="div" className="font-mono text-[0.67rem] text-[#faf6ee]/70 w-[90px] shrink-0 text-right" en="Rangpur" bn="রংপুর" />
                <div className="flex-1 h-6 bg-white/6 rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] flex items-center pl-2 font-mono text-[0.67rem] text-black/75 animate-growBar origin-left" style={{width: '78%', background: 'linear-gradient(90deg,#1a3d1f,#2d6a35)'}}>2,610</div></div>
              </div>
              <div className="flex items-center gap-4">
                <Text as="div" className="font-mono text-[0.67rem] text-[#faf6ee]/70 w-[90px] shrink-0 text-right" en="Rajshahi" bn="রাজশাহী" />
                <div className="flex-1 h-6 bg-white/6 rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] flex items-center pl-2 font-mono text-[0.67rem] text-black/75 animate-growBar origin-left" style={{width: '72%', background: 'linear-gradient(90deg,#1a3d1f,#2d6a35)'}}>2,410</div></div>
              </div>
              <div className="flex items-center gap-4">
                <Text as="div" className="font-mono text-[0.67rem] text-[#faf6ee]/70 w-[90px] shrink-0 text-right" en="Comilla" bn="কুমিল্লা" />
                <div className="flex-1 h-6 bg-white/6 rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] flex items-center pl-2 font-mono text-[0.67rem] text-black/75 animate-growBar origin-left" style={{width: '65%', background: 'linear-gradient(90deg,#1a3d1f,#2d6a35)'}}>2,180</div></div>
              </div>
              <div className="flex items-center gap-4">
                <Text as="div" className="font-mono text-[0.67rem] text-[#faf6ee]/70 w-[90px] shrink-0 text-right" en="Dinajpur" bn="দিনাজপুর" />
                <div className="flex-1 h-6 bg-white/6 rounded-[2px] overflow-hidden"><div className="h-full rounded-[2px] flex items-center pl-2 font-mono text-[0.67rem] text-black/75 animate-growBar origin-left" style={{width: '60%', background: 'linear-gradient(90deg,#1a3d1f,#2d6a35)'}}>2,010</div></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
