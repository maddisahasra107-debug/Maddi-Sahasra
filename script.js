/**
 * Portfolio Interactive Scripts
 * Handles:
 * 1. Left Vertical Pixel Navigation (Mobile drawer, ScrollSpy active states, keyboard accessibility)
 * 2. Theme Toggle with CSS Media Query detection (Auto / Night / Light)
 * 3. Interactive Terminal Chat NPC demo
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. Left Vertical Navigation (Responsive Mobile Drawer & ScrollSpy)
     ------------------------------------------------------------------------ */
  const sidebarAside = document.getElementById('sidebar-container');
  const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const navLinks = document.querySelectorAll('.sidebar-nav-link');

  // Toggle mobile drawer
  function openMobileNav() {
    if (sidebarAside && sidebarBackdrop && sidebarToggleBtn) {
      sidebarAside.classList.add('is-open');
      sidebarBackdrop.classList.add('is-active');
      sidebarToggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // prevent background scrolling while drawer open
    }
  }

  function closeMobileNav() {
    if (sidebarAside && sidebarBackdrop && sidebarToggleBtn) {
      sidebarAside.classList.remove('is-open');
      sidebarBackdrop.classList.remove('is-active');
      sidebarToggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      const isOpen = sidebarAside.classList.contains('is-open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileNav);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarAside && sidebarAside.classList.contains('is-open')) {
      closeMobileNav();
    }
  });

  // Close mobile drawer when clicking any link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        closeMobileNav();
      }
    });
  });

  // ScrollSpy to highlight active link in vertical navbar
  const sections = document.querySelectorAll('section[id]');
  function updateScrollSpy() {
    const scrollPosition = window.scrollY + 160;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  updateScrollSpy();

  /* ------------------------------------------------------------------------
     2. Night Mode Toggle (CSS Media Query Browser Theme Detection)
     ------------------------------------------------------------------------ */
  const themeToggleBtns = [
    document.getElementById('theme-toggle'),
    document.getElementById('mobile-theme-toggle')
  ].filter(Boolean);

  const themeModeTag = document.getElementById('theme-mode-tag');
  const rootElement = document.documentElement;

  // Media query to detect browser / OS color scheme preference
  const systemDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');

  // Stored mode: 'auto', 'dark', 'light'
  let currentMode = localStorage.getItem('theme-preference') || 'auto';

  function applyThemeMode(mode) {
    currentMode = mode;

    if (mode === 'auto') {
      rootElement.removeAttribute('data-theme');
      localStorage.removeItem('theme-preference');
      const isSystemDark = systemDarkMedia.matches;
      if (themeModeTag) {
        themeModeTag.textContent = isSystemDark ? 'Auto (Night)' : 'Auto (Light)';
      }
    } else if (mode === 'dark') {
      rootElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme-preference', 'dark');
      if (themeModeTag) {
        themeModeTag.textContent = 'Night';
      }
    } else if (mode === 'light') {
      rootElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme-preference', 'light');
      if (themeModeTag) {
        themeModeTag.textContent = 'Light';
      }
    }
  }

  // Initialize
  applyThemeMode(currentMode);

  // Dynamic listener for OS/browser preference changes in 'auto' mode
  systemDarkMedia.addEventListener('change', () => {
    if (currentMode === 'auto') {
      applyThemeMode('auto');
    }
  });

  // Cycle modes when clicking theme button
  themeToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (currentMode === 'auto') {
        applyThemeMode(systemDarkMedia.matches ? 'light' : 'dark');
      } else if (currentMode === 'dark') {
        applyThemeMode('light');
      } else if (currentMode === 'light') {
        applyThemeMode('auto');
      }
    });
  });

  /* ------------------------------------------------------------------------
     3. Interactive AI Digital Twin Chat Section (Maddi Sahasra AI)
     ------------------------------------------------------------------------
     Simulates an interactive conversation with Maddi Sahasra's AI persona.
     Includes:
     - Realistic typing indicator animation
     - Dynamic conversation history & timestamping
     - Quick prompt suggestion chips
     - Reset conversation control
     - Context-aware portfolio knowledge engine
     - EXTENSIVE OPENAI / CLAUDE / GEMINI API INTEGRATION BLUEPRINT
     ------------------------------------------------------------------------ */

  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatMessages = document.getElementById('chat-messages');
  const clearChatBtn = document.getElementById('clear-chat-btn');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  let isAiResponding = false;

  // Format current timestamp (e.g., "9:42 AM")
  function getFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Helper to escape user input to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Smooth auto-scroll to the latest message
  function scrollChatToBottom() {
    if (chatMessages) {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  // Append user message bubble
  function appendUserMessage(text) {
    if (!chatMessages) return;
    const time = getFormattedTime();
    const row = document.createElement('div');
    row.className = 'chat-message-row user-row';
    row.innerHTML = `
      <div class="message-avatar" aria-hidden="true">
        <div class="user-avatar-badge">YOU</div>
      </div>
      <div class="chat-bubble user-bubble">
        <div class="bubble-header">
          <span class="bubble-sender-name">Visitor</span>
          <span class="bubble-timestamp">${time}</span>
        </div>
        <div class="bubble-text">${escapeHtml(text)}</div>
      </div>
    `;
    chatMessages.appendChild(row);
    scrollChatToBottom();
  }

  // Display simulated typing indicator
  function showTypingIndicator() {
    if (!chatMessages) return;
    const typingRow = document.createElement('div');
    typingRow.className = 'chat-message-row bot-row typing-row';
    typingRow.id = 'bot-typing-indicator';
    typingRow.innerHTML = `
      <div class="message-avatar" aria-hidden="true">
        <img src="867f567d-8d0c-4471-8dfa-48e20be7da65.png" alt="" class="avatar-small">
      </div>
      <div class="chat-bubble bot-bubble typing-bubble">
        <span class="typing-dot" aria-hidden="true"></span>
        <span class="typing-dot" aria-hidden="true"></span>
        <span class="typing-dot" aria-hidden="true"></span>
        <span class="typing-text-tag">Sahasra AI is computing...</span>
      </div>
    `;
    chatMessages.appendChild(typingRow);
    scrollChatToBottom();
  }

  // Remove typing indicator before appending response
  function removeTypingIndicator() {
    const indicator = document.getElementById('bot-typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // Append bot message bubble
  function appendBotMessage(htmlContent) {
    if (!chatMessages) return;
    const time = getFormattedTime();
    const row = document.createElement('div');
    row.className = 'chat-message-row bot-row';
    row.innerHTML = `
      <div class="message-avatar" aria-hidden="true">
        <img src="867f567d-8d0c-4471-8dfa-48e20be7da65.png" alt="" class="avatar-small">
      </div>
      <div class="chat-bubble bot-bubble">
        <div class="bubble-header">
          <span class="bubble-sender-name">Maddi Sahasra (AI Twin)</span>
          <span class="bubble-timestamp">${time}</span>
        </div>
        <div class="bubble-text">${htmlContent}</div>
      </div>
    `;
    chatMessages.appendChild(row);
    scrollChatToBottom();
  }

  /* ========================================================================
   * [FUTURE API INTEGRATION POINT: OPENAI / LLM BACKEND HOOK]
   * ========================================================================
   * When you are ready to connect this interface to OpenAI (e.g. GPT-4o / GPT-4o-mini),
   * Anthropic Claude, or Google Gemini, refer to the following guidelines:
   *
   * 1. DO NOT PUT YOUR SECRET API KEY DIRECTLY IN CLIENT-SIDE CODE:
   *    In production, exposing `apiKey: "sk-..."` in client JavaScript allows anyone
   *    inspecting network requests to steal your credentials and run up billing costs.
   *
   * 2. RECOMMENDED BACKEND PROXY ARCHITECTURE:
   *    Client Browser (script.js)
   *          │
   *          ▼ POST /api/chat { message: "...", history: [...] }
   *    Your Secure Backend (Next.js API route, Express, or Cloudflare Worker)
   *          │ (Holds process.env.OPENAI_API_KEY safely)
   *          ▼ POST https://api.openai.com/v1/chat/completions
   *    OpenAI Servers
   *
   * 3. BACKEND SERVER IMPLEMENTATION EXAMPLE (e.g., Next.js / Node.js):
   *    ------------------------------------------------------------------------
   *    // app/api/chat/route.js (or server.js)
   *    import OpenAI from 'openai';
   *    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
   *
   *    export async function POST(req) {
   *      const { message, history } = await req.json();
   *      
   *      const systemPrompt = `You are the AI Digital Twin of Maddi Sahasra, an elite
   *      full-stack software engineer specializing in TypeScript, React, Go, Kafka,
   *      Redis, and high-throughput distributed systems. Answer politely, concisely,
   *      and highlight portfolio projects (CloudScale, SyncFlow, OrbitCLI, etc.).`;
   *
   *      const response = await openai.chat.completions.create({
   *        model: "gpt-4o-mini",
   *        temperature: 0.7,
   *        max_tokens: 450,
   *        messages: [
   *          { role: "system", content: systemPrompt },
   *          ...(history || []),
   *          { role: "user", content: message }
   *        ],
   *      });
   *
   *      return Response.json({ reply: response.choices[0].message.content });
   *    }
   *    ------------------------------------------------------------------------
   *
   * 4. SWITCHING TO LIVE API:
   *    Flip `USE_LIVE_API = true` below and define your proxy endpoint in
   *    `fetchOpenAiResponse()`.
   * ======================================================================== */

  // Flag to toggle between local simulated intelligence and live OpenAI backend
  const USE_LIVE_API = false; // Set to TRUE once your backend proxy is deployed

  // Placeholder for calling your secure OpenAI backend endpoint
  async function fetchOpenAiResponse(userMessage) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI proxy returned HTTP status ${response.status}`);
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.warn('[OpenAI Integration] Live API call failed, falling back to local simulated response:', error);
      // Fallback gracefully to the built-in simulated engine
      return generateSimulatedResponse(userMessage);
    }
  }

  // Simulated AI Engine: Comprehensively covers Maddi Sahasra's portfolio domain
  function generateSimulatedResponse(input) {
    const query = input.toLowerCase().trim();

    // 1. Tech Stack & Programming Languages
    if (
      query.includes('stack') ||
      query.includes('tech') ||
      query.includes('language') ||
      query.includes('tool') ||
      query.includes('frontend') ||
      query.includes('backend') ||
      query.includes('database')
    ) {
      return `
        My core technical stack focuses on end-to-end distributed systems and modern web architecture:
        <ul>
          <li><strong>Languages:</strong> TypeScript, JavaScript (ES6+), Python, Go (Golang), Java, SQL.</li>
          <li><strong>Frontend:</strong> React 18, Next.js 14, HTML5 Canvas API, WebAssembly, Vanilla CSS Design Systems.</li>
          <li><strong>Backend &amp; APIs:</strong> Node.js, Express, FastAPI, Go Gin, RESTful &amp; WebSocket microservices.</li>
          <li><strong>Databases &amp; Caching:</strong> PostgreSQL, TimescaleDB, Redis (Pub/Sub &amp; Mutexes), MySQL.</li>
          <li><strong>DevOps &amp; Infra:</strong> Docker, Kubernetes, Apache Kafka, Linux cgroups, GitHub Actions CI/CD.</li>
        </ul>
        You can inspect interactive proficiency gauges in the <strong>Skills</strong> section above!
      `;
    }

    // 2. Featured Projects: CloudScale
    if (query.includes('cloudscale') || query.includes('telemetry') || query.includes('observability')) {
      return `
        <strong>CloudScale</strong> is a real-time observability telemetry engine I architected to solve metric ingestion bottlenecks during burst traffic spikes:
        <ul>
          <li>Ingestion layer processes streaming metric bursts through <strong>Apache Kafka</strong> with backpressure regulation.</li>
          <li>Hot metrics cache in <strong>Redis</strong> for sub-millisecond lookups, while historical series persist to partitioned <strong>TimescaleDB</strong> tables.</li>
          <li>Sustains sub-<strong>15ms p95 query latency</strong> across 50,000+ simultaneous time-series streams.</li>
          <li>Custom hardware-accelerated Canvas surface rendering 100k+ data points at 60fps.</li>
        </ul>
        Click <em>"Architecture ℹ️"</em> on CloudScale in the <strong>Projects</strong> section to view the full pipeline diagram!
      `;
    }

    // 3. Featured Projects: SyncFlow
    if (query.includes('syncflow') || query.includes('crdt') || query.includes('multiplayer') || query.includes('collaboration')) {
      return `
        <strong>SyncFlow</strong> is an asynchronous real-time collaborative workspace powered by <strong>Conflict-free Replicated Data Types (CRDTs)</strong>:
        <ul>
          <li>Eliminates centralized write-locks so concurrent edits and drag-and-drop operations merge deterministically.</li>
          <li>Low-latency bidirectional state propagation over <strong>WebSockets</strong> backed by Go microservices and Redis Pub/Sub.</li>
          <li>Optimistic UI mutations ensure instant visual feedback with seamless conflict resolution.</li>
        </ul>
        Check out the Projects section to examine its state diffing architecture!
      `;
    }

    // 4. Featured Projects: OrbitCLI
    if (query.includes('orbit') || query.includes('orbitcli') || query.includes('cli')) {
      return `
        <strong>OrbitCLI</strong> is a cross-platform multi-cloud development orchestrator compiled in <strong>Go (Cobra)</strong>:
        <ul>
          <li>Parses declarative YAML manifests to construct Directed Acyclic Graphs (DAGs) of service dependencies.</li>
          <li>Reduces developer local environment onboarding from 45 minutes to under <strong>38 seconds</strong>.</li>
          <li>Adopted by multiple engineering teams with 1,400+ GitHub stars.</li>
        </ul>
      `;
    }

    // 5. Featured Projects: PixelForge
    if (query.includes('pixelforge') || query.includes('sprite') || query.includes('pixel') || query.includes('canvas')) {
      return `
        <strong>PixelForge</strong> is a browser-native 8-bit sprite studio and graphics engine:
        <ul>
          <li>Uses HTML5 2D Canvas offscreen rendering buffers and <strong>WebAssembly</strong> color quantization routines.</li>
          <li>Provides authentic retro palette profiles (NES, Game Boy, PICO-8) with zero frame drops at 60fps.</li>
          <li>Exports packed sprite sheets and JSON texture atlases for Unity and Phaser.</li>
        </ul>
      `;
    }

    // 6. Featured Projects: TapLearn & AuraGateway
    if (query.includes('taplearn') || query.includes('sandbox') || query.includes('evaluator')) {
      return `
        <strong>TapLearn</strong> is an enterprise sandboxed automated code evaluation runner:
        <ul>
          <li>Runs untrusted student submissions inside isolated, unprivileged Linux containers with strict <strong>cgroup constraints</strong> (CPU, RAM, zero network egress).</li>
          <li>Over 50,000+ executions completed with 0 container escapes or resource exhaustion events.</li>
          <li>Built with Java 17, Spring Boot, React, and Docker.</li>
        </ul>
      `;
    }

    if (query.includes('aura') || query.includes('auragateway') || query.includes('payment') || query.includes('fintech')) {
      return `
        <strong>AuraGateway</strong> is a distributed payment ingestion engine built to guarantee transactional idempotency:
        <ul>
          <li>Locks incoming transactions using <strong>Redis distributed mutexes</strong> to prevent double charges during client retries.</li>
          <li>Tested under synthetic peak loads of 20,000+ ops/sec with 0% duplicate ledger entries.</li>
          <li>AES-256 encrypted signatures with automated dead-letter queue webhook reconciliation.</li>
        </ul>
      `;
    }

    // 7. General Projects Query
    if (query.includes('project') || query.includes('portfolio') || query.includes('work') || query.includes('built')) {
      return `
        I have engineered 6 production-grade systems featured in this portfolio:
        <ul>
          <li><strong>CloudScale:</strong> Kafka + TimescaleDB real-time telemetry observability platform.</li>
          <li><strong>SyncFlow:</strong> CRDT-powered real-time multiplayer board engine.</li>
          <li><strong>OrbitCLI:</strong> Go-based multi-cloud environment orchestrator.</li>
          <li><strong>PixelForge:</strong> HTML5 Canvas &amp; Wasm retro sprite creation studio.</li>
          <li><strong>TapLearn:</strong> Sandboxed containerized automated code evaluator.</li>
          <li><strong>AuraGateway:</strong> Idempotent high-throughput fintech payment engine.</li>
        </ul>
        Each project in the <strong>Projects</strong> section includes an interactive architecture modal with system diagrams and benchmark specs!
      `;
    }

    // 8. Systems Architecture & Distributed Systems
    if (
      query.includes('architecture') ||
      query.includes('distributed') ||
      query.includes('kafka') ||
      query.includes('redis') ||
      query.includes('microservice') ||
      query.includes('concurrency') ||
      query.includes('scale') ||
      query.includes('latency')
    ) {
      return `
        My architectural approach prioritizes:
        <ul>
          <li><strong>Decoupled Event Streaming:</strong> Using Apache Kafka or Redis streams to buffer bursts, decoupling write ingestion from read query services.</li>
          <li><strong>Data Partitioning &amp; Indexing:</strong> Partitioning large time-series datasets (TimescaleDB / Postgres) by chunk intervals to prevent index bloat.</li>
          <li><strong>Concurrency Guarantees:</strong> Utilizing Redis distributed locks (Redlock) for strict idempotency and CRDTs for distributed optimistic updates.</li>
          <li><strong>Defensive Isolation:</strong> Sandboxing workloads with kernel cgroups and unprivileged Docker runtimes.</li>
        </ul>
        Check out the <strong>Video Walkthrough</strong> (Channel 02) for a deep dive into these patterns!
      `;
    }

    // 9. Work Experience & Career Background
    if (
      query.includes('experience') ||
      query.includes('career') ||
      query.includes('job') ||
      query.includes('company') ||
      query.includes('tech solutions') ||
      query.includes('nextgen') ||
      query.includes('resume')
    ) {
      return `
        Here is a snapshot of Maddi Sahasra's career milestones:
        <ul>
          <li><strong>Software Engineer @ Tech Solutions Inc. (2024 - Present):</strong> Architecting high-throughput microservices, real-time event streaming pipelines, and leading sprint deliveries.</li>
          <li><strong>Frontend Engineer @ NextGen Digital (2023 - 2024):</strong> Engineered accessible component libraries, reduced Core Web Vitals LCP by 40%, and collaborated across design/product squads.</li>
          <li><strong>Full-Stack Engineering Program @ Tap Academy (2022 - 2023):</strong> Rigorous immersion in Java, Spring Boot, data structures, algorithms, and SQL database design.</li>
          <li><strong>B.Tech in Computer Science &amp; Engineering:</strong> Foundational grounding in operating systems, networking protocols, and discrete mathematics.</li>
        </ul>
        Explore the <strong>Timeline</strong> section for chronological milestones!
      `;
    }

    // 10. Availability & Hiring Opportunities
    if (
      query.includes('hire') ||
      query.includes('open') ||
      query.includes('available') ||
      query.includes('role') ||
      query.includes('interview') ||
      query.includes('contract') ||
      query.includes('full-time') ||
      query.includes('relocate') ||
      query.includes('remote')
    ) {
      return `
        <strong>Yes!</strong> Maddi Sahasra is actively open to discussions for:
        <ul>
          <li>⚡ <strong>Full-time Software Engineering roles</strong> (Full-Stack, Backend, or Distributed Systems).</li>
          <li>🌐 <strong>Remote or hybrid opportunities</strong> with engineering-driven teams.</li>
          <li>🎯 High-impact product builds requiring scalable architectures, low-latency microservices, and pixel-precise frontends.</li>
        </ul>
        You can reach out directly via the <strong>Contact</strong> section or email at <a href="mailto:engineer@example.com" style="color:var(--accent-primary);text-decoration:underline;">engineer@example.com</a>!
      `;
    }

    // 11. Soft Skills & Core Competencies
    if (
      query.includes('soft skill') ||
      query.includes('leadership') ||
      query.includes('communication') ||
      query.includes('collaboration') ||
      query.includes('problem solving')
    ) {
      return `
        Engineering excellence extends beyond syntax. Maddi Sahasra places high value on:
        <ul>
          <li><strong>Problem Solving &amp; Analytical Thinking:</strong> Root-cause analysis over quick patches, profiling bottlenecks with quantitative benchmarks.</li>
          <li><strong>Team Collaboration &amp; Mentorship:</strong> Rigorous peer code reviews, blameless postmortems, and clear RFC documentation.</li>
          <li><strong>Technical Documentation:</strong> Maintaining architecture decision records (ADRs) and comprehensive API specs.</li>
          <li><strong>Adaptability &amp; Quick Learning:</strong> Rapidly picking up new ecosystems and paradigms based on project constraints.</li>
        </ul>
      `;
    }

    // 12. Video Walkthrough & Demos
    if (query.includes('video') || query.includes('youtube') || query.includes('watch') || query.includes('walkthrough')) {
      return `
        Check out the <strong>Portfolio Highlight Video</strong> section right above Testimonials! It features a retro CRT monitor interface with three switchable channels:
        <ul>
          <li><em>CH-01:</em> Engineering Philosophy &amp; Architecture Overview</li>
          <li><em>CH-02:</em> Microservices &amp; Event-Driven Pipelines (Kafka/Redis)</li>
          <li><em>CH-03:</em> Real-Time Multiplayer State with CRDTs</li>
        </ul>
        You can even toggle CRT scanlines and click chapter timestamps!
      `;
    }

    // 13. Testimonials & Peer Feedback
    if (query.includes('testimonial') || query.includes('review') || query.includes('recommend') || query.includes('feedback')) {
      return `
        The <strong>Testimonials</strong> section highlights feedback from engineering leaders and peers:
        <ul>
          <li><strong>Rajesh Sharma (Director of Engineering):</strong> Praised systems rigor, Kafka pipeline architecture, and sub-15ms p95 SLAs.</li>
          <li><strong>Priya Patel (Staff Software Architect):</strong> Commended clean modular design and deterministic CRDT synchronization.</li>
          <li><strong>Arjun Varma (Lead Technical Mentor):</strong> Commended problem-solving acumen and algorithmic clarity.</li>
          <li><strong>Sneha Reddy (VP of Product):</strong> Highlighted on-time project execution and user-centric empathy.</li>
        </ul>
      `;
    }

    // 14. Education & Tap Academy
    if (query.includes('education') || query.includes('degree') || query.includes('college') || query.includes('tap academy')) {
      return `
        Maddi Sahasra holds a <strong>B.Tech in Computer Science and Engineering</strong> (focused on distributed systems, OS, and algorithms) and completed the rigorous Full-Stack Software Engineering specialization at <strong>Tap Academy</strong> (covering Java, Spring Boot, microservices, and database tuning).
      `;
    }

    // 15. Greetings & Pleasantries
    if (
      query === 'hi' ||
      query === 'hello' ||
      query === 'hey' ||
      query.startsWith('hello') ||
      query.startsWith('hi ') ||
      query.startsWith('hey ') ||
      query.includes('who are you')
    ) {
      return `
        Hello there! 👋 I am Maddi Sahasra's AI Digital Twin. I can answer any questions regarding her software architecture, full-stack tech stack, featured projects, or career milestones.
        <br><br>
        Try clicking one of the suggested chips below or asking:
        <em>"Tell me how CloudScale handles metric backpressure"</em> or <em>"Are you open to full-time roles?"</em>
      `;
    }

    // 16. Contact Details
    if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('linkedin') || query.includes('github')) {
      return `
        You can get in touch with Maddi Sahasra through:
        <ul>
          <li>📧 <strong>Email:</strong> <a href="mailto:engineer@example.com" style="color:var(--accent-primary);text-decoration:underline;">engineer@example.com</a></li>
          <li>💼 <strong>LinkedIn:</strong> <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);text-decoration:underline;">linkedin.com/in/maddi-sahasra</a></li>
          <li>🐙 <strong>GitHub:</strong> <a href="https://github.com" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);text-decoration:underline;">github.com/maddi-sahasra</a></li>
        </ul>
        Or scroll down to the <strong>Contact</strong> section at the bottom of the page!
      `;
    }

    // 17. Default / Fallback Response
    return `
      Thanks for your question! As Maddi Sahasra's AI Twin, I'm happy to help. While my simulated neural weights might not have a pre-trained answer for that specific phrasing, here are areas I know thoroughly:
      <ul>
        <li>💻 <strong>Core Tech Stack:</strong> TypeScript, React, Go, Kafka, Redis, Docker, PostgreSQL.</li>
        <li>🚀 <strong>Featured Projects:</strong> CloudScale, SyncFlow, OrbitCLI, PixelForge, TapLearn, AuraGateway.</li>
        <li>⚡ <strong>Distributed Architecture:</strong> Low-latency streaming, CRDTs, Redis mutexes, Docker sandboxing.</li>
        <li>💼 <strong>Experience &amp; Opportunities:</strong> Software engineer background and availability for hire.</li>
      </ul>
      Feel free to ask about any of the above or click a suggested prompt chip!
    `;
  }

  // Handle message submission
  function handleMessageSubmit(messageText) {
    if (!messageText || isAiResponding) return;

    // 1. Display user bubble immediately
    appendUserMessage(messageText);
    if (chatInput) chatInput.value = '';

    // 2. Lock UI state
    isAiResponding = true;
    if (chatSendBtn) chatSendBtn.disabled = true;

    // 3. Display typing indicator
    showTypingIndicator();

    // 4. Calculate realistic simulated thinking delay (600ms to 1100ms)
    const simulatedDelay = Math.min(1100, Math.max(620, messageText.length * 18));

    setTimeout(async () => {
      removeTypingIndicator();

      let replyHtml = '';
      if (USE_LIVE_API) {
        // [OPENAI API HOOK] Calls external backend endpoint when configured
        replyHtml = await fetchOpenAiResponse(messageText);
      } else {
        // Local simulation engine
        replyHtml = generateSimulatedResponse(messageText);
      }

      appendBotMessage(replyHtml);
      isAiResponding = false;
      if (chatSendBtn) chatSendBtn.disabled = false;
      if (chatInput) chatInput.focus();
    }, simulatedDelay);
  }

  // Bind Form Submit Listener
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const messageText = chatInput.value.trim();
      if (messageText) {
        handleMessageSubmit(messageText);
      }
    });
  }

  // Bind Suggestion Chip Buttons
  if (suggestionChips.length > 0) {
    suggestionChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        if (prompt && !isAiResponding) {
          handleMessageSubmit(prompt);
        }
      });
    });
  }

  // Bind Reset / Clear Chat History Button
  if (clearChatBtn && chatMessages) {
    clearChatBtn.addEventListener('click', () => {
      chatMessages.innerHTML = `
        <div class="chat-message-row bot-row">
          <div class="message-avatar" aria-hidden="true">
            <img src="867f567d-8d0c-4471-8dfa-48e20be7da65.png" alt="" class="avatar-small">
          </div>
          <div class="chat-bubble bot-bubble">
            <div class="bubble-header">
              <span class="bubble-sender-name">Maddi Sahasra (AI)</span>
              <span class="bubble-timestamp">${getFormattedTime()}</span>
            </div>
            <div class="bubble-text">
              Conversation session refreshed! 👋 I'm ready to answer any questions about Maddi Sahasra's engineering architecture, full-stack systems, or role availability. What's on your mind?
            </div>
          </div>
        </div>
      `;
      if (chatInput) {
        chatInput.value = '';
        chatInput.focus();
      }
      scrollChatToBottom();
    });
  }

  /* ------------------------------------------------------------------------
     4. Timeline Category Filter (All / Career / Major Projects / Education)
     ------------------------------------------------------------------------ */
  const timelineFilterBtns = document.querySelectorAll('.timeline-filter-btn');
  const timelineEntries = document.querySelectorAll('.timeline-entry');

  if (timelineFilterBtns.length > 0) {
    timelineFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedFilter = btn.getAttribute('data-filter');

        // Update active filter button state
        timelineFilterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter timeline cards with smooth transition
        timelineEntries.forEach((entry) => {
          const category = entry.getAttribute('data-category');
          if (selectedFilter === 'all' || category === selectedFilter) {
            entry.classList.remove('is-hidden');
            entry.style.opacity = '0';
            entry.style.transform = 'translateY(6px)';
            setTimeout(() => {
              entry.style.opacity = '1';
              entry.style.transform = 'translateY(0)';
            }, 50);
          } else {
            entry.classList.add('is-hidden');
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. Projects Category Filter (All / Full-Stack / Systems / DevOps / Tools)
     ------------------------------------------------------------------------ */
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (projectFilterBtns.length > 0) {
    projectFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedFilter = btn.getAttribute('data-filter');

        // Update active filter button state
        projectFilterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter project cards with smooth staggered animation
        projectCards.forEach((card, index) => {
          const categoryString = card.getAttribute('data-category') || '';
          const categories = categoryString.split(' ');

          if (selectedFilter === 'all' || categories.includes(selectedFilter)) {
            card.classList.remove('is-hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30 * index);
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. Interactive Project Architecture & Case Study Modal
     ------------------------------------------------------------------------ */
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const projectArchBtns = document.querySelectorAll('.project-arch-btn');

  // Modal Content Target Elements
  const modalBadge = document.getElementById('modal-project-badge');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalDiagram = document.getElementById('modal-project-diagram');
  const modalHighlights = document.getElementById('modal-project-highlights');
  const modalTech = document.getElementById('modal-project-tech');
  const modalLiveLink = document.getElementById('modal-live-link');
  const modalSourceLink = document.getElementById('modal-source-link');

  // Comprehensive Architectural Specs Database
  const architectureData = {
    cloudscale: {
      title: 'CloudScale // Real-Time Observability Engine',
      badge: '[FULL-STACK DISTRIBUTED PLATFORM]',
      desc: 'CloudScale was architected to eliminate metric ingestion bottlenecks during burst traffic spikes. The ingestion layer routes streaming telemetry through Apache Kafka for distributed backpressure control, storing hot metrics into Redis for sub-millisecond retrieval and writing historical intervals into partitioned TimescaleDB tables.',
      diagram: `[Telemetry Agents] ──> [Envoy API Gateway] ──> [Apache Kafka Bus]
                                                    │
                 ┌──────────────────────────────────┴──────────────────────────────────┐
                 ▼                                                                     ▼
       [Redis In-Memory Hot Cache]                                           [TimescaleDB Analytical Store]
                 │                                                                     │
                 └───────────────────────► [Query Engine Service] ◄────────────────────┘
                                                     │ (WebSocket / SSE)
                                                     ▼
                                        [Next.js Canvas Client UI]`,
      highlights: [
        '✦ Sustained sub-15ms p95 latency on high-frequency metric queries across 50k+ time-series streams.',
        '✦ Custom hardware-accelerated HTML5 Canvas engine rendering 100k+ data points at fluid 60fps.',
        '✦ Sliding-window z-score anomaly detector triggering automated Slack and PagerDuty notifications.'
      ],
      tech: ['Next.js 14', 'TypeScript', 'Node.js', 'Apache Kafka', 'TimescaleDB', 'PostgreSQL', 'Redis', 'Docker'],
      liveLink: '#0',
      sourceLink: '#0'
    },
    syncflow: {
      title: 'SyncFlow // Real-Time Multiplayer Workspace',
      badge: '[COLLABORATIVE ENGINE]',
      desc: 'SyncFlow implements an asynchronous multiplayer architecture powered by Conflict-free Replicated Data Types (CRDTs). When multiple engineers reorganize tasks or edit shared boards in parallel, operations merge deterministically without requiring centralized write locks.',
      diagram: `[User A Client] <═══ WebSockets ═══> [Go Gateway Cluster]
                                              ║ (Redis Pub/Sub)
[User B Client] <═══ WebSockets ═══> [Event Broker Bus]
                                              ║
                                     [CRDT State Engine]
                                              ║
                                     [PostgreSQL Storage]`,
      highlights: [
        '✦ Zero data collisions across concurrent multi-user drag-and-drop operations.',
        '✦ Optimistic frontend mutations with seamless rollback reconciliation on dropped frames.',
        '✦ Sub-25ms global WebSocket message propagation with Go microservices.'
      ],
      tech: ['React 18', 'WebSockets', 'Go (Golang)', 'Redis Pub/Sub', 'PostgreSQL', 'Docker', 'Tailwind CSS'],
      liveLink: '#0',
      sourceLink: '#0'
    },
    orbitcli: {
      title: 'OrbitCLI // Multi-Cloud Environment Orchestrator',
      badge: '[DEVOPS & SYSTEM CLI]',
      desc: 'Engineered to completely eradicate developer setup discrepancies. OrbitCLI parses declarative YAML topology manifests, dynamically resolves directed acyclic graphs (DAGs) of service dependencies, provisions isolated virtual networks, and sets up volume-caching layers.',
      diagram: `[Developer Terminal] ──> [Orbit CLI Binary (Go)]
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
  [Manifest Parser]      [DAG Dependency Graph]     [Docker / K8s Engine]
                                  │                        │
                                  └────────► [Isolated Local Cluster]`,
      highlights: [
        '✦ Reduced local dev environment onboarding setup from 45 minutes to under 38 seconds.',
        '✦ Over 1,400 GitHub stars and adopted by multiple open-source engineering teams.',
        '✦ Cross-platform binary compiled with Go Cobra with native Docker Engine API hooks.'
      ],
      tech: ['Go (Golang)', 'Docker Engine API', 'Kubernetes Client', 'Cobra CLI', 'GitHub Actions', 'Linux'],
      liveLink: '#0',
      sourceLink: '#0'
    },
    pixelforge: {
      title: 'PixelForge // 8-Bit Sprite Engine & Studio',
      badge: '[GRAPHICS & INTERACTIVE TECH]',
      desc: 'PixelForge is a high-performance browser-native pixel creation studio. It leverages HTML5 2D Canvas offscreen rendering buffers and WebAssembly routines for color quantization, guaranteeing zero lag when painting and previewing animated 60fps sprite loops.',
      diagram: `[Browser Viewport] ──> [Interactive Canvas Surface]
                                 │
                   ┌─────────────┴─────────────┐
                   ▼                           ▼
        [Offscreen Buffer Layer]    [Wasm Quantization Engine]
                   │                           │
                   └─────────────┬─────────────┘
                                 ▼
                     [Atlas / Spritesheet Exporter]`,
      highlights: [
        '✦ 60fps hardware-accelerated canvas rasterization supporting layers and onion skinning.',
        '✦ Authentic retro palette quantization algorithms supporting NES, Game Boy, and custom profiles.',
        '✦ Automated export to compact PNG spritesheets and Phaser/Unity JSON atlas descriptors.'
      ],
      tech: ['TypeScript', 'HTML5 Canvas', 'WebAssembly', 'CSS Grid', 'Vite'],
      liveLink: '#0',
      sourceLink: '#0'
    },
    taplearn: {
      title: 'TapLearn // Sandboxed Automated Code Evaluator',
      badge: '[ENTERPRISE LMS & SECURITY]',
      desc: 'A secure online code execution and grading system. Student code submissions run within isolated, unprivileged Linux containers with hard kernel-level cgroup constraints on CPU cycles, memory usage, and zero network routing.',
      diagram: `[Student Submission] ──> [Spring Boot REST API] ──> [Evaluation Queue]
                                                             │
                                                    [Docker Container]
                                                    ┌─────────────────┐
                                                    │ * Isolated cgroup
                                                    │ * No net access 
                                                    │ * 2 sec timeout 
                                                    └─────────────────┘
                                                             │
                                               [JUnit / Test Assertions]
                                                             │
                                                    [Student Report]`,
      highlights: [
        '✦ Zero container escapes or resource exhaustion incidents across 50,000+ executions.',
        '✦ Multi-language evaluation runner supporting Java, Python, and SQL with sub-50ms dispatch.',
        '✦ Comprehensive instructor analytics dashboard with automated code performance profiling.'
      ],
      tech: ['Java 17', 'Spring Boot', 'React', 'MySQL', 'Docker Sandboxing', 'Linux cgroups'],
      liveLink: '#0',
      sourceLink: '#0'
    },
    auragateway: {
      title: 'AuraGateway // High-Throughput Payment Engine',
      badge: '[DISTRIBUTED FINTECH API]',
      desc: 'A mission-critical payment ingestion engine built to guarantee transactional idempotency. Requests are signed, hashed, and locked via Redis distributed mutexes, completely eliminating double charges during client retries or network drops.',
      diagram: `[Payment Request] ──> [FastAPI Gateway]
                              │
               [Idempotency Key Check (Redis)]
               ├── Key exists? ──► Return Cached Response
               └── New Key? ──► Acquire Lock
                                      │
                              [Execute Transaction]
                                      │
                        ┌─────────────┴─────────────┐
                        ▼                           ▼
                 [Stripe API / Rails]        [PostgreSQL Ledger]`,
      highlights: [
        '✦ Tested under peak loads of 20,000+ operations/sec with 0% duplicate ledger charges.',
        '✦ Dead-letter queue and automatic exponential backoff webhook reconciliation.',
        '✦ AES-256 encrypted payload signatures with end-to-end cryptographic audit trails.'
      ],
      tech: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Stripe API', 'Docker'],
      liveLink: '#0',
      sourceLink: '#0'
    }
  };

  function openProjectModal(projectId) {
    const data = architectureData[projectId];
    if (!data || !projectModal) return;

    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalDiagram.textContent = data.diagram;

    // Populate highlights
    modalHighlights.innerHTML = '';
    data.highlights.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>✦</span> <span>${escapeHtml(item.replace(/^✦\s*/, ''))}</span>`;
      modalHighlights.appendChild(li);
    });

    // Populate tech badges
    modalTech.innerHTML = '';
    data.tech.forEach((t) => {
      const li = document.createElement('li');
      li.className = 'tech-badge';
      li.textContent = t;
      modalTech.appendChild(li);
    });

    modalLiveLink.setAttribute('href', data.liveLink || '#0');
    modalSourceLink.setAttribute('href', data.sourceLink || '#0');

    projectModal.removeAttribute('hidden');
    // Trigger reflow for transition
    void projectModal.offsetWidth;
    projectModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus();
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      projectModal.setAttribute('hidden', '');
    }, 300);
  }

  /* ------------------------------------------------------------------------
     THUMBNAIL TO DETAIL VIEW CONNECTION
     ------------------------------------------------------------------------
     Each clickable thumbnail button (.project-thumbnail-btn) and architecture button
     (.project-arch-btn) carries a data-project attribute matching a key in architectureData.
     Clicking a thumbnail immediately opens the project's detailed architecture view
     in #project-modal, displaying system diagrams, benchmark metrics, and links.
     ------------------------------------------------------------------------ */
  const projectThumbnailBtns = document.querySelectorAll('.project-thumbnail-btn');

  // Connect thumbnail clicks directly to the project detail view
  projectThumbnailBtns.forEach((thumbBtn) => {
    thumbBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = thumbBtn.getAttribute('data-project');
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  // Connect architecture button clicks to the same project detail view
  projectArchBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  // Close modal events
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }
  if (modalDismissBtn) {
    modalDismissBtn.addEventListener('click', closeProjectModal);
  }
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-open')) {
      closeProjectModal();
    }
  });

  /* ------------------------------------------------------------------------
     7. Retro Video Console Controls (CRT Scanlines & Channel Switching)
     ------------------------------------------------------------------------ */
  const scanlineToggleBtn = document.getElementById('scanline-toggle-btn');
  const scanlineBtnText = document.getElementById('scanline-btn-text');
  const crtScanlinesLayer = document.getElementById('crt-scanlines-layer');
  const screenHousing = document.getElementById('screen-housing');
  const channelBtns = document.querySelectorAll('.channel-btn');
  const youtubeIframe = document.getElementById('portfolio-youtube-video');
  const videoCaptionHeading = document.getElementById('video-caption-heading');
  const videoCaptionBody = document.getElementById('video-caption-body');

  // Toggle CRT scanline overlay
  if (scanlineToggleBtn && crtScanlinesLayer && scanlineBtnText) {
    let scanlinesActive = true;
    scanlineToggleBtn.addEventListener('click', () => {
      scanlinesActive = !scanlinesActive;
      if (scanlinesActive) {
        crtScanlinesLayer.classList.remove('is-disabled');
        scanlineBtnText.textContent = 'CRT FX: ON';
        scanlineToggleBtn.setAttribute('title', 'Disable CRT scanline raster effect');
      } else {
        crtScanlinesLayer.classList.add('is-disabled');
        scanlineBtnText.textContent = 'CRT FX: OFF';
        scanlineToggleBtn.setAttribute('title', 'Enable CRT scanline raster effect');
      }
    });
  }

  // Channel switching dictionary
  const videoChannels = {
    intro: {
      url: 'https://www.youtube-nocookie.com/embed/aircAruvnKk?rel=0&modestbranding=1',
      title: 'Engineering Philosophy, Distributed Pipelines & Architecture Walkthrough',
      desc: 'This portfolio highlight provides a detailed walkthrough of Maddi Sahasra’s engineering journey and distributed system architectures. In this session, Sahasra demonstrates real-time observability telemetry streaming through Apache Kafka and Redis (CloudScale), multiplayer state synchronization using CRDTs (SyncFlow), and automated container isolation sandboxes (TapLearn). The presentation emphasizes microservice resilience, low-latency querying, and pixel-precise, accessible frontend design.'
    },
    architecture: {
      url: 'https://www.youtube-nocookie.com/embed/M576WGiDBdQ?rel=0&modestbranding=1',
      title: 'Deep Dive: Microservices Architecture & Event-Driven Message Brokers',
      desc: 'Channel 02 focuses on backend resilience patterns: partitioning time-series PostgreSQL databases, managing consumer groups with Apache Kafka, and eliminating write contention with Redis distributed mutex locks. Learn how microservices communicate with sub-15ms p95 latency under high-load synthetic stress testing.'
    },
    systems: {
      url: 'https://www.youtube-nocookie.com/embed/L_LUpnjgPso?rel=0&modestbranding=1',
      title: 'Systems & Real-Time Synchronization: CRDTs & Low-Latency WebSockets',
      desc: 'Channel 03 examines real-time collaborative state engines. Explores Conflict-free Replicated Data Types (CRDTs), state diffing over WebSockets, and zero-downtime container orchestration with OrbitCLI. Discusses trade-offs between consistency models and optimistic UI rendering.'
    }
  };

  if (channelBtns.length > 0 && youtubeIframe) {
    channelBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const channelKey = btn.getAttribute('data-channel');
        const channelData = videoChannels[channelKey];
        if (!channelData) return;

        // Update active button state
        channelBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        // Apply brief retro screen flicker effect
        if (screenHousing) {
          screenHousing.style.filter = 'brightness(2) contrast(1.5)';
          setTimeout(() => {
            screenHousing.style.filter = '';
          }, 120);
        }

        // Switch video src & caption
        youtubeIframe.src = channelData.url;
        if (videoCaptionHeading) videoCaptionHeading.textContent = channelData.title;
        if (videoCaptionBody) videoCaptionBody.textContent = channelData.desc;
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. Testimonial Category Filter (All / Leads / Peers / Product)
     ------------------------------------------------------------------------ */
  const testimonialFilterBtns = document.querySelectorAll('.testimonial-filter-btn');
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  if (testimonialFilterBtns.length > 0) {
    testimonialFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedFilter = btn.getAttribute('data-filter');

        // Update active filter button state
        testimonialFilterBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter cards with smooth staggered animation
        testimonialCards.forEach((card, index) => {
          const category = card.getAttribute('data-category');
          if (selectedFilter === 'all' || category === selectedFilter) {
            card.classList.remove('is-hidden');
            card.style.opacity = '0';
            card.style.transform = 'translateY(8px)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 35 * index);
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }
});


