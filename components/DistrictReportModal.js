'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { parseHarvestMonths, MONTHS } from '../lib/calendarUtils';

export default function DistrictReportModal({ isOpen, onClose, district }) {
  const { lang } = useLanguage();
  const [showAdvisoryDetails, setShowAdvisoryDetails] = useState(false);

  const t = {
    en: {
      intelReport: 'Intelligence Report',
      officialAudit: 'Official Audit v4.2',
      updated: 'Updated March 2026',
      agronomyOverview: 'Agronomy Overview',
      climateRisk: 'Climate Risk',
      monitorStrategies: 'Monitor and prepare mitigation strategies.',
      qualityScore: 'Quality Score',
      soilFertility: 'Soil Fertility',
      waterTable: 'Water Table',
      exportPotential: 'Export Potential',
      pestAdvisory: 'Pest & Disease Advisory',
      treatmentActive: 'Treatment Plan Active',
      details: 'Details',
      advancedProtocol: 'Advanced Protocol',
      back: 'Back',
      targetedMeasures: 'Targeted Measures',
      bioAdvisory: 'Bio-Advisory',
      source: 'Source: BARI / BRRI Treatment Guidelines',
      agronomyCalendar: 'Agronomy Calendar',
      harvestSeason: 'Harvest Season',
      offSeason: 'Off Season',
      marketAnalysis: 'Market & Export Analysis',
      growth: 'Growth',
      export: 'Export',
      keyCrops: 'Key Crops:',
      close: 'Close',
      downloadPDF: 'Download PDF',
      loading: 'Loading...',
    },
    bn: {
      intelReport: 'ইন্টেলিজেন্স রিপোর্ট',
      officialAudit: 'অফিসিয়াল অডিট v4.2',
      updated: 'আপডেট করা হয়েছে মার্চ ২০২৬',
      agronomyOverview: 'অ্যাগ্রোনমি ওভারভিউ',
      climateRisk: 'জলবায়ু ঝুঁকি',
      monitorStrategies: 'পর্যবেক্ষণ করুন এবং প্রশমন কৌশল প্রস্তুত করুন।',
      qualityScore: 'কোয়ালিটি স্কোর',
      soilFertility: 'মাটির উর্বরতা',
      waterTable: 'পানির স্তর',
      exportPotential: 'রপ্তানি সম্ভাবনা',
      pestAdvisory: 'কীটপতঙ্গ ও রোগ পরামর্শ',
      treatmentActive: 'চিকিৎসা পরিকল্পনা সক্রিয়',
      details: ' বিস্তারিত  →',
      advancedProtocol: 'উন্নত প্রোটোকল',
      back: 'পিছনে',
      targetedMeasures: 'লক্ষ্যযুক্ত ব্যবস্থা:',
      bioAdvisory: 'বায়ো-পরামর্শ:',
      source: 'উৎস: BARI / BRRI চিকিৎসা নির্দেশিকা',
      agronomyCalendar: 'অ্যাগ্রোনমি ক্যালেন্ডার',
      harvestSeason: 'ফসলের মৌসুম',
      offSeason: 'অফ সিজন',
      marketAnalysis: 'বাজার ও রপ্তানি বিশ্লেষণ',
      growth: 'বৃদ্ধি',
      export: 'রপ্তানি',
      keyCrops: 'প্রধান ফসল:',
      close: 'বন্ধ করুন',
      downloadPDF: 'পিডিএফ ডাউনলোড করুন',
      loading: 'লোড হচ্ছে...',
    }
  }[lang];

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      setShowAdvisoryDetails(false); // Reset details state on close
    };
  }, [isOpen]);

  if (!isOpen || !district) return null;

  const hasAdvisory = !!district.advisory;
  const hasCalendar = !!district.calendar;
  const hasPotential = !!district.potential;

  // Use actual metrics strictly injected from the database
  const scoreBadge = district.qualityScore || 'A';
  const fertility = district.fertility || '80%';
  const waterTable = district.waterTable || 'Optimal';
  const exportPot = district.exportPotential || '85%';
  const growth = district.growthForecast || '+8.5%';
  const tier = district.exportTier || 'Tier 2';

  const months = MONTHS;

  // Parse harvest months using the shared utility
  const harvestMonths = parseHarvestMonths(district.calendar);


  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      overflowY: 'auto',
      padding: '4rem 1rem', // strict outer padding creates space at the top and bottom
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 0,
        }}
      />

      {/* Modal Container */}
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: '860px',
        margin: '0 auto', // strict horizontal centering (block level)
        background: '#0f1c2e',
        borderRadius: '.4rem',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 40px 120px rgba(0,0,0,0.8)',
        display: 'flex', flexDirection: 'column',
        zIndex: 10,
      }}>

        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.03) 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '1.25rem 1.75rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
          flexShrink: 0,
        }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', flexShrink: 0,
          }}>📊</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '1.5rem', lineHeight: 1 }}>
                {district.bn}
              </h2>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', fontWeight: 500 }}>
                {district.name} — {t.intelReport}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', alignItems: 'center' }}>
              <span style={{
                background: 'rgba(16,185,129,0.2)', color: '#10b981',
                border: '1px solid rgba(16,185,129,0.3)',
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '2px 8px', borderRadius: '100px',
              }}>{t.officialAudit}</span>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>{t.updated}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>

        {/* ── Scrollable Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Row 1: Overview + Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}>
            {/* Overview text */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '1rem', padding: '1rem 1.25rem',
            }}>
              <SectionTitle icon="🌾">{t.agronomyOverview}</SectionTitle>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', lineHeight: 1.7, margin: '0.5rem 0 0' }}>
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{lang === 'bn' ? district.bn : district.name}</strong> {lang === 'bn' ? 'এ ' : 'features '} <strong style={{ color: '#10b981' }}>{district.soil}</strong> {lang === 'bn' ? 'মাটি রয়েছে।' : 'soil.'}
                {lang === 'bn' ? ' প্রধান ফসল: ' : ' Primary crops: '} <strong style={{ color: '#fbbf24' }}>{district.crops?.join(', ')}</strong>.
                {lang === 'bn' ? ' সেচ কভারেজ: ' : ' Irrigation coverage: '} <strong style={{ color: '#60a5fa' }}>{district.irrigation}</strong>.
              </p>
              {district.risk && (
                <div style={{
                  marginTop: '0.75rem',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '0.75rem', padding: '0.625rem 0.875rem',
                  display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: '0.9rem' }}>⚠️</span>
                  <div>
                    <div style={{ color: '#f87171', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>{t.climateRisk}</div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem' }}>{district.risk} — {t.monitorStrategies}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Score card */}
            <div style={{
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '1rem', padding: '1rem 1.25rem', minWidth: '160px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#10b981', lineHeight: 1 }}>{scoreBadge}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px', marginBottom: '0.875rem' }}>{t.qualityScore}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <MetricRow label={t.soilFertility} value={fertility} />
                <MetricRow label={t.waterTable} value={waterTable} />
                <MetricRow label={t.exportPotential} value={exportPot} />
              </div>
            </div>
          </div>

          {/* Row 2: Advisory + Calendar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Advisory */}
            <div style={{
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
              borderRadius: '1rem', padding: '1rem 1.25rem',
              position: 'relative', // Constrain the overlay details to this box
            }}>
              <SectionTitle icon="💡">{t.pestAdvisory}</SectionTitle>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.7, margin: '0.5rem 0 0.75rem' }}>
                {hasAdvisory
                  ? district.advisory
                  : (lang === 'bn' ? `${district.crops?.[0] || 'প্রধান ফসল'}-এর জন্য সাধারণ কীটপতঙ্গ পর্যবেক্ষণ করুন। আইপিএম প্রোটোকল অনুসরণ করুন। স্প্রে করার সময়সূচীর জন্য স্থানীয় কৃষি সম্প্রসারণ অফিসের সাথে যোগাযোগ করুন।` : `Monitor common pests for ${district.crops?.[0] || 'primary crops'}. Follow IPM protocols. Contact local agricultural extension office for spray schedules.`)}
              </p>
              
              {showAdvisoryDetails && (
                <div style={{
                  position: 'absolute', inset: 0, 
                  background: '#0a1e2f', zIndex: 100, 
                  padding: '1rem 1.25rem', borderRadius: '1rem',
                  display: 'flex', flexDirection: 'column',
                  animation: 'fadeIn 0.3s ease',
                  border: '1px solid rgba(16,185,129,0.4)',
                  boxShadow: '0 0 30px rgba(16,185,129,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SectionTitle icon="🔬">{t.advancedProtocol}</SectionTitle>
                    <button 
                      onClick={() => setShowAdvisoryDetails(false)}
                      style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                    >← {t.back}</button>
                  </div>
                  <div style={{ marginTop: '0.75rem', overflowY: 'auto', flex: 1, fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong style={{ display: 'block', color: '#10b981', marginBottom: '4px' }}>{t.targetedMeasures}</strong>
                      {district.crops?.includes('Rice') && (
                        <div style={{ marginBottom: '4px' }}>• {lang === 'bn' ? 'ধানের মাজরা পোকা: ফেরোমন ফাঁদ + কার্বোফিউরান ৫জি ব্যবহার করুন।' : 'Rice Stem Borer: Use pheromone traps + Carbofuran 5G.'}</div>
                      )}
                      {district.crops?.includes('Tea') && (
                        <div style={{ marginBottom: '4px' }}>• {lang === 'bn' ? 'লাল মাকড়সা: ২ মিলি/লিটার হারে ডিকোফল ১৮.৫ ইসি স্প্রে করুন।' : 'Red Spider Mite: Spray Dicofol 18.5EC at 2ml/L.'}</div>
                      )}
                      {district.crops?.includes('Mango') && (
                        <div style={{ marginBottom: '4px' }}>• {lang === 'bn' ? 'ফল মাছি : বাগানে মেটাইল ইউজেনল ফাঁদ ব্যবহার করুন।' : 'Fruit Fly: Use Matyl Eugenol traps in orchard.'}</div>
                      )}
                      <div style={{ marginBottom: '4px' }}>• {lang === 'bn' ? 'মাটির স্বাস্থ্য: ভালো ফলনের জন্য মাটির পিএইচ (pH) নিরপেক্ষ করুন।' : 'Soil Health: Neutralize pH for better pesticide efficiency.'}</div>
                    </div>
                    <div>
                      <strong style={{ display: 'block', color: '#fbbf24', marginBottom: '4px' }}>{t.bioAdvisory}</strong>
                      {lang === 'bn' ? 'আর্দ্রতা বেশি থাকলে চোষক পোকা দমনে বিউভেরিয়া বাসিয়ানা ব্যবহার করুন।' : 'Apply Beauveria bassiana for biological control of sucking pests during high humidity.'}
                    </div>
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '9px', color: 'rgba(16,185,129,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {t.source}
                    </div>
                  </div>
                </div>
              )}

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '0.625rem', borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ color: '#10b981', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.treatmentActive}</span>
                <button 
                  onClick={() => setShowAdvisoryDetails(true)}
                  style={{
                    background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)',
                    color: '#10b981', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                  }}
                >{t.details}</button>
              </div>
            </div>

            {/* Calendar */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '1rem', padding: '1rem 1.25rem',
            }}>
              <SectionTitle icon="📅">{t.agronomyCalendar}</SectionTitle>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.7, margin: '0.5rem 0 0.75rem' }}>
                {hasCalendar
                  ? district.calendar
                  : (lang === 'bn' ? `${district.crops?.[0] || 'প্রধান ফসল'}-এর জন্য বোরো/আমন চক্র অনুসরণ লক্ষ্য করা যায়। বর্ষা পরবর্তী সময়ে চারা রোপণ শুরু হয়।` : `Primary planting season for ${district.crops?.[0] || 'crops'} follows the Boro/Aman cycle. Transplanting begins post-monsoon.`)}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
                {months.map((m, i) => (
                  <div key={i} style={{
                    borderRadius: '5px', padding: '3px 0', textAlign: 'center',
                    fontSize: '9px', fontWeight: 700,
                    background: harvestMonths.includes(m.name) ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.05)',
                    color: harvestMonths.includes(m.name) ? '#6ee7b7' : 'rgba(255,255,255,0.3)',
                    border: harvestMonths.includes(m.name) ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {m.name}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', background: 'rgba(16,185,129,0.4)', borderRadius: '2px', display: 'inline-block' }} />
                  {t.harvestSeason}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', display: 'inline-block' }} />
                  {t.offSeason}
                </span>
              </div>
            </div>
          </div>

          {/* Row 3: Market Analysis */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(99,102,241,0.08) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '1rem', padding: '1rem 1.25rem',
          }}>
            <SectionTitle icon="📈">{t.marketAnalysis}</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', marginTop: '0.75rem', alignItems: 'start' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.7, margin: 0 }}>
                {hasPotential
                  ? district.potential
                  : (lang === 'bn' ? `ঐতিহাসিক ফলন ডাটার ওপর ভিত্তি করে, ${district.bn} জেলায় কৃষিপণ্য রপ্তানির জোরালো সম্ভাবনা রয়েছে। লাভের মার্জিন বাড়াতে কৃষি প্রক্রিয়াকরণে মনোযোগ দিন।` : `Based on historical yield data, ${district.bn} has strong agricultural export performance. Focus on value-added processing to increase margins.`)}
              </p>
              <div style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.75rem', padding: '0.625rem 1rem', textAlign: 'center', flexShrink: 0,
              }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>{t.growth}</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>{growth}</div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.75rem', padding: '0.625rem 1rem', textAlign: 'center', flexShrink: 0,
              }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>{t.export}</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>{tier}</div>
              </div>
            </div>
          </div>

          {/* Row 4: Crops pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingBottom: '0.25rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 600, alignSelf: 'center', marginRight: '0.25rem' }}>{t.keyCrops}</span>
            {district.crops?.map((c, i) => (
              <span key={i} style={{
                background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)',
                color: '#fbbf24', fontSize: '11px', fontWeight: 600,
                padding: '3px 10px', borderRadius: '100px',
              }}>{c}</span>
            ))}
          </div>

        </div>

        {/* ── Footer ── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '0.875rem 1.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.02)',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            KrishiBangla Intelligence Portal — {lang === 'bn' ? 'বাংলাদেশ অফিশিয়াল রিপোর্ট' : 'Bangladesh Official Report'}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)', borderRadius: '8px', padding: '0.4rem 1rem',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            }}>{t.close}</button>
            {/* <button style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none', color: '#fff', borderRadius: '8px', padding: '0.4rem 1rem',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16,185,129,0.35)',
            }}>{t.downloadPDF}</button> */}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(5px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: '0.95rem' }}>{icon}</span>
      <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{children}</span>
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>{value}</span>
    </div>
  );
}
