import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, CheckCircle2 } from 'lucide-react';

const ACHIEVEMENTS = [
  { id: 'eco_warrior',    label: 'Eco Warrior',     desc: 'Save 100 mAh total',   threshold: 100,  icon: '🌿' },
  { id: 'green_champ',   label: 'Green Champion',   desc: 'Save 500 mAh total',   threshold: 500,  icon: '🌍' },
  { id: 'battery_master',label: 'Battery Master',   desc: 'Save 1000 mAh total',  threshold: 1000, icon: '⚡' },
  { id: 'planet_saver',  label: 'Planet Saver',     desc: 'Save 5000 mAh total',  threshold: 5000, icon: '🚀' },
];

function getComparison(mAh) {
  if (mAh >= 3000) return 'Enough to fully charge your phone once! 🔋';
  if (mAh >= 1000) return 'Equivalent to ~4 hours of screen time! ⏰';
  if (mAh >= 500)  return 'About 2 hours of extra battery life! 💪';
  if (mAh >= 100)  return 'About 30 minutes of extra usage! ✨';
  return 'Every bit counts! 🌱';
}

export default function BatterySavingsTab({ mAhSaved = 0, totalTaps = 0, sessions = 0 }) {
  const [copied, setCopied] = useState(false);

  const totalSaved = parseFloat(mAhSaved.toFixed(1));
  const avgSavingsPercent = 70; // fixed estimate (normal vs saver mode)
  const nextAchievement = ACHIEVEMENTS.find(a => totalSaved < a.threshold);
  const nextProgress = nextAchievement
    ? (totalSaved / nextAchievement.threshold) * 100
    : 100;

  const shareText = `I've saved ${totalSaved} mAh of battery using JapaTap's Battery Saver Mode! 🌍⚡\n\nThat's ~${avgSavingsPercent}% less battery per session!\n\n${sessions} meditation sessions, ${totalTaps.toLocaleString()} taps counted.\n\n#EcoMeditation #BatterySaver #JapaTap`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="space-y-4">

      {/* Hero savings card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-green-500/15 border border-green-500/30 rounded-2xl p-5 text-center">
        <div className="text-5xl mb-2">⚡</div>
        <div className="text-4xl font-bold text-green-400">{totalSaved} mAh</div>
        <div className="text-white/60 text-sm mt-1">Total battery saved</div>
        <div className="mt-3 text-sm text-green-300 bg-green-500/10 rounded-xl p-2">
          {getComparison(totalSaved)}
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
          className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
          <div className="text-xl font-bold">{sessions}</div>
          <div className="text-white/60 text-xs mt-0.5">Saver Sessions</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="bg-white/10 rounded-xl p-4 text-center border border-white/20">
          <div className="text-xl font-bold text-green-400">~{avgSavingsPercent}%</div>
          <div className="text-white/60 text-xs mt-0.5">Avg. Savings/Session</div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white/10 rounded-2xl p-4 border border-white/20">
        <h3 className="font-bold text-sm text-white/70 uppercase tracking-wider mb-3">Battery Achievements</h3>
        <div className="space-y-3">
          {ACHIEVEMENTS.map((a) => {
            const earned = totalSaved >= a.threshold;
            return (
              <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${earned ? 'bg-green-500/15 border border-green-500/25' : 'bg-white/5 border border-white/10'}`}>
                <span className={`text-2xl ${earned ? '' : 'grayscale opacity-40'}`}>{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-sm ${earned ? 'text-white' : 'text-white/50'}`}>{a.label}</div>
                  <div className="text-white/40 text-xs">{a.desc}</div>
                  {!earned && (
                    <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-green-500/60 rounded-full transition-all"
                        style={{ width: `${Math.min((totalSaved / a.threshold) * 100, 100)}%` }} />
                    </div>
                  )}
                </div>
                {earned && <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Next milestone progress */}
      {nextAchievement && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/10 rounded-2xl p-4 border border-white/20">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-white/70">Next: {nextAchievement.label} {nextAchievement.icon}</span>
            <span className="text-white/50">{totalSaved} / {nextAchievement.threshold} mAh</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all"
              style={{ width: `${nextProgress}%` }} />
          </div>
        </motion.div>
      )}

      {/* Share */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <button onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all text-sm font-semibold text-white">
          {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Copied to clipboard!' : 'Share My Savings'}
        </button>
      </motion.div>
    </div>
  );
}