# Kwiz Frontend Deployment Guide

## Railway Deployment (React App)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Frontend deployment ready"
git push origin main
```

### Step 2: Railway Setup
1. Go to [railway.app](https://railway.app)
2. Sign up/login with your GitHub account
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your **kwiz-frontend** repository
6. Railway auto-detects React project and builds it

### Step 3: Environment Variables
In Railway dashboard → Variables:
```
REACT_APP_API_URL=https://your-backend.railway.app
```
Replace with your actual Railway backend URL.

### Step 4: Custom Domain
1. In Railway dashboard → Settings → Domains
2. Add custom domain: `kwiz.fun`
3. Update DNS records as instructed by Railway

### Step 5: Connect to Backend
- Both frontend and backend on Railway
- Easy environment variable sharing
- Simplified CORS configuration

## Alternative Platforms

### Netlify Deployment
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build settings: `npm run build`, publish: `build`
4. Set `REACT_APP_API_URL` environment variable

### Vercel Deployment
1. Go to [vercel.com](https://vercel.com)
2. Import repository
3. Set `REACT_APP_API_URL` environment variable

## Local Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Environment Files
- `.env.development` - Local development (localhost:8000)
- `.env.production` - Production (Railway backend URL)

## Features
- Daily Bollywood trivia quizzes
- Timer system (Wordle-style)
- Local storage statistics
- Social media sharing
- Mobile responsive design
