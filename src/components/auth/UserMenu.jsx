import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, LogIn } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function UserMenu({ stopPropagation = true }) {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(authed => {
      if (!authed) setIsGuest(true);
    });
    base44.auth.me().then(u => {
      setUser(u);
    }).catch(() => {});
  }, []);

  const handleClick = (e) => {
    if (stopPropagation) e.stopPropagation();
    setOpen(o => !o);
  };

  const logout = (e) => {
    e.stopPropagation();
    base44.auth.logout(createPageUrl('Welcome'));
  };

  const goLogin = (e) => {
    e.stopPropagation();
    base44.auth.redirectToLogin(createPageUrl('Home'));
  };

  return (
    <div className="relative">
      {/* Avatar button */}
      <button onClick={handleClick}
        className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white/90 hover:bg-white/30 transition-all active:scale-95 flex items-center gap-1.5">
        {<User className="w-4 h-4" />}
        <span className="text-xs font-medium hidden sm:inline">
          {user ? (user.full_name?.split(' ')[0] || 'Account') : isGuest ? 'Guest' : ''}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ duration: 0.15 }}
              onClick={e => e.stopPropagation()}
              className="absolute right-0 top-12 z-40 w-52 bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden"
            >
              {user ? (
                <>
                  <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
                    <div className="font-semibold text-amber-900 text-sm truncate">{user.full_name || user.email}</div>
                    <div className="text-amber-600 text-xs truncate">{user.email}</div>
  
                  </div>

                  <button onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
                    <div className="font-semibold text-amber-900 text-sm">Guest Mode</div>
                    <div className="text-amber-600 text-xs">Sign in to unlock more features</div>
                  </div>
                  <button onClick={goLogin}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-amber-700 hover:bg-amber-50 transition-colors">
                    <LogIn className="w-4 h-4" />
                    Sign In / Register
                  </button>

                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}