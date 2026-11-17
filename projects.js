/* =====================================================================
   Projects Pane Controller (Dark Scrapbook / Pinboard)
   ===================================================================== */
function initProjects() {
  const root = document.querySelector(".pj-root");
  if (!root) return;

  const icons = {
    html:     { label: "HTML",       svg: `<svg viewBox="0 0 48 48" role="img" aria-label="HTML5"><path d="M6 4h36l-3.3 37L24 45 9.3 41z" fill="#e44d26"/><path d="M24 7.5v35.2l12.2-3.4L39 7.5z" fill="#f16529"/><path d="M32 16H16.5l.6 6.2H31l-.8 9.3-6.2 1.8-6.2-1.8-.4-4.6h4.4l.2 2.3 2 .6 2-.6.3-3.3h-9.2L15.5 13h17z" fill="#fff"/></svg>` },
    css:      { label: "CSS",        svg: `<svg viewBox="0 0 48 48" role="img" aria-label="CSS3"><path d="M6 4h36l-3.3 37L24 45 9.3 41z" fill="#1572b6"/><path d="M24 7.5v35.2l12.2-3.4L39 7.5z" fill="#33a9dc"/><path d="M32.6 13H15.5l.5 5.6h10.6l-10.3 4.4.5 5.3h9.3l-.3 3-3.7 1-3.7-1-.2-2.8h-4.5l.5 5.7L24 36.4l8.3-2.3 1.2-13.2H21.6l-.2-2.4h11.9z" fill="#fff"/></svg>` },
    js:       { label: "JavaScript", svg: `<svg viewBox="0 0 48 48" role="img" aria-label="JavaScript"><rect x="4" y="4" width="40" height="40" rx="4" fill="#f7df1e"/><path d="M18 20v11c0 3-4 3.4-6 1.2M26.5 32.6c1 1.6 2.6 2.4 4.4 2.4 2.2 0 3.6-1 3.6-2.7 0-4.1-8-2.4-8-7.3 0-2.2 1.8-3.8 4.3-3.8 1.9 0 3.3.7 4.2 2" fill="none" stroke="#323330" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
    react:    { label: "React",      svg: `<svg viewBox="-11.5 -10.23 23 20.46" role="img" aria-label="React"><circle r="2.05" fill="#61dafb"/><g stroke="#61dafb" stroke-width="1.2" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>` },
    git:      { label: "Git",        svg: `<svg viewBox="0 0 48 48" role="img" aria-label="Git"><path d="M44.5 21.6L26.4 3.5a3.3 3.3 0 0 0-4.7 0l-4.6 4.6 6 6a3.9 3.9 0 0 1 4.9 4.9l5.8 5.8a3.9 3.9 0 1 1-2.4 2.2l-5.4-5.4v13.6a3.9 3.9 0 1 1-3.3 0V21.4a3.9 3.9 0 0 1-2.1-5.1l-5.9-5.9L3.5 21.6a3.3 3.3 0 0 0 0 4.7l18.1 18.1a3.3 3.3 0 0 0 4.7 0l18.2-18.1a3.3 3.3 0 0 0 0-4.7z" fill="#f05032"/></svg>` },
    devtools: { label: "DevTools",   svg: `<svg viewBox="0 0 48 48" role="img" aria-label="Chrome DevTools"><circle cx="24" cy="24" r="18" fill="#4285f4"/><path d="M24 6a18 18 0 0 1 15.6 9H24z" fill="#ea4335"/><path d="M39.6 15A18 18 0 0 1 31.8 39.6L24 24z" fill="#fbbc05"/><path d="M31.8 39.6A18 18 0 0 1 8.4 33L24 24z" fill="#34a853"/><circle cx="24" cy="24" r="8" fill="#fff"/><circle cx="24" cy="24" r="5" fill="#1a73e8"/></svg>` },
    node:     { label: "Node.js",    svg: `<svg viewBox="0 0 48 48" role="img" aria-label="Node.js"><path d="M24 4l18 10.4v20.8L24 45.6 6 35.2V14.4z" fill="#539e43"/><circle cx="24" cy="24" r="7" fill="none" stroke="#fff" stroke-width="3.5"/></svg>` },
    postgres: { label: "PostgreSQL", svg: `<svg viewBox="0 0 48 48" role="img" aria-label="PostgreSQL"><path d="M8 11v26c0 3.3 7.2 6 16 6s16-2.7 16-6V11z" fill="#336791"/><ellipse cx="24" cy="11" rx="16" ry="6" fill="#6fa8d6"/><path d="M8 19c0 3.3 7.2 6 16 6s16-2.7 16-6M8 28c0 3.3 7.2 6 16 6s16-2.7 16-6" fill="none" stroke="#a9cdea" stroke-width="2"/></svg>` },
    vercel:   { label: "Vercel",     svg: `<svg viewBox="0 0 48 48" role="img" aria-label="Vercel"><path d="M24 6l19 34H5z" fill="#17181a"/></svg>` },
    security: { label: "Security",   svg: `<svg viewBox="0 0 48 48" role="img" aria-label="Security"><path d="M24 4L8 10v12c0 11.5 6.8 22.3 16 25 9.2-2.7 16-13.5 16-25V10L24 4z" fill="#d63a2f"/><path d="M24 14l-8 4v8c0 5.8 3.4 11.2 8 12.5z" fill="#fff" opacity=".85"/></svg>` },
    python:   { label: "Python",     svg: `<svg viewBox="0 0 48 48" role="img" aria-label="Python"><path d="M23.6 4c-5.8 0-10.4 2.4-10.4 7.2v3.6h10.8v1.8H9.6C4.8 16.6 4 20.4 4 25.2s2.8 8.4 8.4 8.4h3.6V29c0-3.6 3.2-6.6 6.8-6.6h10.8c2.8 0 4.8-2 4.8-4.8V11.2C38.4 6.4 33.8 4 23.6 4z" fill="#3776ab"/><path d="M24.4 44c5.8 0 10.4-2.4 10.4-7.2v-3.6H24v-1.8h14.4c4.8 0 5.6-3.8 5.6-8.6s-2.8-8.4-8.4-8.4H32V19c0 3.6-3.2 6.6-6.8 6.6H14.4c-2.8 0-4.8 2-4.8 4.8v6.4c0 4.8 4.6 7.2 14.8 7.2z" fill="#ffd438"/></svg>` },
    aes:      { label: "AES-256",    svg: `<svg viewBox="0 0 48 48" role="img" aria-label="AES-256 encryption"><rect x="10" y="18" width="28" height="24" rx="4" fill="#323330"/><path d="M16 18V12a8 8 0 0 1 16 0v6" fill="none" stroke="#f2b632" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="29" r="3" fill="#fbf7ea"/><path d="M24 32v4" stroke="#fbf7ea" stroke-width="2.5"/></svg>` },
    slm:      { label: "SLM / AI",   svg: `<svg viewBox="0 0 48 48" role="img" aria-label="Small language model"><rect x="10" y="10" width="28" height="28" rx="6" fill="#7fa6d4"/><circle cx="24" cy="24" r="5" fill="#fbf7ea"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6" stroke="#f2b632" stroke-width="3" stroke-linecap="round"/></svg>` },
    pydantic: { label: "Pydantic",   svg: `<svg viewBox="0 0 48 48" role="img" aria-label="Pydantic"><path d="M24 6l18 32H6z" fill="#e91e63" stroke="#e91e63" stroke-width="3" stroke-linejoin="round"/><path d="M24 17v11M24 32v2" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>` }
  };

  const projects = [
    {
      cat: "webdev", tone: "paper", tape: "blue", demoColor: "",
      url: "https://peora.vercel.app/",
      title: "Peora Drinking Water, Jabalpur", hl: "",
      role: "Web Development & Production Management Support Intern",
      caption: "Peora Packaged Drinking Water, live site", ph: "Peora website preview",
      images: [
        { src: "img/peora1.webp", alt: "Peora website homepage" },
        { src: "img/peora2.webp", alt: "Peora product range and 3 SKUs" },
        { src: "img/peora3.webp", alt: "Peora bulk order and contact section" }
      ],
      bullets: [
        "Built a responsive company website using HTML, CSS, JavaScript, and React in VS Code to showcase Peora’s product range across 3 SKUs (20L jars, PET bottles, event pouches), including a customer form for bulk orders.",
        "Tested the website across multiple browsers and screen sizes, and debugged layout and functionality issues using Chrome DevTools.",
        "Used Git and GitHub for version control, tracking and documenting changes throughout development.",
        "Tracked daily production output and quality control checkpoints across reverse osmosis, micron filtration, and UV sterilization stages, supporting inventory coordination."
      ],
      stack: ["html", "css", "js", "react", "git", "devtools"]
    },
    {
      cat: "webdev", tone: "paper", tape: "yellow", demoColor: "lime",
      url: "https://researchjitvan.vercel.app/",
      title: "Behavioural Analytics for Authentication", hl: "lime",
      role: "Continuous Authentication & Compromised-Account Detection",
      caption: "Keystroke dynamics and continuous authentication", ph: "Behavioural biometrics preview",
      images: [
        { src: "img/behavioural-analytics.webp", alt: "Behavioural biometrics preview" }
      ],
      bullets: [
        "Built and deployed a full-stack web application in React and Node.js, implementing end-to-end data capture, storage, and analysis workflows for continuous authentication and compromised-account detection research.",
        "Engineered data capture pipelines for keystroke dynamics, mouse movement/click patterns, and cognitive reaction time, translating raw browser events into structured behavioural datasets.",
        "Designed and implemented a persistent PostgreSQL (Neon) data layer, enabling structured storage and retrieval of research-grade datasets for downstream analysis."
      ],
      stack: ["react", "node", "postgres", "vercel", "security"]
    },
    {
      cat: "saas", tone: "kraft", tape: "red", demoColor: "yellow",
      url: "https://get-thinkstack.github.io/ThinkStack/",
      title: "Think Stack: SLM Research Assistant", hl: "",
      role: "Local-First Research Assistant with Cryptographic Vault & RAG",
      caption: "Cryptographic vault and local SLM assistant", ph: "Think Stack vault preview",
      images: [],
      bullets: [
        "Built a responsive React 19 frontend with Framer Motion transitions and a RAG grounding selector, enabling users to contextualize LLM responses against local document libraries.",
        "Designed the document ingestion and chunking pipeline using PyMuPDF for text extraction and Pydantic for schema validation, integrating a Small Language Model (SLM) to drive context-aware chunking and populate a local vectorized storage layer.",
        "Engineered a local-first cryptographic vault backend using Argon2id key derivation and AES-256-GCM authenticated encryption, including a custom TSENC1 envelope format for tamper detection."
      ],
      stack: ["react", "python", "aes", "slm", "pydantic"]
    }
  ];

  const list = root.querySelector(".pj-list");
  if (!list) return;
  const counter = root.querySelector("[data-pj-count]");
  const placeholder = (text) => `<div class="pj-ph"><b>${text}</b><span>Screenshots coming soon</span></div>`;

  const media = (p) => !p.images.length ? placeholder(p.ph) : `
    <div class="pj-gallery" data-i="0" data-ph="${p.ph}">
      <div class="pj-viewport">
        <div class="pj-track">${p.images.map(i => `<img src="${i.src}" alt="${i.alt}" loading="lazy" decoding="async" draggable="false">`).join("")}</div>
        <button class="pj-nav pj-prev" type="button" data-dir="-1" aria-label="Previous screenshot"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg></button>
        <button class="pj-nav pj-next" type="button" data-dir="1" aria-label="Next screenshot"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg></button>
        <span class="pj-count">1 / ${p.images.length}</span>
      </div>
      <div class="pj-thumbs">${p.images.map((i, k) => `<button type="button" data-go="${k}" class="${k ? "" : "pj-on"}" aria-label="Show screenshot ${k + 1}"><img src="${i.src}" alt="" loading="lazy" decoding="async"></button>`).join("")}</div>
    </div>`;

  const card = (p) => `
    <article class="pj-card ${p.tone === "kraft" ? "pj-kraft" : ""} pj-tape-${p.tape}">
      <div class="pj-media-wrap">${media(p)}</div>
      <div class="pj-info">
        <div class="pj-badges">
          <a class="pj-demo ${p.demoColor ? "pj-" + p.demoColor : ""}" href="${p.url}" target="_blank" rel="noopener noreferrer">Live demo &#8599;</a>
        </div>
        <h3 class="pj-ptitle"><span class="pj-hl ${p.hl ? "pj-" + p.hl : ""}">${p.title}</span></h3>
        <p class="pj-role">${p.role}</p>
        <ul class="pj-bullets">${p.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
        <div class="pj-stack">
          <span class="pj-stack-label">Tech stack</span>
          <ul class="pj-tiles">${p.stack.filter(k => icons[k]).map(k => `<li class="pj-tile">${icons[k].svg}<span>${icons[k].label}</span></li>`).join("")}</ul>
        </div>
      </div>
    </article>`;

  const show = (cat) => {
    const items = projects.filter(p => p.cat === cat);
    list.innerHTML = items.length ? items.map(card).join("") : `<p class="pj-empty">Nothing pinned here yet. Check back soon!</p>`;
    if (counter) counter.textContent = `${items.length} project${items.length === 1 ? "" : "s"}`;
  };

  // Tabs
  const tabs = root.querySelectorAll(".pj-tab");
  tabs.forEach(t => t.addEventListener("click", () => {
    tabs.forEach(x => x.setAttribute("aria-pressed", String(x === t)));
    show(t.dataset.cat);
  }));

  // Gallery controls (arrows, thumbnails, and modal lightbox)
  list.addEventListener("click", (e) => {
    const img = e.target.closest(".pj-track img");
    if (img && typeof openImgModal === "function") {
      openImgModal(img.src, img.alt);
      return;
    }
    const b = e.target.closest("[data-dir], [data-go]");
    if (!b) return;
    const g = b.closest(".pj-gallery");
    if (!g) return;
    const n = g.querySelectorAll(".pj-track img").length;
    if (!n) return;
    const i = b.dataset.go !== undefined ? +b.dataset.go : (+g.dataset.i + +b.dataset.dir + n) % n;
    g.dataset.i = i;
    g.querySelector(".pj-track").style.transform = `translateX(${-100 * i}%)`;
    const cnt = g.querySelector(".pj-count");
    if (cnt) cnt.textContent = `${i + 1} / ${n}`;
    g.querySelectorAll(".pj-thumbs button").forEach((t, k) => t.classList.toggle("pj-on", k === i));
  });

  // If a screenshot file is missing, swap the gallery for a placeholder
  list.addEventListener("error", (e) => {
    const g = e.target.closest && e.target.closest(".pj-gallery");
    if (g && g.isConnected) g.outerHTML = placeholder(g.dataset.ph);
  }, true);

  show("webdev");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProjects);
} else {
  initProjects();
}
