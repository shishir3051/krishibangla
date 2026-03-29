"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "./LanguageProvider";

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
  const abortControllerRef = useRef(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 300;
    setShowScrollDown(isUp);
  };

  const stopResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
    }
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
      content: `আস্সালামু আলাইকুম! আমি KrishiBangla AI।\n\nবাংলায় বা English-এ যেকোনো প্রশ্ন করুন:\n🌾 ধান চাষ A-Z · 🐟 মৎস্য সম্পদ\n🌊 জলবায়ু · 🪢 পাট · 📊 পরিসংখ্যান\n\nWhat would you like to know? কি জানতে চান?`
    }]);
  }, []);

  useEffect(() => {
    if (messages.length > 1 || loading) {
      const lastMsg = messages[messages.length - 1];
      // Force scroll if:
      // 1. It's a user message (just sent)
      // 2. It's the very start of an assistant response
      // 3. User is already close to bottom
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
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: signal
      });
      if (!res.ok) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let botMessageIndex = history.length + 1;
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') break;
          try {
            const obj = JSON.parse(raw);
            if (obj.type === 'content_block_delta' && obj.delta?.type === 'text_delta' && obj.delta?.text) {
              fullText += obj.delta.text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[botMessageIndex].content = fullText;
                return updated;
              });
            }
          } catch (e) { }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // User interrupted the response, do nothing or show stopped indicator
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: lang === 'bn' ? 'সংযোগ সমস্যা — পুনরায় চেষ্টা করুন।' : 'Connection issue — please try again.' }
        ]);
      }
    }
    setLoading(false);
    abortControllerRef.current = null;
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