import Text from "./Text";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-[100] bg-green-deep/97 backdrop-blur-xl border-b border-gold/20 py-[0.8rem] px-8 flex gap-4 items-center overflow-x-auto">
      <div className="font-playfair font-black text-gold text-[1.1rem] whitespace-nowrap mr-2">কৃষি BD</div>
      <a href="#overview" className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-green-light no-underline whitespace-nowrap py-[0.3rem] px-[0.6rem] rounded-[2px] transition-all duration-200 hover:bg-gold/15 hover:text-gold">
        <Text en="Overview" bn="সারসংক্ষেপ" />
      </a>
      <a href="#rice-az" className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-green-light no-underline whitespace-nowrap py-[0.3rem] px-[0.6rem] rounded-[2px] transition-all duration-200 hover:bg-gold/15 hover:text-gold">
        <Text en="Rice" bn="ধান" />
      </a>
      <a href="#fisheries" className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-green-light no-underline whitespace-nowrap py-[0.3rem] px-[0.6rem] rounded-[2px] transition-all duration-200 hover:bg-gold/15 hover:text-gold">
        <Text en="Fisheries" bn="মৎস্য" />
      </a>
      <a href="#climate" className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-green-light no-underline whitespace-nowrap py-[0.3rem] px-[0.6rem] rounded-[2px] transition-all duration-200 hover:bg-gold/15 hover:text-gold">
        <Text en="Climate" bn="জলবায়ু" />
      </a>
      <a href="#data" className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-green-light no-underline whitespace-nowrap py-[0.3rem] px-[0.6rem] rounded-[2px] transition-all duration-200 hover:bg-gold/15 hover:text-gold">
        <Text en="Data" bn="তথ্য" />
      </a>
      <a href="#ai-chat" className="font-mono text-[0.65rem] tracking-[0.08em] uppercase text-green-light no-underline whitespace-nowrap py-[0.3rem] px-[0.6rem] rounded-[2px] transition-all duration-200 hover:bg-gold/15 hover:text-gold">
        <Text en="🤖 AI Chat" bn="🤖 AI চ্যাট" />
      </a>
    </nav>
  );
}
