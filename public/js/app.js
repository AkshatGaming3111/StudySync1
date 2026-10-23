/**
 * StudySync - AI Educational Suite
 * Main Application Logic & Interactive Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Service Health Polling
  initServiceHealthMonitoring();

  // 2. Dual Section View Mode Switching
  initViewModeSwitcher();

  // 3. Interactive Student Streak Widget
  initStreakTracker();

  // 4. Daily Motivation / Quote Generator
  initQuoteGenerator();

  // 5. Mouse Cursor Spotlight Glow & Interactive Card Borders
  initSpotlightAndTilt();

  // 6. Interactive Academic Skill Radar (Spider Chart)
  initAcademicRadarChart();

  // Enforce permanent dark theme
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.removeItem('studysync_suite_theme');
});

/**
 * Periodically polls the backend for live status of both platforms (Planner & Classroom)
 */
function initServiceHealthMonitoring() {
  const plannerDot = document.getElementById('planner-status-dot');
  const classroomDot = document.getElementById('classroom-status-dot');
  const plannerText = document.getElementById('planner-status-text');
  const classroomText = document.getElementById('classroom-status-text');

  const plannerCardDot = document.getElementById('card-planner-dot');
  const classroomCardDot = document.getElementById('card-classroom-dot');
  const plannerCardStatus = document.getElementById('card-planner-status');
  const classroomCardStatus = document.getElementById('card-classroom-status');

  async function checkStatus() {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error('Status endpoint unavailable');
      const data = await res.json();

      const pOnline = data.services?.planner?.online;
      const cOnline = data.services?.classroom?.online;
      const pLatency = data.services?.planner?.latencyMs;
      const cLatency = data.services?.classroom?.latencyMs;

      // Update Planner Status
      if (plannerDot && plannerText) {
        if (pOnline) {
          plannerDot.className = 'pulse-dot online';
          plannerText.textContent = `Planner: Online (${pLatency}ms)`;
        } else {
          plannerDot.className = 'pulse-dot';
          plannerText.textContent = 'Planner: Standby';
        }
      }

      if (plannerCardDot && plannerCardStatus) {
        if (pOnline) {
          plannerCardDot.className = 'pulse-dot online';
          plannerCardStatus.textContent = `Online • Vercel (${pLatency}ms)`;
        } else {
          plannerCardDot.className = 'pulse-dot';
          plannerCardStatus.textContent = 'Vercel • Standby';
        }
      }

      // Update Classroom Status
      if (classroomDot && classroomText) {
        if (cOnline) {
          classroomDot.className = 'pulse-dot online';
          classroomText.textContent = `Classroom: Online (${cLatency}ms)`;
        } else {
          classroomDot.className = 'pulse-dot';
          classroomText.textContent = 'Classroom: Standby';
        }
      }

      if (classroomCardDot && classroomCardStatus) {
        if (cOnline) {
          classroomCardDot.className = 'pulse-dot online';
          classroomCardStatus.textContent = `Online • Port 5001 (${cLatency}ms)`;
        } else {
          classroomCardDot.className = 'pulse-dot';
          classroomCardStatus.textContent = 'Port 5001 • Standby';
        }
      }
    } catch (err) {
      // Offline or local standalone fallback
      console.warn('Microservice health check notice:', err.message);
    }
  }

  // Check immediately, then every 6 seconds
  checkStatus();
  setInterval(checkStatus, 6000);
}

/**
 * View Mode Selector (Dual Split View vs. Individual Platform Focus)
 */
function setViewMode(mode) {
  const container = document.getElementById('dual-sections-container');
  const buttons = document.querySelectorAll('.view-mode-btn');

  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
  });

  if (!container) return;

  container.classList.remove('focus-planner', 'focus-classroom');
  if (mode === 'planner') {
    container.classList.add('focus-planner');
  } else if (mode === 'classroom') {
    container.classList.add('focus-classroom');
  }

  // Play navigation chime
  if (window.soundEngine) {
    window.soundEngine.playChime('nav');
  }
}

function initViewModeSwitcher() {
  const buttons = document.querySelectorAll('.view-mode-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      setViewMode(mode);
    });
  });

  // Expand Deep Dive buttons inside cards
  const expandBtns = document.querySelectorAll('.expand-focus-btn');
  expandBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      setViewMode(target);
      const section = document.getElementById(`${target}-section`);
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Quick Switch Companion Banners
  const quickSwitchBtns = document.querySelectorAll('.btn-quick-switch, .quick-switch-companion-banner');
  quickSwitchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = btn.getAttribute('data-target');
      if (target) {
        setViewMode(target);
        const section = document.getElementById(`${target}-section`);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Initialize Deep Dive Interactive Tools
  initSyllabusSandbox();
  initInteractivePomodoro();
  initPersonaSimulator();
  initWhiteboardScanner();
}

/**
 * Interactive AI Syllabus Deconstructor Sandbox (Planner)
 */
function initSyllabusSandbox() {
  const timelineEl = document.getElementById('planner-schedule-timeline');
  const coursePills = document.querySelectorAll('.course-pill');
  if (!timelineEl) return;

  const courseData = {
    calc: [
      { day: 'Day 1', topic: 'Integration by Parts & Trigonometric Substitutions', desc: 'Core definite integrals and tabular shortcut method', time: '45 mins', xp: '120' },
      { day: 'Day 2', topic: 'Infinite Series & Taylor Polynomial Expansion', desc: 'Convergence tests (Ratio, Integral, Alternating)', time: '50 mins', xp: '140' },
      { day: 'Day 3', topic: 'Parametric Equations & Polar Coordinates', desc: 'Arc length, surface area, and polar area sweeps', time: '40 mins', xp: '110' },
      { day: 'Day 4', topic: 'Differential Equations & Logistic Growth', desc: 'Separation of variables and Euler numerical approximations', time: '55 mins', xp: '150' },
      { day: 'Day 5', topic: 'Comprehensive Exam Simulation & Speed Drills', desc: 'AP Olympiad timed diagnostic with AI error remediation', time: '60 mins', xp: '200' }
    ],
    dsa: [
      { day: 'Day 1', topic: 'Asymptotic Analysis & Recurrence Relations', desc: 'Master Theorem, Big-O, Big-Omega, Space Complexity', time: '40 mins', xp: '110' },
      { day: 'Day 2', topic: 'Divide & Conquer, Balanced Trees & Heaps', desc: 'AVL trees, Red-Black properties, priority queue invariants', time: '50 mins', xp: '135' },
      { day: 'Day 3', topic: 'Graph Algorithms: BFS, DFS & Dijkstra', desc: 'Shortest paths, topological sort, cycle detection in DAGs', time: '55 mins', xp: '160' },
      { day: 'Day 4', topic: 'Dynamic Programming: 1D & 2D Memoization', desc: '0/1 Knapsack, Longest Common Subsequence, state transitions', time: '60 mins', xp: '180' },
      { day: 'Day 5', topic: 'System Design Patterns & Real-World Mock', desc: 'LRU Cache implementation and concurrency edge-cases', time: '45 mins', xp: '150' }
    ],
    bio: [
      { day: 'Day 1', topic: 'DNA Polymerase Replication & Okazaki Fragments', desc: 'Fidelity proofreading, topoisomerase, single-strand binding', time: '40 mins', xp: '105' },
      { day: 'Day 2', topic: 'Eukaryotic Transcription & mRNA Splicing', desc: 'Intron excision, spliceosome complexes, 5\' capping & poly-A', time: '45 mins', xp: '125' },
      { day: 'Day 3', topic: 'Epigenetic Regulation & Histone Acetylation', desc: 'Chromatin remodeling, CpG island methylation mechanisms', time: '50 mins', xp: '140' },
      { day: 'Day 4', topic: 'CRISPR-Cas9 & Recombinant Biotechnology', desc: 'Guide RNA design, PAM sequence recognition, off-target audits', time: '55 mins', xp: '165' },
      { day: 'Day 5', topic: 'Medical Genetics Diagnostic Lab Review', desc: 'Karyotyping, Sanger sequencing & clinical case analysis', time: '50 mins', xp: '175' }
    ],
    neuro: [
      { day: 'Day 1', topic: 'Action Potential Dynamics & Hodgkin-Huxley', desc: 'Voltage-gated Na+/K+ channels, refractory periods', time: '45 mins', xp: '120' },
      { day: 'Day 2', topic: 'Neurotransmitter Synthesis & Synaptic Release', desc: 'SNARE complexes, exocytosis, GABA vs Glutamate balance', time: '50 mins', xp: '130' },
      { day: 'Day 3', topic: 'Hippocampal Long-Term Potentiation (LTP)', desc: 'NMDA/AMPA receptor trafficking & dendritic spine plasticity', time: '55 mins', xp: '150' },
      { day: 'Day 4', topic: 'Sensory Cortical Hierarchies (V1 to V4)', desc: 'Receptive field orientation columns & lateral inhibition', time: '45 mins', xp: '125' },
      { day: 'Day 5', topic: 'Neurodegenerative Pathologies & Clinical Study', desc: 'Alzheimer tau tangles, Parkinsonian dopaminergic loss', time: '60 mins', xp: '190' }
    ]
  };

  function renderTimeline(courseKey) {
    const list = courseData[courseKey] || courseData.calc;
    timelineEl.innerHTML = list.map(item => `
      <div class="sim-step-item">
        <div class="step-day-badge">${item.day}</div>
        <div class="step-info">
          <div class="step-topic">${item.topic}</div>
          <div class="step-subtext">${item.desc}</div>
        </div>
        <div class="step-metrics">
          <span class="metric-chip"><i data-lucide="clock" style="width:11px; height:11px; display:inline;"></i> ${item.time}</span>
          <span class="metric-chip" style="color: #38bdf8;">+${item.xp} XP</span>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  // Initial render
  renderTimeline('calc');

  coursePills.forEach(pill => {
    pill.addEventListener('click', () => {
      coursePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const course = pill.getAttribute('data-course');
      renderTimeline(course);
      if (window.soundEngine) window.soundEngine.playChime('nav');
    });
  });
}

/**
 * Functional Pomodoro & Deep Work Engine Simulator (Planner)
 */
function initInteractivePomodoro() {
  const digitsEl = document.getElementById('pomodoro-timer-digits');
  const toggleBtn = document.getElementById('pomo-toggle-btn');
  const btnText = document.getElementById('pomo-btn-text');
  const resetBtn = document.getElementById('pomo-reset-btn');
  const modeBadge = document.getElementById('pomodoro-current-mode');
  const presetBtns = document.querySelectorAll('.pomo-preset-btn');

  if (!digitsEl || !toggleBtn) return;

  let currentTotalSeconds = 25 * 60;
  let remainingSeconds = currentTotalSeconds;
  let isRunning = false;
  let pomoInterval = null;

  function updateDisplay() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    digitsEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    if (btnText) btnText.textContent = 'Pause Flow';
    toggleBtn.innerHTML = '<i data-lucide="pause" style="width:14px; height:14px;"></i> <span id="pomo-btn-text">Pause Flow</span>';
    if (window.lucide) window.lucide.createIcons();

    if (window.soundEngine) window.soundEngine.playChime('nav');

    pomoInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        updateDisplay();
      } else {
        clearInterval(pomoInterval);
        isRunning = false;
        if (btnText) btnText.textContent = 'Session Complete!';
        if (window.soundEngine) window.soundEngine.playChime('success');
      }
    }, 1000);
  }

  function pauseTimer() {
    isRunning = false;
    clearInterval(pomoInterval);
    if (btnText) btnText.textContent = 'Resume Focus';
    toggleBtn.innerHTML = '<i data-lucide="play" style="width:14px; height:14px;"></i> <span id="pomo-btn-text">Resume Focus</span>';
    if (window.lucide) window.lucide.createIcons();
  }

  toggleBtn.addEventListener('click', () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  resetBtn.addEventListener('click', () => {
    pauseTimer();
    remainingSeconds = currentTotalSeconds;
    updateDisplay();
    if (btnText) btnText.textContent = 'Start Focus';
    toggleBtn.innerHTML = '<i data-lucide="play" style="width:14px; height:14px;"></i> <span id="pomo-btn-text">Start Focus</span>';
    if (window.lucide) window.lucide.createIcons();
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mins = parseInt(btn.getAttribute('data-mins'), 10);
      const label = btn.getAttribute('data-label');

      pauseTimer();
      currentTotalSeconds = mins * 60;
      remainingSeconds = currentTotalSeconds;
      updateDisplay();

      if (modeBadge) modeBadge.textContent = `${label} (${mins}m)`;
      if (btnText) btnText.textContent = 'Start Focus';
      toggleBtn.innerHTML = '<i data-lucide="play" style="width:14px; height:14px;"></i> <span id="pomo-btn-text">Start Focus</span>';
      if (window.lucide) window.lucide.createIcons();
    });
  });

  updateDisplay();
}

/**
 * Interactive 1-Click Persona Simulator (Classroom)
 */
function initPersonaSimulator() {
  const container = document.getElementById('persona-dialogue-content');
  const personaPills = document.querySelectorAll('.persona-pill');
  if (!container) return;

  const personas = {
    turing: {
      avatar: '👨‍🏫',
      speaker: 'Dr. Alan Turing — Socratic Coding & Discrete Math Lead',
      time: 'Real-Time Pedagogy',
      formula: 'L = { w ∈ {0, 1}* | w = w^R }  (Context-Free Palindromes)',
      msg: 'Greetings, scholar. Instead of memorizing the solution, consider the machine architecture. Does an automaton require infinite memory tape, or can we solve this with a single pushdown stack? What transition rule determines our halt state?'
    },
    franklin: {
      avatar: '👩‍🔬',
      speaker: 'Prof. Rosalind Franklin — Biophysics & Molecular Biology Lead',
      time: 'Structural Analysis',
      formula: '2d · sin(θ) = n · λ  (Bragg\'s Crystallographic Diffraction)',
      msg: 'Examine the cross-shaped diffraction pattern in Photo 51. The mathematical periodicity gives away the 3.4 Å helical base-pair stacking immediately. How do hydrogen bonds provide anti-parallel stability between purine and pyrimidine rings?'
    },
    alex: {
      avatar: '🥇',
      speaker: 'Alex Rivera — Top Ranker #1 Student (12th Grade)',
      time: 'Classroom Exam Arena',
      formula: 'Active Streak: 42 Days  •  Arena Diagnostic Score: 98.4%',
      msg: 'Pro tip for the CS101 exam arena: Question 4 looks tricky with recursive backtracking, but you can memoize intermediate states to pass all 15 test-cases in under 4ms! Keep your streak burning!'
    },
    maya: {
      avatar: '💡',
      speaker: 'Maya Chen — Bio-Engineering Explorer',
      time: 'SyncBoard Whiteboard Collab',
      formula: 'Km = (k_-1 + k_2) / k_1  (Michaelis-Menten Kinetics)',
      msg: 'I just sketched the enzyme inhibition Lineweaver-Burk curve on the SyncBoard digital whiteboard. StudyBot analyzed the canvas in 2 seconds and exported the full LaTeX derivation directly into our group notes!'
    }
  };

  function renderPersona(key) {
    const p = personas[key] || personas.turing;
    container.innerHTML = `
      <div class="dialogue-bubble">
        <div class="dialogue-avatar">${p.avatar}</div>
        <div class="dialogue-body">
          <div class="dialogue-meta">
            <span class="dialogue-speaker">${p.speaker}</span>
            <span class="dialogue-time">${p.time}</span>
          </div>
          <div class="dialogue-formula"><code>${p.formula}</code></div>
          <p class="dialogue-msg">${p.msg}</p>
        </div>
      </div>
    `;
  }

  renderPersona('turing');

  personaPills.forEach(pill => {
    pill.addEventListener('click', () => {
      personaPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const key = pill.getAttribute('data-persona');
      renderPersona(key);
      if (window.soundEngine) window.soundEngine.playChime('nav');
    });
  });
}

/**
 * SyncBoard AI Whiteboard Laser Scan Simulator (Classroom)
 */
function initWhiteboardScanner() {
  const btn = document.getElementById('btn-simulate-ai-canvas');
  const laser = document.getElementById('scanner-laser');
  const resultBox = document.getElementById('canvas-ai-output');
  if (!btn || !laser) return;

  btn.addEventListener('click', () => {
    laser.classList.add('scanning');
    btn.innerHTML = '<i data-lucide="loader-2" style="width:14px; height:14px; display:inline; animation:spin 1s infinite linear;"></i> <span>AI Multimodal Scanning...</span>';
    if (window.soundEngine) window.soundEngine.playChime('launch');

    setTimeout(() => {
      laser.classList.remove('scanning');
      btn.innerHTML = '<i data-lucide="check" style="width:14px; height:14px; display:inline;"></i> <span>Board Analyzed ✨</span>';
      
      if (resultBox) {
        resultBox.innerHTML = `
          <div class="result-label" style="color: #10b981;">
            <i data-lucide="check-circle" style="width:13px; height:13px; display:inline;"></i> AI Extraction Verified (100% Precision)
          </div>
          <div class="extracted-formula-box" style="background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); color: #10b981;">
            <code>c = √(a² + b²)  &amp;  f(t) = A · sin(ωt + φ)  &amp;  ∇ · E = ρ / ε₀</code>
          </div>
          <div class="extracted-notes-text">
            • <strong>Euclidean Vector Space:</strong> Identified right-triangle hypotenuse derivation.<br>
            • <strong>Harmonic Oscillation:</strong> Angular velocity ω and phase angle φ extracted and formatted for LaTeX lecture export!
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }

      if (window.soundEngine) window.soundEngine.playChime('success');

      setTimeout(() => {
        btn.innerHTML = '<i data-lucide="sparkles" style="width:14px; height:14px; display:inline;"></i> <span>Simulate AI Board Analysis</span>';
        if (window.lucide) window.lucide.createIcons();
      }, 4000);
    }, 2200);
  });
}

/**
 * Interactive Streak Tracker
 */
function initStreakTracker() {
  const countEl = document.getElementById('streak-count-display');
  const boostBtn = document.getElementById('streak-boost-btn');
  const badgeEl = document.getElementById('streak-badge-text');

  let currentStreak = parseInt(localStorage.getItem('studysync_user_streak') || '7', 10);
  if (countEl) countEl.textContent = `${currentStreak} Days`;

  if (boostBtn) {
    boostBtn.addEventListener('click', () => {
      currentStreak += 1;
      localStorage.setItem('studysync_user_streak', currentStreak);
      if (countEl) countEl.textContent = `${currentStreak} Days`;

      if (currentStreak >= 30) {
        if (badgeEl) badgeEl.textContent = '🏆 30-Day Grandmaster';
      } else if (currentStreak >= 14) {
        if (badgeEl) badgeEl.textContent = '⚡ 2-Week Study Titan';
      } else {
        if (badgeEl) badgeEl.textContent = '🔥 Habit Streak Active';
      }

      if (window.soundEngine) {
        window.soundEngine.playChime('launch');
      }

      boostBtn.textContent = 'Streak Boosted! ✨';
      setTimeout(() => {
        boostBtn.textContent = 'Check In Today 🔥';
      }, 2000);
    });
  }
}

/**
 * Daily Study Motivation Quote Rotator
 */
function initQuoteGenerator() {
  const quoteText = document.getElementById('quote-display-text');
  const quoteAuthor = document.getElementById('quote-display-author');
  const nextBtn = document.getElementById('next-quote-btn');

  const quotes = [
    { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
    { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { quote: "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.", author: "Dwayne Johnson" },
    { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { quote: "We can only see a short distance ahead, but we can see plenty there that needs to be done.", author: "Dr. Alan Turing" },
    { quote: "Science and everyday life cannot and should not be separated.", author: "Prof. Rosalind Franklin" }
  ];

  let quoteIdx = 0;

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      quoteIdx = (quoteIdx + 1) % quotes.length;
      if (quoteText) quoteText.textContent = `"${quotes[quoteIdx].quote}"`;
      if (quoteAuthor) quoteAuthor.textContent = `— ${quotes[quoteIdx].author}`;
    });
  }
}

/**
 * Mouse Cursor Spotlight Glow, Interactive Card Borders & Specular 3D Tilt
 * Follows mouse position across cards with radial-gradient illumination
 */
function initSpotlightAndTilt() {
  const cards = document.querySelectorAll(
    '.portal-section-card, .student-feature-card, .deep-tool-card, .pillar-card, .deep-testimonial-card, .radar-chart-card, .skill-intel-card, .metrics-ribbon-section, .spotlight-card'
  );

  if (!cards.length) return;

  cards.forEach(card => card.classList.add('spotlight-card'));

  const haloEl = document.getElementById('cursor-spotlight-halo');

  let mouseX = -9999;
  let mouseY = -9999;
  let isPointerActive = false;
  let rafId = null;

  function updateSpotlights() {
    rafId = null;
    if (!isPointerActive) return;

    const windowH = window.innerHeight;
    const windowW = window.innerWidth;

    // Update ambient cursor spotlight follower halo
    if (haloEl) {
      haloEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      haloEl.style.opacity = '1';
    }

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();

      // Skip cards that are outside viewport bounds
      if (rect.bottom < -120 || rect.top > windowH + 120 || rect.right < -120 || rect.left > windowW + 120) {
        return;
      }

      if (rect.width === 0 || rect.height === 0) return;

      const x = mouseX - rect.left;
      const y = mouseY - rect.top;

      // Distance from card perimeter (0 if cursor is inside)
      const dx = Math.max(0, -x, x - rect.width);
      const dy = Math.max(0, -y, y - rect.height);
      const dist = Math.hypot(dx, dy);

      const proximityRange = 140; // Pixels outside border where approach illumination begins

      if (dist === 0) {
        // Cursor is inside the card
        card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
        card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
        card.style.setProperty('--spotlight-opacity', '1');
      } else if (dist < proximityRange) {
        // Cursor approaching card perimeter: interpolate edge illumination
        const factor = 1 - (dist / proximityRange);
        card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
        card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
        card.style.setProperty('--spotlight-opacity', (factor * 0.75).toFixed(3));
      } else {
        // Out of range: reset opacity
        if (card.style.getPropertyValue('--spotlight-opacity') !== '0') {
          card.style.setProperty('--spotlight-opacity', '0');
        }
      }
    });
  }

  function onPointerMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isPointerActive = true;

    if (!rafId) {
      rafId = requestAnimationFrame(updateSpotlights);
    }
  }

  function onPointerLeaveWindow() {
    isPointerActive = false;
    if (haloEl) haloEl.style.opacity = '0';
    cards.forEach(card => {
      card.style.setProperty('--spotlight-opacity', '0');
    });
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('mouseleave', onPointerLeaveWindow);

  // Smooth 3D tilt on primary cards
  const tiltCards = document.querySelectorAll('.portal-section-card, .student-feature-card, .radar-chart-card');
  tiltCards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

/**
 * Interactive 5-Axis Academic Skill Radar (Spider Chart)
 * Compares cognitive strengths trained by Planner and Classroom
 */
function initAcademicRadarChart() {
  const radarChartCard = document.querySelector('.radar-chart-card');
  const filterPills = document.querySelectorAll('.radar-filter-pill');
  const vertexDots = document.querySelectorAll('.radar-vertex-dot');
  const skillCards = document.querySelectorAll('.skill-intel-card');
  const tagEl = document.getElementById('radar-card-tag');
  const scoreEl = document.getElementById('radar-card-score');
  const descEl = document.getElementById('radar-card-desc');

  if (!radarChartCard || !filterPills.length) return;

  const defaultModeInfo = {
    synergy: {
      tag: '✨ Unified Suite Synergy',
      score: '96.2% Cognitive Mastery',
      scoreColor: '#10b981',
      desc: 'Hover over any axis or skill card to inspect how the two platforms balance cognitive stamina with Socratic problem solving.'
    },
    planner: {
      tag: '📅 Smart Study Planner Focus',
      score: '97.0% Discipline Score',
      scoreColor: '#38bdf8',
      desc: 'Specialized in distraction resistance, deep work endurance, and structured syllabus pacing. Builds consistent daily habits.'
    },
    classroom: {
      tag: '🎓 Interactive Classroom Focus',
      score: '95.6% Problem Mastery',
      scoreColor: '#ec4899',
      desc: 'Specialized in algorithmic reasoning, timed exam precision, and visual diagram derivations. Trains deep analytical problem-solving.'
    }
  };

  const skillsData = [
    {
      idx: 0,
      name: 'Algorithmic Reasoning',
      tag: '🎯 Classroom Algorithmic Mastery',
      score: '98% Multi-Step Logic',
      color: '#ec4899',
      desc: 'Multi-step deductive logic, formal proof decomposition, and algorithmic complexity. Guided through Socratic questioning via the Dr. Alan Turing AI mentor.'
    },
    {
      idx: 1,
      name: 'Deep Work Stamina',
      tag: '⏳ Planner Cognitive Endurance',
      score: '96% Deep Block Capacity',
      color: '#38bdf8',
      desc: 'Continuous distraction-free cognitive endurance across 25m and 50m Pomodoro blocks, reinforced by built-in Web Audio ambient soundscapes.'
    },
    {
      idx: 2,
      name: 'Exam Precision & Diagnostic Recall',
      tag: '📝 Diagnostic Testing Arena',
      score: '95% Speed & Retrieval',
      color: '#ec4899',
      desc: 'High-speed retrieval under timed focus simulator with question-by-question diagnostic analysis and targeted AI remediation hints.'
    },
    {
      idx: 3,
      name: 'Distraction Resistance',
      tag: '🚫 Focus Lock Companion',
      score: '98% Interception Rate',
      color: '#38bdf8',
      desc: 'Immunity to digital interruptions through the official Chrome Focus Lock companion extension, intercepting stray tab switches during active timers.'
    },
    {
      idx: 4,
      name: 'Visual & Spatial Derivations',
      tag: '🎨 Multimodal SyncBoard Vision',
      score: '94% Diagram Deconstruction',
      color: '#ec4899',
      desc: 'Translating geometric blueprints, chemical structures, and vector diagrams into structured LaTeX lecture notes via SyncBoard multimodal AI vision.'
    }
  ];

  let currentMode = 'synergy';
  let hoveredSkillIdx = null;

  function updateLiveCard(info) {
    if (tagEl) tagEl.textContent = info.tag;
    if (scoreEl) {
      scoreEl.textContent = info.score;
      scoreEl.style.color = info.scoreColor || info.color || '#10b981';
    }
    if (descEl) descEl.textContent = info.desc;
  }

  // Filter Mode Pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const mode = pill.getAttribute('data-filter') || 'synergy';
      currentMode = mode;

      filterPills.forEach(p => p.classList.toggle('active', p === pill));

      radarChartCard.classList.remove('mode-synergy', 'mode-planner', 'mode-classroom');
      radarChartCard.classList.add(`mode-${mode}`);

      if (hoveredSkillIdx === null) {
        updateLiveCard(defaultModeInfo[mode]);
      }

      if (window.soundEngine) {
        window.soundEngine.playChime('nav');
      }
    });
  });

  // Highlight a specific skill (by index 0-4)
  function highlightSkill(idx) {
    hoveredSkillIdx = idx;
    const skill = skillsData[idx];
    if (!skill) return;

    // Highlight Axis Spoke Line
    document.querySelectorAll('.radar-axis-line').forEach(line => line.classList.remove('highlight'));
    const targetLine = document.getElementById(`axis-line-${idx}`);
    if (targetLine) targetLine.classList.add('highlight');

    // Highlight Vertex Dot
    vertexDots.forEach(dot => {
      dot.classList.toggle('active', parseInt(dot.getAttribute('data-skill'), 10) === idx);
    });

    // Highlight Card
    skillCards.forEach(card => {
      card.classList.toggle('active', parseInt(card.getAttribute('data-skill-idx'), 10) === idx);
    });

    // Update live indicator card
    updateLiveCard(skill);
  }

  function clearSkillHighlight() {
    hoveredSkillIdx = null;

    document.querySelectorAll('.radar-axis-line').forEach(line => line.classList.remove('highlight'));
    vertexDots.forEach(dot => dot.classList.remove('active'));
    skillCards.forEach(card => card.classList.remove('active'));

    updateLiveCard(defaultModeInfo[currentMode]);
  }

  // Bind Vertex Dot events
  vertexDots.forEach(dot => {
    const idx = parseInt(dot.getAttribute('data-skill'), 10);
    dot.addEventListener('mouseenter', () => highlightSkill(idx));
    dot.addEventListener('mouseleave', clearSkillHighlight);
  });

  // Bind Skill Card events
  skillCards.forEach(card => {
    const idx = parseInt(card.getAttribute('data-skill-idx'), 10);
    card.addEventListener('mouseenter', () => highlightSkill(idx));
    card.addEventListener('mouseleave', clearSkillHighlight);
    card.addEventListener('click', () => {
      highlightSkill(idx);
      if (window.soundEngine) {
        window.soundEngine.playChime('launch');
      }
    });
  });
}

