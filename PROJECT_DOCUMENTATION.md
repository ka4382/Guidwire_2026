# BlinkShield AI - Deep Dive Documentation

## 1. The Problem
Gig workers operating in quick-commerce sectors (Blinkit, Swiggy Instamart, Zepto) suffer from unstable daily incomes. A single 2-hour heavy rainfall or an unexpected traffic surge due to localized events can completely eradicate a worker's earnings for the day. Existing insurance products do not cater to these micro-disruptions; they only cover catastrophic accidents or hospitalizations over long-term multi-month policies. Gig workers are left highly vulnerable to conditions outside of their control.

## 2. The Solution
**BlinkShield AI** introduces micro-duration, hyper-localized Parametric Income Protection. Rather than relying on traditional slow adjusters, the platform leverages AI and metadata to underwrite weekly premiums, track localized disruption automatically via external APIs (such as Open-Meteo), and issue immediate straight-through payouts when workers are impacted by legitimate downtime.

## 3. Architecture Overview
The platform operates as a specialized full-stack ecosystem:
- **Frontend Panel (React/Vite)**: A modular, mobile-responsive dashboard supplying personalized insights, visual AI explanations (Fraud Meters, Decision Timelines, Impact Cards), and a built-in mock payment processing pipeline for premium activations.
- **Backend Orchestrator (Express/Node.js)**: The central Nervous System handling REST API requests spanning Auth, Analytics, Dashboards, and Simulation Pipelines. Crucially, it manages the deterministic engine switching between Live-API feeds and Fallback Mock-Generators for demonstration resiliency.
- **AI Core Engine (FastAPI)**: A Python-centric microservice dedicated to advanced heuristics and Machine Learning. By segregating ML tasks such as anomaly detection (via Isolation Forests) from the standard CRUD backend, we allow the platform to scale its computational footprint independently.

## 4. AI & Machine Learning Usage
### Predictive Underwriting
BlinkShield calculates premiums dynamically by evaluating the correlation between a worker's historical completion consistency in their assigned zone and incoming temporal risk indicators (next week's probability of rain or severe pollution).

### Hybrid Fraud Detection
The AI Fraud Engine inspects incoming Claims by assigning a composite score between 0 and 100 based on:
1. **Metadata Signatures**: Checks if uploaded proof files exhibit metadata anomalies typically tied to Photoshop or Hex Editors.
2. **Behavioral Physics**: Calculates if the user's logged velocities and GPS coordinates match realistic physics.
3. **Isolation Forest Model**: Flags outliers structurally distinct from the mathematical representations of thousands of valid historical claims. 

Claims spanning below the risk threshold map to automatic processing; those spiking into the "Red" bounds instantly alert administrators via the Risk Console.

## 5. Core Application Features
- **Simulation Pipeline Orchestrator**: Supports toggling between an integrated **Open-Meteo Live feed** and an offline Sandbox mock layer. Designed primarily for hackathon presentations, the sandbox visually guarantees a fail-safe demo.
- **Predictive Risk Map Generation**: Derives likely future disruptions week-over-week per delivery zone.
- **Advanced Visual UI Suite**: Dedicated React components abstracting complexities into simple explainability tiles (Timelines, Meters, Impact Cards).
- **Simulated Payment Gateway**: A fully integrated module modeling UPI and Card processing constraints securely resulting in automated policy activation.

## 6. Future Scope
- **IoT Fleet Device Integration:** Sourcing real-time accelerometer and telemetry data natively from the worker's transport vehicle to construct hyper-accurate behavior profiles instead of relying solely on mobile-app GPS pings.
- **Plaid/Stripe Abstraction:** Transitioning the mocked payment gateway to a sandbox-enabled processor to allow exact fund capturing and disbursement.
- **Blockchain Smart Contracts:** Implementing the disruption payout mechanism via verified oracle nodes executing immediate payouts to zero-fee crypto wallets eliminating standard banking transaction lags.
