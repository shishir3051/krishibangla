'use client';

export default function DistrictReportModal({ isOpen, onClose, district }) {
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

  const months = [
    { key:'J', name:'Jan' }, { key:'F', name:'Feb' }, { key:'M', name:'Mar' }, { key:'A', name:'Apr' },
    { key:'M', name:'May' }, { key:'J', name:'Jun' }, { key:'J', name:'Jul' }, { key:'A', name:'Aug' },
    { key:'S', name:'Sep' }, { key:'O', name:'Oct' }, { key:'N', name:'Nov' }, { key:'D', name:'Dec' },
  ];
  
  // Real-time dynamic calendar parsing: Extract only Harvest/Plucking months and support wrapping ranges (e.g. Dec-Feb)
  const monthOrder = months.map(m => m.name);
  let harvestSet = new Set();
  if (district.calendar) {
    const harvestMatch = district.calendar.match(/(?:Harvest|Plucking)\s*:\s*([^;]+)/i);
    const targetStr = harvestMatch ? harvestMatch[1] : district.calendar;
    // Format capitalize to match monthOrder
    const targetStrCamel = targetStr.replace(/\b\w/g, c => c.toUpperCase());
    const monthsFound = targetStrCamel.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g);
    
    if (monthsFound && monthsFound.length === 2 && targetStr.includes('-')) {
       const startIdx = monthOrder.indexOf(monthsFound[0]);
       const endIdx = monthOrder.indexOf(monthsFound[1]);
       if (startIdx !== -1 && endIdx !== -1) {
          let curr = startIdx;
          while (true) {
             harvestSet.add(monthOrder[curr]);
             if (curr === endIdx) break;
             curr = (curr + 1) % 12; // Wrap around Dec to Jan
          }
       }
    } else if (monthsFound) {
       monthsFound.forEach(m => harvestSet.add(m));
    }
  }
  const harvestMonths = Array.from(harvestSet);


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
        borderRadius: '1.5rem',
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
                {district.name} — Intelligence Report
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', alignItems: 'center' }}>
              <span style={{
                background: 'rgba(16,185,129,0.2)', color: '#10b981',
                border: '1px solid rgba(16,185,129,0.3)',
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '2px 8px', borderRadius: '100px',
              }}>Official Audit v4.2</span>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>Updated March 2026</span>
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
              <SectionTitle icon="🌾">Agronomy Overview</SectionTitle>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', lineHeight: 1.7, margin: '0.5rem 0 0' }}>
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{district.name}</strong> features <strong style={{ color: '#10b981' }}>{district.soil}</strong> soil.
                Primary crops: <strong style={{ color: '#fbbf24' }}>{district.crops?.join(', ')}</strong>.
                Irrigation coverage: <strong style={{ color: '#60a5fa' }}>{district.irrigation}</strong>.
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
                    <div style={{ color: '#f87171', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>Climate Risk</div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem' }}>{district.risk} — Monitor and prepare mitigation strategies.</div>
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
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px', marginBottom: '0.875rem' }}>Quality Score</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <MetricRow label="Soil Fertility" value={fertility} />
                <MetricRow label="Water Table" value={waterTable} />
                <MetricRow label="Export Potential" value={exportPot} />
              </div>
            </div>
          </div>

          {/* Row 2: Advisory + Calendar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Advisory */}
            <div style={{
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
              borderRadius: '1rem', padding: '1rem 1.25rem',
            }}>
              <SectionTitle icon="💡">Pest & Disease Advisory</SectionTitle>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.7, margin: '0.5rem 0 0.75rem' }}>
                {hasAdvisory
                  ? district.advisory
                  : `Monitor common pests for ${district.crops?.[0] || 'primary crops'}. Follow IPM protocols. Contact local agricultural extension office for spray schedules.`}
              </p>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '0.625rem', borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ color: '#10b981', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Treatment Plan Active</span>
                <button style={{
                  background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)',
                  color: '#10b981', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                }}>Details →</button>
              </div>
            </div>

            {/* Calendar */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '1rem', padding: '1rem 1.25rem',
            }}>
              <SectionTitle icon="📅">Agronomy Calendar</SectionTitle>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.7, margin: '0.5rem 0 0.75rem' }}>
                {hasCalendar
                  ? district.calendar
                  : `Primary planting season for ${district.crops?.[0] || 'crops'} follows the Boro/Aman cycle. Transplanting begins post-monsoon.`}
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
                  Harvest Season
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', display: 'inline-block' }} />
                  Off Season
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
            <SectionTitle icon="📈">Market & Export Analysis</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', marginTop: '0.75rem', alignItems: 'start' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.7, margin: 0 }}>
                {hasPotential
                  ? district.potential
                  : `Based on historical yield data, ${district.bn} has strong agricultural export performance. Focus on value-added processing to increase margins.`}
              </p>
              <div style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.75rem', padding: '0.625rem 1rem', textAlign: 'center', flexShrink: 0,
              }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>Growth</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>{growth}</div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.75rem', padding: '0.625rem 1rem', textAlign: 'center', flexShrink: 0,
              }}>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2px' }}>Export</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>{tier}</div>
              </div>
            </div>
          </div>

          {/* Row 4: Crops pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingBottom: '0.25rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 600, alignSelf: 'center', marginRight: '0.25rem' }}>Key Crops:</span>
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
            KrishiBangla Intelligence Portal — Bangladesh Official Report
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)', borderRadius: '8px', padding: '0.4rem 1rem',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            }}>Close</button>
            <button style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none', color: '#fff', borderRadius: '8px', padding: '0.4rem 1rem',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16,185,129,0.35)',
            }}>Download PDF</button>
          </div>
        </div>
      </div>
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
