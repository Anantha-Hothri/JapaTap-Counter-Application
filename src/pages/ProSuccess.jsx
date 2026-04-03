import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

const PRO_FEATURES = [
  'Blackout Mode',
  'Premium Themes',
  'Advanced Analytics',
  'Cloud Sync',
  'Ad-Free Experience',
  'Streak Freeze',
];

export default function ProSuccess() {
  useEffect(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ['#fbbf24', '#f59e0b', '#ef4444', '#8b5cf6'] });
  }, []);

  const paymentId = localStorage.getItem('japa_paymentId') || '';
  const plan = localStorage.getItem('japa_proPlan') || 'yearly';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white flex flex-col items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
        className="w-full max-w-sm text-center space-y-6">

        <div className="text-8xl">🎉</div>

        <div>
          <h1 className="text-3xl font-bold">Welcome to Pro!</h1>
          <p className="text-white/70 mt-2">Your premium features are now active</p>
        </div>

        {/* Receipt box */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Plan</span>
            <span className="font-semibold capitalize">{plan}</span>
          </div>
          {paymentId && (
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Payment ID</span>
              <span className="font-mono text-xs text-white/80 truncate max-w-[160px]">{paymentId}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Status</span>
            <span className="text-green-400 font-semibold">✓ Active</span>
          </div>
        </div>

        {/* Features unlocked */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-left">
          <h3 className="font-bold text-sm text-white/70 uppercase tracking-wider mb-3">Pro Features Unlocked</h3>
          <div className="space-y-2">
            {PRO_FEATURES.map(f => (
              <div key={f} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <Link to={createPageUrl('Home')}
          className="block w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-lg text-center shadow-xl hover:from-amber-300 hover:to-orange-400 transition-all">
          Start Using Pro Features 🚀
        </Link>
      </motion.div>
    </div>
  );
}