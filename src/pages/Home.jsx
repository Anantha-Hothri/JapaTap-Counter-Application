import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, RotateCcw, Bell, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SettingsModal from '@/components/SettingsModal';
import BatterySaverMode from '@/components/BatterySaverMode';
import BatterySaverSummary from '@/components/BatterySaverSummary';
import BatterySaverLauncher from '@/components/BatterySaverLauncher';
import StreakBadge from '@/components/gamification/StreakBadge';
import UserMenu from '@/components/auth/UserMenu';
import { useStats } from '@/components/useCloudSync.jsx';

export default function Home() {
  const [count, setCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [targetNumber, setTargetNumber] = useState(null);
  const [selectedRingtone, setSelectedRingtone] = useState('bell1');
  const [customRingtoneUrl, setCustomRingtoneUrl] = useState(null);
  const [ripples, setRipples] = useState([]);
  const [bellRinging, setBellRinging] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState('gradient1');
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState(null);
  const [enableBellSound, setEnableBellSound] = useState(true);
  const [enableVibration, setEnableVibration] = useState(true);
  const [batterySaverActive, setBatterySaverActive] = useState(false);
  const [roundsMode, setRoundsMode] = useState(false);
  const [roundSize, setRoundSize] = useState(108);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [batterySaverMode, setBatterySaverMode] = useState('touch');
  const [batterySaverSession, setBatterySaverSession] = useState(null);
  const audioRef = useRef(null);

  const { stats, updateStats, loading } = useStats();



  // Daily login streak update (once stats are loaded)
  useEffect(() => {
    if (loading) return;
    const today = new Date().toDateString();
    if (stats.lastLoginDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = stats.lastLoginDate === yesterday ? (stats.streak || 0) + 1 : 1;
      updateStats({ streak: newStreak, lastLoginDate: today });
    }
  }, [loading]);

  const presetRingtones = {
    bell1:   'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
    bell2:   'https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3',
    chime:   'https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3',
    gong:    'https://assets.mixkit.co/active_storage/sfx/2866/2866-preview.mp3',
    crystal: 'https://assets.mixkit.co/active_storage/sfx/2871/2871-preview.mp3',
    tibetan: 'https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3',
  };

  const presetBackgrounds = {
    gradient1: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 25%, #f59e0b 50%, #d97706 75%, #92400e 100%)',
    gradient2: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 25%, #3b82f6 50%, #1d4ed8 75%, #1e3a8a 100%)',
    gradient3: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 25%, #ec4899 50%, #be185d 75%, #831843 100%)',
    gradient4: 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 25%, #10b981 50%, #059669 75%, #065f46 100%)',
    gradient5: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)',
    gradient6: 'linear-gradient(135deg, #064e3b 0%, #065f46 30%, #7c3aed 70%, #1e1b4b 100%)',
  };

  const themeRippleColors = {
    gradient1: 'rgba(245, 175, 25, 0.5)',
    gradient2: 'rgba(79, 172, 254, 0.5)',
    gradient3: 'rgba(250, 112, 154, 0.5)',
    gradient4: 'rgba(113, 178, 128, 0.5)',
    gradient5: 'rgba(99, 102, 241, 0.5)',
    gradient6: 'rgba(124, 58, 237, 0.5)',
    custom: 'rgba(102, 126, 234, 0.5)',
  };

  const themeProgressColors = {
    gradient1: 'linear-gradient(to right, #ff6b6b, #f5af19)',
    gradient2: 'linear-gradient(to right, #4facfe, #00f2fe)',
    gradient3: 'linear-gradient(to right, #fa709a, #fee140)',
    gradient4: 'linear-gradient(to right, #71b280, #134e5e)',
    gradient5: 'linear-gradient(to right, #6366f1, #a78bfa)',
    gradient6: 'linear-gradient(to right, #10b981, #7c3aed)',
    custom: 'linear-gradient(to right, #667eea, #764ba2)',
  };

  const getRippleColor = () => themeRippleColors[customBackgroundUrl ? 'custom' : selectedBackground] || themeRippleColors.gradient1;
  const getProgressBarStyle = () => ({ background: themeProgressColors[customBackgroundUrl ? 'custom' : selectedBackground] || themeProgressColors.gradient1 });

  const getBackgroundStyle = () => {
    if (customBackgroundUrl) {
      return { backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${customBackgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    const bg = presetBackgrounds[selectedBackground];
    if (bg.startsWith('http')) {
      return { backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return { background: bg };
  };

  const playBell = () => {
    if (!enableBellSound) return;
    const soundUrl = customRingtoneUrl || presetRingtones[selectedRingtone];
    if (soundUrl && audioRef.current) {
      audioRef.current.src = soundUrl;
      audioRef.current.play().catch(() => {});
      setBellRinging(true);
      setTimeout(() => setBellRinging(false), 1000);
    }
  };

  const vibrate = () => {
    if (enableVibration && 'vibrate' in navigator) navigator.vibrate(30);
  };

  const handleTap = (e) => {
    if (e.target.closest('.settings-btn') || e.target.closest('.reset-btn')) return;
    if (showSettings) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    const id = Date.now() + Math.random();
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);

    const newCount = count + 1;
    setCount(newCount);

    const today = new Date().toDateString();
    const hist = [...(stats.dailyHistory || [])];
    const idx = hist.findIndex(h => h.date === today);
    if (idx >= 0) { hist[idx] = { ...hist[idx], taps: (hist[idx].taps || 0) + 1 }; }
    else { hist.push({ date: today, taps: 1, sessions: 0 }); }
    updateStats({ totalTaps: (stats.totalTaps || 0) + 1, dailyHistory: hist.slice(-100) });

    vibrate();

    // Rounds Mode: ring at every multiple of roundSize
    if (roundsMode && newCount % roundSize === 0) {
      playBell();
      setCompletedRounds(Math.floor(newCount / roundSize));
      return;
    }

    if (!roundsMode && targetNumber && newCount === targetNumber) {
      playBell();
      const newSessions = (stats.sessionsCompleted || 0) + 1;
      const lastSession = stats.lastSessionDate;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = lastSession !== today
        ? (lastSession === yesterday ? (stats.streak || 0) + 1 : 1)
        : stats.streak;
      const histIdx = hist.findIndex(h => h.date === today);
      if (histIdx >= 0) { hist[histIdx] = { ...hist[histIdx], sessions: (hist[histIdx].sessions || 0) + 1 }; }
      else { hist.push({ date: today, taps: 0, sessions: 1 }); }
      updateStats({
        sessionsCompleted: newSessions,
        streak: newStreak,
        lastSessionDate: today,
        dailyHistory: hist.slice(-100),
      });
    }
  };

  const resetCount = (e) => {
    e.stopPropagation();
    setCount(0);
    setCompletedRounds(0);
  };

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden select-none touch-manipulation"
      onClick={handleTap}
      style={getBackgroundStyle()}
    >
      {/* Ripples */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ position: 'absolute', left: ripple.x - 30, top: ripple.y - 30, width: 60, height: 60, borderRadius: '50%', background: getRippleColor() }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange-300/40 blur-3xl" />
        <motion.div animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-yellow-200/30 blur-3xl" />
      </div>

      {/* Header - Mobile Optimized */}
      <div className="absolute top-0 left-0 right-0 z-20 p-3 sm:p-4">
        <div className="flex justify-between items-start gap-2">
          {/* Left side - Reset button */}
          <button
            onClick={resetCount}
            className="reset-btn p-2.5 sm:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white/90 hover:bg-white/30 transition-all active:scale-95 flex-shrink-0"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Right side - Main controls */}
          <div className="flex flex-col items-end gap-2 min-w-0 flex-1">
            {/* Top row - Primary actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
              <UserMenu />

              {/* Hide Saver button text on very small screens */}
              <BatterySaverLauncher onActivate={(mode) => { setBatterySaverMode(mode); setBatterySaverActive(true); }} />

              {/* Rounds toggle - compact on mobile */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={(e) => { e.stopPropagation(); setRoundsMode(r => !r); }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-semibold border transition-all backdrop-blur-md flex-shrink-0 ${
                  roundsMode
                    ? 'bg-amber-500/80 border-amber-400 text-white'
                    : 'bg-white/20 border-white/30 text-white/90 hover:bg-white/30'
                }`}
                title="Toggle Rounds Mode"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Rounds</span>
              </motion.button>

              {/* Target number indicator */}
              {targetNumber && (
                <div className="px-2 sm:px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white/90 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {targetNumber}
                </div>
              )}

              {/* Stats link */}
              <Link
                to={createPageUrl('Stats')}
                onClick={(e) => e.stopPropagation()}
                className="p-2.5 sm:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white/90 hover:bg-white/30 transition-all active:scale-95 flex-shrink-0"
              >
                <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>

              {/* Settings button */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowSettings(true); }}
                className="settings-btn p-2.5 sm:p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white/90 hover:bg-white/30 transition-all active:scale-95 flex-shrink-0"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Bottom row - Streak badge */}
            <StreakBadge streak={stats.streak || 0} />
          </div>
        </div>
      </div>

      {/* Main Counter */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
        {roundsMode && completedRounds > 0 && (
          <motion.div
            key={completedRounds}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30"
          >
            <span className="text-white/80 text-sm font-medium">🔔 Round</span>
            <span className="text-white font-bold text-xl">{completedRounds}</span>
            <span className="text-white/50 text-xs">completed</span>
          </motion.div>
        )}

        <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-white/60 text-sm font-medium tracking-wider uppercase mb-8">
          Tap anywhere to count
        </motion.p>

        <div className="relative">
          <AnimatePresence>
            {bellRinging && (
              <motion.div initial={{ scale: 1, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Bell className="w-20 h-20 text-yellow-200" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div key={count} initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 shadow-2xl flex items-center justify-center">
              <span
                className="font-bold text-white drop-shadow-lg"
                style={{
                  fontSize: count > 9999 ? '3rem' : count > 999 ? '4rem' : count > 99 ? '5rem' : '6rem',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  letterSpacing: '-0.02em'
                }}
              >
                {count.toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>

        {roundsMode && (
          <div className="mt-12 w-full max-w-xs px-4">
            <div className="h-3 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden border border-white/30">
              <motion.div
                animate={{ width: `${((count % roundSize) / roundSize) * 100}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="h-full shadow-lg"
                style={getProgressBarStyle()}
              />
            </div>
            <div className="mt-3 flex justify-between items-center text-white/70 text-sm font-medium">
              <span>{count % roundSize}</span>
              <span className="text-xs text-white/50">Round {completedRounds + 1}</span>
              <span>{roundSize}</span>
            </div>
          </div>
        )}
        {!roundsMode && targetNumber && (
          <div className="mt-12 w-full max-w-xs px-4">
            <div className="h-3 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden border border-white/30">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((count / targetNumber) * 100, 100)}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="h-full shadow-lg"
                style={getProgressBarStyle()}
              />
            </div>
            <div className="mt-3 flex justify-between items-center text-white/70 text-sm font-medium">
              <span>{count}</span>
              <span className="text-xs text-white/50">{Math.round((count / targetNumber) * 100)}%</span>
              <span>{targetNumber}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
        <p className="text-white/40 text-xs font-medium">JapaTap Counter</p>
      </div>

      <audio ref={audioRef} />

      {/* Battery Saver Mode overlay */}
      <AnimatePresence>
        {batterySaverActive && (
          <BatterySaverMode
            count={count}
            targetNumber={targetNumber}
            enableVibration={enableVibration}
            inputMode={batterySaverMode}
            onTap={() => {
              setCount(prev => {
                const newCount = prev + 1;
                updateStats({ totalTaps: (stats.totalTaps || 0) + 1 });
                if (targetNumber && newCount === targetNumber) {
                  playBell();
                  updateStats({ sessionsCompleted: (stats.sessionsCompleted || 0) + 1 });
                }
                return newCount;
              });
            }}
            onExit={(session) => { setBatterySaverActive(false); if (session && session.tapCount > 0) setBatterySaverSession(session); }}
          />
        )}
      </AnimatePresence>

      {batterySaverSession && (
        <AnimatePresence>
          <BatterySaverSummary
            session={batterySaverSession}
            onClose={() => setBatterySaverSession(null)}
            updateStats={updateStats}
            currentMahSaved={stats.mAhSaved || 0}
          />
        </AnimatePresence>
      )}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        targetNumber={targetNumber}
        setTargetNumber={setTargetNumber}
        selectedRingtone={selectedRingtone}
        setSelectedRingtone={setSelectedRingtone}
        customRingtoneUrl={customRingtoneUrl}
        setCustomRingtoneUrl={setCustomRingtoneUrl}
        presetRingtones={presetRingtones}
        selectedBackground={selectedBackground}
        setSelectedBackground={setSelectedBackground}
        customBackgroundUrl={customBackgroundUrl}
        setCustomBackgroundUrl={setCustomBackgroundUrl}
        presetBackgrounds={presetBackgrounds}
        enableBellSound={enableBellSound}
        setEnableBellSound={setEnableBellSound}
        enableVibration={enableVibration}
        setEnableVibration={setEnableVibration}
        totalTaps={stats.totalTaps || 0}
        sessionsCompleted={stats.sessionsCompleted || 0}
        onClearStats={() => updateStats({ totalTaps: 0, sessionsCompleted: 0, streak: 0, dailyHistory: [] })}
        onEnableBatterySaver={(mode) => { setBatterySaverMode(mode || 'touch'); setBatterySaverActive(true); }}
        roundsMode={roundsMode}
        setRoundsMode={setRoundsMode}
        roundSize={roundSize}
        setRoundSize={setRoundSize}
      />
    </div>
  );
}