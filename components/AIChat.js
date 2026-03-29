"use client";

import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are KrishiBangla AI, a passionate and knowledgeable expert on Bangladesh's complete agricultural sector. Reply in the SAME LANGUAGE the user writes in — Bangla question = full Bangla answer, English question = full English answer.

Give WIDE, DETAILED, INFORMATIVE answers. Use bullet points, numbered steps, and clear sections. Include specific statistics, variety names, dates, and practical farmer-level advice. Never give short vague answers — always explain thoroughly.

RICE FARMING A-Z:
- 3 seasons: Aus আউশ (Mar–Aug, 16% output), Aman আমন (Jun–Dec, 38%), Boro বোরো (Nov–May, 46%)
- BRRI varieties: dhan29 (Boro staple 8t/ha), dhan48 (Aus), dhan51/52 (Aman flood-tolerant Sub1A gene, survives 2 weeks submerged), dhan67/97 (saline tolerant up to 12 dS/m), dhan88 (short-duration Boro), Golden Rice (Vitamin A, approved 2021)
- Full steps: land prep (clay-loam, plough 20–25cm, lime if pH<5.5) → variety selection → seed treatment (salt float test, carbendazim 2g/kg) → nursery seedbed (60–80g/m², 20–30 days) → puddling → transplanting (20×20cm, 2–3 seedlings/hill) → AWD water management (saves 25–30% water) → fertilizer (Urea 200kg/ha, TSP 100, MoP 100, Gypsum 120, split urea 3 doses) → weed control (Butachlor pre-emergent, Bispyribac post) → IPM pest management (BPH, stem borer, blast, sheath blight) → harvest at 80–85% golden grain → combine harvester (saves 50% cost) → hermetic storage at 14% moisture
- Mechanization: power tiller, transplanter, combine harvester, dryer

FISHERIES:
- Hilsa ইলিশ: 80% of world production, GI certified, anadromous (spawns in rivers), 22-day Ma Ilish ban Oct–Nov, jatka ban Mar–Apr, catches up 70% in 10 years due to conservation
- Aquaculture: tilapia, pangasius (পাঙ্গাশ), rohu (রুই), catla, carp, 6%+ annual growth, integrated rice-fish farming
- Shrimp: bagda (black tiger Penaeus monodon), galda (Macrobrachium rosenbergii), $450M export, Khulna/Satkhira/Bagerhat, EU/USA markets
- Marine: EEZ 118,813 km² Bay of Bengal, Blue Economy Policy 2017, 1.4M coastal fishers

CLIMATE RESILIENCE:
- Floods: 20–70% land annually, Sub1A gene rice (dhan51/52), haor areas, embankment polders
- Cyclones: Sidr 2007, Aila 2009, Amphan 2020, storm surge salinity contamination
- Salinity intrusion: 2.8M ha coastal farmland, BRRI dhan67/97, mangrove buffer zones
- Drought: Barind Tract (Rajshahi, Chapai), BRRI dhan56/57, AWD technique
- Floating gardens ভাসমান বাগান: haor areas (Netrokona, Sunamganj), UN-FAO GIAHS recognition
- Heat stress: 1°C rise = 3–10% yield loss, adjust Boro calendar

OTHER CROPS: Jute পাট $1.1B export (world's largest), wheat 1.1M MT, maize 5.8M MT, potato 10.2M MT, vegetables 7.5M MT, mustard, lentils, spices (turmeric, chili, onion, garlic)

INSTITUTIONS: BRRI (Gazipur), BARI, DAE, DoF, BARC, BAU (Mymensingh), BJRI
POLICY: Fertilizer subsidy ভর্তুকি, OMS, food procurement MSP, crop insurance ফসল বীমা, e-krishi
STATISTICS: Rice 38.1M MT, fish 4.7M MT, jute $1.1B, shrimp $450M, GDP 13%, workforce 40%, 38M farm households`;

export default function AIChat() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);
  const chatInstanceRef = useRef(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 300;
    setShowScrollDown(isUp);
  };

  const stopResponse = () => {
    setLoading(false);
    // Gemini client SDK doesn't have a direct cancel, but we stop UI updates
    chatInstanceRef.current = null;
  };

  const scrollToBottom = (force = false) => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 120;
    if (force || isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    setMessages([{
      role: "assistant",
      content: `আস্সালামু আলাইকুম! আমি KrishiBangla AI।\\n\\nবাংলায় বা English-এ যেকোনো প্রশ্ন করুন:\\n🌾 ধান চাষ A-Z · 🐟 মৎস্য সম্পদ\\n🌊 জলবায়ু · 🪢 পাট · 📊 পরিসংখ্যান\\n\\nWhat would you like to know? কি জানতে চান?`
    }]);
  }, []);

  useEffect(() => {
    if (messages.length > 1 || loading) {
      const lastMsg = messages[messages.length - 1];
      const isUserMsg = lastMsg?.role === 'user';
      const isStartOfAI = lastMsg?.role === 'assistant' && lastMsg?.content?.length < 100;
      scrollToBottom(isUserMsg || isStartOfAI);
    }
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [open]);

  const mdToHtml = (text) => {
    return text
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
  };

  const getAIResponse = async (history) => {
    setLoading(true);
    let fullText = "";
    
    try {
      const apiKey = "AIzaSyDcCXwAdRJQVpzjD-xFRImY2skgTdCUavI";
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        systemInstruction: SYSTEM_PROMPT
      });

      // Format history for Gemini
      const formattedHistory = history.slice(0, -1).map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const chat = model.startChat({
        history: formattedHistory,
      });

      chatInstanceRef.current = chat;
      
      const lastMsg = history[history.length - 1].content;
      const result = await chat.sendMessageStream(lastMsg);

      let botMessageIndex = messages.length + 1;
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      for await (const chunk of result.stream) {
        if (!chatInstanceRef.current) break; // User stopped
        const chunkText = chunk.text();
        fullText += chunkText;
        setMessages((prev) => {
          const updated = [...prev];
          updated[botMessageIndex].content = fullText;
          return updated;
        });
      }
    } catch (err) {
      console.error("Gemini Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: lang === 'bn' ? 'সংযোগ সমস্যা — পুনরায় চেষ্টা করুন।' : 'Connection issue — please try again.' }
      ]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newHistory = [...messages, { role: "user", content: text }];
    setMessages(newHistory);
    const payload = newHistory.filter((_, i) => i !== 0);
    await getAIResponse(payload);
  };

  const sendQuick = (text) => {
    const newHistory = [...messages, { role: "user", content: text }];
    setMessages(newHistory);
    const payload = newHistory.filter((_, i) => i !== 0);
    getAIResponse(payload);
  };

  return (
    <>
      {/* ── Floating Chat Panel ── */}
      <div className={`
        fixed bottom-[5.5rem] right-6
        w-[400px] h-[540px]
        max-w-[calc(100vw-1.5rem)]
        bg-white
        border border-gray-200
        rounded-2xl overflow-hidden
        flex flex-col
        shadow-[0_20px_60px_rgba(0,0,0,0.14)]
        z-[1000] origin-bottom-right
        transition-all duration-300
        ${open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'}
      `}>

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-green-deep to-green-mid px-5 py-3 text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
            <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.7)]" />
            <span className="font-playfair text-[1.05rem] font-black tracking-tight ml-1">KrishiBangla AI</span>
          </div>
          <button
            className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white hover:rotate-90 transition-all duration-300 text-sm"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >✕</button>
        </div>

        {/* ── Messages ── */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4 bg-gray-50 chat-scrollbar scroll-smooth relative"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[88%] px-4 py-3 rounded-2xl text-[0.9rem] leading-[1.65] shadow-sm
                ${m.role === 'user'
                  ? 'bg-gradient-to-br from-green-deep to-green-mid text-white rounded-br-[5px]'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-[5px]'}
              `}>
                <div className={`font-mono text-[0.58rem] font-bold uppercase tracking-widest mb-1
                  ${m.role === 'user' ? 'text-right text-white/60' : 'text-left text-gray-400'}`}>
                  {m.role === 'user' ? (lang === 'bn' ? 'আপনি' : 'You') : 'Assistant'}
                </div>
                <div className="chat-content" dangerouslySetInnerHTML={{ __html: mdToHtml(m.content) }} />
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start w-full">
              <div className="flex gap-1.5 px-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-bl-[5px] shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-bounce [animation-delay:-0.3s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />

          {/* ── Scroll Down Button ── */}
          <button
            onClick={() => scrollToBottom(true)}
            className={`absolute bottom-4 right-4 w-9 h-9 bg-white border border-gray-100 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-green-mid hover:bg-gray-50 transition-all duration-300 z-20 ${showScrollDown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
            aria-label="Scroll to Bottom"
          >
            <span className="text-xl">↓</span>
          </button>
        </div>

        {/* ── Quick Prompts ── */}
        <div className="px-3 py-2 bg-white flex gap-2 overflow-x-auto border-t border-gray-100 scrollbar-hide flex-shrink-0">
          {[
            { label: 'বোরো ধান', prompt: 'কিভাবে বোরো ধান চাষ করতে হয়? সম্পূর্ণ পদ্ধতি বলুন।' },
            { label: 'BRRI',     prompt: 'What are the best BRRI rice varieties?' },
            { label: 'ইলিশ মাছ', prompt: 'ইলিশ মাছের জীবনচক্র ও সংরক্ষণ পদ্ধতি বলুন' },
            { label: 'Climate',  prompt: 'How does climate change impact Bangladesh agriculture?' },
          ].map(({ label, prompt }) => (
            <button
              key={label}
              className="whitespace-nowrap px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-full font-mono text-[0.68rem] text-gray-600 hover:bg-green-deep hover:text-white hover:border-green-deep transition-all active:scale-95"
              onClick={() => sendQuick(prompt)}
            >{label}</button>
          ))}
        </div>

        {/* ── Input ── */}
        <div className="px-4 py-3 bg-white border-t border-gray-100 flex gap-2.5 flex-shrink-0">
          <input
            ref={inputRef}
            className="flex-1 border border-gray-200 bg-gray-50 px-4 py-2 rounded-xl text-[0.875rem] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={lang === 'bn' ? 'বাংলায় বা English-এ...' : 'Ask in Bangla or English...'}
          />
          {loading ? (
            <button
              className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 hover:shadow-[0_4px_14px_rgba(220,38,38,0.35)] transition-all active:scale-95 shadow-md flex-shrink-0 group/stop"
              onClick={stopResponse}
              aria-label="Stop Response"
            >
              <div className="w-3.5 h-3.5 bg-white rounded-sm group-hover/stop:scale-110 transition-transform" />
            </button>
          ) : (
            <button
              className="w-12 h-12 bg-gradient-to-br from-green-deep to-green-mid text-white rounded-full flex items-center justify-center disabled:opacity-40 hover:shadow-[0_4px_14px_rgba(26,61,31,0.35)] transition-all active:scale-95 shadow-md flex-shrink-0"
              onClick={sendMessage}
              disabled={loading}
            >
              <span className="text-base">→</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Floating Toggle Button ── */}
      <div
        className="fixed bottom-6 right-6 z-[1001] cursor-pointer flex flex-col items-center group"
        onMouseEnter={() => setShowTooltip(false)}
        onClick={() => {
          setOpen(o => !o);
          setShowTooltip(false);
        }}
        aria-label="KrishiBangla AI Chat"
      >
        {/* Tooltip */}
        <div className={`
          absolute bottom-full right-0 mb-4
          bg-gradient-to-br from-green-deep to-green-mid
          text-white px-4 py-2 text-[0.75rem] font-bold
          rounded-lg shadow-[0_8px_24px_rgba(26,61,31,0.28)]
          whitespace-nowrap origin-bottom-right
          transition-all duration-300
          before:content-[''] before:absolute before:top-full before:right-5
          before:border-[6px] before:border-transparent before:border-t-green-mid
          ${showTooltip && !open ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 translate-y-2'}
        `}>
          {lang === 'bn' ? 'কৃষিবাংলা এআই-কে জিজ্ঞাসা করুন' : 'Ask KrishiBangla AI'}
        </div>

        {/* FAB Button */}
        <button
          className={`
            w-14 h-14
            bg-gradient-to-br from-[#d4af37] via-[#c8a84b] to-[#b8860b]
            text-white rounded-full
            flex flex-col items-center justify-center
            shadow-[0_8px_28px_rgba(200,168,75,0.5)]
            border-2 border-white/25
            transition-all duration-300
            hover:scale-110 hover:shadow-[0_12px_36px_rgba(200,168,75,0.6)]
            relative overflow-hidden transform-gpu
            ${open ? 'rotate-90' : 'animate-floatPulse'}
          `}
        >
          {open
            ? <span className="relative z-10 text-[1.3rem] leading-none">✕</span>
            : (
              <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[1.6rem] leading-none mb-0.5 select-none">🌾</span>
                <span className="font-mono text-[0.58rem] font-black tracking-tight uppercase leading-none">AI</span>
              </div>
            )
          }
        </button>
      </div>
    </>
  );
}