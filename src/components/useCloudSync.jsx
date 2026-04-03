import { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const DEBOUNCE_MS = 2000;

// Load all stats from the cloud user object
export async function loadStatsFromCloud() {
  const user = await base44.auth.me();
  return {
    totalTaps:         user.totalTaps         ?? 0,
    sessionsCompleted: user.sessionsCompleted  ?? 0,
    streak:            user.streak            ?? 0,
    totalXp:           user.totalXp           ?? 0,
    maxCombo:          user.maxCombo          ?? 0,
    mAhSaved:          user.mAhSaved          ?? 0,
    lastSessionDate:   user.lastSessionDate   ?? null,
    lastLoginDate:     user.lastLoginDate     ?? null,
    dailyHistory: (() => {
      try { return JSON.parse(user.dailyHistory || '[]'); } catch { return []; }
    })(),
  };
}

// Save stats object to cloud
export async function saveStatsToCloud(stats) {
  await base44.auth.updateMe({
    totalTaps:         stats.totalTaps,
    sessionsCompleted: stats.sessionsCompleted,
    streak:            stats.streak,
    totalXp:           stats.totalXp   ?? 0,
    maxCombo:          stats.maxCombo  ?? 0,
    mAhSaved:          stats.mAhSaved  ?? 0,
    lastSessionDate:   stats.lastSessionDate ?? null,
    lastLoginDate:     stats.lastLoginDate   ?? null,
    dailyHistory:      JSON.stringify((stats.dailyHistory ?? []).slice(-100)),
  });
}

/**
 * Hook that manages stats fully in cloud for logged-in users,
 * and in memory only for guests.
 * Returns: { stats, updateStats, isLoggedIn, loading }
 */
export function useStats() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTaps: 0, sessionsCompleted: 0, streak: 0,
    totalXp: 0, maxCombo: 0, mAhSaved: 0,
    lastSessionDate: null, lastLoginDate: null, dailyHistory: [],
  });

  const timerRef = useRef(null);
  const pendingRef = useRef(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async authed => {
      setIsLoggedIn(authed);
      if (authed) {
        const cloudStats = await loadStatsFromCloud();
        setStats(cloudStats);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateStats = useCallback((patch) => {
    setStats(prev => {
      const next = { ...prev, ...patch };
      pendingRef.current = next;
      if (isLoggedIn) {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          if (pendingRef.current) saveStatsToCloud(pendingRef.current).catch(() => {});
        }, DEBOUNCE_MS);
      }
      return next;
    });
  }, [isLoggedIn]);

  return { stats, updateStats, isLoggedIn, loading };
}