'use client';
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Text from "./Text";
import { useLanguage } from "./LanguageProvider";
import { cropsData, getFallbackCrop } from "@/data/cropsData";
import { generateSmoothPath, scaleToViewport } from "@/lib/chartUtils";

export default function GenericCropGuide({ cropId }) {
  const { lang } = useLanguage();
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);
  const [liveMarketData, setLiveMarketData] = useState(null);

  useEffect(() => {
    // Initial AI greeting for this specific crop
    setMessages([{
      role: "assistant", 
      content: lang === 'bn' 
        ? `আস্সালামু আলাইকুম! আমি ${cropId} বিশেষজ্ঞ এআই। ${cropId} চাষ, রোগবালাই, বা বাজারদর নিয়ে যেকোনো প্রশ্ন করুন।` 
        : `Hello! I am your real-time AI consultant for ${cropId}. Ask me anything about cultivation, diseases, or market trends.`
    }]);
  }, [cropId, lang]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch live market data specifically for this crop
    const fetchMarketData = async () => {
      try {
        const res = await fetch(`/api/market/${cropId}`);
        if(res.ok) {
          const data = await res.json();
          setLiveMarketData(data);
        }
      } catch (err) {
        console.error("Failed to load live market data:", err);
      }
    };
    fetchMarketData();
  }, [cropId]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userMsg = chatInput;
    setChatInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const payload = [
        { role: "system", content: `You are an expert agronomist specialized in ${cropId} cultivation in Bangladesh. Provide precise, actionable advice.` },
        ...messages,
        { role: "user", content: userMsg }
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });
      
      if (!res.ok) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') break;
          try {
            const obj = JSON.parse(raw);
            if (obj.type === 'content_block_delta' && obj.delta?.type === 'text_delta') {
              fullText += obj.delta.text;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1].content = fullText;
                return updated;
              });
            }
          } catch (e) {}
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I am having trouble connecting to the intelligence server." }]);
    }
    setLoading(false);
  };

  // Pull crop data from the shared single source of truth
  const rawCrop = cropsData[cropId?.toLowerCase()] || getFallbackCrop(cropId || 'Crop');

  // Normalise field names (cropsData uses desc_bn_long; keep backward compat)
  const crop = {
    ...rawCrop,
    desc_bn: rawCrop.desc_bn_long ?? rawCrop.desc_bn,
  };


  // Color token map — single lookup replaces repeated ternary chains
  const colorTokens = {
    red:     { bg: "from-red-900 to-[#05111e] text-red-400 border-red-500/20",     accent: 'text-red-400',     border: 'border-red-500'     },
    amber:   { bg: "from-amber-900 to-[#05111e] text-amber-400 border-amber-500/20",   accent: 'text-amber-400',   border: 'border-amber-500'   },
    orange:  { bg: "from-orange-900 to-[#05111e] text-orange-400 border-orange-500/20",  accent: 'text-orange-400',  border: 'border-orange-500'  },
    blue:    { bg: "from-blue-900 to-[#05111e] text-blue-400 border-blue-500/20",     accent: 'text-blue-400',    border: 'border-blue-500'    },
    emerald: { bg: "from-emerald-900 to-[#05111e] text-emerald-400 border-emerald-500/20", accent: 'text-emerald-400', border: 'border-emerald-500' },
  };
  const tokens = colorTokens[crop.color] ?? colorTokens.emerald;
  const bgGradient   = tokens.bg;
  const accentColor  = tokens.accent;
  const borderAccent = tokens.border;

  // Chart path — uses shared chartUtils (generateSmoothPath + scaleToViewport)
  const activeTrendRaw = liveMarketData?.trend || crop.marketData.trend;
  const scaledTrend = scaleToViewport(activeTrendRaw, 100, { top: 10, bottom: 10 });

  const trendPath = generateSmoothPath(scaledTrend);
  const trendFill = `${trendPath} L 400 100 L 0 100 Z`;

  return (
    <div className="w-full pb-20">
      {/* 1. Hero Header */}
      <section className={`py-24 px-8 relative overflow-hidden bg-gradient-to-b ${bgGradient}`}>
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
            <Text as="div" className="font-mono text-xs font-black tracking-[0.3em] uppercase mb-4 text-white/60" en={crop.subtitle} bn={crop.subtitle_bn} />
            <h1 className="font-playfair text-[clamp(3.5rem,5vw,5rem)] font-black text-white leading-none mb-6">
              {lang === 'bn' ? crop.bn : crop.en}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed font-sans">
              {lang === 'bn' ? crop.desc_bn : crop.desc}
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="w-full lg:w-[450px]">
            <div className="bg-[#0a1628]/80 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
              <Text as="div" className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-8" en="Sector Performance Overview" bn="খাত পারফরম্যান্স রিয়েলটাইম" />
              <div className="space-y-6">
                {crop.stats.map((stat, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="text-white/40 text-[11px] font-bold uppercase mb-1 tracking-wider">{lang === 'bn' ? stat.bn : stat.label}</div>
                      <div className="text-2xl font-black text-white">{stat.value}</div>
                    </div>
                    <div className={`bg-white/5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border-l-2 ${borderAccent} text-white/80`}>
                      {stat.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* 2. Left Column: Lifecycle & Analytics */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-8">
          
          {/* Lifecycle timeline */}
          <div className="bg-[#0a1628] border border-white/5 rounded-[2rem] p-8 shadow-xl">
            <h3 className="flex items-center gap-3 text-lg font-black text-white mb-8 border-b border-white/5 pb-4">
              <span className={`text-2xl ${accentColor}`}>⚙️</span> 
              {lang === 'bn' ? 'স্ট্যান্ডার্ড চাষাবাদ চক্র' : 'Standard Cultivation Lifecycle'}
            </h3>
            
            <div className="relative border-l-2 border-white/10 ml-4 space-y-8 pb-4">
              {crop.lifecycle.map((step, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="relative pl-8"
                >
                  <div className="absolute top-0 -left-[17px] w-8 h-8 bg-[#0a1628] border border-white/20 rounded-full flex items-center justify-center text-sm z-10 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:bg-white/[0.04] transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-bold text-lg ${accentColor}`}>
                        {lang === 'bn' ? step.phase_bn : step.phase}
                      </h4>
                      <span className="text-[10px] font-mono uppercase tracking-widest bg-white/10 px-2 py-1 rounded text-white/50">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">{step.action}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Animated Market Outlook Graphic */}
          <div className="bg-[#0a1628] border border-white/5 rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl opacity-5 group-hover:opacity-10 transition-opacity duration-700 rounded-bl-full pointer-events-none ${bgGradient.split(' ')[0]}`} />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">{lang === 'bn' ? 'বাজার বিশ্লেষণ মডেল' : 'Market Analytical Model'}</h3>
                <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                  {lang === 'bn' ? 'রিয়েল-টাইম এগ্রিগেশন' : 'Live Aggregation'}
                </p>
              </div>
              <div className={`px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-xs font-mono font-bold ${accentColor}`}>
                LIVE
              </div>
            </div>

            <div className="relative h-[120px] w-full mt-4 flex items-end">
               <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                  <defs>
                     <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                     </linearGradient>
                  </defs>
                  
                  {/* Dynamic smooth path */}
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d={trendPath} 
                    fill="none" 
                    className={accentColor} 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />
                  <motion.path 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1, duration: 1 }}
                    d={trendFill} 
                    className={accentColor}
                    fill="url(#trendGradient)" 
                  />
                  
                  {/* Data Points */}
                  {scaledTrend.map((y, i) => (
                    <motion.circle 
                      key={i} 
                      cx={i * 100} cy={y} r="4" 
                      className={`${accentColor} fill-current`}
                      initial={{ opacity: 0, scale: 0 }} 
                      whileInView={{ opacity: 1, scale: 1 }} 
                      viewport={{ once: true }}
                      transition={{ delay: 1 + (i * 0.1) }} 
                    />
                  ))}
               </svg>
            </div>
            
            <div className="flex justify-between mt-6 font-mono text-[9px] text-white/40 uppercase tracking-widest relative z-10 border-t border-white/10 pt-4">
               <div>Vol: <span className="text-white font-bold text-xs">{crop.marketData.vol}</span></div>
               <div>Live Price: <span className="text-white font-bold text-xs">৳{liveMarketData?.price || "---"} / {liveMarketData?.unit || "KG"}</span></div>
               <div className="flex items-center gap-2">
                 Demand <span className={`w-2 h-2 rounded-full animate-pulse bg-current ${accentColor}`}></span> <span className="text-white font-bold">{lang === 'bn' ? crop.marketData.demand_bn : crop.marketData.demand}</span>
               </div>
            </div>
          </div>

        </div>

        {/* 3. Right Column: Functional Inline AI Chat */}
         <div className="lg:col-span-6 xl:col-span-7 h-[600px] md:h-[700px] lg:h-[850px]">
          <div className="bg-[#0a1628] border border-white/10 rounded-[2rem] h-full flex flex-col shadow-2xl relative overflow-hidden">
            {/* AI Header */}
            <div className={`p-6 border-b border-white/10 bg-gradient-to-r ${bgGradient.split(' ')[0]} to-[#0a1628] flex items-center gap-4 flex-shrink-0`}>
              <div className="relative">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl shadow-inner backdrop-blur-sm">🤖</div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a1628] animate-pulse" />
              </div>
              <div>
                <h3 className="font-playfair font-black text-xl text-white leading-tight">
                  {lang === 'bn' ? `${cropId} স্পেশালিস্ট এআই` : `${cropId} Specialist AI`}
                </h3>
                <p className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
                  {lang === 'bn' ? "লাইভ কনসালটেশন" : "Live Consultation"}
                </p>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth chat-scrollbar bg-[#05111e]/50"
            >
              {messages.filter(m => m.role !== 'system').map((msg, idx) => {
                
                // Advanced Markdown to HTML parser
                const renderMarkdown = (text) => {
                  let html = text
                   .replace(/^##### (.+)$/gm, '<strong class="block mt-[0.6rem] text-green-light text-[0.82rem] tracking-[0.04em] uppercase opacity-80">$1</strong>')
      .replace(/^#### (.+)$/gm, '<strong class="block mt-[0.7rem] text-green-light text-[0.88rem]">$1</strong>')
      .replace(/^### (.+)$/gm, '<strong class="block mt-[0.8rem] text-green-light text-[0.95rem]">$1</strong>')
      .replace(/^## (.+)$/gm, '<strong class="block mt-4 text-gold text-[1rem]">$1</strong>')
      .replace(/^# (.+)$/gm, '<strong class="block mt-4 text-gold text-[1.1rem]">$1</strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<span class="block pl-4 my-[0.15rem]">• $1</span>')
      .replace(/^(\d+)\. (.+)$/gm, '<span class="block pl-4 my-[0.15rem]">$1. $2</span>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
                  return html;
                };

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-5 rounded-2xl text-[0.95rem] leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-blue-600/20 border border-blue-500/30 text-white rounded-br-sm' 
                        : 'bg-white/5 border border-white/10 text-white/80 rounded-bl-sm shadow-xl'
                    }`}>
                      <div className="text-[10px] uppercase tracking-widest font-bold mb-3 opacity-50 flex items-center gap-2">
                        {msg.role === 'user' ? 'You' : 'Agri-AI Expert'}
                      </div>
                      
                      {msg.role === 'user' ? (
                        <div className="font-sans whitespace-pre-wrap">{msg.content}</div>
                      ) : (
                        <div 
                          className="font-sans styled-ai-content" 
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} 
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl rounded-bl-sm flex gap-2 items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Area */}
            <div className="p-4 bg-[#0a1628] border-t border-white/10 pb-6 flex-shrink-0">
              <form onSubmit={handleChatSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={lang === 'bn' ? `রোগবালাই বা ফলন নিয়ে জিজ্ঞেস করুন...` : `Ask about ${cropId} diseases or yield...`}
                  className="w-full bg-[#05111e] border border-white/20 rounded-full py-4 pl-6 pr-16 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-white/30"
                />
                <button 
                  type="submit" 
                  disabled={!chatInput.trim() || loading}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  &#10148;
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
