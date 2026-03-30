'use client';

import { useParams } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { StatsProvider } from '@/components/StatsProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarketIntelligence from '@/components/MarketIntelligence';
import DataCharts from '@/components/DataCharts';
import RiceGuide from '@/components/RiceGuide';
import RiceSeasons from '@/components/RiceSeasons';
import Fisheries from '@/components/Fisheries';
import Climate from '@/components/Climate';
import GenericCropGuide from '@/components/GenericCropGuide';
import Link from 'next/link';

export default function CropPage() {
  const params = useParams();
  const id = params.id;
  const { lang } = useLanguage();

  return (
    <StatsProvider>
      <div className="bg-[#05111e] min-h-screen text-white flex flex-col">
        <Navbar />
        
        {/* Navigation Bar for Back to Home */}
        <div className="border-b border-white/5 bg-[#0a1628] sticky top-[72px] z-40">
          <div className="max-w-[1200px] mx-auto px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-mono text-xs font-black uppercase tracking-widest">
              <span>←</span> {lang === 'bn' ? 'হোমে ফিরে যান' : 'Back to Dashboard'}
            </Link>
            <div className="text-white/30 font-mono text-[10px] tracking-[0.2em] uppercase">
              {lang === 'bn' ? 'কৃষি বাংলাদেশ ইন্টেলিজেন্স' : 'KrishiBangla Intelligence'} / {id}
            </div>
          </div>
        </div>

        <main className="flex-1">
          {id === 'rice' && (
            <>
              <RiceGuide />
              <RiceSeasons />
              <DataCharts />
              <MarketIntelligence />
            </>
          )}

          {id === 'fisheries' && (
            <>
              <Fisheries />
              <Climate />
            </>
          )}

          {id !== 'rice' && id !== 'fisheries' && (
            <GenericCropGuide cropId={id} />
          )}
        </main>

        <Footer />
      </div>
    </StatsProvider>
  );
}
