'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISTRICTS } from '@/lib/districts';
import { getWeather } from '@/lib/weather';
import { useLanguage } from '@/components/LanguageProvider';

export default function WeatherWidget() {
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [weather, setWeather] = useState(null);
  const [district, setDistrict] = useState('Dhaka');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const t = {
    en: {
      title: 'Live Weather',
      districtLabel: 'District:',
      humidity: 'Humidity',
      wind: 'Wind Speed',
      rain: 'Rain (Today)',
      feelsLike: 'Feels Like',
      irrigationStatus: 'Irrigation Status',
      loading: 'Loading Live Weather...',
      kmh: 'km/h',
    },
    bn: {
      title: 'লাইভ আবহাওয়া',
      districtLabel: 'জেলা:',
      humidity: 'আর্দ্রতা',
      wind: 'বাতাসের গতি',
      rain: 'বৃষ্টি (আজ)',
      feelsLike: 'অনুভূত হচ্ছে',
      irrigationStatus: 'সেচের অবস্থা',
      loading: 'লাইভ আবহাওয়া লোড হচ্ছে...',
      kmh: 'কি.মি./ঘণ্টা',
    }
  }[lang];

  const fetchWeather = async (name) => {
    setLoading(true);
    try {
      const data = await getWeather(name);
      setWeather(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchWeather(district);
  }, [district]);

  if (!mounted) return null;

  if (loading && !weather) {
    return (
      <div className="w-full h-64 bg-white/10 animate-pulse rounded-3xl border border-white/20 flex items-center justify-center">
        <span className="text-white/60 font-medium">{t.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-200">
        Error loading weather: {error}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full group overflow-hidden bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl p-8 transition-all hover:shadow-green-900/20"
    >
      {/* ── Background Decoration ── */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-green-500/20 transition-all duration-700" />
      
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span className="text-4xl">🌦️</span> 
            {t.title}
          </h2>
          <p className="text-white/60 mt-1 font-medium italic">
            {lang === 'bn' ? (DISTRICTS.find(d => d.name === weather?.district)?.bn || weather?.district) : weather?.district}: {weather?.location || (lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...')}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-1.5 pl-4 rounded-2xl border border-white/10">
          <span className="text-xs uppercase tracking-widest text-white/40 font-bold">{t.districtLabel}</span>
          <select 
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-xl outline-none cursor-pointer hover:bg-green-500 transition-colors border-none appearance-none pr-10 relative"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'3\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.2rem'
            }}
          >
            {DISTRICTS.map(d => (
              <option key={d.name} value={d.name} className="bg-green-900">{lang === 'bn' ? d.bn : d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {weather && (
        <>
          {/* ── Main Stats ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10 relative z-10">
            <div className="lg:col-span-5 flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                <img src={weather.icon} alt={weather.condition} className="w-32 h-32 relative drop-shadow-[0_8px_32px_rgba(255,255,255,0.4)]" />
              </div>
              <div>
                <div className="text-7xl font-black text-white flex items-start gap-1">
                  {weather.temp}<span className="text-3xl mt-2 text-green-400">°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xl font-medium text-white/80">{weather.condition}</div>
                  <div className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/5 whitespace-nowrap">
                    <span className="text-[10px] uppercase tracking-tighter text-white/40 block font-bold leading-none">{t.feelsLike}</span>
                    <span className="text-xs font-bold text-white leading-none">{weather.feels_like}°C</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <WeatherStat icon="💧" label={t.humidity} value={`${weather.humidity}%`} />
              <WeatherStat icon="🌬️" label={t.wind} value={`${weather.wind} ${t.kmh}`} />
              <WeatherStat icon="🌧️" label={t.rain} value={`${weather.rain_chance}%`} />
            </div>
          </div>

          {/* ── Irrigation Alert Banner ── */}
          <div className={`mt-10 p-6 rounded-[2rem] border relative overflow-hidden transition-all duration-500 ${
            weather.irrigation.level === 'high' 
              ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-orange-500/40' 
              : weather.irrigation.level === 'none'
              ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/40'
              : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/40'
          }`}>
            <div className="absolute top-0 right-0 w-32 h-full opacity-10 flex items-center justify-center scale-150 rotate-12">
                <span className="text-8xl">{weather.irrigation.level === 'high' ? '⚠️' : weather.irrigation.level === 'none' ? '🌧️' : '✅'}</span>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl shadow-inner border border-white/10">
                {weather.irrigation.level === 'high' ? '🆘' : '💡'}
              </div>
              <div>
                <div className="text-lg font-bold text-white mb-1 uppercase tracking-wider flex items-center gap-2">
                    {t.irrigationStatus} <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                </div>
                <div className="text-2xl font-black text-white leading-tight">
                  {weather.irrigation.message_bn}
                </div>
                <div className="text-sm text-white/60 font-medium mt-1">
                  {weather.irrigation.message_en}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

function WeatherStat({ icon, label, value }) {
  return (
    <div className="bg-white/5 border border-white/5 p-4 rounded-3xl hover:bg-white/10 transition-all group/stat">
      <div className="text-2xl mb-2 group-hover/stat:scale-125 transition-transform duration-300">{icon}</div>
      <div className="text-xs font-bold text-white/30 uppercase tracking-widest">{label}</div>
      <div className="text-2xl font-black text-white mt-1 group-hover/stat:text-green-400 transition-colors uppercase">{value}</div>
    </div>
  );
}
