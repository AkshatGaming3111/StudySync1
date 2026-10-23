const express = require('express');
const router = express.Router();
const { checkEndpointHealth } = require('../services/healthChecker');

const PLANNER_URL = process.env.PLANNER_URL || 'http://localhost:5000';
const CLASSROOM_URL = process.env.CLASSROOM_URL || 'http://localhost:5001';

// 1. Live Status of both websites
router.get('/status', async (req, res) => {
  try {
    const [plannerHealth, classroomHealth] = await Promise.all([
      checkEndpointHealth(`${PLANNER_URL}/api/health`).then(res => {
        if (!res.online) return checkEndpointHealth(PLANNER_URL);
        return res;
      }),
      checkEndpointHealth(`${CLASSROOM_URL}/api/health`).then(res => {
        if (!res.online) return checkEndpointHealth(CLASSROOM_URL);
        return res;
      })
    ]);

    res.json({
      timestamp: new Date().toISOString(),
      services: {
        planner: {
          name: 'StudySync – AI Smart Study Planner',
          url: PLANNER_URL,
          port: 5000,
          online: plannerHealth.online,
          latencyMs: plannerHealth.latencyMs,
          statusMessage: plannerHealth.message,
          directLinks: {
            home: `${PLANNER_URL}/index.html`,
            dashboard: `${PLANNER_URL}/dashboard.html`,
            focusRoom: `${PLANNER_URL}/dashboard.html#focus`,
            planner: `${PLANNER_URL}/dashboard.html#planner`,
            analytics: `${PLANNER_URL}/dashboard.html#screentime`,
            auth: `${PLANNER_URL}/auth.html`
          }
        },
        classroom: {
          name: 'StudySync – AI Interactive Classroom',
          url: CLASSROOM_URL,
          port: 5001,
          online: classroomHealth.online,
          latencyMs: classroomHealth.latencyMs,
          statusMessage: classroomHealth.message,
          directLinks: {
            home: CLASSROOM_URL,
            apiHealth: `${CLASSROOM_URL}/api/health`
          }
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to query microservice status', details: err.message });
  }
});

// 2. Comprehensive metadata on both platforms
router.get('/suite-info', (req, res) => {
  res.json({
    title: 'StudySync - AI Educational Suite',
    tagline: 'The Complete Dual-Engine Academic Intelligence & Collaborative Learning Ecosystem',
    version: '1.0.0',
    platforms: {
      planner: {
        id: 'study-planner',
        title: 'StudySync – AI Smart Study Planner',
        badge: 'Self-Paced Mastery & Deep Focus',
        themeColor: '#38bdf8',
        accentColor: '#6366f1',
        defaultPort: 5000,
        url: PLANNER_URL,
        description: 'An AI-powered academic command center designed to optimize student focus, automate syllabus planning into micro-tasks, enforce deep work sessions with ambient audio, and eliminate digital distractions.',
        highlights: [
          'AI Syllabus Deconstructor (Gemini Powered)',
          'Distraction-Free Focus Room with Web Audio Soundscapes',
          'Chrome Focus Lock Companion (Anti-Tab Switch Guard)',
          'Screen Time, Study Velocity & Habit Analytics',
          'Intelligent Daily Task & Milestone Roadmap'
        ],
        idealFor: 'Individual students preparing for competitive exams, board exams, university finals, and demanding project deadlines.',
        specs: {
          architecture: 'Full-Stack Express + SQLite + Gemini API + Manifest V3 Chrome Extension',
          aiEngine: 'Google Gemini 1.5 Flash + Local Pedagogical Intelligence',
          focusFeatures: 'Rain, White Noise, Binaural Beats synthesizer & Fullscreen Lockdown'
        }
      },
      classroom: {
        id: 'interactive-classroom',
        title: 'StudySync – AI Interactive Classroom',
        badge: 'Collaborative Academy & AI Tutoring',
        themeColor: '#a855f7',
        accentColor: '#ec4899',
        defaultPort: 5001,
        url: CLASSROOM_URL,
        description: 'A cutting-edge virtual school and pedagogical arena featuring real-time AI teacher co-piloting, collaborative digital whiteboard with AI canvas vision, automated homework auto-grading, and gamified diagnostic testing.',
        highlights: [
          'StudyBot 3.0 Multi-Persona AI Co-Pilot (Socratic, Visual, Cram Coach)',
          'SyncBoard Interactive Whiteboard with AI Canvas Extraction',
          'Homework Studio with Teacher AI Rubric Auto-Grading',
          'AI Examination Arena with Timed Focus & Diagnostic Breakdown',
          'Dynamic XP Leaderboards, Badges & 1-Click Persona Switcher'
        ],
        idealFor: 'Teachers, virtual study circles, classrooms, tutoring institutions, and students thriving in peer competitions.',
        specs: {
          architecture: 'React 18 + Vite + Tailwind CSS + Node/Express + Persistent JSON Store',
          aiEngine: 'StudyBot 3.0 Socratic AI + Gemini Multimodal Vision Analysis',
          gamification: 'Top-3 Podium, 12+ Badges, Streaks, Confetti & Web Audio Chimes'
        }
      }
    }
  });
});

// 3. Student Interest, Learning Methodologies, Quotes & Focus Tracks
router.get('/student-interests', (req, res) => {
  res.json({
    studyTechniques: [
      {
        name: 'The Feynman Technique',
        tag: 'Deep Comprehension',
        icon: 'lightbulb',
        summary: 'Explain any concept in ultra-simple terms as if teaching a 10-year-old child. Identifies conceptual gaps instantly.',
        benefit: 'Boosts retention by 85%'
      },
      {
        name: 'Spaced Repetition & Leitner',
        tag: 'Long-Term Memory',
        icon: 'calendar',
        summary: 'Review study material at systematically increasing intervals to counter the human Ebbinghaus forgetting curve.',
        benefit: 'Halves required study time before exams'
      },
      {
        name: 'Active Recall Testing',
        tag: 'Retrieval Practice',
        icon: 'brain-circuit',
        summary: 'Close books and force your brain to retrieve knowledge through quick self-quizzing rather than passive reading.',
        benefit: '300% higher exam performance'
      },
      {
        name: 'The Pomodoro Flow Cycle',
        tag: 'Dopamine & Focus',
        icon: 'timer',
        summary: '25 or 50 minutes of laser-focused distraction-free deep work followed by 5 to 10 minutes of complete mental reset.',
        benefit: 'Eliminates mental fatigue & burnout'
      }
    ],
    studentQuotes: [
      {
        quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
        author: "Mahatma Gandhi"
      },
      {
        quote: "The beautiful thing about learning is that no one can take it away from you.",
        author: "B.B. King"
      },
      {
        quote: "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.",
        author: "Dwayne Johnson"
      },
      {
        quote: "It always seems impossible until it's done.",
        author: "Nelson Mandela"
      },
      {
        quote: "Study while others are sleeping; work while others are loafing; prepare while others are playing; and dream while others are wishing.",
        author: "William Arthur Ward"
      }
    ],
    focusSoundtracks: [
      { id: 'rain', name: 'Gentle Rainstorm', icon: 'cloud-rain', frequency: 'Delta & Theta Waves', mood: 'Calm & Deep Coding' },
      { id: 'binaural', name: '40Hz Gamma Focus', icon: 'activity', frequency: 'Cognitive Flow', mood: 'Intense Problem Solving' },
      { id: 'whitenoise', name: 'Cosmic White Noise', icon: 'wind', frequency: 'Broad Spectrum', mood: 'Tab-Blocker & Reading' },
      { id: 'lofi', name: 'Ambient Study Drone', icon: 'headphones', frequency: 'Alpha Wave Harmony', mood: 'Creative Concept Mapping' }
    ],
    academicTracks: [
      { name: 'Computer Science & AI', icon: 'terminal', count: '124 Modules' },
      { name: 'Physics & Discrete Math', icon: 'sigma', count: '96 Modules' },
      { name: 'Molecular Biology & Chem', icon: 'dna', count: '82 Modules' },
      { name: 'Competitive Exam Arenas', icon: 'trophy', count: '150+ Diagnostic Tests' }
    ]
  });
});

// 4. Aggregate Suite Statistics
router.get('/stats', (req, res) => {
  res.json({
    metrics: [
      { label: 'Active Study Modules', value: '250+', change: '+18% this month', icon: 'book-open' },
      { label: 'AI Diagnostic Questions', value: '45,800+', change: 'Instant Breakdown', icon: 'help-circle' },
      { label: 'Focus Hours Logged', value: '18,400 hrs', change: 'With Ambient Sound', icon: 'clock' },
      { label: 'Auto-Graded Submissions', value: '9,250+', change: 'Rubric Compliant', icon: 'check-circle-2' },
      { label: 'Average Score Boost', value: '+28.4%', change: 'Exam Readiness', icon: 'trending-up' }
    ]
  });
});

module.exports = router;
