"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Overview from "@/components/Overview";
import RiceGuide from "@/components/RiceGuide";
import DataCharts from "@/components/DataCharts";
import RiceSeasons from "@/components/RiceSeasons";
import Fisheries from "@/components/Fisheries";
import Climate from "@/components/Climate";
import WeatherWidget from "@/components/WeatherWidget";
import CropMap from "@/components/CropMap";
import AIChat from "@/components/AIChat";
import Footer from "@/components/Footer";

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
    <>
      <Hero />
      <Navbar />
      
      <section className="bg-green-deep py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <WeatherWidget />
        </div>
      </section>

      <section className="bg-green-950 py-24 px-4 overflow-hidden relative">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <CropMap />
        </div>
      </section>

      <Overview />
      <RiceGuide />
      <DataCharts />
      <RiceSeasons />
      <Fisheries />
      <Climate />
      <AIChat />
      <Footer />
    </>
  );
}
