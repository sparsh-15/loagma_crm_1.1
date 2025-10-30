# 🚀 Quick Start Guide - Separate Deployment

This guide gets you up and running with separate frontend and backend deployments in under 10 minutes.

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free - sign up at vercel.com)
- Render account (free - sign up at render.com)

## 📦 Important: Separate Package Files

Your project has **two package.json files** for optimized deployments:

```
project-root/
├── client/                    ← Frontend (Vercel)
│   ├── package.json          ← Frontend deps only (~200MB)
│   ├── vite.config.ts        ← Vite config
│   ├── tailwind.config.ts    ← Styling config
│   └── src/                  ← React app
├── shared/                    ← Shared types
└── package.json              ← Backend + local dev (~500MB)
```

**Vercel** uses `client/package.json` → Fast builds!  
**Render** uses root `package.json` → Backend ready!

---

## ⚡ 5-Minute Setup

### Step 1: Push to GitHub (2 min)

```bash
# Download from Replit, then:
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

### Step 2: Deploy Backend to Render (2 min)

1. Go to [render.com](https://render.com/) → **"New +"** → **"Web Service"**
2. Connect GitHub repository
3. Settings:
   - Name: `crm-backend`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: **Free**
4. Environment variables:
   ```
   NODE_ENV = production
   SESSION_SECRET = [Click Generate]
   FRONTEND_URL = https://TEMPORARY-WILL-UPDATE-LATER.com
   ```
5. Click **"Create Web Service"**
6. ⏱️ Wait 3-5 minutes
7. 📋 **Copy your backend URL**: `https://your-backend.onrender.com`

---

### Step 3: Deploy Frontend to Vercel (1 min)

1. Go to [vercel.com](https://vercel.com/) → **"Add New"** → **"Project"**
2. Select your GitHub repo
3. Settings:
   - Framework: **Vite**
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - **Note**: Vercel will automatically detect `client/package.json` with only frontend dependencies!
4. Environment variable:
   ```
   VITE_API_URL = https://your-backend.onrender.com
   ```
   *(Paste YOUR backend URL from Step 2.7)*
5. Click **"Deploy"**
6. ⏱️ Wait 2-3 minutes
7. 📋 **Copy your frontend URL**: `https://your-app.vercel.app`

---

### Step 4: Update Backend CORS (30 sec)

1. Go back to Render → Your backend service
2. **Environment** tab → Edit `FRONTEND_URL`:
   ```
   FRONTEND_URL = https://your-app.vercel.app
   ```
   *(Paste YOUR frontend URL from Step 3.7)*
3. **Manual Deploy** → **"Deploy latest commit"**

---

## ✅ Done! Test Your App

Visit: `https://your-app.vercel.app`

**Login**:
- Username: `admin`
- Password: `admin123`

---

## 🔧 Environment Variables Cheat Sheet

### Backend (Render)
```
NODE_ENV = production
SESSION_SECRET = [32+ random characters]
FRONTEND_URL = https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL = https://your-backend.onrender.com
```

**Generate SESSION_SECRET**:
```bash
openssl rand -base64 32
```

---

## 🐛 Common Issues

### CORS Error
- ❌ `FRONTEND_URL` doesn't match
- ✅ Update backend `FRONTEND_URL` to exact Vercel URL
- ✅ Redeploy backend

### Blank Page
- ❌ `VITE_API_URL` not set
- ✅ Add environment variable in Vercel
- ✅ Redeploy frontend

### Login Fails
- ❌ Backend not running
- ✅ Check Render dashboard
- ✅ Visit backend URL directly (should see JSON or message)

---

## 📱 Local Development

### Run Together (Same as Replit)
```bash
npm install
npm run dev
# Visit http://localhost:5000
```

### Run Separately
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

Create `.env` in root:
```env
NODE_ENV=development
SESSION_SECRET=dev-secret-change-in-production
FRONTEND_URL=http://localhost:5173
```

Create `client/.env.local`:
```env
VITE_API_URL=http://localhost:5000
```

---

## 🔄 Making Updates

```bash
# Make changes
git add .
git commit -m "Your changes"
git push

# Auto-deploys to both Vercel and Render!
```

---

## 📚 More Help

- Full guide: See `SEPARATE_DEPLOYMENT.md`
- Environment vars: See `.env.example` files
- Issues: Check browser console (F12) and Render logs

---

**🎉 You're ready! Start building your CRM system!**
