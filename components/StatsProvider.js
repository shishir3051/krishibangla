'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const StatsContext = createContext();

export function StatsProvider({ children }) {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/data/stats.json');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        // Add current time as counter reference
        data.serverTime = Date.now();
        setStatsData(data);
      } catch (err) {
        console.error('Stats fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <StatsContext.Provider value={{ statsData, loading, error }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
