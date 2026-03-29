import Text from "./Text";

export default function Footer() {
  return (
    <footer className="py-16 px-8 text-center border-t border-black/5 bg-white">
      <p className="text-[0.82rem] text-muted my-[0.3rem]"><strong className="text-green-deep font-bold">কৃষি বাংলাদেশ</strong> — Bangladesh Agriculture Intelligence Portal</p>
      <Text as="p" className="text-[0.82rem] text-muted my-[0.3rem]"
        en="Data: BBS · BRRI · DoF · FAO · World Bank · Ministry of Agriculture Bangladesh" 
        bn="তথ্যসূত্র: বিবিএস · BRRI · মৎস্য অধিদপ্তর · FAO · বিশ্বব্যাংক · কৃষি মন্ত্রণালয়" 
      />
      <Text as="p" className="text-[0.82rem] text-muted mt-2" 
        en="AI powered by Gemini (Google) · Statistical data 2024" 
        bn="AI: Gemini (Google) · পরিসংখ্যান ২০২৪" 
      />
    </footer>
  );
}
