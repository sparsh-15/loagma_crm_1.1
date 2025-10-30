# CRM & Accounting System - Deployment Guide

## 📦 Downloading the Project from Replit

### Method 1: Download as ZIP (Recommended)
1. In the Replit workspace, go to the **file tree** (left sidebar)
2. Click the **three dots** (⋮) next to your project's root folder
3. Select **"Download as ZIP"**
4. Extract the ZIP file on your local machine

### Method 2: Using Git
```bash
git clone <your-replit-git-url>
```

---

## 🏗️ Project Structure

```
crm-accounting/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Auth, query client
│   │   └── App.tsx        # Main app component
│   ├── index.html
│   └── package.json
├── server/                # Backend (Express + Node.js)
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage interface
│   ├── init-data.ts      # Sample data initialization
│   ├── auth.ts           # Authentication
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts
├── package.json          # Root package.json
└── .env                  # Environment variables
```

---

## 🚀 Deployment Options

### Option 1: Deploy on Replit (Easiest - Recommended)

#### Using Replit's Built-in Deployment
1. Click the **"Deploy"** or **"Publish"** button in Replit
2. Choose **"Autoscale Deployment"**
3. Configure settings:
   - **Machine Power**: Start with 0.5 vCPU, 512MB RAM
   - **Run Command**: `npm run dev` (already configured)
   - **Port**: 5000 (automatically configured)
4. Click **"Deploy"**
5. Your app will be live at `https://<your-app-name>.replit.app`

#### Environment Variables on Replit
- Replit automatically manages secrets
- Current secrets configured:
  - `SESSION_SECRET` - Already set up
  - `DATABASE_URL` - Auto-configured if using Replit database

**Note**: On Replit, the frontend and backend run together on a single server (port 5000).

---

### Option 2: Deploy Separately (Frontend + Backend)

If you want to deploy frontend and backend on different platforms:

---

## 🎨 FRONTEND DEPLOYMENT (Separate)

### Platforms: Vercel, Netlify, Cloudflare Pages

### 1. Prepare Frontend for Separate Deployment

#### A. Create a standalone frontend build

**Update `client/src/lib/queryClient.ts`:**
```typescript
// Change API base URL to point to your backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const url = `${API_URL}${path}`;
  // ... rest of the code
}
```

#### B. Create `client/.env.production`:
```env
VITE_API_URL=https://your-backend-url.com
```

#### C. Build the frontend:
```bash
cd client
npm install
npm run build
```

This creates a `dist/` folder with static files.

---

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# From the client directory
cd client
vercel --prod
```

**Configuration (vercel.json in client folder):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### 3. Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# From the client directory
cd client
netlify deploy --prod --dir=dist
```

**Configuration (netlify.toml in client folder):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 4. Deploy to Cloudflare Pages

```bash
# Install Wrangler CLI
npm install -g wrangler

# From the client directory
cd client
wrangler pages publish dist
```

---

## 🔧 BACKEND DEPLOYMENT (Separate)

### Platforms: Railway, Render, Heroku, DigitalOcean, AWS

---

### 1. Prepare Backend for Separate Deployment

#### A. Create backend package.json (if deploying separately)

**Create `server/package.json`:**
```json
{
  "name": "crm-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node --loader tsx server/index.ts",
    "dev": "tsx server/index.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "bcrypt": "^5.1.1",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "tsx": "^4.7.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0"
  }
}
```

#### B. Enable CORS for frontend requests

**Update `server/index.ts`:**
```typescript
import cors from 'cors';

const app = express();

// Add CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

#### C. Create `.env` file for backend:
```env
NODE_ENV=production
PORT=5000
SESSION_SECRET=your-super-secret-session-key-change-this
FRONTEND_URL=https://your-frontend-url.vercel.app
```

---

### 2. Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

**Configuration (railway.json):**
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**Set environment variables in Railway dashboard:**
- `NODE_ENV=production`
- `SESSION_SECRET=<your-secret>`
- `PORT=5000`
- `FRONTEND_URL=<your-frontend-url>`

---

### 3. Deploy to Render

```bash
# Create render.yaml in project root
```

**render.yaml:**
```yaml
services:
  - type: web
    name: crm-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: SESSION_SECRET
        generateValue: true
      - key: PORT
        value: 5000
```

1. Push code to GitHub
2. Connect GitHub repo to Render
3. Render will auto-deploy

---

### 4. Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-crm-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secret-key

# Deploy
git push heroku main
```

**Procfile:**
```
web: npm start
```

---

### 5. Deploy to DigitalOcean App Platform

1. Push code to GitHub
2. Go to DigitalOcean App Platform
3. Create new app from GitHub repo
4. Configure:
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
   - **HTTP Port**: 5000
5. Add environment variables in dashboard
6. Deploy

---

### 6. Deploy to AWS (EC2)

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone your repository
git clone <your-repo-url>
cd <your-project>

# Install dependencies
npm install

# Install PM2 for process management
sudo npm install -g pm2

# Create .env file
nano .env
# Add your environment variables

# Start the server with PM2
pm2 start server/index.ts --name crm-backend --interpreter tsx
pm2 save
pm2 startup

# Setup Nginx as reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

---

## 🔐 Environment Variables Reference

### Backend Environment Variables

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Session Secret (REQUIRED - Generate a strong random string)
SESSION_SECRET=your-super-secret-session-key-min-32-chars

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-url.vercel.app

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Optional: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend Environment Variables

```env
# API Backend URL
VITE_API_URL=https://your-backend-url.railway.app
```

### Generate SESSION_SECRET

```bash
# On Linux/Mac
openssl rand -base64 32

# On Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or use any random string generator (minimum 32 characters)
```

---

## 📋 Complete Deployment Commands

### Local Development

```bash
# Install dependencies
npm install

# Start development server (frontend + backend together)
npm run dev

# Access at http://localhost:5000
```

---

### Separate Frontend Development

```bash
cd client
npm install
npm run dev
# Access at http://localhost:5173
```

---

### Separate Backend Development

```bash
# From project root
npm run dev

# Or if you created server/package.json
cd server
npm install
npm run dev
# Access at http://localhost:5000
```

---

### Production Build (Monolithic - Frontend + Backend Together)

```bash
# Install all dependencies
npm install

# Build frontend
cd client && npm run build && cd ..

# Start production server
NODE_ENV=production npm start
```

---

### Production Build (Separate Deployments)

**Frontend:**
```bash
cd client
npm install
npm run build
# Deploy the 'dist' folder
```

**Backend:**
```bash
# From project root or server directory
npm install
NODE_ENV=production npm start
```

---

## 🗄️ Database Setup

### Current Setup: In-Memory Storage
- Data resets on server restart
- Good for development/testing
- **Not suitable for production**

### Recommended: PostgreSQL Database

#### 1. Using Replit's Built-in Database
- Automatically provisioned
- Environment variables auto-configured
- Access via `DATABASE_URL`

#### 2. External PostgreSQL (Supabase, Neon, Railway)

**Update `server/storage.ts` to use PostgreSQL:**
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

export class PostgresStorage implements IStorage {
  // Implement storage methods using pool.query()
}
```

**Install pg package:**
```bash
npm install pg
npm install --save-dev @types/pg
```

---

## 🧪 Testing Your Deployment

### Test Backend API

```bash
# Health check
curl https://your-backend-url.com/api/auth/check

# Login
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Test Frontend
1. Open browser to your frontend URL
2. Login with demo credentials:
   - Username: `admin`
   - Password: `admin123`
3. Check that dashboard loads
4. Verify API calls work (check browser DevTools Network tab)

---

## 🔧 Troubleshooting

### Issue: CORS Errors
**Solution**: Ensure backend CORS is configured with correct frontend URL

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Issue: 404 on Frontend Routes
**Solution**: Configure rewrites/redirects to serve index.html for all routes

### Issue: Session Not Persisting
**Solution**: 
1. Ensure `credentials: true` in CORS config
2. Use secure cookies in production
3. Configure session store (Redis recommended)

### Issue: Port Already in Use
**Solution**:
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

---

## 📊 Performance Optimization

### Frontend
- Enable Gzip compression
- Use CDN for static assets
- Implement code splitting
- Enable caching headers

### Backend
- Use Redis for session storage
- Implement rate limiting
- Add database connection pooling
- Enable response compression

---

## 🔒 Security Checklist

- [ ] Change default SESSION_SECRET
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Sanitize user inputs
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted origins
- [ ] Implement CSRF protection
- [ ] Use secure session cookies
- [ ] Regular dependency updates
- [ ] Database backups

---

## 📞 Support & Documentation

### Demo Credentials
- Admin: `admin` / `admin123`
- Sales Manager: `manager` / `manager123`
- Sales Executive: `sales` / `sales123`
- Accountant: `accountant` / `acc123`
- Engineer: `engineer` / `eng123`
- Client: `client` / `client123`

### Useful Commands
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# View running processes
ps aux | grep node

# Check port usage
lsof -i :5000
```

---

## 🎯 Quick Start Deployment Recommendations

### Best for Beginners
**Deploy on Replit** - Click "Deploy" button, done in 2 minutes!

### Best for Free Hosting
- **Frontend**: Vercel or Netlify (both free tier)
- **Backend**: Railway or Render (free tier with limitations)

### Best for Production
- **Frontend**: Vercel (automatic edge network)
- **Backend**: Railway or AWS (scalable, reliable)
- **Database**: Supabase or Neon PostgreSQL (free tier available)

---

**Last Updated**: October 2025
**Project**: CRM & Accounting Management System
**Stack**: React + Express + TypeScript
