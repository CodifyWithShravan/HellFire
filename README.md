<div align="center">

# 🎯 MarketMind AI

### **Sales Intelligence War Room**

*AI-powered Battle Cards • Real-time Market Signals • Smart Outreach*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-marketmind--black.vercel.app-00C7B7?style=for-the-badge)](https://marketmind-black.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Groq](https://img.shields.io/badge/Groq-LLaMA%203.3-orange?style=for-the-badge)](https://groq.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

### 🌐 **[Try the Live Demo →](https://marketmind-black.vercel.app)**

[Features](#-features) • [Quick Start](#-quick-start) • [API Keys](#-api-keys-setup) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Campaign Generator** | Generate marketing campaigns for LinkedIn, Twitter, Facebook, Instagram & YouTube |
| 🎤 **Pitch Creator** | Craft personalized 30-second elevator pitches with value propositions |
| 📊 **Lead Scorer** | Qualify and score leads with AI-powered analysis |
| 🏢 **Company Intel** | Get real-time financial data, news sentiment, and tactical strategies |
| 📧 **Smart Outreach** | Generate hyper-personalized cold emails based on market signals |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://www.python.org/))
- **Groq API Key** ([Get Free Key](https://console.groq.com/))
- **News API Key** ([Get Free Key](https://newsapi.org/))

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/MarketMind.git
cd MarketMind
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (see API Keys section below)
cp .env.example .env
```

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install
```

### 4️⃣ Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
python main.py
```
> Backend runs on: `http://localhost:8000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
> Frontend runs on: `http://localhost:3000`

### 5️⃣ Open in Browser

Visit **[http://localhost:3000](http://localhost:3000)** and start generating Battle Cards! 🎮

---

## 🔑 API Keys Setup

Create a `.env` file in the `backend/` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
NEWS_API_KEY=your_newsapi_key_here
```

### Getting API Keys

| Service | Link | Free Tier |
|---------|------|-----------|
| **Groq** | [console.groq.com](https://console.groq.com/) | ✅ Free - Fast LLaMA 3.3 70B inference |
| **News API** | [newsapi.org](https://newsapi.org/) | ✅ Free - 100 requests/day |

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 16.1 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Theme:** Dark Glassmorphism War Room

### Backend
- **Framework:** FastAPI
- **AI Model:** Groq LLaMA 3.3 70B
- **Financial Data:** Yahoo Finance (yfinance)
- **News Data:** NewsAPI
- **Validation:** Pydantic

---

## 📁 Project Structure

```
MarketMind/
├── backend/
│   ├── main.py              # FastAPI server & AI logic
│   ├── requirements.txt     # Python dependencies
│   └── .env                  # API keys (create this)
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main dashboard
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # War Room theme
│   │
│   ├── components/
│   │   ├── HeroLanding.tsx      # Landing page
│   │   ├── CampaignGenerator.tsx
│   │   ├── PitchCreator.tsx
│   │   ├── LeadScorer.tsx
│   │   └── CompanyIntel.tsx
│   │
│   └── package.json
│
└── README.md
```

---

## 🎨 Screenshots

<details>
<summary>Click to view screenshots</summary>

### Landing Page
The stunning Get Started page with floating orbs and typewriter effect.

### Campaign Generator
Generate platform-specific marketing campaigns with AI.

### Company Intel
Real-time financial data with tactical sales strategies.

</details>

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/campaign` | Generate marketing campaign |
| `POST` | `/pitch` | Create sales pitch |
| `POST` | `/score` | Score a lead |
| `POST` | `/intel` | Get company intelligence |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ for the Modern Sales Team**

*Powered by Groq LLaMA 3.3 70B • Real-time Market Intelligence*

</div>
