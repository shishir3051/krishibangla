'use client';
import { useState, useEffect, useMemo } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { districtsData } from '@/data/districtsData';
import DistrictReportModal from './DistrictReportModal';

// Name normalizations between geoBoundaries shapeNames and our districtsData keys
const NAME_MAP = {
  'Brahamanbaria': 'Brahmanbaria',
  'Nawabganj': 'Chapai Nawabganj',
  'Netrakona': 'Netrokona',
  'Khagrachhari': 'Khagrachhari',
  'Jhalokathi': 'Jhalokati',
  'Chittagong': 'Chittagong',
  'Chattogram': 'Chittagong',
  'Maulvibazar': 'Moulvibazar',
  "Cox's Bazar": "Cox's Bazar",
};

function getDistrictKey(shapeName) {
  return NAME_MAP[shapeName] || shapeName;
}

export default function CropMap() {
  const [geoData, setGeoData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/bangladesh.json')
      .then(r => r.json())
      .then(data => { setGeoData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const pathGenerator = useMemo(() => {
    if (!geoData) return null;
    const projection = geoMercator().fitExtent([[10, 10], [490, 690]], geoData);
    return geoPath().projection(projection);
  }, [geoData]);

  const stats = selectedDistrict ? districtsData[selectedDistrict] : null;

  return (
    <section
      id="map"
      style={{
        background: 'linear-gradient(160deg, #0a1628 0%, #0d2137 40%, #0a2e1a 100%)',
        borderRadius: '2rem',
        padding: '3rem',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blurs */}
      <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'400px', height:'400px', background:'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'300px', height:'300px', background:'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />

      {/* Header */}
      <div style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg, #10b981, #059669)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>🗺️</div>
          <span style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.2em', color:'#10b981', textTransform:'uppercase' }}>Agricultural Intelligence Map</span>
        </div>
        <h2 style={{ fontSize:'2.25rem', fontWeight:800, color:'#ffffff', lineHeight:1.1, margin:0 }}>
          Bangladesh <span style={{ color:'#10b981' }}>64 Districts</span>
        </h2>
        <p style={{ color:'rgba(255,255,255,0.4)', marginTop:'0.5rem', fontSize:'0.95rem' }}>
          Click any district to explore its unique agricultural profile
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', position:'relative', zIndex:10 }}>

        {/* ── Map Panel ── */}
        <div style={{
          background:'rgba(255,255,255,0.03)',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:'1.5rem',
          padding:'1.5rem',
          position:'relative',
        }}>
          {/* Status badge */}
          <div style={{
            position:'absolute', top:'1rem', left:'50%', transform:'translateX(-50%)',
            background:'rgba(0,0,0,0.5)', backdropFilter:'blur(10px)',
            border:'1px solid rgba(16,185,129,0.3)', borderRadius:'100px',
            padding:'0.35rem 1rem',
            display:'flex', alignItems:'center', gap:'0.5rem',
            fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.6)', letterSpacing:'0.15em', textTransform:'uppercase',
            zIndex:20, whiteSpace:'nowrap',
          }}>
            <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#10b981', boxShadow:'0 0 8px #10b981' }} />
            ADM2 Precision Active
          </div>

          {loading ? (
            <div style={{ height:'500px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
              <div style={{
                width:'48px', height:'48px', borderRadius:'50%',
                border:'4px solid rgba(16,185,129,0.2)',
                borderTopColor:'#10b981',
                animation:'spin 0.8s linear infinite',
              }} />
              <span style={{ color:'rgba(255,255,255,0.4)', fontSize:'12px', textTransform:'uppercase', letterSpacing:'0.1em' }}>Loading Map...</span>
            </div>
          ) : (
            <div style={{ position:'relative', marginTop:'2.5rem' }}>
              {hoveredDistrict && (
                <div style={{
                  position:'absolute', top:'-0.5rem', left:'50%', transform:'translateX(-50%)',
                  background:'#10b981', color:'#fff',
                  padding:'0.4rem 1rem', borderRadius:'100px',
                  fontSize:'12px', fontWeight:700, whiteSpace:'nowrap', zIndex:30,
                  boxShadow:'0 4px 20px rgba(16,185,129,0.4)',
                }}>
                  {districtsData[hoveredDistrict]?.bn || hoveredDistrict}
                  {districtsData[hoveredDistrict]?.name ? ` · ${districtsData[hoveredDistrict].name}` : ''}
                </div>
              )}
              <svg viewBox="0 0 500 700" style={{ width:'100%', display:'block' }}>
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                {geoData && pathGenerator && geoData.features.map((feature, i) => {
                  const key = getDistrictKey(feature.properties.shapeName);
                  const isSelected = selectedDistrict === key;
                  const isHovered = hoveredDistrict === key;
                  const d = pathGenerator(feature);
                  if (!d) return null;
                  return (
                    <path
                      key={i}
                      d={d}
                      onClick={() => setSelectedDistrict(key)}
                      onMouseEnter={() => setHoveredDistrict(key)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      fill={
                        isSelected ? '#10b981' :
                        isHovered ? 'rgba(16,185,129,0.45)' :
                        'rgba(16,185,129,0.15)'
                      }
                      stroke={
                        isSelected ? '#34d399' :
                        isHovered ? 'rgba(52,211,153,0.8)' :
                        'rgba(16,185,129,0.4)'
                      }
                      strokeWidth={isSelected ? 1.5 : 0.7}
                      filter={isSelected ? 'url(#glow)' : undefined}
                      style={{ cursor:'pointer', transition:'fill 0.2s ease, stroke 0.2s ease' }}
                    />
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        {/* ── Detail Panel ── */}
        <div>
          {!stats ? (
            /* Empty state */
            <div style={{
              height:'100%', minHeight:'400px',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              border:'1px dashed rgba(255,255,255,0.1)',
              borderRadius:'1.5rem',
              padding:'2rem',
              textAlign:'center',
            }}>
              <div style={{
                width:'80px', height:'80px', borderRadius:'50%',
                background:'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
                border:'1px solid rgba(16,185,129,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'2.5rem', marginBottom:'1.5rem',
              }}>🗺️</div>
              <h3 style={{ color:'#ffffff', fontWeight:700, fontSize:'1.25rem', margin:'0 0 0.5rem' }}>Select a District</h3>
              <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.875rem', maxWidth:'220px', lineHeight:1.6 }}>
                Click on any district on the map to view agricultural intelligence data
              </p>
              <div style={{ marginTop:'2rem', display:'flex', gap:'0.5rem', flexWrap:'wrap', justifyContent:'center' }}>
                {['Dhaka', 'Sylhet', 'Khulna', 'Rajshahi'].map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDistrict(d)}
                    style={{
                      background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)',
                      color:'#10b981', borderRadius:'100px', padding:'0.35rem 0.75rem',
                      fontSize:'12px', fontWeight:600, cursor:'pointer',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* District card */
            <div style={{
              background:'rgba(255,255,255,0.04)',
              border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:'1.5rem',
              overflow:'hidden',
              height:'100%',
            }}>
              {/* Card header */}
              <div style={{
                background:'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
                borderBottom:'1px solid rgba(255,255,255,0.07)',
                padding:'1.5rem 2rem',
                display:'flex', alignItems:'center', gap:'1rem',
              }}>
                <div style={{
                  width:'56px', height:'56px', borderRadius:'14px',
                  background:'linear-gradient(135deg, #10b981, #059669)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1.75rem', flexShrink:0,
                }}>🌾</div>
                <div>
                  <h4 style={{ color:'#fff', fontWeight:800, fontSize:'2rem', margin:0, lineHeight:1 }}>{stats.bn}</h4>
                  <p style={{ color:'#10b981', fontWeight:600, fontSize:'11px', letterSpacing:'0.15em', textTransform:'uppercase', margin:'0.25rem 0 0' }}>{stats.name} · District Intel</p>
                </div>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  style={{
                    marginLeft:'auto', width:'32px', height:'32px',
                    borderRadius:'50%', background:'rgba(255,255,255,0.08)',
                    border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)',
                    cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center',
                  }}
                >✕</button>
              </div>

              {/* Data rows */}
              <div style={{ padding:'1.5rem 2rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
                <StatCard icon="🌱" label="Major Crops" value={stats.crops?.join(', ')} color="#10b981" />
                <StatCard icon="🪨" label="Soil Profile" value={stats.soil} color="#f59e0b" />
                <StatCard icon="⚡" label="Climate Risk" value={stats.risk} color="#ef4444" />
                <StatCard icon="💧" label="Irrigation" value={stats.irrigation} color="#3b82f6" />
              </div>

              {/* CTA */}
              <div style={{ padding:'0 2rem 1.5rem' }}>
                <button
                  onClick={() => setIsReportOpen(true)}
                  style={{
                    width:'100%',
                    background:'linear-gradient(135deg, #10b981, #059669)',
                    color:'#fff', fontWeight:700, fontSize:'15px',
                    border:'none', borderRadius:'1rem',
                    padding:'1rem', cursor:'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem',
                    boxShadow:'0 8px 30px rgba(16,185,129,0.35)',
                    transition:'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(16,185,129,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 30px rgba(16,185,129,0.35)'; }}
                >
                  <span>📊</span> Generate Full Intelligence Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {stats && (
        <DistrictReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} district={stats} />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'1rem',
      background:'rgba(255,255,255,0.03)',
      border:'1px solid rgba(255,255,255,0.06)',
      borderRadius:'1rem', padding:'0.875rem 1rem',
    }}>
      <div style={{
        width:'42px', height:'42px', borderRadius:'10px', flexShrink:0,
        background:`${color}18`, border:`1px solid ${color}30`,
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem',
      }}>{icon}</div>
      <div>
        <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:'2px' }}>{label}</div>
        <div style={{ color:'#fff', fontWeight:600, fontSize:'0.95rem' }}>{value}</div>
      </div>
    </div>
  );
}
