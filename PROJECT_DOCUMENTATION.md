# BlinkShield AI — Technical Deep-Dive Documentation

## 1. The Problem

Gig workers operating in quick-commerce sectors (Blinkit, Swiggy Instamart, Zepto) suffer from unstable daily incomes. A single 2-hour heavy rainfall or an unexpected zone closure can completely eradicate a worker's earnings for the day. Existing insurance products do not cater to these micro-disruptions — they only cover catastrophic accidents or hospitalizations over long-term, multi-month policies. Gig workers are left highly vulnerable to conditions outside of their control.

**Key Statistics:**
- India has 15M+ gig workers, growing 25% YoY
- 68% of delivery workers report weather-related income loss monthly
- Zero insurance products cover sub-24-hour disruptions

---

## 2. The Solution

**BlinkShield AI** introduces micro-duration, hyper-localized **Parametric Income Protection**. Rather than relying on traditional slow adjusters, the platform leverages AI and real-time data to:

1. **Underwrite** personalized weekly premiums across 3 coverage tiers
2. **Track** disruptions automatically via external APIs (Open-Meteo)
3. **Process** claims with hybrid ML fraud detection
4. **Disburse** immediate straight-through payouts when legitimate

The entire cycle — from disruption detection to payout — can complete in under 60 seconds.

---

## 3. Architecture Overview

The platform operates as a specialized full-stack microservices ecosystem:

### Frontend Panel (React/Vite)
A modular, mobile-responsive dashboard providing:
- Personalized AI insights with visual explainability (Fraud Meters, Decision Timelines, Impact Cards)
- Multi-tier plan selection with dynamic pricing display
- Built-in simulated payment processing pipeline
- Evidence upload with live image previews
- Real-time disruption monitoring with event grouping

### Backend Orchestrator (Express/Node.js)
The central nervous system handling:
- REST API spanning Auth, Analytics, Dashboards, Claims, Payments, and Simulation
- Deterministic engine switching between Live-API feeds and Fallback Mock-Generators
- Atomic policy activation via `findByIdAndUpdate` with `{ new: true }`
- Multer-powered media upload pipeline (5MB limit)
- Static file serving for uploaded evidence

### AI Core Engine (FastAPI)
A Python-centric microservice for:
- Advanced heuristics and Machine Learning
- Anomaly detection via Isolation Forests
- Risk assessment and premium calculation
- Independent scaling of computational workloads

### Database Layer (MongoDB)
Document-based storage with schemas for:
- **User** — Authentication, roles (worker/admin), assigned zones
- **WorkerProfile** — Earnings history, activity patterns
- **Policy** — Coverage details, activation state, payment records
- **Claim** — Disruption linkage, fraud scores, evidence URLs
- **DisruptionEvent** — Type, zone, severity, evidence arrays
- **FraudSignal** — Metadata anomaly scores
- **Payout** — Amount, status, linked claim reference

---

## 4. AI & Machine Learning Usage

### 4.1 Predictive Underwriting (Premium Calculation)
BlinkShield calculates premiums dynamically by evaluating:
- Worker's historical completion consistency in their assigned zone
- Temporal risk indicators (next week's probability of rain or severe pollution)
- Zone-specific disruption frequency and severity patterns

**Multi-Tier Output:**
| Tier | Premium Multiplier | Coverage Multiplier | Target User |
|------|-------------------|--------------------:|-------------|
| Lite | 0.6× base | 0.6× base | Budget-conscious workers |
| Standard | 1.0× base | 1.0× base | Average risk tolerance |
| Premium | 1.6× base | 1.6× base | Maximum protection seekers |

### 4.2 Hybrid Fraud Detection
The AI Fraud Engine inspects incoming claims using a composite scoring system (0–100):

1. **Metadata Signatures** — Checks if uploaded proof files exhibit anomalies tied to Photoshop, hex editors, or timestamp manipulation.
2. **Behavioral Physics** — Validates whether logged velocities and GPS coordinates match realistic human physics.
3. **Isolation Forest Model** — Flags statistical outliers that deviate structurally from validated historical claim patterns.
4. **Cross-Referencing** — Compares claim timing against actual weather data for the reported zone.

**Decision Thresholds:**
- **Score < 30**: Auto-approve → straight-through payout
- **Score 30–70**: Flag for admin review → manual investigation
- **Score > 70**: Auto-reject → alert admin console

### 4.3 Predictive Risk Mapping
Derives likely future disruptions week-over-week per delivery zone by analyzing:
- Historical weather pattern correlations
- Seasonal disruption frequency
- Zone-level claim density metrics

---

## 5. Core Application Features

### 5.1 Payment & Policy Activation
- Simulated payment gateway supporting UPI/QR and Card modalities
- Atomic policy updates using MongoDB `findByIdAndUpdate` with `{ new: true }` ensuring the updated document is returned immediately
- 7-day policy duration with `startDate`, `endDate`, `paymentMethod`, and `transactionId` persistence
- Frontend state synchronization via `response.data.data` pattern

### 5.2 Claims Processing Pipeline
- **8 Disruption Types**: Heavy Rainfall, Extreme Heat, Severe AQI, Zone Closure, Platform Outage, Unplanned Curfew, Local Strike, Market Closure
- **Strict Policy Validation**: Claims require `isActive: true` AND `endDate > new Date()` using `workerId` (not `userId`)
- **Evidence Upload**: Multer middleware handles `multipart/form-data` with 5MB file size limit
- **Manual Review**: Worker-filed claims default to `pending_review` status for admin verification

### 5.3 Live Disruption Monitoring
- Real-time event streaming from Open-Meteo API
- Event deduplication using composite keys (`type + zone + timestamp`)
- Grouped display with counts (e.g., "Heavy Rainfall (3 events)")
- Latest 5 unique events shown to prevent UI overflow

### 5.4 Dashboard Intelligence
- **Worker View**: Active policy badge ("🟢 ACTIVE POLICY"), income protection banner, premium explainability via AI Insights component, claims breakdown (approved/flagged/rejected), and earnings summary
- **Admin View**: System-wide metrics, fraud triage queue, disruption heatmaps, financial overview
- **Empty States**: Friendly messaging ("No claims yet. You are protected!") for zero-state screens

### 5.5 Simulation Pipeline
- Toggle between **Real Mode** (live API data) and **Demo Mode** (deterministic simulation)
- Force-trigger specific disruptions (rain, pollution, fraud) for presentation reliability
- Fail-safe architecture ensuring demos never break regardless of external API availability

---

## 6. API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new worker/admin |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user profile |

### Premium & Policy
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/premium/calculate` | Calculate personalized premium |
| POST | `/api/policies` | Create a new policy |
| PATCH | `/api/policies/:id/activate` | Activate a policy |
| POST | `/api/payment/simulate` | Process simulated payment |

### Claims
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/claims/file` | File manual claim (multipart) |
| POST | `/api/claims/trigger` | Auto-trigger claim from event |
| GET | `/api/claims/:workerId` | Get worker's claims |
| GET | `/api/claims/admin/pending` | Admin: get pending claims |
| PATCH | `/api/claims/:id/review` | Admin: review a claim |

### Disruptions & Simulation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/disruptions/live` | Get live disruption feed |
| POST | `/api/simulation/rain` | Simulate rainfall event |
| POST | `/api/simulation/pollution` | Simulate pollution event |
| POST | `/api/simulation/fraud` | Simulate fraudulent claim |

---

## 7. Data Flow Diagrams

### Payment → Policy Activation Flow
```
Worker selects plan → PaymentModal opens → Simulated payment
    → Backend: Policy.findByIdAndUpdate({ isActive: true, ... }, { new: true })
    → Returns updated policy → Frontend: setPolicy(response.data.data)
    → Dashboard shows "🛡️ Income protected" banner
```

### Claim Filing Flow
```
Worker selects disruption type → Adds description → Uploads evidence (optional)
    → Frontend: FormData with media file → Backend: multer parses file
    → Policy validation: isActive=true AND endDate > now
    → DisruptionEvent created → AI Fraud scoring → Claim created
    → Status set to "pending_review" → Admin notified
```

---

## 8. Security & Data Integrity

- **JWT Authentication** — All API routes protected via `requireAuth` middleware
- **Role-Based Access** — Admin-only routes guarded by `requireRole("admin")`
- **Atomic Updates** — MongoDB `findByIdAndUpdate` with `{ new: true }` prevents stale reads
- **File Upload Safety** — Multer configured with 5MB limit and restricted MIME types
- **Input Validation** — Joi/Zod schemas on critical endpoints
- **Error Handling** — Global `errorHandler` middleware with structured `ApiError` responses

---

## 9. Future Scope

- **IoT Fleet Device Integration** — Real-time accelerometer and telemetry data from delivery vehicles for hyper-accurate behavior profiles.
- **Plaid/Stripe Integration** — Production payment processing with sandbox-enabled fund capturing and disbursement.
- **Blockchain Smart Contracts** — Oracle-verified disruption payouts via crypto wallets eliminating banking transaction delays.
- **Multi-Language Support** — Hindi, Tamil, Kannada, and Telugu localization for broader gig worker accessibility.
- **Push Notifications** — Real-time disruption alerts and claim status updates via FCM/APNs.
- **Advanced Analytics** — Time-series forecasting for premium optimization and loss ratio management.

---

## 10. Deployment

The application is fully containerized using Docker Compose:

```yaml
services:
  mongo:       # MongoDB 7.0 — persistence layer
  ai-engine:   # FastAPI — ML/AI microservice (port 8000)
  backend:     # Express.js — REST API (port 5000)
  frontend:    # Vite/React — SPA client (port 5173)
```

**Production Deployment:**
```bash
docker compose up --build -d
```

All services communicate over an internal Docker network. The frontend proxies API requests to the backend via Vite's dev server configuration.
