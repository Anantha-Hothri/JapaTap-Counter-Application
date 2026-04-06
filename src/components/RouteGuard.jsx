import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

/**
 * RouteGuard - Handles routing logic for first-time visitors and authentication
 * 
 * Logic:
 * 1. First-time visitor (no localStorage flag) → Welcome page
 * 2. Returning visitor, not logged in, not guest → Welcome page
 * 3. Logged in OR guest mode → Home page (or requested page)
 */
export default function RouteGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth to finish loading
      if (isLoadingAuth) {
        return;
      }

      const hasVisited = localStorage.getItem('japa_hasVisited');
      const isGuestMode = localStorage.getItem('japa_guestMode') === 'true';
      const currentPath = location.pathname;

      // User is on Welcome page - allow it
      if (currentPath === '/Welcome' || currentPath === '/welcome') {
        setIsChecking(false);
        return;
      }

      // First-time visitor - redirect to Welcome
      if (!hasVisited) {
        console.log('First-time visitor - redirecting to Welcome');
        navigate('/Welcome', { replace: true });
        setIsChecking(false);
        return;
      }

      // Not first-time, but not authenticated and not in guest mode
      if (!isAuthenticated && !isGuestMode) {
        console.log('Not authenticated and not guest - redirecting to Welcome');
        navigate('/Welcome', { replace: true });
        setIsChecking(false);
        return;
      }

      // User is authenticated or in guest mode - allow access
      setIsChecking(false);
    };

    checkAccess();
  }, [isLoadingAuth, isAuthenticated, navigate, location.pathname]);

  // Show loading spinner while checking
  if (isLoadingAuth || isChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-800 font-medium">Loading JapaTap...</p>
        </div>
      </div>
    );
  }

  return children;
}
