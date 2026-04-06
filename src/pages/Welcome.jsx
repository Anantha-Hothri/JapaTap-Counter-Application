import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import AuthModal from '@/components/auth/AuthModal';

export default function Welcome() {
  const [phase, setPhase] = useState('splash'); // splash | choice
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = 'Welcome - JapaTap Counter';
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const isGuest = localStorage.getItem('japa_guestMode') === 'true';
      try {
        const authed = await base44.auth.isAuthenticated();
        if (authed || isGuest) {
          window.location.href = createPageUrl('Home');
        } else {
          setTimeout(() => setPhase('choice'), 2500);
        }
      } catch (error) {
        // Base44 not configured - go straight to choice or home if already guest
        if (isGuest) {
          window.location.href = createPageUrl('Home');
        } else {
          setTimeout(() => setPhase('choice'), 2500);
        }
      }
    };
    checkAuth();
  }, []);

  const continueAsGuest = () => {
    localStorage.setItem('japa_guestMode', 'true');
    window.location.href = createPageUrl('Home');
  };

  const goToLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    window.location.href = createPageUrl('Home');
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 40%, #92400e 100%)' }}>

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-yellow-200/40 blur-3xl" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange-400/40 blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {/* SPLASH */}
        {phase === 'splash' && (
          <motion.div key="splash" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6 text-center px-8 z-10">
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl">🧘</motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">JapaTap</h1>
              <p className="text-white/80 text-lg mt-2">Your meditation companion</p>
            </div>
            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-8 h-1 rounded-full bg-white/60 mt-4" />
          </motion.div>
        )}

        {/* CHOICE */}
        {phase === 'choice' && (
          <motion.div key="choice" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm px-6 z-10 flex flex-col items-center gap-6">

            {/* Logo small */}
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="text-5xl">🧘</div>
              <h1 className="text-3xl font-bold text-white drop-shadow">Welcome to JapaTap!</h1>
              <p className="text-white/70 text-center text-sm">Start your meditation journey today</p>
            </div>

            {/* Continue as Guest */}
            <motion.button whileTap={{ scale: 0.97 }} onClick={continueAsGuest}
              className="w-full py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 text-white font-semibold text-lg hover:bg-white/30 transition-all">
              <div className="flex flex-col items-center gap-1">
                <span>Continue as Guest</span>
                <span className="text-white/60 text-xs font-normal">Free features only</span>
              </div>
            </motion.button>

            {/* Create Account */}
            <motion.button whileTap={{ scale: 0.97 }} onClick={goToLogin}
              className="w-full py-4 rounded-2xl bg-white text-amber-800 font-semibold text-lg hover:bg-amber-50 transition-all shadow-xl">
              <div className="flex flex-col items-center gap-1">
                <span>Create Account / Login</span>
                <span className="text-amber-600 text-xs font-normal">Access all features + Pro</span>
              </div>
            </motion.button>

            <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-sm text-white/80 space-y-2">
              <div className="flex justify-between">
                <span>Basic counting &amp; goals</span>
                <span>✅ Free</span>
              </div>
              <div className="flex justify-between">
                <span>Streak tracking</span>
                <span>✅ Login required</span>
              </div>
              <div className="flex justify-between">
                <span>Statistics &amp; history</span>
                <span>✅ Login required</span>
              </div>
              <div className="flex justify-between">
                <span>🔋 Battery Saver Mode</span>
                <span>✅ Free</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        initialMode="signup"
      />
    </div>
  );
}