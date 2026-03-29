import Text from "./Text";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-[100] bg-green-deep/97 backdrop-blur-xl border-b border-gold/10 py-3 px-8 flex gap-3 items-center overflow-x-auto scrollbar-hide shadow-lg shadow-black/20">
      <div className="font-playfair font-black text-gold text-lg whitespace-nowrap mr-6 tracking-tighter hover:scale-105 transition-transform cursor-pointer">
        কৃষি <span className="text-white/40 font-mono text-xs uppercase ml-1 tracking-widest">BD</span>
      </div>
      
      {[
        { en: 'Overview',   bn: 'সারসংক্ষেপ', href: '#overview' },
        { en: 'Rice',       bn: 'ধান',       href: '#rice-az' },
        { en: 'Fisheries',  bn: 'মৎস্য',     href: '#fisheries' },
        { en: 'Climate',    bn: 'জলবায়ু',    href: '#climate' },
        { en: 'Data',       bn: 'তথ্য',       href: '#data' },
        { en: 'Market',     bn: 'বাজার',      href: '#market' },
        { en: 'Protection', bn: 'সুরক্ষা',     href: '#protection' },
        { en: 'Map',        bn: 'মানচিত্র',    href: '#map' },
      ].map((link, i) => (
        <a 
          key={i}
          href={link.href} 
          className="font-mono text-[0.68rem] font-bold tracking-[0.1em] uppercase text-green-light/70 no-underline whitespace-nowrap py-2 px-4 rounded-lg transition-all duration-300 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10"
        >
          <Text en={link.en} bn={link.bn} />
        </a>
      ))}
    </nav>
  );
}
