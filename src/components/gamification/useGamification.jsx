// XP and Leveling System

const LEVEL_XP_BASE = 100;
const LEVEL_XP_MULTIPLIER = 1.5;

/**
 * Calculate level from total XP
 * @param {number} xp - Total accumulated XP
 * @returns {{ level: number, currentLevelXp: number, xpForNextLevel: number, progress: number }}
 */
export function getLevelFromXP(xp) {
  let level = 1;
  let xpRequired = 0;
  
  while (xp >= xpRequired) {
    xpRequired += Math.floor(LEVEL_XP_BASE * Math.pow(LEVEL_XP_MULTIPLIER, level - 1));
    if (xp >= xpRequired) {
      level++;
    }
  }
  
  // Calculate XP for current level
  let previousLevelXp = 0;
  for (let i = 1; i < level; i++) {
    previousLevelXp += Math.floor(LEVEL_XP_BASE * Math.pow(LEVEL_XP_MULTIPLIER, i - 1));
  }
  
  const currentLevelXp = xp - previousLevelXp;
  const xpForNextLevel = Math.floor(LEVEL_XP_BASE * Math.pow(LEVEL_XP_MULTIPLIER, level - 1));
  const progress = (currentLevelXp / xpForNextLevel) * 100;
  
  return {
    level,
    currentLevelXp,
    xpForNextLevel,
    progress: Math.min(progress, 100)
  };
}

/**
 * Calculate XP rewards
 */
export const XP_REWARDS = {
  TAP: 1,
  SESSION_COMPLETE: 50,
  STREAK_DAY: 25,
  ACHIEVEMENT: 100,
  COMBO_BONUS: 5
};
