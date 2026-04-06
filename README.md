# JapaTap Counter Application 🙏

A beautiful, feature-rich japa mala counter application for meditation and chanting practice. Built with React, Vite, and Firebase Authentication.

![JapaTap Counter](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Firebase](https://img.shields.io/badge/Firebase-11.2.0-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 📿 **Digital Japa Counter** - Track your mantras and prayers
- 🎮 **Gamification** - XP system, levels, achievements, and unlockables
- 📊 **Statistics & Analytics** - Detailed progress tracking and visualizations
- 🔋 **Battery Saver Mode** - Reduce battery consumption during long sessions
- 🔐 **Authentication** - Email/password and Google OAuth sign-in
- ☁️ **Cloud Sync** - Sync your progress across devices (requires Firebase)
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- 📱 **Responsive** - Works on desktop, tablet, and mobile

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Yarn** or **npm** package manager
- **Firebase Account** (optional - for authentication features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Japatap/JapaTap-Counter-Application
   ```

2. **Install dependencies**
   ```bash
   # Using yarn (recommended)
   yarn install

   # OR using npm
   npm install
   ```

3. **Run the application**
   ```bash
   # Using yarn
   yarn dev

   # OR using npm
   npm run dev
   ```

4. **Open in browser**
   ```
   The app will be running at: http://localhost:5173/
   ```

That's it! The app will run in **guest mode** by default, with all features working locally.

---

## 🔐 Enable Authentication (Optional)

To enable email/password login and Google OAuth, you need to set up Firebase:

### Quick Firebase Setup

1. **Go to [Firebase Console](https://console.firebase.google.com/)**

2. **Create a new project**
   - Click "Add project"
   - Name it "JapaTap" (or any name you prefer)
   - Follow the setup wizard

3. **Enable Authentication**
   - Go to **Authentication** → **Sign-in method**
   - Enable **Email/Password**
   - Enable **Google**

4. **Create Firestore Database**
   - Go to **Firestore Database**
   - Click "Create database"
   - Choose **Production mode**
   - Select a location

5. **Get Firebase Configuration**
   - Go to **Project Settings** (gear icon) → **General**
   - Scroll to "Your apps"
   - Click the web icon (`</>`)
   - Register app as "JapaTap Web"
   - Copy the configuration values

6. **Create `.env.local` file**

   Create a file named `.env.local` in the `JapaTap-Counter-Application/` directory:

   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
   ```

7. **Restart the dev server**

   The server will automatically restart and you'll see:
   ```
   ✅ Firebase initialized successfully
   ```

📚 **Detailed Setup Guide:** See [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md) for complete instructions.

---

## 📖 Usage

### Running in Guest Mode (No Setup Required)

1. Start the app with `yarn dev`
2. Click **"Continue as Guest"** on the welcome screen
3. Start counting! All features work locally
4. Your data is saved to browser localStorage

### Running with Authentication (Firebase Required)

1. Complete the Firebase setup above
2. Start the app with `yarn dev`
3. Click **"Sign In / Register"**
4. Create an account or sign in with Google
5. Your data syncs to the cloud automatically

---

## 🛠️ Development

### Project Structure

```
JapaTap-Counter-Application/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── gamification/   # XP, achievements, unlockables
│   │   └── ...
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and services
│   │   ├── firebase.js     # Firebase configuration
│   │   ├── authService.js  # Authentication functions
│   │   └── AuthContext.jsx # Auth context provider
│   └── api/                # API clients
├── public/                 # Static assets
├── .env.local             # Environment variables (create this)
├── .env.example           # Environment template
└── package.json           # Dependencies
```

### Available Scripts

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Lint code
yarn lint
```

### Building for Production

```bash
# Build the app
yarn build

# The output will be in the `dist/` directory
# Deploy the `dist/` folder to any static hosting service
```

---

## 🌐 Deployment

The app can be deployed to any static hosting service:

- **Vercel** - Connect your GitHub repo for automatic deployments
- **Netlify** - Drag & drop the `dist/` folder
- **GitHub Pages** - Use GitHub Actions for CI/CD
- **Firebase Hosting** - `firebase deploy`

**Remember:** Add your production domain to Firebase **Authorized domains** in Authentication settings.

---

## 📚 Documentation

- [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md) - Complete Firebase setup guide
- [README_AUTHENTICATION.md](README_AUTHENTICATION.md) - Authentication system overview
- `.env.example` - Environment variable template

---

## 🎯 Features Overview

### Core Features
- ✅ Manual tap counter with haptic feedback
- ✅ Session management with customizable goals
- ✅ Real-time statistics and analytics
- ✅ Daily streak tracking
- ✅ Battery saver mode

### Gamification
- ✅ XP and leveling system
- ✅ 15+ achievements to unlock
- ✅ Combo system for consecutive taps
- ✅ Unlockable avatar frames and badges
- ✅ Profile customization

### Authentication
- ✅ Email/password authentication
- ✅ Google OAuth sign-in
- ✅ Separate login and signup forms
- ✅ Password validation and security
- ✅ Cloud sync across devices

### Analytics
- ✅ Session history tracking
- ✅ Visual charts and graphs
- ✅ Daily/weekly/monthly views
- ✅ Battery savings calculator
- ✅ Progress insights

---

## 🔧 Troubleshooting

### Common Issues

**Issue:** "Firebase is not configured" error
- **Solution:** Create `.env.local` file with Firebase credentials (see setup above)

**Issue:** App runs but authentication doesn't work
- **Solution:** Check that Firebase Authentication is enabled in Firebase Console

**Issue:** Google Sign-in popup closes immediately
- **Solution:** Add `localhost` to Authorized domains in Firebase Console

**Issue:** Port 5173 already in use
- **Solution:** Stop other Vite apps or change the port in `vite.config.js`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Powered by [Vite](https://vitejs.dev/)
- Authentication by [Firebase](https://firebase.google.com/)
- UI components from [Lucide Icons](https://lucide.dev/)
- Animations with [Framer Motion](https://www.framer.com/motion/)

---

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation files in this repository

---

**Happy Meditating! 🙏✨**
