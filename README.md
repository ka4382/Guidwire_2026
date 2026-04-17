# BlinkShield AI – AI Powered Income Protection for Gig Workers

![BlinkShield AI Demo](https://via.placeholder.com/1200x600.png?text=BlinkShield+AI+Dashboard+Screenshot)

BlinkShield AI is a state-of-the-art gig worker insurance platform designed specifically for quick commerce drivers (Blinkit, Swiggy Instamart, Zepto). It provides hyper-localized, automated income protection against disruptions like severe weather and unnotified traffic surges. 

Built with **React**, **Node.js**, **Express**, **MongoDB**, and **FastAPI (AI Engine)**, it features real-time weather API ingestion, predictive ML-based risk calculation, and a fraud detection system that utilizes metadata anomaly scores to automatically process or flag claims in seconds.

## 🚀 Features

- **AI-Based Premium Calculation**: Uses individual worker history, historical weather data, and localized risk scores to compute dynamic weekly premiums.
- **Real-Time Weather Integration**: Connects to the Open-Meteo API to monitor live rainfall. Trigger alerts completely automatically if thresholds are breached.
- **Fraud Detection (Hybrid Approach)**: ML capabilities embedded via an Isolation Forest structure alongside heuristics to catch anomalous locations, Photoshop tampers, and impossible physics in claim uploads.
- **Automatic Claim + Payout**: Straight-through processing for valid disruption claims under active policies—no manual adjusters needed!
- **Dashboard Insights**:
  - **Worker View:** Active policy limits, predictive insights on upcoming premium surges, and earnings protection details.
  - **Admin View:** Predictive next-week risk mapping, comprehensive fraud triage queues, and financial overviews.

## 🧠 How it Works

The workflow of BlinkShield AI follows a completely deterministic yet intelligent path to ensure zero user friction:

1. **Weather** is tracked continuously.
2. **Disruption** is logged when a designated threshold (e.g. Rainfall > 2mm/hr) is passed in a gig worker's assigned zone.
3. **Claim** is instantly created and pre-filled.
4. **Fraud** layer investigates the validity, running algorithms on GPS stability and matching metadata.
5. **Payout** executes straight-through if the fraud score is sufficiently low, moving money to the worker's wallet in seconds.

## 💰 Payment Flow
Activating a policy utilizes a simulated payment modal. Workers review their personalized premium bounds (e.g. Pay ₹48 to protect ₹460). Selecting **UPI/QR** or **Card** simulates a secure transaction handshake, immediately activating a 7-day policy complete with a unique `TXN` identifier and validating their claim eligibility.

## 🌍 Real vs Demo Mode
We wanted to prove both the concept's reliability and its production readiness capability. 
Within the system dashboard, users can toggle between:
- **🌍 Real Mode**: Ingests *live* data streams directly via the Open-Meteo API based on Indian latitude/longitude clusters.
- **🎮 Demo Mode**: Uses an offline, deterministic simulation generator allowing administrators and judges to force-trigger specific disruptions (like severe rain or pollution) regardless of the actual weather.

## 🛠️ Tech Stack

- **Frontend Frontstage**: React.js, TailwindCSS, Framer Motion, Vite
- **Backend Orchestrator**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI / ML Microservice**: FastAPI, Scikit-Learn (Isolation Forest), Pandas

## ⚙️ Setup Instructions

### Prerequisites
Make sure you have Node > v18, Docker, and Python 3.10+ installed. This project runs as a monorepo containing multiple microservices.

```bash
# 1. Clone the repository
git clone https://github.com/ka4382/Guidwire_2026
cd project

# 2. Start the entire stack effortlessly using Docker 
# (Spins up Mongo, Node Backend, Python AI Engine, and Vite Frontend)
docker compose up -d
```
*The frontend will be available at `http://localhost:5173`. Demo mode exists at `http://localhost:5173/demo`.*

---

## 🎥 Demo Video

**Demo Video**: [ADD YOUR VIDEO LINK HERE]

---

## 📊 Pitch Deck

**Pitch Deck**: [ADD YOUR DRIVE LINK HERE]

---

## 📦 Folder Structure
```text
BlinkShield_AI/
├── backend/            # Express.js REST API
│   ├── src/
│   │   ├── controllers/ # Route logic (e.g. payment.controller.js)
│   │   ├── services/    # Business logic (e.g. weather.service.js)
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # Endpoints
│   │   └── ...
├── frontend/           # React.js SPA Client
│   ├── src/
│   │   ├── api/         # Axios wrappers coordinating endpoints
│   │   ├── components/  # Reusable UI Blocks (PaymentModal, FraudMeter)
│   │   ├── pages/       # Dashboard routes
│   │   └── ...
├── ai-engine/          # FastAPI Python Server
│   ├── main.py
│   ├── models/          # IsolationForest pickled states
│   └── ...
└── docker-compose.yml   # Multi-container orchestration
```
