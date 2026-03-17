'use strict';

/* ==========================================
   CANVAS STARFIELD BACKGROUND
   ========================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCv() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCv();
window.addEventListener('resize', resizeCv);

class Star {
  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.z = Math.random() * 2 + 0.1; // Parallax
    this.r = Math.random() * 1.2;
    this.a = Math.random() * 0.6 + 0.2;
  }
  update() {
    this.y -= this.z * 0.15; // float gently upwards
    if (this.y < -this.r) {
      this.y = window.innerHeight + this.r;
      this.x = Math.random() * window.innerWidth;
    }
    // Twinkle
    this.a += (Math.random() - 0.5) * 0.05;
    if (this.a < 0.1) this.a = 0.1;
    if (this.a > 0.8) this.a = 0.8;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    // Cool white/blue starlight tint
    ctx.fillStyle = `rgba(165, 215, 255, ${this.a})`; 
    ctx.fill();
  }
}

for (let i = 0; i < 200; i++) stars.push(new Star());

let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
});

function animCv() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    // Stars move faster when scrolling
    const scrollFactor = (scrollY * 0.05) * (s.z / 2);
    s.y -= (s.z * 0.15 + scrollFactor * 0.1); 
    
    if (s.y < -s.r) {
      s.y = window.innerHeight + s.r;
      s.x = Math.random() * window.innerWidth;
    }
    s.draw();
  });
  requestAnimationFrame(animCv);
}
animCv();

/* ==========================================
   SCROLL PROGRESS
   ========================================== */
const fill = document.getElementById('scroll-fill');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  if (fill) fill.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
});

/* ==========================================
   CUSTOM CURSOR
   ========================================== */
const dot = document.getElementById('cur-dot'),
      ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  if (dot) {
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  }
  
  // Parallax Layer Animation
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const x = (mx - window.innerWidth / 2) * 0.03;
    const y = (my - window.innerHeight / 2) * 0.03;
    heroContent.style.transform = `translate(${x}px, ${y}px) rotateY(${x * 0.1}deg) rotateX(${-y * 0.1}deg)`;
  }
  
  // Subtle glow follow
  const bgGlow = document.querySelector('.bg-glow');
  if (bgGlow) {
    bgGlow.style.left = (mx - window.innerWidth * 0.4) + 'px';
    bgGlow.style.top = (my - window.innerWidth * 0.4) + 'px';
  }
});

function animCursor() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  if (ring) {
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
  }
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a, button, .fp-card, .tl-card, .blog-card, .dsa-platform, .cl-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    dot?.classList.add('hov');
    ring?.classList.add('hov');
  });
  el.addEventListener('mouseleave', () => {
    dot?.classList.remove('hov');
    ring?.classList.remove('hov');
  });
});

/* ==========================================
   THEME TOGGLE
   ========================================== */
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
const tBtn = document.getElementById('theme-btn');
if (tBtn) {
  tBtn.textContent = savedTheme === 'dark' ? '☀' : '🌙';
  tBtn.addEventListener('click', () => {
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    tBtn.textContent = t === 'dark' ? '☀' : '🌙';
  });
}

/* ==========================================
   MOBILE MENU
   ========================================== */
const menuBtn = document.getElementById('menu-btn'),
      mobileMenu = document.getElementById('mobile-menu');
menuBtn?.addEventListener('click', () => mobileMenu?.classList.toggle('open'));
document.querySelectorAll('#mobile-menu a').forEach(a => a.addEventListener('click', () => mobileMenu?.classList.remove('open')));

/* ==========================================
   NAVBAR ACTIVE ON SCROLL
   ========================================== */
const navLinks = document.querySelectorAll('.nav-links a');
const sectionEls = document.querySelectorAll('section[id]');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.3 });
sectionEls.forEach(s => navObserver.observe(s));

/* ==========================================
   TYPEWRITER
   ========================================== */
const roles = ['Software Engineer', 'AI Developer', 'Problem Solver', 'DSA Enthusiast', 'Open Source Contributor'];
let ri = 0, ci = 0, del = false, td = 120;
const typedEl = document.getElementById('typed-role');
const prefixEl = document.getElementById('typed-prefix');

function type() {
  if (!typedEl) return;
  const cur = roles[ri];
  
  // Update a/an prefix dynamically
  if (prefixEl && ci === 0 && !del) {
    const firstChar = cur.charAt(0).toUpperCase();
    prefixEl.textContent = ['A', 'E', 'I', 'O', 'U'].includes(firstChar) ? 'an' : 'a';
  }

  if (del) {
    typedEl.textContent = cur.slice(0, --ci);
    td = 60;
    if (ci === 0) {
      del = false;
      ri = (ri + 1) % roles.length;
      td = 400;
    }
  } else {
    typedEl.textContent = cur.slice(0, ++ci) + '|';
    td = 120;
    if (ci === cur.length) {
      del = true;
      td = 2000;
      typedEl.textContent = cur; // Remove cursor when pausing
    }
  }
  setTimeout(type, td);
}
setTimeout(type, 800);

/* ==========================================
   3D TILT CARDS
   ========================================== */
document.querySelectorAll('.fp-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'none';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s ease';
  });
});

/* ==========================================
   COUNTER ANIMATION
   ========================================== */
function animCount(el, target, dur = 2000) {
  let s = performance.now();
  const suf = el.dataset.suffix || '+';
  const step = ts => {
    const p = Math.min((ts - s) / dur, 1),
          v = Math.floor(1 - Math.pow(1 - p, 3)) * target;
    el.textContent = v;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + suf;
  };
  requestAnimationFrame(step);
}

/* ==========================================
   SKILL BARS & PROGRESS
   ========================================== */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.w + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.bar-fill').forEach(b => barObs.observe(b));

/* ==========================================
   CINEMATIC SECTION OBSERVER
   ========================================== */
const cinematicObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      
      // Narrative entry effect
      const header = e.target.querySelector('.section-header');
      if (header && !header.dataset.animated) {
        header.dataset.animated = "true";
        header.animate([
          { opacity: 0, transform: 'skewX(-15deg) translateY(20px)' },
          { opacity: 1, transform: 'skewX(0deg) translateY(0)' }
        ], { duration: 1000, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
      }

      // Animate children
      e.target.querySelectorAll('[data-count]').forEach(child => {
        if (!child.dataset.animRunning) {
          child.dataset.animRunning = "true";
          animCount(child, parseInt(child.dataset.count));
        }
      });
    }
  });
}, { threshold: 0.1 });

// Initialize observer and force Hero
document.querySelectorAll('section').forEach(s => cinematicObs.observe(s));
document.getElementById('hero')?.classList.add('visible');

// Parallax for scrollytelling
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  document.querySelectorAll('.fp-img').forEach(img => {
    const rect = img.parentElement.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const shift = (rect.top - window.innerHeight / 2) * 0.1;
      img.style.transform = `scale(1.1) translateY(${shift}px)`;
    }
  });
});

/* ==========================================
   ALGORITHM VISUALIZER
   ========================================== */
let algoRunning = false, currentAlgo = 'bubble', arr = [], animTimeout = null;

function genArray(n = 30) {
  arr = Array.from({ length: n }, () => Math.floor(Math.random() * 180) + 20);
  renderBars();
}
// Only generate array if we are on the page with visualizer (defensive check)
if(document.getElementById('sort-bars')) genArray();

function renderBars(comparing = [], swapping = [], sorted = []) {
  const container = document.getElementById('sort-bars');
  if (!container) return;
  container.innerHTML = '';
  const maxW = Math.floor(container.clientWidth / arr.length) - 3;
  const barW = Math.max(4, Math.min(maxW, 20));
  arr.forEach((v, i) => {
    const b = document.createElement('div');
    b.className = 'sort-bar';
    b.style.height = v + 'px';
    b.style.width = barW + 'px';
    if (comparing.includes(i)) b.classList.add('comparing');
    if (swapping.includes(i)) b.classList.add('swapping');
    if (sorted.includes(i)) b.classList.add('sorted');
    container.appendChild(b);
  });
}

function sleep(ms) { return new Promise(r => { animTimeout = setTimeout(r, ms); }); }

function getAnimSpeed() { return 1050 - parseInt(document.getElementById('algo-speed')?.value || 300); }

async function bubbleSort() {
  const n = arr.length, sortedSet = new Set();
  const info = document.getElementById('algo-info');
  if(info) info.textContent = 'Bubble Sort: Comparing adjacent pairs, bubbling largest to end. O(n²) time.';
  
  for (let i = 0; i < n && algoRunning; i++) {
    for (let j = 0; j < n - i - 1 && algoRunning; j++) {
      renderBars([j, j + 1], [], Array.from(sortedSet));
      await sleep(getAnimSpeed());
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        renderBars([], [j, j + 1], Array.from(sortedSet));
        await sleep(getAnimSpeed());
      }
    }
    sortedSet.add(n - i - 1);
  }
  if (algoRunning) {
    renderBars([], [], Array.from({ length: n }, (_, i) => i));
    if(info) info.textContent = '✅ Bubble Sort Complete!';
  }
  algoRunning = false;
}

async function selectionSort() {
  const n = arr.length, sortedSet = new Set();
  const info = document.getElementById('algo-info');
  if(info) info.textContent = 'Selection Sort: Find minimum in unsorted portion, place it at beginning. O(n²) time.';
  
  for (let i = 0; i < n && algoRunning; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n && algoRunning; j++) {
      renderBars([minIdx, j], [], Array.from(sortedSet));
      await sleep(getAnimSpeed());
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      renderBars([], [i, minIdx], Array.from(sortedSet));
      await sleep(getAnimSpeed());
    }
    sortedSet.add(i);
  }
  if (algoRunning) {
    renderBars([], [], Array.from({ length: n }, (_, i) => i));
    if(info) info.textContent = '✅ Selection Sort Complete!';
  }
  algoRunning = false;
}



async function insertionSort() {
  const n = arr.length, sortedSet = new Set([0]);
  const info = document.getElementById('algo-info');
  if(info) info.textContent = 'Insertion Sort: Pick each element and insert into its correct position. O(n²) worst, O(n) best.';
  
  for (let i = 1; i < n && algoRunning; i++) {
    let key = arr[i], j = i - 1;
    while (j >= 0 && arr[j] > key && algoRunning) {
      arr[j + 1] = arr[j];
      renderBars([j, j + 1], [], Array.from(sortedSet));
      await sleep(getAnimSpeed());
      j--;
    }
    arr[j + 1] = key;
    sortedSet.add(i);
    renderBars([], [j + 1], Array.from(sortedSet));
    await sleep(getAnimSpeed());
  }
  if (algoRunning) {
    renderBars([], [], Array.from({ length: n }, (_, i) => i));
    if(info) info.textContent = '✅ Insertion Sort Complete!';
  }
  algoRunning = false;
}

// BFS Visualizer
const NODES = [
  {id:0, x:50, y:150}, {id:1, x:160, y:60}, {id:2, x:160, y:240},
  {id:3, x:280, y:60}, {id:4, x:280, y:240}, {id:5, x:400, y:150},
  {id:6, x:520, y:60}, {id:7, x:520, y:240}
];
const EDGES = [[0,1], [0,2], [1,3], [2,4], [3,5], [4,5], [5,6], [5,7]];
const ADJ = Array.from({ length: 8 }, () => []);
EDGES.forEach(([a, b]) => { ADJ[a].push(b); ADJ[b].push(a); });

function drawBFS(visited = new Set(), queue = [], current = -1) {
  const cv = document.getElementById('bfs-canvas');
  if (!cv) return;
  const c = cv.getContext('2d');
  c.clearRect(0, 0, cv.width, cv.height);
  
  EDGES.forEach(([a, b]) => {
    c.beginPath();
    c.moveTo(NODES[a].x, NODES[a].y);
    c.lineTo(NODES[b].x, NODES[b].y);
    c.strokeStyle = 'rgba(168,85,247,0.3)';
    c.lineWidth = 2;
    c.stroke();
  });
  
  NODES.forEach(n => {
    c.beginPath();
    c.arc(n.x, n.y, 18, 0, Math.PI * 2);
    let color = '#1e1e3f';
    if (n.id === current) color = '#f59e0b';
    else if (visited.has(n.id)) color = '#7c3aed';
    else if (queue.includes(n.id)) color = '#2563eb';
    
    c.fillStyle = color;
    c.strokeStyle = n.id === current ? '#fbbf24' : 'rgba(168,85,247,0.6)';
    c.lineWidth = 2;
    c.fill();
    c.stroke();
    c.fillStyle = '#fff';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = 'bold 13px Inter';
    c.fillText(n.id, n.x, n.y);
  });
}

async function runBFS() {
  const cv = document.getElementById('bfs-canvas');
  const info = document.getElementById('algo-info');
  if (!cv) return;
  if(info) info.textContent = 'BFS: Explores nodes level by level using a queue. O(V+E) time.';
  
  const visited = new Set(), queue = [0], order = [];
  visited.add(0);
  
  while (queue.length && algoRunning) {
    const node = queue.shift();
    order.push(node);
    drawBFS(visited, queue, node);
    await sleep(getAnimSpeed() * 2);
    
    for (const nb of ADJ[node]) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
      }
    }
    drawBFS(visited, queue, node);
    await sleep(getAnimSpeed());
  }
  if (algoRunning) {
    drawBFS(visited, [], -1);
    if(info) info.textContent = `✅ BFS Complete! Order: ${order.join(' → ')}`;
  }
  algoRunning = false;
}

// Algo Setup Listeners
document.querySelectorAll('.atab').forEach(t => {
  t.addEventListener('click', () => {
    if (algoRunning) return;
    document.querySelectorAll('.atab').forEach(a => a.classList.remove('active'));
    t.classList.add('active');
    currentAlgo = t.dataset.algo;
    const sb = document.getElementById('sort-bars'), bw = document.getElementById('bfs-canvas-wrap');
    if (currentAlgo === 'bfs') {
      sb.style.display = 'none';
      bw.style.display = 'block';
      drawBFS();
    } else {
      sb.style.display = 'flex';
      bw.style.display = 'none';
    }
  });
});

document.getElementById('algo-start')?.addEventListener('click', async () => {
  if (algoRunning) return;
  algoRunning = true;
  try {
    if (currentAlgo === 'bubble') await bubbleSort();
    else if (currentAlgo === 'selection') await selectionSort();
    else if (currentAlgo === 'insertion') await insertionSort();
    else if (currentAlgo === 'bfs') await runBFS();
  } catch (err) {
    console.error("Algo error:", err);
  } finally {
    algoRunning = false;
  }
});

document.getElementById('algo-reset')?.addEventListener('click', () => {
  algoRunning = false;
  clearTimeout(animTimeout);
  const info = document.getElementById('algo-info');
  const n = parseInt(document.getElementById('algo-size')?.value || 30);
  if (currentAlgo === 'bfs') {
    drawBFS();
    if(info) info.textContent = 'BFS reset! Press Start to visualize.';
  } else {
    genArray(n);
    if(info) info.textContent = 'Array shuffled! Press Start to visualize.';
  }
});

document.getElementById('algo-size')?.addEventListener('input', e => {
  if (!algoRunning) genArray(parseInt(e.target.value));
});

/* ==========================================
   INTERACTIVE TERMINAL
   ========================================== */
const termData = {
  help: () => `<span class="term-info">Available commands:</span>
<span class="term-suc">  about</span>     — Learn about Nitin
<span class="term-suc">  skills</span>    — List all skills
<span class="term-suc">  projects</span>  — Show featured projects
<span class="term-suc">  dsa</span>       — DSA stats
<span class="term-suc">  contact</span>   — Get contact info
<span class="term-suc">  experience</span>— Work experience
<span class="term-suc">  education</span> — Education history
<span class="term-suc">  social</span>    — Social media links
<span class="term-suc">  clear</span>     — Clear terminal
<span class="term-suc">  whoami</span>    — Who is Nitin?`,
  about: () => `<span class="term-info">Nitin Kumar Singh</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━
Role    : AI Developer & Software Engineer
Location: Sasaram, Bihar, India
Status  : <span class="term-suc">● Available for Opportunities</span>
Passion : AI/ML, DSA, Web Development`,
  whoami: () => `<span class="term-suc">nitin</span> — AI Developer | B.Tech CS | Problem Solver`,
  skills: () => `<span class="term-info">Skills Overview:</span>
Languages : C++ (92%) | Python (88%) | C (85%) | JS (88%)
Web       : React (85%) | Next.js (82%) | Node.js (80%) | Tailwind (90%)
AI/ML     : TensorFlow | PyTorch | NLP | LLMs | Gemini AI
Tools     : Git | Docker | Linux | VS Code | Nmap | Wireshark`,
  projects: () => `<span class="term-info">Featured Projects:</span>
1. <span class="term-suc">AI Coding Mentor</span>       — LLM-powered DSA assistant
2. <span class="term-suc">CPU Scheduler Sim</span>      — OS scheduling visualizer  
3. <span class="term-suc">DesiFood Hub</span>           — Restaurant Management System 🍛
4. <span class="term-suc">Finance Tracker</span>        — PHP Finance Dashboard 💰
<span class="term-out">Run <b>desifood</b> or <b>finance</b> for details</span>`,
  finance: () => `<span class="term-suc">💰 Finance Tracker</span> — PHP Finance Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type    : Web Application (PHP/MySQL)
Features: User Dashboard, Admin Dashboard,
          Landing Page, Transaction Tracking
GitHub  : <span class="term-info">github.com/Nitinsingh7643/FinanceTracker</span>`,
  desifood: () => `<span class="term-suc">🍛 DesiFood Hub</span> — Restaurant Management System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type    : Full-Stack Web Application (MERN + Next.js)
Stack   : Next.js 14 · Node.js · MongoDB · Firebase · Gemini AI
Features: AI Chatbot, Razorpay Payments, Real-time tracking,
          Admin Dashboard, Dynamic Coupons
Status  : <span class="term-suc">✅ Deployed & Active</span>
Demo    : <span class="term-info">https://desifoodhub-api.onrender.com</span>`,
  dsa: () => `<span class="term-info">DSA Progress:</span>
LeetCode   : <span class="term-suc">150+</span> problems | Top 15%
GFG        : <span class="term-suc">100+</span> problems
HackerRank : <span class="term-suc">50+</span> problems | 5★ Algo
Total      : <span class="term-suc">300+</span> problems solved! 🏆`,
  contact: () => `<span class="term-info">Contact Info:</span>
Phone    : <span class="term-suc">+91 7643929550</span>
Email    : <span class="term-suc">nitinsingh6207816283@gmail.com</span>
LinkedIn : <span class="term-suc">linkedin.com/in/nitinsingh9550</span>
GitHub   : <span class="term-suc">github.com/Nitinsingh7643</span>`,
  social: () => `<span class="term-info">Social Links:</span>
<span class="term-suc">→</span> GitHub   : github.com/Nitinsingh7643
<span class="term-suc">→</span> LinkedIn : linkedin.com/in/nitinsingh9550
<span class="term-suc">→</span> Email    : nitinsingh6207816283@gmail.com`,
  experience: () => `<span class="term-info">Experience & Training:</span>
2026 — AI Coding Mentor (Creator)
2025 — Cyber Security Training (CipherSchools)
       Brief: Network security, cryptography, and
              penetration testing using Nmap & Wireshark.
2025 — CPU Scheduler Simulator Creator
2024 — Open Source Contributor`,
  education: () => `<span class="term-info">Education:</span>
2023–2027 : B.Tech CS @ LPU (CGPA: 8.80)
2020–2022 : Class XII @ Shri Shankar College (82%)
2019–2020 : Class X @ Pragya Niketan School (92.8%)`,
  clear: () => '__CLEAR__',
};

const termBody = document.getElementById('term-body');
const termInput = document.getElementById('term-input');
let cmdHistory = [], histIdx = -1;

function addLine(prompt, cmd, out, type = 'term-out') {
  if (!termBody) return;
  const pLine = document.createElement('div');
  pLine.className = 'term-line';
  pLine.innerHTML = `<span class="term-prompt">nitin@portfolio:~$</span> <span class="term-out">${cmd}</span>`;
  termBody.appendChild(pLine);
  if (out === '__CLEAR__') {
    termBody.innerHTML = '';
    return;
  }
  const oDiv = document.createElement('div');
  oDiv.className = 'term-line';
  oDiv.innerHTML = `<span class="${type}">${out}</span>`;
  termBody.appendChild(oDiv);
  termBody.scrollTop = termBody.scrollHeight;
}

termInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const cmd = termInput.value.trim().toLowerCase();
    termInput.value = '';
    if (!cmd) return;
    cmdHistory.unshift(cmd);
    histIdx = -1;
    const fn = termData[cmd];
    if (fn) {
      const res = fn();
      if (res === '__CLEAR__') termBody.innerHTML = '';
      else addLine('nitin@portfolio:~$', cmd, res);
    } else {
      addLine('', '', `<span class="term-err">command not found: ${cmd}. Try "help"</span>`, 'term-err');
    }
  }
  if (e.key === 'ArrowUp') {
    if (histIdx < cmdHistory.length - 1) {
      histIdx++;
      termInput.value = cmdHistory[histIdx];
    }
  }
  if (e.key === 'ArrowDown') {
    if (histIdx > 0) {
      histIdx--;
      termInput.value = cmdHistory[histIdx];
    } else {
      histIdx = -1;
      termInput.value = '';
    }
  }
});

/* ==========================================
   CONTACT FORM
   ========================================== */
function showToast(msg, ok = true) {
  const t = document.getElementById('toast');
  if (t) {
    t.textContent = msg;
    t.style.borderColor = ok ? 'rgba(168,85,247,.5)' : 'rgba(239,68,68,.5)';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3200);
  }
}

document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message ✉';
    btn.disabled = false;
    e.target.reset();
    showToast('✅ Message sent! I\'ll reply soon.');
  }, 1500);
});

/* ==========================================
   SMOOTH SCROLL
   ========================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ==========================================
   ENTRY ANIMATIONS
   ========================================== */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  // Hero reveal logic
  const heroItems = document.querySelectorAll('.hero-content > *');
  heroItems.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.style.transition = '0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
    }, 200 + (i * 100));
  });
});
