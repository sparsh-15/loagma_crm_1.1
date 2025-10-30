# Environment Variables Configuration

## 📋 Complete Environment Variables Reference

### Backend (.env)

Create a `.env` file in the project root with these variables:

```env
# ===================================
# SERVER CONFIGURATION
# ===================================
NODE_ENV=production
PORT=5000

# ===================================
# SESSION SECRET (REQUIRED)
# ===================================
# Generate with: openssl rand -base64 32
# Minimum 32 characters recommended
SESSION_SECRET=your-super-secret-session-key-change-this-min-32-chars

# ===================================
# CORS CONFIGURATION
# ===================================
# Frontend URL for CORS (Required for separate deployments)
FRONTEND_URL=https://your-frontend-url.vercel.app

# Multiple allowed origins (comma-separated)
# ALLOWED_ORIGINS=https://app1.com,https://app2.com

# ===================================
# DATABASE CONFIGURATION
# ===================================
# PostgreSQL Database URL (if using database instead of in-memory)
# DATABASE_URL=postgresql://username:password@host:port/database_name

# Or individual database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=crm_database
# DB_USER=admin
# DB_PASSWORD=your-db-password

# ===================================
# EMAIL CONFIGURATION (Optional)
# ===================================
# SMTP Settings for email notifications
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# EMAIL_FROM=CRM System <noreply@yourcompany.com>

# ===================================
# FILE UPLOAD CONFIGURATION (Optional)
# ===================================
# MAX_FILE_SIZE=5242880  # 5MB in bytes
# UPLOAD_DIR=./uploads

# ===================================
# API KEYS (Optional - for future features)
# ===================================
# PDF_SERVICE_API_KEY=your-pdf-service-key
# PAYMENT_GATEWAY_KEY=your-payment-key
# SMS_SERVICE_KEY=your-sms-service-key

# ===================================
# LOGGING & MONITORING (Optional)
# ===================================
# LOG_LEVEL=info
# SENTRY_DSN=your-sentry-dsn

# ===================================
# RATE LIMITING (Optional)
# ===================================
# RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
# RATE_LIMIT_MAX_REQUESTS=100
```

---

### Frontend (.env or .env.production)

Create a `.env.production` file in the `client/` directory:

```env
# ===================================
# API BACKEND URL
# ===================================
# Points to your backend API
VITE_API_URL=https://your-backend-url.railway.app

# Or for local development
# VITE_API_URL=http://localhost:5000

# ===================================
# FEATURE FLAGS (Optional)
# ===================================
# VITE_ENABLE_ANALYTICS=true
# VITE_ENABLE_DEBUG=false

# ===================================
# THIRD-PARTY SERVICES (Optional)
# ===================================
# VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
# VITE_SENTRY_DSN=your-frontend-sentry-dsn
```

**Important**: All frontend environment variables MUST start with `VITE_` prefix!

---

## 🔐 How to Generate Secure Secrets

### Generate SESSION_SECRET

#### Method 1: Using OpenSSL (Linux/Mac)
```bash
openssl rand -base64 32
```

#### Method 2: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Method 3: Using PowerShell (Windows)
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

#### Method 4: Online Generator
- Visit: https://www.uuidgenerator.net/
- Use a strong password generator

**Example Output:**
```
J9xK2mN5pQ8rT1uV4wX7yZ0aB3cD6eF9gH
```

---

## 📦 Environment Variables by Deployment Platform

### Replit
Set secrets in the **Secrets** tool (lock icon in left sidebar):
```
SESSION_SECRET=your-generated-secret-here
```
Replit automatically makes these available as environment variables.

---

### Vercel (Frontend)
```bash
# Using CLI
vercel env add VITE_API_URL

# Or in Vercel Dashboard:
# Settings → Environment Variables
```

Add these variables:
```
VITE_API_URL = https://your-backend-url.com
```

---

### Netlify (Frontend)
```bash
# Using CLI
netlify env:set VITE_API_URL "https://your-backend-url.com"

# Or in Netlify Dashboard:
# Site settings → Environment variables
```

---

### Railway (Backend)
In Railway dashboard → Variables tab:
```
NODE_ENV = production
PORT = 5000
SESSION_SECRET = your-generated-secret
FRONTEND_URL = https://your-frontend-url.vercel.app
```

---

### Render (Backend)
In Render dashboard → Environment tab:
```
NODE_ENV = production
SESSION_SECRET = your-generated-secret
FRONTEND_URL = https://your-frontend-url.vercel.app
```

---

### Heroku (Backend)
```bash
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-generated-secret
heroku config:set FRONTEND_URL=https://your-frontend-url.com

# View all config vars
heroku config
```

---

### AWS EC2 / DigitalOcean (Backend)
Create `.env` file on server:
```bash
# SSH into server
ssh user@your-server-ip

# Navigate to project
cd /path/to/project

# Create .env file
nano .env
```

Paste environment variables, then save (Ctrl+X, Y, Enter).

**Secure the .env file:**
```bash
chmod 600 .env
```

---

## 🔍 Accessing Environment Variables in Code

### Backend (Node.js/Express)
```typescript
// Using dotenv (auto-loaded in development)
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 5000;
const sessionSecret = process.env.SESSION_SECRET;
const dbUrl = process.env.DATABASE_URL;

// Check if required variables exist
if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is required');
}
```

---

### Frontend (Vite/React)
```typescript
// Access with import.meta.env (NOT process.env)
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const analyticsId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

// Check environment
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
```

**Important**: 
- Frontend vars MUST start with `VITE_`
- Use `import.meta.env`, NOT `process.env`
- Never expose secrets in frontend code!

---

## 🛡️ Security Best Practices

### DO ✅
- ✅ Use strong, randomly generated secrets (min 32 characters)
- ✅ Different secrets for dev/staging/production
- ✅ Add `.env` to `.gitignore` (never commit secrets!)
- ✅ Use platform-specific secret managers (Replit Secrets, Vercel Env Vars)
- ✅ Rotate secrets periodically (every 3-6 months)
- ✅ Use environment variables for all sensitive data
- ✅ Validate required environment variables on startup

### DON'T ❌
- ❌ Hard-code secrets in source code
- ❌ Commit `.env` files to Git
- ❌ Share secrets in plain text (email, Slack, etc.)
- ❌ Use simple/guessable secrets like "secret123"
- ❌ Expose backend secrets in frontend code
- ❌ Use same secret across multiple apps

---

## 📝 Example .env File (Development)

```env
# Development Configuration
NODE_ENV=development
PORT=5000

# Generate with: openssl rand -base64 32
SESSION_SECRET=dev-secret-please-change-in-production-J9xK2mN5pQ8rT1uV4

# For local development
FRONTEND_URL=http://localhost:5173

# Local PostgreSQL (optional)
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crm_dev

# Email testing (Mailtrap, Ethereal Email)
# SMTP_HOST=smtp.mailtrap.io
# SMTP_PORT=2525
# SMTP_USER=your-mailtrap-user
# SMTP_PASS=your-mailtrap-pass
```

---

## 📝 Example .env File (Production)

```env
# Production Configuration
NODE_ENV=production
PORT=5000

# Strong secret generated with: openssl rand -base64 32
SESSION_SECRET=Xf9Km2Lp5Nq8Rt1Sv4Wx7Yz0Ab3Cd6Ef9Gh2Jk5Mn8Pq1

# Production frontend URL
FRONTEND_URL=https://your-app.vercel.app

# Production database
DATABASE_URL=postgresql://user:pass@db-host.railway.app:5432/railway

# Production email service
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=CRM System <noreply@yourcompany.com>

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
LOG_LEVEL=error
```

---

## ✅ Validation Checklist

Before deploying, verify:

- [ ] SESSION_SECRET is set and strong (32+ characters)
- [ ] NODE_ENV is set to "production" for production
- [ ] PORT is configured (usually 5000 or platform-specific)
- [ ] FRONTEND_URL matches your actual frontend URL
- [ ] DATABASE_URL is set (if using PostgreSQL)
- [ ] All required secrets are set on deployment platform
- [ ] .env file is in .gitignore
- [ ] No secrets are hard-coded in source code
- [ ] Frontend VITE_ variables are set correctly
- [ ] Test that app works with production env vars

---

## 🔧 Troubleshooting

### Issue: "SESSION_SECRET is not defined"
**Solution**: Set SESSION_SECRET in your .env file or deployment platform

### Issue: CORS errors in production
**Solution**: Set FRONTEND_URL to match your actual frontend domain

### Issue: Frontend can't reach backend API
**Solution**: Set VITE_API_URL in frontend environment variables

### Issue: Environment variables not loading
**Solution**: 
- Backend: Install `dotenv` and call `dotenv.config()` early
- Frontend: Restart dev server after changing .env
- Prefix frontend vars with `VITE_`

### Issue: Different values in dev vs production
**Solution**: Use separate .env files:
- `.env` - Local development
- `.env.production` - Production build
- Platform-specific environment management

---

## 📚 Additional Resources

- [Replit Secrets Documentation](https://docs.replit.com/programming-ide/workspace-features/secrets)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Node.js process.env](https://nodejs.org/api/process.html#processenv)
- [12 Factor App - Config](https://12factor.net/config)

---

**Security Reminder**: Never commit `.env` files to version control!

Add to `.gitignore`:
```
.env
.env.local
.env.production
.env.*.local
```
