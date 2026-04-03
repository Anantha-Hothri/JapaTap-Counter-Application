import React from 'react';
import { motion } from 'framer-motion';
import { Battery, Zap, Clock, Hand } from 'lucide-react';

// Estimates based on research:
// Normal mode (screen on, full brightness): ~150 µAh per tap
// Battery saver mode (black screen): ~45 µAh per tap → ~70% savings
const NORMAL_UAH_PER_TAP = 150;
const SAVER_UAH_PER_TAP = 45;
const SAVINGS_PERCENT = Math.round(((NORMAL_UAH_PER_TAP - SAVER_UAH_PER_TAP) / NORMAL_UAH_PER_TAP) * 100);

function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function getComparison(mAhSaved) {
  if (mAhSaved >= 3000) return 'Enough to fully charge your phone once! 🔋';
  if (mAhSaved >= 1000) return 'Equivalent to ~4 hours of screen time! ⏰';
  if (mAhSaved >= 500)  return 'About 2 hours of extra battery life! 💪';
  if (mAhSaved >= 100)  return 'About 30 minutes of extra usage! ✨';
  if (mAhSaved >= 10)   return 'Every bit of saving counts! 🌱';
  return 'Keep going to save more! 🌱';
}

export default function BatterySaverSummary({ session, onClose, updateStats, currentMahSaved = 0 }) {
  if (!session) return null;

  const savedUah = (NORMAL_UAH_PER_TAP - SAVER_UAH_PER_TAP) * session.tapCount;
  const savedMah = (savedUah / 1000).toFixed(1);
  const usedMah = ((SAVER_UAH_PER_TAP * session.tapCount) / 1000).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/70 flex items-end justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-gray-950 rounded-3xl p-6 border border-white/10 text-white"
      >
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-xl font-bold">Session Complete!</h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 rounded-2xl p-3 text-center">
            <Hand className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-xl font-bold">{session.tapCount.toLocaleString()}</div>
            <div className="text-white/50 text-xs">Taps</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 text-center">
            <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <div className="text-xl font-bold">{formatDuration(session.durationMs)}</div>
            <div className="text-white/50 text-xs">Duration</div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 text-center">
            <Battery className="w-4 h-4 text-red-400 mx-auto mb-1" />
            <div className="text-xl font-bold">{usedMah} mAh</div>
            <div className="text-white/50 text-xs">Battery Used</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-3 text-center">
            <Zap className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <div className="text-xl font-bold text-green-400">{savedMah} mAh</div>
            <div className="text-white/50 text-xs">Saved (~{SAVINGS_PERCENT}%)</div>
          </div>
        </div>

        {/* Comparison */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-3 mb-5 text-center text-sm text-green-300">
          {getComparison(parseFloat(savedMah))}
        </div>

        <button
          onClick={() => {
            updateStats && updateStats({ mAhSaved: currentMahSaved + parseFloat(savedMah) });
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:from-amber-400 hover:to-orange-400 transition-all"
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
}