# 📱 Convert JapaTap to Android & iOS Apps with Capacitor

## 🎯 Overview

This guide will help you convert your JapaTap web app into native Android and iOS apps using Capacitor.

---

## 📋 Prerequisites

Before starting, make sure you have:

### **For Both Platforms:**
- ✅ Node.js installed (you already have this)
- ✅ Your JapaTap app built and working
- ✅ Basic command line knowledge

### **For Android:**
- ✅ [Android Studio](https://developer.android.com/studio) installed
- ✅ Java Development Kit (JDK) 11 or higher
- ✅ Android SDK installed via Android Studio

### **For iOS (Mac only):**
- ✅ macOS computer
- ✅ [Xcode](https://apps.apple.com/us/app/xcode/id497799835) installed
- ✅ Xcode Command Line Tools
- ✅ CocoaPods installed: `sudo gem install cocoapods`

---

## 🚀 Step 1: Install Capacitor

```bash
# Navigate to your project
cd JapaTap-Counter-Application

# Install Capacitor CLI and Core
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init

# When prompted:
# App name: JapaTap Counter
# App ID: com.japatap.counter (or your own domain)
# Web asset directory: dist
```

---

## 📱 Step 2: Add Android Platform

```bash
# Install Android platform
npm install @capacitor/android

# Add Android project
npx cap add android

# This creates an 'android' folder with native Android project
```

---

## 🍎 Step 3: Add iOS Platform (Mac only)

```bash
# Install iOS platform
npm install @capacitor/ios

# Add iOS project
npx cap add ios

# This creates an 'ios' folder with native iOS project
```

---

## 🔧 Step 4: Configure Your App

### **Update `capacitor.config.ts`** (or `.json`):

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.japatap.counter',
  appName: 'JapaTap Counter',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For development, you can use your local server:
    // url: 'http://192.168.1.100:5173',
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#f59e0b",
      showSpinner: false
    }
  }
};

export default config;
```

---

## 🏗️ Step 5: Build Your Web App

```bash
# Build the production version
npm run build

# Sync the build to native projects
npx cap sync

# This copies your dist folder to Android and iOS projects
```

---

## 📱 Step 6: Build Android App

### **Open in Android Studio:**
```bash
npx cap open android
```

### **In Android Studio:**

1. **Wait for Gradle sync** to complete (first time takes a while)

2. **Configure app icon:**
   - Right-click `app` → `New` → `Image Asset`
   - Upload your app icon
   - Generate all sizes

3. **Update app details:**
   - Open `android/app/build.gradle`
   - Update version code and version name:
   ```gradle
   android {
       defaultConfig {
           versionCode 1
           versionName "1.0.0"
       }
   }
   ```

4. **Build APK:**
   - `Build` menu → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Or run: `cd android && ./gradlew assembleDebug`

5. **Find your APK:**
   - Located at: `android/app/build/outputs/apk/debug/app-debug.apk`

6. **Install on device:**
   - Connect Android phone via USB
   - Enable Developer Options & USB Debugging
   - Click "Run" ▶️ button in Android Studio

---

## 🍎 Step 7: Build iOS App (Mac only)

### **Open in Xcode:**
```bash
npx cap open ios
```

### **In Xcode:**

1. **Select your team:**
   - Click project name in left sidebar
   - Go to "Signing & Capabilities" tab
   - Select your Apple Developer account (or create free account)

2. **Configure app:**
   - Update Bundle Identifier: `com.japatap.counter`
   - Set deployment target: iOS 13.0 or higher

3. **Add app icon:**
   - Click `Assets.xcassets` → `AppIcon`
   - Drag and drop icon images for all sizes

4. **Build and run:**
   - Select your iPhone from device list
   - Click "Run" ▶️ button
   - App installs and launches on your iPhone!

---

## 🔑 Step 8: Firebase Configuration for Apps

Your Firebase Google Sign-In will work, but you need to configure it:

### **For Android:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Add Android app:
   - Package name: `com.japatap.counter`
   - Download `google-services.json`
   - Place in: `android/app/google-services.json`

### **For iOS:**

1. In Firebase Console
2. Add iOS app:
   - Bundle ID: `com.japatap.counter`
   - Download `GoogleService-Info.plist`
   - Add to Xcode project (drag into Xcode)

---

## 🎨 Step 9: Customize App

### **Splash Screen:**

```bash
# Install splash screen plugin
npm install @capacitor/splash-screen

# Add splash screen image to:
# Android: android/app/src/main/res/drawable/splash.png
# iOS: ios/App/App/Assets.xcassets/Splash.imageset/
```

### **App Icon:**

Create icons at these sizes:
- **Android:** 192x192, 512x512
- **iOS:** 1024x1024 (App Store), various sizes for device

Use tools like:
- [AppIcon.co](https://appicon.co/) - Free icon generator
- [MakeAppIcon](https://makeappicon.com/) - Generate all sizes

---

## 🔄 Development Workflow

### **When you make changes:**

```bash
# 1. Rebuild web app
npm run build

# 2. Sync to native apps
npx cap sync

# 3. Reopen in IDE (if needed)
npx cap open android
# or
npx cap open ios
```

### **Live Reload (Development):**

```bash
# Run development server
npm run dev

# Note your local IP (e.g., 192.168.1.100)
# Update capacitor.config.ts:
# server: { url: 'http://192.168.1.100:5173', cleartext: true }

# Sync and run
npx cap sync
npx cap open android
```

Now changes in your web app reflect immediately in the mobile app!

---

## 📦 Step 10: Publish to Stores

### **Google Play Store (Android):**

1. **Create signed APK/AAB:**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. **Sign the bundle:**
   - Follow [Android signing guide](https://developer.android.com/studio/publish/app-signing)

3. **Upload to Play Console:**
   - Go to [Google Play Console](https://play.google.com/console)
   - Create app
   - Upload AAB file
   - Fill in store listing, screenshots, etc.

### **Apple App Store (iOS):**

1. **Archive the app in Xcode:**
   - Product → Archive
   - Wait for archive to complete

2. **Upload to App Store Connect:**
   - Click "Distribute App"
   - Follow wizard to upload

3. **Submit for review:**
   - Go to [App Store Connect](https://appstoreconnect.apple.com/)
   - Fill in app details, screenshots
   - Submit for review

---

## ⚡ Pro Tips

### **Optimize Bundle Size:**
- Use code splitting in Vite
- Remove unused dependencies
- Compress images
- Use lazy loading

### **Test on Real Devices:**
- Always test on real devices, not just emulators
- Test on different Android versions
- Test on different iOS versions

### **Handle Deep Links:**
```bash
npm install @capacitor/app

# Add to your code:
import { App } from '@capacitor/app';

App.addListener('appUrlOpen', (event) => {
  // Handle deep links
});
```

---

## 🐛 Common Issues

### **"Build failed" in Android Studio:**
- Clean project: `Build` → `Clean Project`
- Rebuild: `Build` → `Rebuild Project`
- Invalidate caches: `File` → `Invalidate Caches / Restart`

### **"No provisioning profile" in Xcode:**
- Make sure you're signed in with Apple ID
- Enable "Automatically manage signing"

### **App crashes on launch:**
- Check `npx cap sync` was run after building
- Check capacitor.config webDir points to `dist`
- Check console logs in Android Studio / Xcode

---

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Ionic Framework](https://ionicframework.com/) - UI components
- [Android Publishing Guide](https://developer.android.com/studio/publish)
- [iOS Publishing Guide](https://developer.apple.com/app-store/submissions/)

---

**Next Steps:** Follow Option 1 above to get started!
