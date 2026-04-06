# JapaTap - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended - Easiest)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with your GitHub account

2. **Import Your Repository**
   - Click "Import Project" or "Add New Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository: `JapaTap-Counter-Application`

3. **Configure Project**
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add these:
   
   ```
   VITE_FIREBASE_API_KEY=AIzaSyC5pGnQXrsqwJJDkx2VXeJdW7QBGgAKm8k
   VITE_FIREBASE_AUTH_DOMAIN=japatap-87df4.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=japatap-87df4
   VITE_FIREBASE_STORAGE_BUCKET=japatap-87df4.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=937432083804
   VITE_FIREBASE_APP_ID=1:937432083804:web:7820fa8cdf1b82be4fe599
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your app will be live at: `https://your-project-name.vercel.app`

---

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   # or use without installation:
   npx vercel
   ```

2. **Login to Vercel**
   ```bash
   npx vercel login
   ```

3. **Deploy**
   ```bash
   # Production deployment
   npx vercel --prod
   
   # Preview deployment (for testing)
   npx vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (first time)
   - What's your project's name? `japatap-counter`
   - In which directory is your code located? `./`
   - Want to override settings? **N**

5. **Add Environment Variables (CLI)**
   ```bash
   npx vercel env add VITE_FIREBASE_API_KEY
   # Then paste the value when prompted
   # Repeat for all environment variables
   ```

---

## 🔧 Post-Deployment Configuration

### 1. Update Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `japatap-87df4`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain:
   - `your-project-name.vercel.app`
   - Also add any custom domains you plan to use

### 2. Set Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add your custom domain (e.g., `japatap.com`)
4. Follow DNS configuration instructions

---

## 📋 Environment Variables Reference

All environment variables must be prefixed with `VITE_` for Vite to expose them to the client.

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API Key | ✅ Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | ✅ Yes |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | ✅ Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | ✅ Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | ✅ Yes |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | ✅ Yes |

---

## 🔍 Troubleshooting

### Build Fails with "Command not found"
- Make sure `package.json` has the correct build script
- Check that all dependencies are listed in `package.json`

### Firebase Authentication Not Working
- Verify all environment variables are set correctly in Vercel
- Make sure Vercel domain is added to Firebase authorized domains
- Check browser console for specific error messages

### App Shows Blank Page
- Check build logs in Vercel dashboard
- Verify `dist` folder is being generated
- Check for JavaScript errors in browser console

### Environment Variables Not Working
- Make sure they're prefixed with `VITE_`
- Redeploy after adding environment variables
- Use `import.meta.env.VITE_VARIABLE_NAME` to access them

---

## 🔄 Continuous Deployment

Vercel automatically deploys:
- **Production:** Every push to `main` branch
- **Preview:** Every push to other branches and pull requests

---

## 📱 Mobile PWA Configuration

The app is already configured as a PWA. After deployment:

1. **Test PWA on Mobile:**
   - Open your Vercel URL on mobile browser
   - Look for "Add to Home Screen" prompt

2. **Update manifest.json** (if needed):
   - Update `start_url` to your Vercel domain
   - Located in `public/manifest.json`

---

## ✅ Deployment Checklist

Before deploying, ensure:

- [ ] All code is committed and pushed to GitHub
- [ ] `vercel.json` is configured correctly
- [ ] Firebase credentials are ready
- [ ] Build runs successfully locally (`npm run build`)
- [ ] No `.env.local` in git (it's in `.gitignore`)
- [ ] All dependencies are in `package.json`

After deploying:

- [ ] Test authentication flow
- [ ] Test all features (counter, streaks, stats)
- [ ] Test on mobile devices
- [ ] Verify PWA installation works
- [ ] Check Firebase authorized domains
- [ ] Monitor Vercel analytics

---

## 📊 Monitoring & Analytics

### Vercel Analytics
- View real-time traffic in Vercel Dashboard
- Monitor build times and errors
- Track Core Web Vitals

### Firebase Analytics (Optional)
- Add Firebase Analytics SDK if needed
- Track user engagement and feature usage

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Firebase Console:** https://console.firebase.google.com/
- **Vite Deployment Guide:** https://vitejs.dev/guide/static-deploy.html

---

**Last Updated:** 2026-04-06
