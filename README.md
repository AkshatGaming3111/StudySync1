# StudySync – AI Educational Suite 🎓✨
> **The Unified Gateway Connecting Self-Paced Focus Mastery and Virtual Pedagogical Collaboration**

Welcome to **StudySync - AI Educational Suite** (`http://localhost:3000`), the central index portal and orchestration hub linking two cutting-edge AI-powered academic platforms:
1. **StudySync – AI Smart Study Planner** (`http://localhost:5000`)
2. **StudySync – AI Interactive Classroom** (`http://localhost:5001`)

---

## 🏛️ Ecosystem Overview

```
                      ┌────────────────────────────────────────┐
                      │    StudySync AI Educational Suite      │
                      │       http://localhost:3000            │
                      │    (Central Index Portal & Backend)    │
                      └──────────────────┬─────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
  ┌───────────────────────────────┐               ┌───────────────────────────────┐
  │   AI Smart Study Planner      │               │   AI Interactive Classroom    │
  │     http://localhost:5000     │               │     http://localhost:5001     │
  ├───────────────────────────────┤               ├───────────────────────────────┤
  │ • AI Syllabus Deconstruction  │               │ • StudyBot 3.0 Co-Pilot       │
  │ • Pomodoro & Ambient Sound    │               │ • SyncBoard Smart Whiteboard  │
  │ • Chrome Focus Lock Companion │               │ • Automated Homework Grading  │
  │ • Screen-Time & Velocity Data │               │ • AI Exam Arena & Quizzes     │
  │ • Milestone Task Roadmap      │               │ • Dynamic XP Leaderboard      │
  └───────────────────────────────┘               └───────────────────────────────┘
```

---

## 🌟 Key Highlights & Features of the Common Index Page

### 1. 🔀 Divided 2-Section Dual Showcase
- **Split Cockpit Layout**: Exhaustive details, feature checklists, technology specs, and simulated mini-dashboards for both websites.
- **Interactive View Switcher**: *Dual Comparison View*, *Focus on Study Planner*, and *Focus on Classroom*.
- **Clickable Launch Buttons**: High-impact glowing launch buttons and direct sub-link chips to specific areas (Dashboard, Focus Sanctuary, Sign-In, Whiteboard, Exam Arena).

### 2. 🌌 Educational Theme with Synaptic Particle Mesh Canvas
- **Synaptic Neural Mesh Canvas**: Lightweight interactive HTML5 `<canvas>` background rendering drifting academic formulas and glowing neural nodes with cursor synaptic filaments and spark impulses.
- **Mouse Cursor Spotlight Glow & Interactive Card Borders**: Dual-layer glassmorphism illumination effect with proximity-based border lighting (`-webkit-mask` XOR composite) and subtle specular 3D tilt across cards.
- **Sliding Marquee Ticker**: Infinite sliding educational subject ticker detailing core features across both platforms.
- **Permanent Dark Theme**: Ultra-modern OLED dark aesthetic optimized for long study sessions.

### 3. 🎯 Interactive 5-Axis Academic Skill Radar (Spider Chart)
- **Cognitive Strengths Comparison**: Interactive vector radar chart comparing what each platform trains in a student:
  - 🎯 *Algorithmic Reasoning* (Classroom • 98%)
  - ⏳ *Deep Work Stamina* (Planner • 96%)
  - 📝 *Exam Precision & Diagnostic Recall* (Classroom • 95%)
  - 🚫 *Distraction Resistance* (Planner • 98%)
  - 🎨 *Visual & Spatial Derivations* (Classroom • 94%)
- **Dynamic Filter Modes**: Toggle between Unified Suite Synergy (96.2%), Study Planner Discipline, and Classroom Mastery.
- **Bi-Directional Hover Linking**: Hovering over any radar node or skill breakdown card illuminates its axis line and updates live telemetry.

### 4. 💎 Commercialization & Monetization Suite
- **Transparent Academic Pricing**:
  - **Explorer Free ($0/mo)**: 1 Course Syllabus, 25 daily Socratic queries, Pomodoro Sanctuary, Local SyncBoard.
  - **Scholar Pro ($9.99/mo or $6.50/mo billed annually at $78/yr)**: Unlimited syllabi decomposition, Chrome Focus Lock Companion, SyncBoard AI OCR to LaTeX, AI Diagnostic Exam Arena with score prediction, StudyBot 3.0 Turing/Franklin personas, priority Gemini token routing.
  - **Study Squad & Campus ($19.99/mo or $4/seat/mo for schools)**: 5 student seats, Multiplayer SyncBoard rooms with voice & OCR, Faculty Rubric Auto-Grading Studio, Student Risk Radar & Attrition Prediction, Canvas/Google Classroom LTI 1.3 sync.
- **Monthly / Annual Billing Switcher**: Real-time price updating with a 35% annual discount toggle.
- **Interactive Academic ROI & Time-Savings Calculator**: Dynamic slider calculating score lift (+14% to +38.5%), weekly syllabus hours saved, and private tutoring cost replacement value.
- **Interactive Checkout Modal**: Complete with sandbox test verification, coupon validation engine (`STUDYSYNC30` for 30% off), instant Pro entitlement unlock, and live navbar badge updates (`👑 Scholar Pro Active`).
- **Campus & Institutional Pilot Modal**: B2B intake form dispatching leads to `/api/billing/enterprise-inquiry`.

### 5. 🧠 Student Interest Hub & Curriculum Telemetry
- **Interactive Habit Streak Flame**: Click-to-boost streak counter with gamified milestone badges (*7-Day Sprint, 14-Day Titan, 30-Day Grandmaster*).
- **Daily Scholar Mindset**: Dynamic inspirational quotes from Turing, Franklin, Gandhi, and Mandela with one-click rotator.
- **Curriculum Telemetry**: Live counters displaying 250+ curriculum modules, 45.8K+ AI diagnostic questions, and 18,400+ focus hours.

### 6. 🛠️ Microservice Health & Entitlement Aggregator
- Express backend running on **Port 3000**.
- **Real-Time Port Ping**: `/api/status` pings `http://localhost:5000` and `http://localhost:5001`, reporting live online/standby status and roundtrip latency in milliseconds.

---

## 💳 Billing & Commercialization API Endpoints (Port 3000)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/billing/plans` | `GET` | Returns full plan catalog (Explorer, Scholar Pro, Study Squad) with feature matrices |
| `/api/billing/verify-coupon` | `POST` | Validates promotional codes (e.g. `STUDYSYNC30`, `EXAMREADY`) with real-time discount calculation |
| `/api/billing/create-checkout-session` | `POST` | Generates a Stripe Checkout session (live) or instant Sandbox session |
| `/api/billing/complete-test-checkout` | `POST` | Confirms test payment and activates Pro entitlement in session registry |
| `/api/billing/subscription-status` | `GET` | Queries active subscription entitlements by session ID |
| `/api/billing/enterprise-inquiry` | `POST` | Ingests B2B campus pilot and departmental inquiries |
| `/api/billing/webhook` | `POST` | Webhook listener for Stripe and Lemon Squeezy subscription lifecycle events |

---

## 🗄️ Enterprise Database Schema (PostgreSQL / Supabase)

The complete multi-tenant database schema is located at **`server/db/schema.sql`** and includes:
- `users`: Identity and role management (`student`, `instructor`, `institution_admin`).
- `user_entitlements`: Commercial plan tier tracking (`explorer`, `scholar_pro`, `study_squad`, `campus_enterprise`).
- `billing_transactions`: Audit trail of payments across Stripe, Lemon Squeezy, and sandbox gateways.
- `institutions` & `institution_memberships`: B2B departmental license pooling and LMS mapping (Canvas, Blackboard, Moodle).
- `syllabi` & `focus_sessions`: Planner telemetry and distraction lock event logs.
- `syncboard_rooms` & `homework_submissions`: Classroom collaborative whiteboard states and AI rubric evaluations.
- **Row Level Security (RLS)**: Enforced tenant isolation protecting student privacy and compliance (FERPA & GDPR ready).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher; tested on v24)
- **npm** / `npm.cmd`

### 2. Launching the Suite Index Portal
From this root directory:
```bash
# Start the central Index Suite Hub (Port 3000)
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

### 3. Launching All Services Simultaneously (Recommended)
You can launch the Suite Hub, Study Planner, and Classroom all at once with a single command:
```bash
npm run start:all
```
This runs:
- `http://localhost:3000` (StudySync Educational Suite Hub)
- `http://localhost:5000` (StudySync AI Smart Study Planner)
- `http://localhost:5001` (StudySync AI Interactive Classroom)

---

## 💻 Tech Stack

- **Index Backend**: Node.js, Express.js, CORS, Morgan, Dotenv, Stripe SDK
- **Billing Architecture**: Stripe Checkout API, Lemon Squeezy Webhook Verification, Custom Coupon Engine
- **Database Architecture**: PostgreSQL 15+, Supabase, Row Level Security (RLS)
- **Frontend Architecture**: HTML5, Modern CSS (Glassmorphism, Proximity Mouse Spotlight, Responsive Grid), Vanilla JavaScript (ES6+)
- **Audio Architecture**: Web Audio API (Synthesized noise generators, biquad filters, oscillators)
- **Icons & Typography**: Lucide Icons, Google Fonts (`Inter`, `Outfit`, `JetBrains Mono`)
- **Brand Identity**: Scalable Vector Graphics (SVG Favicon & Logo)

---

## 📄 License
MIT License • Created for StudySync AI Educational Platform.
