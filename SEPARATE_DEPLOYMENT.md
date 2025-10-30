# Separate Frontend & Backend Deployment Guide

This guide shows how to deploy the frontend and backend separately to different platforms.

## 🎯 Recommended Setup

**Frontend**: Vercel (Free tier, automatic deployments)  
**Backend**: Render (Free tier, auto-sleep after 15min inactivity)

---

## 📦 Step 1: Prepare Your Code

### 1.1 Download Project from Replit
1. Click the **three dots** (⋮) in the file tree
2. Select **"Download as ZIP"**
3. Extract on your computer

### 1.2 Push to GitHub (Required for Vercel/Render)
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repository on GitHub, then:
git remote add origin https://github.com/your-username/your-repo.git
git branch -M main
git push -u origin main
```

---

## 🚀 Step 2: Deploy Backend to Render

### 2.1 Sign Up / Login
1. Go to [render.com](https://render.com/)
2. Sign up with GitHub

### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `crm-backend` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.3 Set Environment Variables
Click **"Environment"** tab and add:

```
NODE_ENV = production
SESSION_SECRET = [Click "Generate" or paste your own 32+ char secret]
FRONTEND_URL = https://your-app.vercel.app
```

**Note**: You'll update `FRONTEND_URL` after deploying frontend.

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Copy your backend URL: `https://your-backend.onrender.com`

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Sign Up / Login
1. Go to [vercel.com](https://vercel.com/)
2. Sign up with GitHub

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Set Environment Variables
Click **"Environment Variables"** and add:

```
VITE_API_URL = https://your-backend.onrender.com
```

**Important**: Use your actual Render backend URL from Step 2.4

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Copy your frontend URL: `https://your-app.vercel.app`

---

## 🔄 Step 4: Update Backend CORS

### 4.1 Go Back to Render
1. Open your backend service on Render
2. Click **"Environment"** tab
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL = https://your-app.vercel.app
   ```
   **Important**: Use your actual Vercel URL from Step 3.4

### 4.2 Redeploy Backend
1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait for redeployment (1-2 minutes)

---

## ✅ Step 5: Test Your Deployment

### 5.1 Open Your App
Visit: `https://your-app.vercel.app`

### 5.2 Login
Use demo credentials:
- Username: `admin`
- Password: `admin123`

### 5.3 Verify
- ✅ Login works
- ✅ Dashboard loads
- ✅ Can create/view leads
- ✅ Can create/view quotations

**If you see CORS errors**: Double-check `FRONTEND_URL` in Render matches your Vercel URL exactly (no trailing slash).

---

## 🔧 Alternative: Deploy Frontend to Netlify

### Option A: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# From project root
cd client

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option B: Netlify Dashboard
1. Go to [netlify.com](https://netlify.com/)
2. **"Add new site"** → **"Import an existing project"**
3. Connect GitHub repository
4. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. Add environment variable:
   ```
   VITE_API_URL = https://your-backend.onrender.com
   ```
6. Deploy

---

## 🔧 Alternative: Deploy Backend to Railway

### Setup
1. Go to [railway.app](https://railway.app/)
2. Sign up with GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Add environment variables:
   ```
   NODE_ENV = production
   SESSION_SECRET = [Generate or paste 32+ char secret]
   FRONTEND_URL = https://your-app.vercel.app
   ```
6. Click **"Deploy"**
7. Copy backend URL: `https://your-backend.up.railway.app`

---

## 🗂️ Environment Variables Quick Reference

### Backend (.env on Render/Railway)
```env
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-32-plus-character-secret-here
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (.env on Vercel/Netlify)
```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🔒 Generate SESSION_SECRET

```bash
# Method 1: OpenSSL (Mac/Linux)
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 3: Online
Visit: https://generate-secret.vercel.app/32
```

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" / CORS Error
**Solution**: 
1. Check `FRONTEND_URL` on backend matches your frontend URL exactly
2. No trailing slash in URLs
3. Redeploy backend after changing `FRONTEND_URL`

### Issue: Blank page on frontend
**Solution**:
1. Check browser console for errors
2. Verify `VITE_API_URL` is set correctly
3. Ensure backend is running (visit backend URL directly)

### Issue: Login doesn't work
**Solution**:
1. Check backend logs on Render/Railway
2. Verify `credentials: true` in CORS (already configured)
3. Ensure `SESSION_SECRET` is set on backend

### Issue: Backend sleeps (Render free tier)
**Solution**:
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- Upgrade to paid plan ($7/month) for always-on
- Or use Railway (different free tier limits)

### Issue: API returns 404
**Solution**:
1. Verify backend is deployed and running
2. Check `VITE_API_URL` has no trailing slash
3. Check backend URL is accessible directly

---

## 📊 Free Tier Limitations

### Vercel (Frontend)
- ✅ 100GB bandwidth/month
- ✅ Unlimited projects
- ✅ Automatic HTTPS
- ✅ Global CDN

### Render (Backend)
- ✅ 750 hours/month free
- ⚠️ Sleeps after 15min inactivity
- ✅ Automatic HTTPS
- ⚠️ Limited to 512MB RAM

### Railway (Backend Alternative)
- ✅ $5 free credit/month
- ✅ No sleep (stays active)
- ✅ 512MB RAM
- ⚠️ Free credit runs out ~mid-month for always-on

---

## 🔄 Making Updates

### Update Frontend
```bash
# Make changes to client code
git add .
git commit -m "Update frontend"
git push

# Vercel auto-deploys from GitHub (takes 1-2 minutes)
```

### Update Backend
```bash
# Make changes to server code
git add .
git commit -m "Update backend"
git push

# Render auto-deploys from GitHub (takes 2-3 minutes)
```

### Manual Deploy
- **Vercel**: Click "Redeploy" in dashboard
- **Render**: Click "Manual Deploy" → "Deploy latest commit"

---

## 🎯 Production Checklist

- [ ] Backend deployed to Render/Railway
- [ ] Frontend deployed to Vercel/Netlify
- [ ] `FRONTEND_URL` set on backend
- [ ] `VITE_API_URL` set on frontend
- [ ] `SESSION_SECRET` is strong (32+ characters)
- [ ] Both URLs use HTTPS
- [ ] Login works correctly
- [ ] All features tested
- [ ] CORS configured properly
- [ ] No console errors in browser

---

## 🆘 Need Help?

1. Check browser console for errors (F12)
2. Check backend logs on Render/Railway dashboard
3. Verify all environment variables are set correctly
4. Ensure GitHub repository is up to date
5. Try redeploying both frontend and backend

---

**Last Updated**: October 2025  
**Deployment Type**: Separate Frontend (Vercel) + Backend (Render)
