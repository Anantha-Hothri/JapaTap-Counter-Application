import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function BatterySaverMode({ count, targetNumber, onTap, onExit, enableVibration }) {
  const [showExitHint, setShowExitHint] = useState(false);
  const backHoldTimer = useRef(null);
  const sessionStartRef = useRef(Date.now());
  const sessionStartCountRef = useRef(count);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  // Keep audio session alive (screen wake hint)
  useEffect(() => {
    try {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const gain = audioCtxRef.current.createGain();
      gain.gain.value = 0.001;
      gain.connect(audioCtxRef.current.destination);
      const osc = audioCtxRef.current.createOscillator();
      osc.frequency.value = 1;
      osc.connect(gain);
      osc.start();
      oscRef.current = osc;
    } catch {}
    return () => {
      try { oscRef.current?.stop(); } catch {}
      try { audioCtxRef.current?.close(); } catch {}
    };
  }, []);

  const doTap = useCallback(() => {
    onTap();
    if (enableVibration && 'vibrate' in navigator) navigator.vibrate(50);
  }, [onTap, enableVibration]);

  const handleExit = useCallback(() => {
    const session = {
      tapCount: count - sessionStartCountRef.current,
      durationMs: Date.now() - sessionStartRef.current,
    };
    onExit(session);
  }, [onExit, count]);

  // Back/Escape: hold 2s to exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (!backHoldTimer.current) {
          setShowExitHint(true);
          backHoldTimer.current = setTimeout(() => handleExit(), 2000);
        }
        e.preventDefault();
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        clearTimeout(backHoldTimer.current);
        backHoldTimer.current = null;
        setShowExitHint(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
      if (backHoldTimer.current) clearTimeout(backHoldTimer.current);
    };
  }, [handleExit]);

  const handleScreenTap = useCallback((e) => {
    if (e.target.closest('[data-exit]')) return;
    doTap();
  }, [doTap]);

  const remaining = targetNumber ? Math.max(0, targetNumber - count) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none touch-manipulation"
      style={{ backgroundColor: '#000000' }}
      onClick={handleScreenTap}
    >
      {/* Hidden exit button */}
      <button
        data-exit
        onClick={(e) => { e.stopPropagation(); handleExit(); }}
        className="absolute top-4 right-4 p-2"
        style={{ color: 'rgba(255,255,255,0.05)', fontSize: '24px' }}
      >
        ✕
      </button>

      <div className="flex flex-col items-center gap-3 pointer-events-none">
        <span
          style={{
            fontSize: count > 9999 ? '72px' : count > 999 ? '96px' : '120px',
            color: 'rgba(255,255,255,0.20)',
            fontWeight: '300',
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {count.toLocaleString()}
        </span>

        {targetNumber && (
          <div className="flex flex-col items-center gap-1 mt-2">
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '18px' }}>
              Goal: {targetNumber}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '16px' }}>
              ({remaining} remaining)
            </span>
          </div>
        )}

        <span className="mt-12" style={{ color: 'rgba(255,255,255,0.10)', fontSize: '14px' }}>
          Tap anywhere to count
        </span>
      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <span style={{ color: 'rgba(255,255,255,0.05)', fontSize: '12px' }}>
          {showExitHint ? 'Keep holding to exit...' : 'Hold back to exit'}
        </span>
      </div>
    </motion.div>
  );
}