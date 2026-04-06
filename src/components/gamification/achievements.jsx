// Achievement definitions

export const ACHIEVEMENTS = [
  // Beginner achievements
  {
    id: 'first_session',
    name: 'First Steps',
    description: 'Complete your first japa session',
    icon: '🌱',
    xpReward: 50,
    condition: (stats) => stats.sessionsCompleted >= 1
  },
  {
    id: 'first_hundred',
    name: 'Century',
    description: 'Reach 100 total taps',
    icon: '💯',
    xpReward: 75,
    condition: (stats) => stats.totalTaps >= 100
  },
  {
    id: 'first_streak',
    name: 'Getting Consistent',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    xpReward: 100,
    condition: (stats) => stats.streak >= 3
  },
  
  // Intermediate achievements
  {
    id: 'ten_sessions',
    name: 'Devoted Practitioner',
    description: 'Complete 10 sessions',
    icon: '🙏',
    xpReward: 150,
    condition: (stats) => stats.sessionsCompleted >= 10
  },
  {
    id: 'thousand_taps',
    name: 'Thousand Chants',
    description: 'Reach 1,000 total taps',
    icon: '⭐',
    xpReward: 200,
    condition: (stats) => stats.totalTaps >= 1000
  },
  {
    id: 'week_streak',
    name: 'Weekly Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🌟',
    xpReward: 250,
    condition: (stats) => stats.streak >= 7
  },
  
  // Advanced achievements
  {
    id: 'fifty_sessions',
    name: 'Meditation Master',
    description: 'Complete 50 sessions',
    icon: '🧘',
    xpReward: 300,
    condition: (stats) => stats.sessionsCompleted >= 50
  },
  {
    id: 'ten_thousand_taps',
    name: 'Ten Thousand Mantras',
    description: 'Reach 10,000 total taps',
    icon: '💎',
    xpReward: 500,
    condition: (stats) => stats.totalTaps >= 10000
  },
  {
    id: 'month_streak',
    name: 'Monthly Dedication',
    description: 'Maintain a 30-day streak',
    icon: '🏆',
    xpReward: 750,
    condition: (stats) => stats.streak >= 30
  },
  
  // Elite achievements
  {
    id: 'hundred_sessions',
    name: 'Enlightened One',
    description: 'Complete 100 sessions',
    icon: '✨',
    xpReward: 1000,
    condition: (stats) => stats.sessionsCompleted >= 100
  },
  {
    id: 'hundred_thousand_taps',
    name: 'Legendary Chanter',
    description: 'Reach 100,000 total taps',
    icon: '👑',
    xpReward: 2000,
    condition: (stats) => stats.totalTaps >= 100000
  },
  {
    id: 'year_streak',
    name: 'Eternal Flame',
    description: 'Maintain a 365-day streak',
    icon: '🔱',
    xpReward: 5000,
    condition: (stats) => stats.streak >= 365
  },
  
  // Combo achievements
  {
    id: 'combo_ten',
    name: 'Combo Starter',
    description: 'Reach a 10-tap combo',
    icon: '⚡',
    xpReward: 50,
    condition: (stats) => stats.maxCombo >= 10
  },
  {
    id: 'combo_fifty',
    name: 'Combo Expert',
    description: 'Reach a 50-tap combo',
    icon: '💥',
    xpReward: 150,
    condition: (stats) => stats.maxCombo >= 50
  },
  {
    id: 'combo_hundred',
    name: 'Combo Master',
    description: 'Reach a 100-tap combo',
    icon: '🌊',
    xpReward: 300,
    condition: (stats) => stats.maxCombo >= 100
  }
];

/**
 * Check which achievements have been unlocked
 * @param {Object} stats - User statistics
 * @param {Object} currentAchievements - Currently unlocked achievements
 * @returns {Array} Newly unlocked achievements
 */
export function checkAchievements(stats, currentAchievements = {}) {
  const newlyUnlocked = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (!currentAchievements[achievement.id] && achievement.condition(stats)) {
      newlyUnlocked.push(achievement);
    }
  }
  
  return newlyUnlocked;
}
