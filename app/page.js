"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Navbar from "@/components/Navbar";
import PremiumHeader from "@/components/PremiumHeader";
import Overview from "@/components/Overview";
import RiceGuide from "@/components/RiceGuide";
import DataCharts from "@/components/DataCharts";
import RiceSeasons from "@/components/RiceSeasons";
import Fisheries from "@/components/Fisheries";
import Climate from "@/components/Climate";
import WeatherWidget from "@/components/WeatherWidget";
import CropMap from "@/components/CropMap";
import DiseaseDetection from "@/components/DiseaseDetection";
import AIChat from "@/components/AIChat";
import Footer from "@/components/Footer";
import MarketIntelligence from "@/components/MarketIntelligence";
import { StatsProvider } from "@/components/StatsProvider";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <StatsProvider>
      <LanguageSwitcher />
      <Hero />
      <Navbar />
      
      {/* Premium Dashboard Command Center */}
      <section id="map" className="bg-[#05111e] py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full animate-pulse pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <PremiumHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-12">
               <CropMap />
            </div>
            <div className="lg:col-span-12">
               <WeatherWidget />
            </div>
          </div>
        </div>
      </section>

      <Overview />
      <RiceGuide />
      <DataCharts />
      <div id="market">
        <MarketIntelligence />
      </div>
      <RiceSeasons />
      <Fisheries />
      <Climate />
      <div id="protection">
        <DiseaseDetection />
      </div>
      <div id="ai-chat">
        <AIChat />
      </div>
      <Footer />
    </StatsProvider>
  );
}
