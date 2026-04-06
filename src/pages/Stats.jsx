import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useStats } from '@/components/useCloudSync.jsx';
import BatterySavingsTab from '@/components/BatterySavingsTab.jsx';
import { base44 } from '@/api/base44Client';
import AuthModal from '@/components/auth/AuthModal';

export default function Stats() {
  const [tab, setTab] = useState('overview');
  const { stats, loading, isLoggedIn } = useStats();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const streak       = stats.streak || 0;
  const totalTaps    = stats.totalTaps || 0;
  const sessions     = stats.sessionsCompleted || 0;
  const dailyHistory = stats.dailyHistory || [];
  const mAhSaved     = stats.mAhSaved || 0;

  const chartData = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const found = dailyHistory.find(h => h.date === key);
      days.push({
        label: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        taps: found?.taps || 0,
        sessions: found?.sessions || 0,
      });
    }
    return days;
  }, [dailyHistory]);

  const heatmapData = useMemo(() => {
    const weeks = [];
    for (let w = 9; w >= 0; w--) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date();
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        const key = date.toDateString();
        const found = dailyHistory.find(h => h.date === key);
        week.push({ date: key, taps: found?.taps || 0, label: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }) });
      }
      weeks.push(week);
    }
    return weeks;
  }, [dailyHistory]);

  const maxDayTaps = Math.max(...heatmapData.flat().map(d => d.taps), 1);

  const getHeatColor = (taps) => {
    if (!taps) return 'bg-white/10';
    const ratio = taps / maxDayTaps;
    if (ratio > 0.75) return 'bg-amber-500';
    if (ratio > 0.5)  return 'bg-amber-400/80';
    if (ratio > 0.25) return 'bg-amber-300/60';
    return 'bg-amber-200/40';
  };

  const tabs = ['overview', 'charts', 'battery'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white flex flex-col items-center justify-center p-6 text-center gap-6">
        <div className="text-6xl">📊</div>
        <h1 className="text-2xl font-bold">Login to See Statistics</h1>
        <p className="text-white/60 text-sm">Your streak, history and charts are saved to your account.</p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 font-semibold transition-all"
        >Sign In / Register</button>
        <Link to="/" className="text-white/40 text-sm underline">Back to Counter</Link>

        <AuthModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => window.location.reload()}
          initialMode="signup"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white">
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-md border-b border-white/10 px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <Link to={createPageUrl('Home')} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold flex-1">Statistics</h1>
        </div>
        <div className="flex gap-1 bg-white/10 rounded-xl p-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4 pb-8">

        {tab === 'overview' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '👆', label: 'Total Taps', value: totalTaps.toLocaleString() },
                { icon: '🔥', label: 'Current Streak', value: `${streak} days` },
                { icon: '🎯', label: 'Sessions Done', value: sessions },
                { icon: '📅', label: 'Days Active', value: dailyHistory.filter(h => h.taps > 0).length },
              ].map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-xl font-bold">{s.value}</div>
                  <div className="text-white/60 text-xs mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔥</span>
                <div>
                  <div className="font-bold text-lg">{streak}-Day Streak</div>
                  <div className="text-white/60 text-sm">Keep it going!</div>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                  style={{ width: `${Math.min((streak / 30) * 100, 100)}%` }} />
              </div>
              <div className="flex justify-between text-xs text-white/50 mt-1.5">
                <span>{streak} days</span><span>30 days 🏆</span>
              </div>
            </motion.div>
          </>
        )}

        {tab === 'charts' && (
          <>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <h3 className="font-semibold text-white/80 mb-3 text-sm">Daily Taps (Last 14 Days)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#1c1917', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="taps" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <h3 className="font-semibold text-white/80 mb-3 text-sm">Sessions Over Time</h3>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#1c1917', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                  <Line type="monotone" dataKey="sessions" stroke="#fb923c" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <h3 className="font-semibold text-white/80 mb-3 text-sm">Activity Heatmap (10 Weeks)</h3>
              <div className="flex gap-1">
                {heatmapData.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1 flex-1">
                    {week.map((day, di) => (
                      <div key={di} title={`${day.label}: ${day.taps} taps`}
                        className={`aspect-square rounded-sm ${getHeatColor(day.taps)}`} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-white/40 mt-2">
                <span>10 weeks ago</span><span>Today</span>
              </div>
            </motion.div>
          </>
        )}

        {tab === 'battery' && (
          <BatterySavingsTab mAhSaved={mAhSaved} totalTaps={totalTaps} sessions={sessions} />
        )}
      </div>
    </div>
  );
}