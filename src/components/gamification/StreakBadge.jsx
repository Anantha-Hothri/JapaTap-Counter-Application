import React from 'react';
import { motion } from 'framer-motion';

const getStreakColor = (streak) => {
  if (streak >= 30) return 'from-purple-500 to-pink-500';
  if (streak >= 14) return 'from-red-500 to-rose-400';
  if (streak >= 7)  return 'from-orange-600 to-red-500';
  if (streak >= 3)  return 'from-orange-400 to-amber-400';
  return 'from-yellow-400 to-amber-300';
};

export default function StreakBadge({ streak }) {
  const colorClass = getStreakColor(streak);

  return (
    <motion.div
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r ${colorClass} shadow-lg`}
    >
      <span className="text-base leading-none">🔥</span>
      <span className="text-white font-black text-sm">{streak}</span>
    </motion.div>
  );
}