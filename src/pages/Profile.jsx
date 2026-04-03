import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { getLevelFromXP } from '@/components/gamification/useGamification';
import { AVATAR_FRAMES, PROFILE_BADGES } from '@/components/gamification/unlockables';
import { ACHIEVEMENTS } from '@/components/gamification/achievements';

const load = (key, def) => { try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : def; } catch { return def; } };
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

export default function Profile() {
  const totalXp       = load('japa_totalXp', 0);
  const streak        = load('japa_streak', 0);
  const totalTaps     = load('japaTap_totalTaps', 0);
  const unlocked      = load('japa_achievements', {});
  const [selectedFrame, setSelectedFrame] = useState(() => load('japa_avatarFrame', 'none'));
  const [tooltip, setTooltip] = useState(null); // { type: 'badge'|'frame', item }

  const levelInfo = getLevelFromXP(totalXp);
  const unlockedAchIds = new Set(Object.keys(unlocked));

  // Determine which frames are available
  const frameAvailable = (frame) => {
    if (frame.unlockLevel && levelInfo.level >= frame.unlockLevel) return true;
    if (frame.unlockAchievement && unlockedAchIds.has(frame.unlockAchievement)) return true;
    return false;
  };

  const handleSelectFrame = (id) => {
    if (!frameAvailable(AVATAR_FRAMES.find(f => f.id === id))) return;
    setSelectedFrame(id);
    save('japa_avatarFrame', id);
  };

  // Earned badges
  const earnedBadges = PROFILE_BADGES.filter(b => unlockedAchIds.has(b.achievement));

  const currentFrame = AVATAR_FRAMES.find(f => f.id === selectedFrame) || AVATAR_FRAMES[0];

  const getAchievementForBadge = (badge) => ACHIEVEMENTS.find(a => a.id === badge.achievement);
  const getFrameUnlockText = (frame) => {
    if (!frame.unlockLevel && !frame.unlockAchievement) return 'Default frame';
    if (frame.unlockLevel) return `Reach Level ${frame.unlockLevel}`;
    const ach = ACHIEVEMENTS.find(a => a.id === frame.unlockAchievement);
    return ach ? `Achievement: ${ach.name} — ${ach.description}` : 'Unlock via achievement';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-md border-b border-white/10 px-4 py-4 flex items-center gap-3">
        <Link to={createPageUrl('Stats')} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Profile</h1>
      </div>

      <div className="p-4 space-y-6 pb-10">

        {/* Avatar display */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center py-6">
          <div className={`w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-5xl ${currentFrame.style} mb-4`}>
            🧘
          </div>
          <div className="text-xl font-bold">Level {levelInfo.level} Practitioner</div>
          <div className="text-white/60 text-sm mt-1">{totalXp.toLocaleString()} XP · {streak} day streak · {totalTaps.toLocaleString()} taps</div>

          {/* Badges row */}
          {earnedBadges.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap justify-center">
              {earnedBadges.map(b => (
                <div key={b.id} title={b.name} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-lg">
                  {b.icon}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Avatar Frames */}
        <div>
          <h2 className="font-bold text-sm text-white/70 uppercase tracking-wider mb-3">Avatar Frames</h2>
          <div className="grid grid-cols-3 gap-3">
            {AVATAR_FRAMES.map((frame, i) => {
              const available = frameAvailable(frame);
              const active = selectedFrame === frame.id;
              const unlockHint = frame.unlockLevel
                ? `Level ${frame.unlockLevel}`
                : frame.unlockAchievement
                  ? ACHIEVEMENTS.find(a => a.id === frame.unlockAchievement)?.name || 'Achievement'
                  : '';
              return (
                <motion.button
                  key={frame.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => {
                    if (!available) {
                      setTooltip({ type: 'frame', item: frame, earned: false });
                    } else {
                      handleSelectFrame(frame.id);
                    }
                  }}
                  onContextMenu={(e) => { e.preventDefault(); setTooltip({ type: 'frame', item: frame, earned: available }); }}
                  className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    active ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/20 bg-white/5'
                  } ${!available ? 'opacity-50' : 'hover:bg-white/10'}`}
                >
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-2xl ${available ? frame.style : 'grayscale'}`}>
                    🧘
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">{frame.name}</span>
                  {!available && (
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/40 rounded-full px-1.5 py-0.5">
                      <Lock className="w-2.5 h-2.5 text-white/70" />
                      <span className="text-white/70 text-[9px]">{unlockHint}</span>
                    </div>
                  )}
                  {active && <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-yellow-400" />}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Profile Badges */}
        <div>
          <h2 className="font-bold text-sm text-white/70 uppercase tracking-wider mb-3">Badges ({earnedBadges.length}/{PROFILE_BADGES.length})</h2>
          <div className="grid grid-cols-4 gap-3">
            {PROFILE_BADGES.map((b, i) => {
              const earned = unlockedAchIds.has(b.achievement);
              const ach = getAchievementForBadge(b);
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setTooltip(tooltip?.item?.id === b.id ? null : { type: 'badge', item: b, earned, ach })}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-pointer active:scale-95 transition-transform ${earned ? 'border-white/20 bg-white/10' : 'border-white/10 bg-white/5 opacity-50'}`}
                >
                  <div className={`text-2xl ${!earned ? 'grayscale' : ''}`}>{earned ? b.icon : '🔒'}</div>
                  <span className="text-[10px] text-center text-white/70 leading-tight">{b.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Tooltip / Info popup */}
      <AnimatePresence>
        {tooltip && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setTooltip(null)} />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-6 left-4 right-4 z-50 bg-gray-900 rounded-2xl p-5 border border-white/20 shadow-2xl"
            >
              <button onClick={() => setTooltip(null)} className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-white/20">
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{tooltip.earned ? tooltip.item.icon : '🔒'}</span>
                <div>
                  <div className="font-bold text-white">{tooltip.item.name}</div>
                  {tooltip.earned
                    ? <div className="text-green-400 text-sm font-medium">✅ Unlocked!</div>
                    : <div className="text-amber-400 text-sm font-medium">Locked</div>
                  }
                </div>
              </div>
              {tooltip.type === 'badge' && tooltip.ach && (
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-white/60 text-xs uppercase tracking-wider mb-1">How to unlock</div>
                  <div className="text-white text-sm">{tooltip.ach.description}</div>
                </div>
              )}
              {tooltip.type === 'frame' && (
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-white/60 text-xs uppercase tracking-wider mb-1">How to unlock</div>
                  <div className="text-white text-sm">{getFrameUnlockText(tooltip.item)}</div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}