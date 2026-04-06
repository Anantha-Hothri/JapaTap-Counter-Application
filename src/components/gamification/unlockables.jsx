// Unlockable cosmetic items

// Avatar Frames
export const AVATAR_FRAMES = [
  {
    id: 'none',
    name: 'Default',
    description: 'No frame',
    borderClass: 'border-2 border-white/20',
    unlockLevel: null,
    unlockAchievement: null
  },
  {
    id: 'bronze',
    name: 'Bronze Frame',
    description: 'A simple bronze border',
    borderClass: 'border-4 border-amber-700',
    unlockLevel: 5,
    unlockAchievement: null
  },
  {
    id: 'silver',
    name: 'Silver Frame',
    description: 'A sleek silver border',
    borderClass: 'border-4 border-gray-400',
    unlockLevel: 10,
    unlockAchievement: null
  },
  {
    id: 'gold',
    name: 'Gold Frame',
    description: 'A prestigious gold border',
    borderClass: 'border-4 border-yellow-500',
    unlockLevel: 20,
    unlockAchievement: null
  },
  {
    id: 'platinum',
    name: 'Platinum Frame',
    description: 'An elegant platinum border',
    borderClass: 'border-4 border-blue-300',
    unlockLevel: 50,
    unlockAchievement: null
  },
  {
    id: 'diamond',
    name: 'Diamond Frame',
    description: 'A brilliant diamond border',
    borderClass: 'border-4 border-cyan-400 shadow-lg shadow-cyan-400/50',
    unlockLevel: null,
    unlockAchievement: 'ten_thousand_taps'
  },
  {
    id: 'fire',
    name: 'Eternal Flame',
    description: 'A fiery border for streak masters',
    borderClass: 'border-4 border-orange-500 shadow-lg shadow-orange-500/50',
    unlockLevel: null,
    unlockAchievement: 'year_streak'
  },
  {
    id: 'rainbow',
    name: 'Rainbow Frame',
    description: 'A colorful rainbow border',
    borderClass: 'border-4 border-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500',
    unlockLevel: null,
    unlockAchievement: 'hundred_sessions'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Frame',
    description: 'A mystical cosmic border',
    borderClass: 'border-4 border-purple-600 shadow-lg shadow-purple-600/50',
    unlockLevel: null,
    unlockAchievement: 'hundred_thousand_taps'
  }
];

// Profile Badges
export const PROFILE_BADGES = [
  {
    id: 'first_session_badge',
    name: 'Beginner',
    icon: '🌱',
    achievement: 'first_session'
  },
  {
    id: 'century_badge',
    name: 'Century',
    icon: '💯',
    achievement: 'first_hundred'
  },
  {
    id: 'streak_starter_badge',
    name: 'Streak Starter',
    icon: '🔥',
    achievement: 'first_streak'
  },
  {
    id: 'devoted_badge',
    name: 'Devoted',
    icon: '🙏',
    achievement: 'ten_sessions'
  },
  {
    id: 'thousand_badge',
    name: 'Thousand',
    icon: '⭐',
    achievement: 'thousand_taps'
  },
  {
    id: 'weekly_warrior_badge',
    name: 'Weekly Warrior',
    icon: '🌟',
    achievement: 'week_streak'
  },
  {
    id: 'master_badge',
    name: 'Master',
    icon: '🧘',
    achievement: 'fifty_sessions'
  },
  {
    id: 'ten_k_badge',
    name: 'Ten Thousand',
    icon: '💎',
    achievement: 'ten_thousand_taps'
  },
  {
    id: 'monthly_badge',
    name: 'Monthly Master',
    icon: '🏆',
    achievement: 'month_streak'
  },
  {
    id: 'enlightened_badge',
    name: 'Enlightened',
    icon: '✨',
    achievement: 'hundred_sessions'
  },
  {
    id: 'legendary_badge',
    name: 'Legendary',
    icon: '👑',
    achievement: 'hundred_thousand_taps'
  },
  {
    id: 'eternal_badge',
    name: 'Eternal',
    icon: '🔱',
    achievement: 'year_streak'
  },
  {
    id: 'combo_starter_badge',
    name: 'Combo Starter',
    icon: '⚡',
    achievement: 'combo_ten'
  },
  {
    id: 'combo_expert_badge',
    name: 'Combo Expert',
    icon: '💥',
    achievement: 'combo_fifty'
  },
  {
    id: 'combo_master_badge',
    name: 'Combo Master',
    icon: '🌊',
    achievement: 'combo_hundred'
  }
];
