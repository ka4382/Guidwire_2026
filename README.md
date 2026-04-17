# BlinkShield AI – AI-Powered Income Protection for Gig Workers

> 🏆 **Guidewire Hackathon 2026** — Parametric Micro-Insurance Platform

BlinkShield AI is a production-grade gig worker insurance platform built for quick-commerce drivers (Blinkit, Swiggy Instamart, Zepto). It delivers hyper-localized, automated income protection against real-world disruptions — severe weather, zone closures, platform outages, and more.

Built with **React**, **Node.js**, **Express**, **MongoDB**, and **FastAPI (AI Engine)**, it features real-time weather API ingestion, predictive ML-based risk calculation, multi-tier dynamic pricing, and a hybrid fraud detection system that processes claims in seconds.

---

## 🚀 Key Features

### 🧠 AI-Powered Core
- **Dynamic Premium Calculation** — Uses worker history, weather forecasts, and zone-level risk scores to generate personalized weekly premiums across 3 tiers (Lite / Standard / Premium).
- **Hybrid Fraud Detection** — Isolation Forest ML model + metadata heuristics (GPS physics, Photoshop signatures, timestamp anomalies) for composite fraud scoring.
- **Predictive Risk Mapping** — Forecasts next-week disruption probability per delivery zone.

### 🌦️ Real-Time Disruption Monitoring
- **Live Weather Integration** — Open-Meteo API streams real-time rainfall, temperature, and AQI data for Indian metro zones.
- **Automatic Claim Triggers** — Disruption events auto-create claims when thresholds are breached.
- **Event Deduplication** — Intelligent grouping of similar events with counts and latest timestamps.

### 💰 End-to-End Payment & Policy System
- **Multi-Tier Pricing** — Workers choose between Lite (60%), Standard (100%), or Premium (160%) coverage plans.
- **Simulated Payment Gateway** — UPI/QR and Card payment flows with transaction IDs.
- **Atomic Policy Activation** — Payment success immediately activates a 7-day policy with persistent `isActive` state in MongoDB.
- **Income Protection Banner** — Dashboard prominently displays "🛡️ Your income is protected for this week" when active.

### 📋 Claims & Evidence System
- **Manual Claim Filing** — Workers report 8 disruption types (rainfall, extreme heat, AQI, zone closure, platform outage, curfew, strike, market closure).
- **Media Upload** — Multer-powered evidence uploads (images/videos, max 5MB) with live preview.
- **Strict Policy Validation** — Claims require an active, non-expired policy (`isActive: true` + `endDate > now`).
- **Admin Review Queue** — Manual claims are set to `pending_review` for admin verification.

### 📊 Intelligent Dashboards
- **Worker Dashboard** — Active policy status, premium explainability, claims breakdown, earnings summary, and AI insights.
- **Admin Dashboard** — System-wide analytics, fraud triage queues, disruption heatmaps, and financial overviews.
- **Empty States** — Clean "No claims yet. You are protected!" messaging for new users.

### 🌍 Real vs Demo Mode
- **🌍 Real Mode** — Ingests live data from Open-Meteo API based on Indian lat/lng clusters.
- **🎮 Demo Mode** — Deterministic simulation generator for force-triggering disruptions during presentations.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, TailwindCSS, Framer Motion, Vite |
| **Backend** | Node.js, Express.js, Multer (file uploads) |
| **Database** | MongoDB (Mongoose ODM) |
| **AI / ML** | FastAPI, Scikit-Learn (Isolation Forest), Pandas |
| **Infrastructure** | Docker Compose (multi-container orchestration) |
| **APIs** | Open-Meteo (weather), QRServer (QR generation) |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js ≥ v18
- Docker & Docker Compose
- Python 3.10+ (for AI engine)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/ka4382/Guidwire_2026.git
cd BlinkShield_AI

# 2. Start the entire stack with Docker
docker compose up --build -d

# 3. Access the application
# Frontend:  http://localhost:5173
# Backend:   http://localhost:5000
# AI Engine: http://localhost:8000
```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Worker | `rahul@blinkit.com` | `password123` |
| Admin | `admin@blinkshield.ai` | `admin123` |

---

## 🧪 End-to-End Test Flow

1. **Register/Login** as a worker
2. **Get Quote** → View personalized Lite / Standard / Premium plans
3. **Pay & Activate** → Select a plan, complete simulated payment
4. **Verify Dashboard** → See "🛡️ Income protected" banner + "🟢 ACTIVE POLICY" badge
5. **File a Claim** → Select disruption type, add description, upload evidence image
6. **Admin Review** → Login as admin, review pending claims in the triage queue
7. **Simulation** → Use Demo Mode to force-trigger weather disruptions

---

## 📦 Project Structure

```text
BlinkShield_AI/
├── backend/                # Express.js REST API
│   ├── src/
│   │   ├── controllers/    # Route handlers (payment, claim, dashboard)
│   │   ├── services/       # Business logic (premium calc, fraud, weather)
│   │   ├── models/         # Mongoose schemas (Policy, Claim, User)
│   │   ├── routes/         # API endpoints with middleware
│   │   ├── middleware/      # Auth, validation, error handling
│   │   └── config/         # Environment & DB configuration
│   └── uploads/            # Evidence files (images/videos)
├── frontend/               # React.js SPA
│   ├── src/
│   │   ├── api/            # Axios API client wrappers
│   │   ├── components/     # Reusable UI (PaymentModal, FraudMeter, Badge)
│   │   ├── pages/          # Route pages (Dashboard, Quote, Claims, Monitor)
│   │   ├── context/        # Auth context provider
│   │   └── hooks/          # Custom React hooks
├── ai-engine/              # FastAPI Python microservice
│   ├── main.py             # Risk assessment & fraud detection endpoints
│   ├── models/             # Isolation Forest trained models
│   └── requirements.txt
└── docker-compose.yml      # Multi-container orchestration
```

---

## 🎥 Demo Video

**Demo Video**: [[click Here](https://youtu.be/pnlubrsX_EA)]

---

## 📊 Pitch Deck

**Pitch Deck**: [[Click Here]](https://docs.google.com/presentation/d/1E_N7hcbKREWUPsCNmDEqTaMxPTKj4ggL/edit?usp=sharing&ouid=108578372458265652384&rtpof=true&sd=true)

---

## 👥 Team

**Team CodeRed 2026** — Built for the Guidewire Hackathon

---

## 📄 License

This project is built for the Guidewire Hackathon 2026. All rights reserved.
