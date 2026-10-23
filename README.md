# StudySync – AI Educational Suite 🎓✨
> **The Unified Gateway Connecting Self-Paced Focus Mastery and Virtual Pedagogical Collaboration**

Welcome to **StudySync - AI Educational Suite** (`http://localhost:3000`), the central index portal and orchestration hub linking two cutting-edge AI-powered academic platforms:
1. **StudySync – AI Smart Study Planner** (Live: `https://studysync2-virid.vercel.app`)
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
  ┌─────────────────────────────────┐               ┌───────────────────────────────┐
  │   AI Smart Study Planner        │               │   AI Interactive Classroom    │
  │ studysync2-virid.vercel.app     │               │     http://localhost:5001     │
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
- **Split Cockpit Layout**: The page is divided into two distinct sections, featuring exhaustive details, feature checklists, technology specs, and simulated mini-dashboards for both websites.
- **Interactive View Switcher**:
  - *Dual Comparison View* (Side-by-side comparative analysis)
  - *Focus on Study Planner* (Expands Planner and focuses self-paced tools)
  - *Focus on Classroom* (Expands Virtual Classroom and highlights collaborative features)
- **Clickable Launch Buttons**:
  - High-impact glowing primary launch buttons (`Launch AI Smart Study Planner` and `Enter AI Interactive Classroom`).
  - Direct sub-link chips to specific areas (Dashboard, Focus Sanctuary, Sign-In, Whiteboard, Exam Arena).

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

### 4. 🎨 Custom Vector Logo & Favicon
- Ultra-sharp SVG logo (`public/logo.svg`) and favicon (`public/favicon.svg`) embodying a modern graduation cap intertwined with AI neural starbursts, illuminated open-knowledge wings, and synchronous orbital halo rings.

### 5. 🧠 Fancy Student Interest Hub
- **Interactive Habit Streak Flame**: Click-to-boost streak counter with gamified milestone badges (*7-Day Sprint, 14-Day Titan, 30-Day Grandmaster*).
- **Daily Scholar Mindset**: Dynamic inspirational quotes from Turing, Franklin, Gandhi, and Mandela with one-click rotator.
- **Curriculum Telemetry**: Live counters displaying 250+ curriculum modules, 45.8K+ AI diagnostic questions, and 18,400+ focus hours.

### 6. 🛠️ Dedicated Backend & Microservice Health Aggregator
- Express backend running on **Port 3000**.
- **Real-Time Port Ping**: `/api/status` pings `http://localhost:5000` and `http://localhost:5001`, reporting live online/standby status and roundtrip latency in milliseconds.
- Visual pulse dots in the navigation bar reflect real-time service health.

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

### 4. Launching Individual Services Separately
- **AI Smart Study Planner (Port 5000)**:
  ```bash
  npm run start:planner
  ```
- **AI Interactive Classroom (Port 5001)**:
  ```bash
  npm run start:classroom
  ```

---

## 📡 Backend API Endpoints (Port 3000)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | `GET` | Central index server status and timestamp |
| `/api/status` | `GET` | Aggregated real-time health and latency of Port 5000 & 5001 |
| `/api/suite-info` | `GET` | Complete metadata, specifications, and architecture of both platforms |
| `/api/student-interests` | `GET` | Curated study techniques, motivational quotes, soundscapes, and tracks |
| `/api/stats` | `GET` | Platform telemetry and student achievement figures |

---

## 💻 Tech Stack

- **Index Backend**: Node.js, Express.js, CORS, Morgan, Dotenv
- **Frontend Architecture**: HTML5, Modern CSS (Custom Properties, Glassmorphism, Responsive Grid/Flexbox), Vanilla JavaScript (ES6+)
- **Audio Architecture**: Web Audio API (Synthesized noise generators, biquad filters, oscillators)
- **Icons & Typography**: Lucide Icons, Google Fonts (`Inter`, `Outfit`, `JetBrains Mono`)
- **Brand Identity**: Scalable Vector Graphics (SVG Favicon & Logo)

---

## 📄 License
MIT License • Created for StudySync AI Educational Platform.
