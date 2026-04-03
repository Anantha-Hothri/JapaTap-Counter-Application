/**
 * BatterySaverLauncher
 *
 * Replaces the old VolumeButtonCounter button in the header.
 * Shows a bottom sheet letting the user pick:
 *   - Touch mode (tap the black screen)
 *   - Volume Up / Volume Down (hardware button via Media Session API)
 *
 * Activates BatterySaverMode with the chosen input method.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BatteryLow, X, Hand } from 'lucide-react';

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);

const MODES = [
  {
    id: 'touch',
    icon: Hand,
    label: 'Touch Screen',
    desc: 'Tap anywhere on the black screen to count',
    color: 'amber',
  },
];

export default function BatterySaverLauncher({ onActivate }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => localStorage.getItem('japa_bsMode') || 'touch');

  const handleActivate = () => {
    localStorage.setItem('japa_bsMode', selected);
    setOpen(false);
    onActivate(selected);
  };

  return (
    <>
      {/* Header button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all backdrop-blur-md bg-white/20 border-white/30 text-white/90 hover:bg-white/30"
        title="Battery Saver Mode"
      >
        <BatteryLow className="w-3.5 h-3.5 text-green-300" />
        <span>Saver</span>
      </motion.button>

      {/* Bottom sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950 rounded-t-3xl p-6 border-t border-white/10"
              onClick={e => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    <BatteryLow className="w-5 h-5 text-green-400" />
                    Battery Saver Mode
                  </h2>
                  <p className="text-white/50 text-sm mt-0.5">Choose how you want to count</p>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 rounded-full bg-white/10 text-white/60 hover:bg-white/20">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {MODES.map(mode => {
                  const Icon = mode.icon;
                  const active = selected === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setSelected(mode.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
                        ${active
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                        ${active ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/60'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={`font-semibold text-sm ${active ? 'text-white' : 'text-white/80'}`}>{mode.label}</div>
                        <div className="text-white/40 text-xs mt-0.5">{mode.desc}</div>
                      </div>
                      {active && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {(selected === 'vol_up' || selected === 'vol_down') && (
                <div className={`mb-4 p-3 rounded-xl text-xs ${isAndroid ? 'bg-green-500/10 border border-green-500/20 text-green-300' : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-300'}`}>
                  {isAndroid
                    ? '✅ Android: Works in Chrome with screen off via Media Session API.'
                    : isIOS
                      ? '⚠️ iOS: Screen must remain on. For best results, add to Home Screen.'
                      : '💻 Desktop: Volume key counting works via keyboard events.'}
                </div>
              )}

              <button
                onClick={handleActivate}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-base hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20"
              >
                Activate Battery Saver
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}