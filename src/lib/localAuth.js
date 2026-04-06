/**
 * Local Authentication System
 * A simple localStorage-based authentication for standalone deployment
 */

const STORAGE_KEYS = {
  USER: 'japa_user',
  GUEST_MODE: 'japa_guestMode',
  STATS: 'japa_stats'
};

/**
 * Local Auth API - mimics Base44 API structure
 */
export const localAuth = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: async () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user !== null;
  },

  /**
   * Get current user
   */
  me: async () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) {
      throw new Error('Not authenticated');
    }
    return JSON.parse(userStr);
  },

  /**
   * Update current user
   */
  updateMe: async (updates) => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) {
      throw new Error('Not authenticated');
    }
    const user = JSON.parse(userStr);
    const updatedUser = { ...user, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    return updatedUser;
  },

  /**
   * Login user (simplified - just stores user data)
   */
  login: async (email, name) => {
    const user = {
      id: Date.now().toString(),
      email: email || 'guest@japatap.local',
      full_name: name || 'Guest User',
      created_at: new Date().toISOString(),
      // Stats fields
      totalTaps: 0,
      sessionsCompleted: 0,
      streak: 0,
      totalXp: 0,
      maxCombo: 0,
      mAhSaved: 0,
      lastSessionDate: null,
      lastLoginDate: new Date().toISOString(),
      dailyHistory: '[]'
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.removeItem(STORAGE_KEYS.GUEST_MODE);
    return user;
  },

  /**
   * Logout user
   */
  logout: async (redirectUrl) => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  },

  /**
   * Enable guest mode
   */
  enableGuestMode: () => {
    localStorage.setItem(STORAGE_KEYS.GUEST_MODE, 'true');
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * Check if in guest mode
   */
  isGuestMode: () => {
    return localStorage.getItem(STORAGE_KEYS.GUEST_MODE) === 'true';
  },

  /**
   * Redirect to login (for standalone app, just show modal)
   */
  redirectToLogin: (returnUrl) => {
    // For standalone app, we'll use a simple prompt
    // In production, you'd show a proper login modal
    return returnUrl;
  }
};

/**
 * App logs stub (for compatibility)
 */
export const localAppLogs = {
  logUserInApp: async (pageName) => {
    // Silently succeed - just for compatibility
    console.log('Page view:', pageName);
  }
};

/**
 * Analytics stub (for compatibility)
 */
export const localAnalytics = {
  track: async (eventName, properties) => {
    // Silently succeed - just for compatibility
    console.log('Analytics event:', eventName, properties);
  }
};

/**
 * Create a local client that mimics Base44 structure
 */
export const createLocalClient = () => ({
  auth: localAuth,
  appLogs: localAppLogs,
  analytics: localAnalytics
});
