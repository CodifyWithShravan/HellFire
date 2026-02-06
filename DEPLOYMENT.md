# 🚀 MarketMind AI - Deployment Guide

## Complete Step-by-Step Guide to Deploy Frontend (Vercel) + Backend (Render)

---

## 📋 Pre-Deployment Checklist

Before you start, make sure you have:

- [ ] GitHub account with your code pushed
- [ ] Vercel account ([sign up free](https://vercel.com/signup))
- [ ] Render account ([sign up free](https://render.com/))
- [ ] Your API keys ready:
  - `GROQ_API_KEY` from [console.groq.com](https://console.groq.com/)
  - `NEWS_API_KEY` from [newsapi.org](https://newsapi.org/)

---

## Part 1: Push Code to GitHub

### Step 1.1: Initialize Git (if not done)
```bash
cd MarketMind
git init
git add .
git commit -m "Initial commit - MarketMind AI"
```

### Step 1.2: Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Name it `MarketMind` (or your preferred name)
3. Keep it **Public** or **Private**
4. Click **Create repository**

### Step 1.3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/MarketMind.git
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy Backend on Render

### Step 2.1: Create render.yaml (Already created for you!)
The `render.yaml` file in your project root configures automatic deployment.

### Step 2.2: Go to Render Dashboard
1. Visit [dashboard.render.com](https://dashboard.render.com/)
2. Click **New +** → **Web Service**

### Step 2.3: Connect GitHub
1. Click **Connect GitHub**
2. Authorize Render to access your repositories
3. Select the **MarketMind** repository

### Step 2.4: Configure the Service
Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | `marketmind-api` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

### Step 2.5: Set Environment Variables
Click **Environment** → **Add Environment Variable**:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `your_groq_api_key_here` |
| `NEWS_API_KEY` | `your_newsapi_key_here` |
| `PYTHON_VERSION` | `3.11` |

### Step 2.6: Select Free Plan
1. Scroll down to **Instance Type**
2. Select **Free** ($0/month)
3. Click **Create Web Service**

### Step 2.7: Wait for Deployment
- Render will build and deploy your backend
- This takes 2-5 minutes
- When status shows **Live**, copy your URL:
  ```
  https://marketmind-api.onrender.com
  ```

> ⚠️ **Important**: Save this URL! You'll need it for the frontend.

---

## Part 3: Update Frontend for Production

### Step 3.1: Create Environment File for Frontend
Create a file `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://marketmind-api.onrender.com
```

### Step 3.2: Update API Calls (CRITICAL!)
You need to update the frontend to use the environment variable instead of `localhost`.

The API calls in your components currently use:
```typescript
fetch('http://localhost:8000/campaign', ...)
```

Change them to:
```typescript
fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaign`, ...)
```

**Files to update:**
- `components/CampaignGenerator.tsx` (line ~80)
- `components/PitchCreator.tsx` (line ~49)
- `components/LeadScorer.tsx` (line ~47)
- `components/CompanyIntel.tsx` (line ~78)

Or use the helper file I've created: `frontend/lib/api.ts`

### Step 3.3: Commit Changes
```bash
git add .
git commit -m "Update API URLs for production"
git push origin main
```

---

## Part 4: Deploy Frontend on Vercel

### Step 4.1: Go to Vercel
1. Visit [vercel.com/new](https://vercel.com/new)
2. Sign in with GitHub

### Step 4.2: Import Repository
1. Click **Import** next to your `MarketMind` repository
2. If not visible, click **Adjust GitHub App Permissions**

### Step 4.3: Configure Project
Fill in these settings:

| Field | Value |
|-------|-------|
| **Project Name** | `marketmind` |
| **Framework Preset** | `Next.js` (auto-detected) |
| **Root Directory** | `frontend` |

### Step 4.4: Set Environment Variables
Click **Environment Variables** and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://marketmind-api.onrender.com` |

> 📝 Replace with your actual Render URL from Step 2.7

### Step 4.5: Deploy
1. Click **Deploy**
2. Wait 1-2 minutes for build
3. 🎉 Your site is live!

### Step 4.6: Get Your URL
Vercel will give you a URL like:
```
https://marketmind.vercel.app
```

---

## Part 5: Post-Deployment

### Step 5.1: Update CORS (Important!)
Update your backend `main.py` to allow your Vercel domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://marketmind.vercel.app",  # Add your Vercel URL
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Push the change:
```bash
git add .
git commit -m "Update CORS for production"
git push origin main
```

Render will automatically redeploy.

### Step 5.2: Test Your Deployment
1. Open your Vercel URL
2. Click **Get Started**
3. Try generating a campaign for "Tesla"
4. Verify all features work!

---

## 🔧 Troubleshooting

### Backend not responding?
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set
- Make sure the backend is "Live" status

### Frontend shows "Failed to fetch"?
- Check browser console for CORS errors
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Make sure the URL has `https://` and NO trailing slash

### Render free tier sleeping?
- Free tier services spin down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading or use a monitoring service to keep it awake

---

## 📊 Summary

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | `https://marketmind.vercel.app` |
| Backend | Render | `https://marketmind-api.onrender.com` |

---

## ✅ Deployment Complete!

Your MarketMind AI is now live on the internet! 🎉

Share your URL and start generating AI-powered Battle Cards for sales teams everywhere.

