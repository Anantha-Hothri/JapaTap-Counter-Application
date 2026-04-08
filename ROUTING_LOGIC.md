# JapaTap Routing Logic

## 🎯 Overview

The app implements a smart routing system that provides different experiences for first-time visitors vs. returning users.

---

## 📊 Routing Flow Diagram

```
User Opens App
     |
     ├─── First-time visitor? ──────────────> Welcome Page
     |    (no 'japa_hasVisited' flag)              |
     |                                              |
     |                                              ├─> Choose "Continue as Guest"
     |                                              |   └─> Mark visited + Set guest mode + Go to Home
     |                                              |
     |                                              └─> Choose "Sign In/Register"
     |                                                  └─> Mark visited + Show auth modal
     |                                                      └─> After login: Go to Home
     |
     └─── Returning visitor ────────────────> Check Authentication
          ('japa_hasVisited' exists)               |
                                                    |
                                                    ├─> Logged in? ──────────> Home Page
                                                    |
                                                    ├─> Guest mode? ─────────> Home Page
                                                    |
                                                    └─> Neither? ────────────> Welcome Page
```

---

## 🔑 Key Components

### 1. **RouteGuard** (`src/components/RouteGuard.jsx`)
- Wraps all routes in App.jsx
- Checks localStorage flags before allowing navigation
- Shows loading spinner while checking auth state
- Redirects users based on their status

### 2. **localStorage Flags**

| Flag | Purpose | Values |
|------|---------|--------|
| `japa_hasVisited` | Tracks if user has visited before | `"true"` or doesn't exist |
| `japa_guestMode` | Tracks if user chose guest mode | `"true"` or doesn't exist |

---

## 🚦 Routing Rules

### Rule 1: First-Time Visitors
**Condition:** No `japa_hasVisited` flag in localStorage

**Action:** Redirect to `/Welcome` page

**Example:**
```javascript
if (!hasVisited) {
  navigate('/Welcome', { replace: true });
}
```

---

### Rule 2: Returning Visitors (Not Authenticated)
**Condition:** 
- `japa_hasVisited` exists
- User is NOT authenticated
- User is NOT in guest mode

**Action:** Redirect to `/Welcome` page

**Example:**
```javascript
if (!isAuthenticated && !isGuestMode) {
  navigate('/Welcome', { replace: true });
}
```

---

### Rule 3: Authenticated or Guest Users
**Condition:** 
- User is authenticated (logged in)
- OR user is in guest mode

**Action:** Allow access to all pages (Home, Stats, etc.)

---

## 🎬 User Journey Examples

### Scenario 1: Brand New User
1. User opens app → No flags exist
2. RouteGuard redirects to `/Welcome`
3. User clicks "Continue as Guest"
4. App sets:
   - `japa_hasVisited = "true"`
   - `japa_guestMode = "true"`
5. User redirected to `/Home`
6. Next visit: Goes directly to `/Home`

---

### Scenario 2: New User Who Registers
1. User opens app → No flags exist
2. RouteGuard redirects to `/Welcome`
3. User clicks "Sign In / Register"
4. App sets `japa_hasVisited = "true"`
5. User completes registration
6. User redirected to `/Home`
7. Next visit: Firebase auth persists, goes directly to `/Home`

---

### Scenario 3: Guest User Who Logs Out
1. Guest user on `/Home`
2. User clicks logout (from header menu)
3. App clears:
   - `japa_guestMode` flag
   - (keeps `japa_hasVisited`)
4. RouteGuard detects no auth + no guest mode
5. User redirected to `/Welcome`

---

### Scenario 4: Returning User (Previously Logged In)
1. User opens app
2. Firebase auth state restored automatically
3. RouteGuard sees user is authenticated
4. User goes directly to `/Home` (last visited page)

---

## 🛠️ Implementation Details

### Setting the Visited Flag

The flag is set in multiple places to ensure it's always marked:

**In Welcome.jsx:**
```javascript
const continueAsGuest = () => {
  localStorage.setItem('japa_hasVisited', 'true');
  localStorage.setItem('japa_guestMode', 'true');
  window.location.href = createPageUrl('Home');
};

const goToLogin = () => {
  localStorage.setItem('japa_hasVisited', 'true');
  setShowLoginModal(true);
};
```

**In AuthModal.jsx:**
```javascript
const handleSuccess = (user) => {
  localStorage.setItem('japa_hasVisited', 'true');
  if (onSuccess) onSuccess(user);
  onClose();
};
```

---

### Clearing Flags on Logout

**In UserMenu.jsx:**
```javascript
const logout = (e) => {
  e.stopPropagation();
  localStorage.removeItem('japa_guestMode');
  // japa_hasVisited remains - user has still "visited" before
  base44.auth.logout(createPageUrl('Welcome'));
};
```

---

## 🧪 Testing the Flow

### Test Case 1: Clear All Data
```javascript
// In browser console:
localStorage.clear();
location.reload();
// Expected: Redirects to Welcome page
```

### Test Case 2: Simulate Guest User
```javascript
localStorage.setItem('japa_hasVisited', 'true');
localStorage.setItem('japa_guestMode', 'true');
location.reload();
// Expected: Goes to Home page
```

### Test Case 3: Simulate Returning User (No Auth)
```javascript
localStorage.setItem('japa_hasVisited', 'true');
localStorage.removeItem('japa_guestMode');
// Make sure you're logged out
location.reload();
// Expected: Redirects to Welcome page
```

---

## 🎨 Loading States

While the RouteGuard checks authentication, users see a branded loading spinner:

```jsx
<div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
  <div className="text-center">
    <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
    <p className="text-amber-800 font-medium">Loading JapaTap...</p>
  </div>
</div>
```

---

## 🔮 Future Enhancements

Potential improvements:
- [ ] Remember last visited page and restore it
- [ ] Add onboarding tour for first-time users
- [ ] Track user journey analytics
- [ ] Add "Skip for now" option on Welcome page
- [ ] Implement deep linking for specific features

---

**Last Updated:** 2026-04-06
**Version:** 1.0.0
