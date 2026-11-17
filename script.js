/* =====================================================================
   EDIT ME: contact links shown in About Me and in the terminal.
   Leave a value as '' and its button stays hidden (no broken links).
   ===================================================================== */
const CONTACT = {
  email: 'jitvanchadha@gmail.com',
  github: 'https://github.com/jitvanChadha',
  linkedin: 'https://www.linkedin.com/in/jitvan07',
  pwn: 'https://pwn.college/hacker/HackingIsCool'
};

/* Text shown by the terminal commands (about, skills, projects, ...) */
const DATA = {
  about: [
    "Jitvan Chadha — Builder & ethical hacker.",
    "Computer Science and Statistics undergraduate at Christ (Deemed to be University), Bangalore.",
    "I love building websites and applications with Java, HTML, CSS, JavaScript, and SQL.",
    "Passionate about cybersecurity, vulnerability testing, and hands-on practice on pwn.college.",
    "Motto: I learn by building, experimenting, and breaking things (responsibly!), then making them better."
  ],
  skills: [
    "Languages: HTML5, CSS3, JavaScript, Java, Python, SQL",
    "Web dev & QA: responsive design, cross-browser testing, Chrome DevTools, Git & GitHub",
    "Databases & cloud: PostgreSQL (Neon), Vercel, AWS",
    "Tools: Linux command line, Figma, Canva, MS Excel",
    "Domains: full-stack web development, cybersecurity"
  ],
  projects: [
    ["Behavioural Analytics for Authentication", "React + Node.js app capturing keystroke, mouse and reaction-time data for continuous-authentication research.", "https://researchjitvan.vercel.app/"],
    ["Think Stack", "Local-first SLM research assistant with RAG grounding and an Argon2id / AES-256-GCM vault.", "https://get-thinkstack.github.io/ThinkStack/"],
    ["Peora Drinking Water", "Responsive company website for a packaged drinking water brand, with a bulk-order form.", "https://peora.vercel.app/"]
  ],
  experience: [
    ["Web Development & Production Management Support Intern", "Peora Packaged Drinking Water, Jabalpur (Apr 2025 - May 2025). Built, tested and shipped the company website."]
  ]
};

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));

const st = $('stage');
const screenEl = $('screen');
const out = $('out');
const typed = $('typed');
const inp = $('inp');
const ov = $('ov');
const lineEl = $('line');

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;

/* =====================================================================
   Stage layout
   Wide screens: the monitor photo is scaled to cover the viewport while
   the whole monitor stays visible. Phones / portrait / small windows
   switch to "compact" mode where the OS fills the viewport instead.
   ===================================================================== */
const SW = 1672, SH = 941;
const Y_OFFSET = 45; // shifts the computer image down to give headroom
const windows = {};  // id -> RetroWindow (filled further down)
let compact = false;

function fit() {
  const W = innerWidth, H = innerHeight;
  const cover = Math.max(W / SW, H / (SH - 2 * Y_OFFSET)); // no black bands
  const s = Math.min(cover, W / 1080, H / 700);            // never crop the monitor
  compact = s < 0.78 || W < H;
  document.body.classList.toggle('compact', compact);
  if (compact) {
    st.removeAttribute('style');
    window.stageScale = 1;
  } else {
    window.stageScale = s;
    st.style.transform = `scale(${s})`;
    st.style.transformOrigin = '0 0';
    st.style.left = '50%';
    st.style.top = '50%';
    st.style.marginLeft = (-SW / 2 * s) + 'px';
    st.style.marginTop = ((-SH / 2 + Y_OFFSET) * s) + 'px';
  }
  syncWindows();
}

function syncWindows() {
  for (const w of Object.values(windows)) {
    if (compact) w.setMax(true, true);
    else if (w.autoMax) w.setMax(false);
    else if (w.isMax) w.setMax(true);
    else { w.clamp(); w.put(); }
  }
}

addEventListener('resize', fit);
fit();

/* =====================================================================
   Contact links
   ===================================================================== */
(() => {
  const url = v => (/^https?:\/\//i.test(v) ? v : 'https://' + v);
  let any = false;
  document.querySelectorAll('[data-contact]').forEach(a => {
    const k = a.dataset.contact;
    const v = (CONTACT[k] || '').trim();
    if (!v) return;
    a.href = k === 'email' ? 'mailto:' + v.replace(/^mailto:/i, '') : url(v);
    const li = a.closest('li');
    if (li) li.hidden = false;
    any = true;
  });
  const box = $('about-contact');
  if (box && any) box.hidden = false;
})();

/* =====================================================================
   Terminal
   ===================================================================== */
const PS = 'jitvan@portfolio:~$ ';
$('ps').textContent = PS;

let hist = [];
let hi = 0;
let busy = false;    // intro / animation running, input locked
let isOpen = false;  // desktop is showing
let booted = false;  // intro already played once this visit

const FILES = {
  'about.txt': DATA.about.join('\n'),
  'resume.pdf': '[PDF Document: Jitvan Chadha - Resume]\nType "resume" to view it.',
  'skills.txt': DATA.skills.join('\n'),
  'projects.txt': DATA.projects.map(p => `* ${p[0]}\n  ${p[1]}${p[2] ? '\n  ' + p[2] : ''}`).join('\n\n'),
  'experience.txt': DATA.experience.map(e => `* ${e[0]}\n  ${e[1]}`).join('\n\n'),
  'contact.txt': Object.entries(CONTACT).map(([k, v]) => k + ': ' + (v || '(not set)')).join('\n')
};

const CMDS = ['help', 'ls', 'launch', 'cd', 'pwd', 'cat', 'whoami', 'clear', 'echo', 'date', 'history', 'neofetch', 'open', 'sudo', 'exit', 'portfolio', 'about', 'resume', 'skills', 'projects', 'experience', 'contact', 'batman'];

// names accepted by "launch <x>" / "open <x>" -> which window they open
const SECTION = {
  about: 'about', contact: 'about',
  resume: 'resume', 'resume.pdf': 'resume',
  projects: 'projects', experience: 'projects',
  computer: 'computer', mycomputer: 'computer', 'my computer': 'computer', skills: 'computer'
};

function print(h) {
  const d = document.createElement('div');
  d.innerHTML = h || '&nbsp;';
  out.append(d);
  while (out.children.length > 300) out.firstChild.remove();
  return d;
}

/* ---------- Intro (boot log + bat animation), skippable ---------- */
let introRunning = false;
let skipIntro = false;
let introArmedAt = 0;

function introStart() {
  introRunning = true;
  skipIntro = false;
  introArmedAt = performance.now() + 350; // ignore the key/click that started it
  screenEl.classList.add('intro');
}

function introEnd() {
  introRunning = false;
  screenEl.classList.remove('intro');
}

function onIntroSkip(e) {
  if (!introRunning || skipIntro || performance.now() < introArmedAt) return;
  if (e.type === 'keydown' && (e.repeat || e.ctrlKey || e.metaKey || e.altKey ||
      ['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock'].includes(e.key))) return;
  skipIntro = true;
  if (window.stopBatman) window.stopBatman();
}
document.addEventListener('keydown', onIntroSkip, true);
document.addEventListener('pointerdown', onIntroSkip, true);

// like sleep(), but returns early as soon as the intro is skipped
async function pause(ms) {
  const end = performance.now() + ms;
  while (!skipIntro && performance.now() < end) {
    await sleep(Math.min(40, Math.max(0, end - performance.now())));
  }
}

const BIOS_LINES = [
  ['THE WIRED BIOS v2.04   Copyright (C) 1998 Wired Systems Inc.', 260],
  ['BIOS Date: 08/26/98   rev 4F   ID: 686-WRD-0042', 120],
  ['System Architecture: i686 Microprocessing Core', 150],
  ['', 80],
  ['CPU : Intel Pentium(R) II MMX @ 233MHz ............. [  OK  ]', 200]
];

const BOOT_LINES = [
  ['Primary Master : QUANTUM FIREBALL 4310MB ........... [  OK  ]', 160],
  ['Primary Slave  : ATAPI CD-ROM 32X .................. [  OK  ]', 130],
  ['Keyboard : AT-Standard 101-Key .................... [  OK  ]', 110],
  ['Display  : SVGA 1672x941 @ 75Hz VRAM 4MB .......... [  OK  ]', 150],
  ['', 100],
  ['Booting from C: ...', 320],
  ['LILO 21.0 boot: wired', 240],
  ['Loading linux-image-2.0.36 ..........................', 420],
  ['Uncompressing Linux... Ok, booting the kernel.', 280],
  ['', 100],
  ['[  OK  ] Mounted root filesystem (/dev/hda1, ext2)', 120],
  ['[  OK  ] Checking filesystem consistency: clean', 130],
  ['[  OK  ] Initializing system clock & timers', 120],
  ['[  OK  ] Starting system logging daemon: syslogd', 130],
  ['[  OK  ] Loading quantum protocol carrier: wired0 up', 160],
  ['[  OK  ] Resolving gateway connection to THE WIRED', 150],
  ['[  OK  ] Allocating virtual framebuffer & tty buffers', 130],
  ['[  OK  ] Starting graphical display manager: X11R6', 160],
  ['[  OK  ] User authentication: session initialized', 150],
  ['', 80],
  ['Starting session...', 350]
];

async function playBoot() {
  const ok = t => esc(t).replace(/\[\s*OK\s*\]/g, '<b>[  OK  ]</b>');

  for (const [t, w] of BIOS_LINES) {
    if (skipIntro) return;
    print(ok(t));
    await pause(w);
  }

  // Memory test animation
  const mem = print('');
  for (let k = 0; k < 65536 && !skipIntro; k += 4096 + ((Math.random() * 3000) | 0)) {
    mem.textContent = 'Memory Test : ' + k + 'K';
    await pause(35);
  }
  if (skipIntro) return;
  mem.innerHTML = 'Memory Test : 65536K OK ............................ <b>[  OK  ]</b>';
  await pause(220);

  for (const [t, w] of BOOT_LINES) {
    if (skipIntro) return;
    print(ok(t));
    await pause(w);
  }
  await pause(200);
}

/* ---------- Title card, drawn in ASCII art ----------
   P-O-R-T-F-O-L-I-O prints in one big letter at a time, scrambles into
   LOADING, then an ASCII progress bar fills before the desktop opens. */
const introAnim = $('intro-anim');
const introWord = $('intro-word');
const introBar = $('intro-bar');
const introPct = $('intro-pct');

// 5x7 dot-matrix letters; every dot becomes a 3x2 patch of characters
const GLYPHS = {
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01110'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100']
};
const GX = 3, GY = 2;                     // characters per dot
const SHADE = '@@%%%###***+++';           // one density per row: bright top, lighter base
const NOISE = '#%&@$*+=<>/[]01';
const BAR_CELLS = 28;

// Returns one letter as GH lines of GW characters. noisy = random characters
// in the letter's shape (used for the print-in flash and the scramble).
function asciiGlyph(ch, noisy, GX = 3, GY = 2) {
  const GW = 5 * GX + 2, GH = 7 * GY + 1; // block size, with room for the drop shadow
  const g = GLYPHS[ch];
  const on = (x, y) => !!g && x >= 0 && y >= 0 && x < 5 * GX && y < 7 * GY &&
    g[(y / GY) | 0][(x / GX) | 0] === '1';
  let s = '';
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      if (on(x, y)) s += noisy ? NOISE[(Math.random() * NOISE.length) | 0] : SHADE[y];
      else if (!noisy && on(x - Math.min(2, GX), y - 1)) s += '.'; // drop shadow
      else s += ' ';
    }
    if (y < GH - 1) s += '\n';
  }
  return s;
}

function setIntroBar(p) {
  if (!introBar) return;
  const n = Math.round(p / 100 * BAR_CELLS);
  introBar.innerHTML = '[<b>' + '#'.repeat(n) + '</b>' + '-'.repeat(BAR_CELLS - n) + ']';
  if (introPct) introPct.textContent = p + '%';
}

async function playTitle() {
  if (!introAnim || !introWord) return;
  const WORD = 'PORTFOLIO';
  const LOAD = ' LOADING '; // padded to the same length so it stays centred
  const POOL = Object.keys(GLYPHS);

  // reserve all nine slots up front so letters print in place without shifting
  const blocks = [...WORD].map(() => {
    const b = document.createElement('pre');
    b.className = 'ig';
    b.textContent = asciiGlyph(' ');
    return b;
  });
  introWord.replaceChildren(...blocks);
  // "BY JITVAN" in the same ASCII style, drawn at 1 character per dot
  const sub = $('intro-sub');
  if (sub) {
    sub.replaceChildren(...[...'BY JITVAN'].map(ch => {
      const b = document.createElement('pre');
      b.className = 'ig';
      b.textContent = asciiGlyph(ch, false, 1, 1);
      return b;
    }));
  }
  setIntroBar(0);
  if (introPct) introPct.textContent = '';
  introAnim.className = 'active';

  // the art is laid out at a fixed size, then scaled to fit the screen width
  const s = Math.min(1.3, introAnim.clientWidth * 0.88 / (introWord.offsetWidth || 1));
  introWord.style.setProperty('--s', s.toFixed(4));
  introWord.style.marginBlock = ((s - 1) * introWord.offsetHeight / 2).toFixed(1) + 'px';
  if (sub) {
    sub.style.setProperty('--s', (s * 0.9).toFixed(4));
    $('intro-slot').style.height = Math.ceil(sub.offsetHeight * s * 0.9) + 'px';
  }
  await pause(350);

  // 1. the letters arrive one after another
  for (let k = 0; k < WORD.length && !skipIntro; k++) {
    blocks[k].classList.add('scr');
    blocks[k].textContent = asciiGlyph(WORD[k], true);
    await pause(60);
    blocks[k].classList.remove('scr');
    blocks[k].classList.add('in');
    blocks[k].textContent = asciiGlyph(WORD[k]);
    await pause(110);
  }
  if (!skipIntro) introAnim.classList.add('named');
  await pause(950);

  // 2. the word scrambles and settles, left to right, into LOADING
  const steps = blocks.length + 5;
  for (let i = 0; i <= steps && !skipIntro; i++) {
    blocks.forEach((b, k) => {
      const locked = i >= k + 4;
      b.textContent = locked
        ? asciiGlyph(LOAD[k])
        : asciiGlyph(POOL[(Math.random() * POOL.length) | 0], true);
      b.classList.toggle('scr', !locked);
    });
    await pause(60);
  }

  // 3. progress bar
  if (!skipIntro) {
    introAnim.classList.add('loading');
    await pause(300);
    for (let p = 0; !skipIntro; p = Math.min(100, p + 3 + ((Math.random() * 9) | 0))) {
      setIntroBar(p);
      if (p >= 100) break;
      await pause(70 + Math.random() * 70);
    }
    await pause(380);
    introAnim.classList.add('out');
    await pause(300);
  }
  introAnim.className = '';
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });
}

// target: optional window to open once the desktop is up ('about', 'resume', ...).
// With no target the desktop opens empty and the visitor picks an icon.
async function launch(target = '', opts = {}) {
  if (busy) return;
  if (isOpen) {
    openWindow(target);
    return;
  }
  busy = true;
  inp.value = '';
  typed.textContent = '';
  lineEl.style.display = 'none';
  out.innerHTML = '';

  if (opts.instant || reduceMotion) {
    // deep link or reduced motion: straight to the desktop
  } else if (booted) {
    print('Resuming session...');
    await sleep(260);
  } else {
    introStart();
    try {
      await playBoot();
      out.innerHTML = '';
      if (!skipIntro) await playTitle();
    } finally {
      introEnd();
    }
  }

  out.innerHTML = '';
  booted = true;
  isOpen = true;
  busy = false;
  inp.blur();
  inp.disabled = true; // keystrokes must not reach the hidden terminal
  ov.classList.add('on');
  openWindow(target);
}

function exitDesktop() {
  if (!isOpen) return;
  if (window.stopBatman) window.stopBatman();
  Object.values(windows).forEach(w => w.close());
  document.querySelectorAll('.di').forEach(d => d.classList.remove('selected'));
  ov.classList.remove('on');
  isOpen = false;
  inp.disabled = false;
  lineEl.style.display = '';
  print('logout');
  print('Session saved. Type <b>launch Portfolio</b> or use the button below to come back.');
  setHash('');
  if (!coarse) inp.focus();
}

/* =====================================================================
   Full image lightbox
   ===================================================================== */
const imgModal = $('img-modal');
const imgModalSrc = $('img-modal-src');
const imgModalClose = $('img-modal-close');
let modalReturn = null;

function openImgModal(src, alt) {
  if (!imgModal || !imgModalSrc) return;
  modalReturn = document.activeElement;
  imgModalSrc.src = src;
  imgModalSrc.alt = alt || '';
  imgModal.classList.add('open');
  if (imgModalClose) imgModalClose.focus();
}

function closeImgModal() {
  if (!imgModal) return;
  imgModal.classList.remove('open');
  if (imgModalSrc) imgModalSrc.removeAttribute('src');
  if (modalReturn && modalReturn.isConnected && modalReturn.focus) modalReturn.focus();
  modalReturn = null;
}

if (imgModal) {
  imgModal.addEventListener('click', e => {
    if (e.target !== imgModalSrc) closeImgModal();
  });
}

/* =====================================================================
   Resizable window manager
   ===================================================================== */
const WIN_IDS = { about: 'win-about', resume: 'win-resume', projects: 'win-projects', computer: 'win-computer' };
const MINW = 280, MINH = 170;
let topZ = 20;

function ovSize() {
  return { cw: ov.offsetWidth || 992, ch: ov.offsetHeight || 565 };
}

// screen px per desktop px (the stage is CSS-scaled outside compact mode)
function effScale() {
  return ov.getBoundingClientRect().width / (ov.offsetWidth || 992) || 1;
}

function setHash(key) {
  try {
    history.replaceState(null, '', key ? '#' + key : location.pathname + location.search);
  } catch (e) { /* file:// or sandboxed: deep links are optional */ }
}

function track(el, win, moveFn) {
  if (!el) return;
  el.addEventListener('pointerdown', e => {
    if (e.button) return;
    win.front();
    if (win.isMax) return;
    e.preventDefault();
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
    document.body.classList.add('win-dragging');
    const s = { px: e.clientX, py: e.clientY, scale: effScale(), ...win.G };
    const mv = ev => {
      moveFn(s, (ev.clientX - s.px) / s.scale, (ev.clientY - s.py) / s.scale);
      win.put();
    };
    const end = () => {
      document.body.classList.remove('win-dragging');
      el.removeEventListener('pointermove', mv);
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => el.removeEventListener(t, end));
    };
    el.addEventListener('pointermove', mv);
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => el.addEventListener(t, end));
  });
}

class RetroWindow {
  constructor(el, index) {
    this.win = el;
    this.id = el.id;
    this.key = Object.keys(WIN_IDS).find(k => WIN_IDS[k] === el.id) || '';
    this.title = el.querySelector('.title');
    this.chip = document.querySelector(`.chip[data-win="${el.id}"]`);
    this.isMax = false;
    this.autoMax = false; // maximized by compact mode rather than by the user
    this.prevG = null;
    this.onShow = null;
    this.G = {
      x: +el.dataset.initX || 100 + index * 18,
      y: +el.dataset.initY || 18 + index * 16,
      w: 810,
      h: 496
    };

    // title bar drag
    track(this.title, this, (s, dx, dy) => {
      const { cw, ch } = ovSize();
      this.G.x = Math.min(Math.max(-this.G.w + 60, s.x + dx), cw - 60);
      this.G.y = Math.min(Math.max(0, s.y + dy), ch - 36);
    });

    // 8 resize handles
    el.querySelectorAll('.h').forEach(h => {
      const d = h.dataset.d;
      track(h, this, (s, dx, dy) => {
        const { cw, ch } = ovSize();
        if (d.includes('e')) this.G.w = Math.max(MINW, Math.min(cw - s.x, s.w + dx));
        if (d.includes('s')) this.G.h = Math.max(MINH, Math.min(ch - s.y, s.h + dy));
        if (d.includes('w')) {
          const nw = Math.max(MINW, Math.min(s.x + s.w, s.w - dx));
          this.G.x = s.x + s.w - nw;
          this.G.w = nw;
        }
        if (d.includes('n')) {
          const nh = Math.max(MINH, Math.min(s.y + s.h, s.h - dy));
          this.G.y = Math.max(0, s.y + s.h - nh);
          this.G.h = s.y + s.h - this.G.y;
        }
      });
    });

    const on = (sel, fn) => {
      const b = el.querySelector(sel);
      if (b) b.addEventListener('click', fn);
    };
    on('.bmin', () => this.minimize());
    on('.bmax', () => this.toggleMax());
    on('.bclose', () => this.close());
    if (this.title) this.title.addEventListener('dblclick', () => this.toggleMax());
    if (this.chip) this.chip.addEventListener('click', () => this.show());
    el.addEventListener('pointerdown', () => this.front());

    this.put();
  }

  get open() {
    return this.win.classList.contains('open');
  }

  put() {
    const s = this.win.style;
    s.left = this.G.x + 'px';
    s.top = this.G.y + 'px';
    s.width = this.G.w + 'px';
    s.height = this.G.h + 'px';
  }

  // keep the window reachable inside the desktop
  clamp() {
    const { cw, ch } = ovSize();
    this.G.w = Math.max(Math.min(MINW, cw), Math.min(this.G.w, cw));
    this.G.h = Math.max(Math.min(MINH, ch), Math.min(this.G.h, ch));
    this.G.x = Math.min(Math.max(this.G.x, 60 - this.G.w), cw - 60);
    this.G.y = Math.min(Math.max(this.G.y, 0), ch - 36);
  }

  front() {
    if (+this.win.style.zIndex === topZ) return;
    this.win.style.zIndex = ++topZ;
  }

  setMax(on, auto = false) {
    const wasMax = this.isMax;
    if (on) {
      if (!wasMax) this.prevG = { ...this.G };
      const { cw, ch } = ovSize();
      this.G = { x: 0, y: 0, w: cw, h: ch };
      this.autoMax = auto && (!wasMax || this.autoMax);
    } else {
      if (wasMax && this.prevG) this.G = { ...this.prevG };
      this.autoMax = false;
    }
    this.isMax = on;
    this.win.classList.toggle('max', on);
    if (!on) this.clamp();
    this.put();
  }

  toggleMax() {
    if (compact) return; // always maximized on small screens
    this.setMax(!this.isMax);
  }

  minimize() {
    this.win.classList.remove('open');
    if (this.chip) this.chip.style.display = 'block';
    this.syncHash(false);
  }

  close() {
    this.win.classList.remove('open');
    if (this.chip) this.chip.style.display = 'none';
    this.syncHash(false);
  }

  show() {
    if (compact) this.setMax(true, true);
    else if (!this.isMax) {
      // first open or after a viewport change: make sure it is fully on screen
      const { cw, ch } = ovSize();
      this.clamp();
      this.G.x = Math.max(0, Math.min(this.G.x, cw - this.G.w));
      this.G.y = Math.max(0, Math.min(this.G.y, ch - this.G.h));
    }
    this.win.classList.add('open');
    if (this.chip) this.chip.style.display = 'none';
    this.front();
    this.put();
    if (this.onShow) this.onShow();
    this.syncHash(true);
    this.focus();
  }

  focus() {
    const go = () => {
      try { this.win.focus({ preventScroll: true }); } catch (e) { this.win.focus(); }
    };
    go();
    // the desktop may still be fading in (not focusable yet): try once more
    if (document.activeElement !== this.win) setTimeout(() => { if (this.open) go(); }, 80);
  }

  syncHash(showing) {
    if (!this.key) return;
    if (showing) setHash(this.key);
    else if (location.hash === '#' + this.key) setHash('');
  }
}

document.querySelectorAll('.retro-win').forEach((el, i) => {
  windows[el.id] = new RetroWindow(el, i);
});
syncWindows();

function openWindow(key) {
  const w = windows[WIN_IDS[key]];
  if (w) w.show();
}

function closeTopWindow() {
  const open = Object.values(windows).filter(w => w.open);
  if (!open.length) return false;
  open.sort((a, b) => (+b.win.style.zIndex || 0) - (+a.win.style.zIndex || 0));
  open[0].close();
  if (open[1]) open[1].focus();
  return true;
}

/* ---------- Resume: load the PDF only when the window is first opened ---------- */
if (windows['win-resume']) {
  let ready = false;
  windows['win-resume'].onShow = () => {
    if (ready) return;
    ready = true;
    const frame = $('resume-frame');
    const fallback = $('resume-fallback');
    if (!frame) return;
    const pv = navigator.pdfViewerEnabled; // undefined on older browsers
    const canInline = pv === true || (pv === undefined && !coarse);
    if (canInline) {
      frame.src = frame.dataset.src;
    } else {
      frame.remove();
      if (fallback) fallback.hidden = false;
    }
  };
}

/* ---------- Desktop icons ---------- */
document.querySelectorAll('.di').forEach(icon => {
  icon.addEventListener('click', () => {
    document.querySelectorAll('.di').forEach(d => d.classList.toggle('selected', d === icon));
    const action = icon.dataset.action;
    if (action === 'exit') exitDesktop();
    else openWindow(action);
  });
  // if an icon image is missing, the text label still works on its own
  const img = icon.querySelector('img');
  if (img) img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
});

const wallpaper = $('wallpaper');
if (wallpaper) {
  wallpaper.addEventListener('click', () => {
    document.querySelectorAll('.di').forEach(d => d.classList.remove('selected'));
  });
  wallpaper.addEventListener('error', () => { wallpaper.style.display = 'none'; });
}

/* =====================================================================
   Terminal commands
   ===================================================================== */
async function run(line) {
  print(`<span class="ps">${PS}</span>${esc(line)}`);
  const [c, ...a] = line.trim().split(/\s+/);
  const arg = a.join(' ');
  if (!c) return;

  switch (c.toLowerCase()) {
    case 'help':
      print('commands:\n' +
        '  <b>launch</b> &lt;app&gt;    boot the desktop (try <b>launch Portfolio</b>)\n' +
        '  <b>open</b> &lt;name&gt;    jump to a window: about, resume, projects, computer\n' +
        '  <b>ls</b>            list files\n' +
        '  <b>cat</b> &lt;file&gt;    read a file (e.g. <b>cat about.txt</b>)\n' +
        '  <b>about</b>, <b>skills</b>, <b>projects</b>, <b>experience</b>, <b>contact</b>\n' +
        '  <b>whoami</b>, <b>pwd</b>, <b>date</b>, <b>echo</b>, <b>history</b>, <b>neofetch</b>, <b>clear</b>\n' +
        '  Tab completes, up/down arrows recall history.');
      break;
    case 'ls':
      print('<b>Portfolio/</b>  about.txt  resume.pdf  skills.txt  projects.txt  experience.txt  contact.txt');
      break;
    case 'pwd':
      print('/home/jitvan');
      break;
    case 'whoami':
      print('jitvan');
      break;
    case 'date':
      print(esc(new Date().toString()));
      break;
    case 'echo':
      print(esc(arg) || '&nbsp;');
      break;
    case 'clear':
      out.innerHTML = '';
      break;
    case 'history':
      hist.forEach((h, i) => print(String(i + 1).padStart(4) + '  ' + esc(h)));
      break;
    case 'neofetch':
      print('<b>jitvan</b>@portfolio\n-------------\nOS: WiredOS 98 (Linux 2.0.36)\nHost: Micro-ATX i686\nShell: bash 5.2\nTerminal: wired-tty1\nDisplay: SVGA CRT (1672x941)\nMemory: 64MB\nEncryption: end-to-end');
      break;
    case 'cat':
      if (!arg) {
        print('usage: cat &lt;file&gt; (e.g. <b>cat about.txt</b>)');
      } else if (FILES[arg.toLowerCase()]) {
        print(esc(FILES[arg.toLowerCase()]));
      } else {
        print('<span class="e">cat: ' + esc(arg) + ': ' + (arg.toLowerCase().replace('/', '') === 'portfolio' ? 'Is a directory' : 'No such file or directory') + '</span>');
      }
      break;
    case 'resume':
      await launch('resume');
      break;
    case 'about':
    case 'skills':
    case 'projects':
    case 'experience':
    case 'contact':
      print(esc(FILES[c.toLowerCase() + '.txt']));
      break;
    case 'cd': {
      const n = arg.replace(/^(\.\/|~\/)/, '').replace(/\/$/, '').toLowerCase();
      if (n === 'portfolio') {
        print('<span class="e">cd: Portfolio: not a directory. Use <b>launch Portfolio</b></span>');
      } else if (!['', '~', '..', '.', '/'].includes(n)) {
        print('<span class="e">bash: cd: ' + esc(arg) + ': ' + (FILES[n] ? 'Not a directory' : 'No such file or directory') + '</span>');
      }
      break;
    }
    case 'launch': {
      const t = arg.toLowerCase().trim();
      if (!t) {
        print('usage: launch &lt;program&gt; (e.g. <b>launch Portfolio</b>)');
      } else if (t === 'portfolio') {
        await launch();
      } else if (SECTION[t]) {
        await launch(SECTION[t]);
      } else {
        print('<span class="e">launch: ' + esc(arg) + ': program not found</span>');
      }
      break;
    }
    case 'portfolio':
    case './portfolio':
      await launch();
      break;
    case 'batman':
      // easter egg: the old bat intro, fetched only when someone asks for it
      if (!window.runBatmanAnimation) {
        try { await loadScript('batman.js'); } catch (e) { /* handled below */ }
      }
      if (!window.runBatmanAnimation) {
        print('<span class="e">batman: signal lost</span>');
      } else {
        busy = true;
        lineEl.style.display = 'none';
        out.innerHTML = '';
        introStart();
        try {
          await window.runBatmanAnimation();
        } finally {
          introEnd();
          lineEl.style.display = '';
          busy = false;
        }
        if (!coarse) inp.focus();
      }
      break;
    case 'open': {
      const t = arg.toLowerCase().replace(/^(\.\/|~\/)/, '').replace(/\/$/, '');
      if (!t || t === 'portfolio') await launch();
      else if (SECTION[t]) await launch(SECTION[t]);
      else if (FILES[t]) print(esc(FILES[t]));
      else if (FILES[t + '.txt']) print(esc(FILES[t + '.txt']));
      else print('<span class="e">open: ' + esc(arg) + ': no such file or target</span>');
      break;
    }
    case 'sudo':
      print('<span class="e">jitvan is not in the sudoers file. This incident will be reported.</span>');
      break;
    case 'exit':
      print('there is nowhere to go. try <b>launch Portfolio</b>');
      break;
    default:
      print('<span class="e">bash: ' + esc(c) + ': command not found</span>');
  }
}

async function submit(v) {
  if (busy || isOpen) return;
  inp.value = '';
  typed.textContent = '';
  if (v.trim()) hist.push(v);
  hi = hist.length;
  await run(v);
}

function complete() {
  const v = inp.value;
  const parts = v.split(/\s+/);
  const pool = parts.length > 1 ? ['Portfolio', ...Object.keys(FILES), 'about', 'resume', 'projects', 'computer'] : CMDS;
  const w = parts[parts.length - 1].toLowerCase();
  const m = [...new Set(pool.filter(x => x.toLowerCase().startsWith(w)))];
  if (m.length === 1) {
    parts[parts.length - 1] = m[0].replace(/\/$/, '');
    inp.value = parts.join(' ');
    typed.textContent = inp.value;
  } else if (m.length > 1) {
    print(`<span class="ps">${PS}</span>${esc(v)}`);
    print(m.map(esc).join('  '));
  }
}

inp.addEventListener('input', () => { typed.textContent = inp.value; });

inp.addEventListener('keydown', async e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    await submit(inp.value);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (hi > 0) inp.value = hist[--hi];
    typed.textContent = inp.value;
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    inp.value = hi < hist.length - 1 ? hist[++hi] : (hi = hist.length, '');
    typed.textContent = inp.value;
  } else if (e.key === 'Tab' && !e.shiftKey) {
    e.preventDefault();
    complete();
  } else if (e.ctrlKey && e.key === 'l') {
    e.preventDefault();
    out.innerHTML = '';
  } else if (e.ctrlKey && e.key === 'c' && inp.selectionStart === inp.selectionEnd) {
    print(`<span class="ps">${PS}</span>${esc(inp.value)}^C`);
    inp.value = '';
    typed.textContent = '';
  }
});

// footer buttons: the terminal is fun, but nobody should have to type to get in
document.querySelectorAll('.fbtn').forEach(b => {
  b.addEventListener('click', async () => {
    await submit(b.dataset.cmd || '');
    if (!isOpen && !busy && !coarse) inp.focus();
  });
});

document.addEventListener('keydown', e => {
  if (imgModal && imgModal.classList.contains('open')) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeImgModal();
    }
    return;
  }
  if (isOpen) {
    if (e.key === 'Escape') closeTopWindow();
    return;
  }
  if (busy) return;
  const ae = document.activeElement;
  const onControl = ae && ae !== inp && /^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(ae.tagName);
  if (ae !== inp && !onControl && !e.metaKey && !e.ctrlKey && !e.altKey && e.key.length === 1) inp.focus();
});

document.addEventListener('click', e => {
  if (isOpen || busy) return;
  if (e.target.closest && e.target.closest('button, a')) return;
  inp.focus();
});

print("Welcome to Jitvan Chadha's portfolio.");
print('Type <b>help</b> for commands, or hit <b>&#9654; LAUNCH PORTFOLIO</b> below.');
print('');

/* ---------- Clock ---------- */
const clk = $('clk');

function tick() {
  const d = new Date();
  const z = n => String(n).padStart(2, '0');
  clk.textContent = `${z(d.getDate())}/${z(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)} ${z(d.getHours())}:${z(d.getMinutes())}`;
}
tick();
setInterval(tick, 10000);

/* ---------- About Me polaroid: show initials until about-photo.jpg exists ---------- */
const aboutPhoto = $('about-photo');
if (aboutPhoto) {
  const img = aboutPhoto.querySelector('img');
  if (img) {
    const markEmpty = () => aboutPhoto.classList.add('empty');
    const markLoaded = () => aboutPhoto.classList.remove('empty');
    img.addEventListener('load', markLoaded);
    img.addEventListener('error', markEmpty);
    if (img.complete) {
      if (img.naturalWidth > 0) markLoaded();
      else markEmpty();
    }
  }
}

/* ---------- Deep links: index.html#projects opens straight to that window ---------- */
(() => {
  const key = decodeURIComponent(location.hash.slice(1)).toLowerCase();
  if (WIN_IDS[key]) launch(key, { instant: true });
  else if (!coarse) inp.focus();
})();
