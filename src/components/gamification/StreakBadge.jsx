import React from 'react';
import { motion } from 'framer-motion';

const getStreakColor = (streak) => {
  if (streak >= 30) return 'from-purple-500 to-pink-500';
  if (streak >= 14) return 'from-red-500 to-rose-400';
  if (streak >= 7)  return 'from-orange-600 to-red-500';
  if (streak >= 3)  return 'from-orange-400 to-amber-400';
  return 'from-yellow-400 to-amber-300';
};

const getStreakShadow = (streak) => {
  if (streak >= 30) return 'shadow-purple-500/50';
  if (streak >= 14) return 'shadow-red-500/50';
  if (streak >= 7)  return 'shadow-orange-600/50';
  if (streak >= 3)  return 'shadow-orange-400/50';
  return 'shadow-amber-400/50';
};

export default function StreakBadge({ streak }) {
  const colorClass = getStreakColor(streak);
  const shadowClass = getStreakShadow(streak);

  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${colorClass} shadow-lg ${shadowClass} border border-white/20`}
    >
      <span className="text-base sm:text-lg leading-none" aria-label="Fire emoji">🔥</span>
      <span className="text-white font-black text-sm sm:text-base drop-shadow-md">{streak}</span>
      <span className="text-white/80 font-semibold text-[10px] sm:text-xs hidden xs:inline">day{streak !== 1 ? 's' : ''}</span>
    </motion.div>
  );
}