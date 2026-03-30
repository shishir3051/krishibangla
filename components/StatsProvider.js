'use client';
import { createContext, useContext } from 'react';
import useSWR from 'swr';

const StatsContext = createContext();

const fetcher = (...args) => fetch(...args).then(res => {
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
});

export function StatsProvider({ children }) {
  const { data: statsData, error, isLoading } = useSWR('/api/stats', fetcher, {
    refreshInterval: 60000, // Background poll every 60 seconds
    revalidateOnFocus: true, // Refresh instantly when user returns to the tab
    revalidateOnReconnect: true // Refresh when internet connection is restored
  });

  const loading = isLoading;

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
