/* ═══════════════════════════════════════════════════════════════════════
   SOUL THRESHOLD — Main JavaScript
   ═══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initNavScrollEffect();
  initStarfield();
  initScrollReveal();
  initFloatingParticles();
  initParallaxNebula();
  initActiveNavHighlight();

  // Page-specific initialization
  if (document.getElementById('application-form')) {
    initApplicationForm();
  }

  // Sanctuary Notes: show either archive or single note
  const noteSlug = new URLSearchParams(window.location.search).get('post');
  if (noteSlug && document.getElementById('note-content')) {
    const archive = document.getElementById('notes-archive');
    const header = document.getElementById('notes-header');
    if (archive) archive.style.display = 'none';
    if (header) header.style.display = 'none';
    initSingleNote();
  } else if (document.getElementById('notes-archive')) {
    const noteEl = document.getElementById('note-content');
    if (noteEl) noteEl.style.display = 'none';
    initNotesArchive();
  }
  // Range slider display
  const rangeInput = document.getElementById('action-scale');
  const rangeDisplay = document.getElementById('scale-display');
  if (rangeInput && rangeDisplay) {
    rangeInput.addEventListener('input', () => {
      rangeDisplay.textContent = rangeInput.value;
    });
  }
});

/* ── NAVIGATION ───────────────────────────────────────────────────────── */
function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── NAV SCROLL EFFECT ────────────────────────────────────────────────── */
function initNavScrollEffect() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── STARFIELD ────────────────────────────────────────────────────────── */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    const count = Math.floor((W * H) / 3200);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        alpha: Math.random() * 0.7 + 0.15,
        speed: Math.random() * 0.003 + 0.001,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;
    stars.forEach(s => {
      const twinkle = s.alpha + Math.sin(frame * s.speed + s.phase) * 0.25;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,230,184,${Math.max(0, Math.min(1, twinkle))})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createStars(); });
  resize();
  createStars();
  draw();
}

/* ── SCROLL REVEAL ────────────────────────────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

/* ── FLOATING GOLD PARTICLES ──────────────────────────────────────────── */
function initFloatingParticles() {
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 2.5 + 0.5;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}vw;
      bottom: ${Math.random() * -20}vh;
      animation-duration: ${Math.random() * 18 + 14}s;
      animation-delay: ${Math.random() * 12}s;
    `;
    document.body.appendChild(p);
  }
}

/* ── ACTIVE NAV HIGHLIGHT ─────────────────────────────────────────────── */
function initActiveNavHighlight() {
  // Only run on pages with in-page sections (single page scroll or home)
  const links = document.querySelectorAll('.nav-links a');
  if (!links.length) return;

  // Highlight current page link for multi-page nav
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && (href === '/' || href === 'index.html'))) {
      a.classList.add('active');
    }
  });
}

/* ── PARALLAX NEBULA ──────────────────────────────────────────────────── */
function initParallaxNebula() {
  const nebula = document.querySelector('.nebula-bg');
  if (!nebula) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.04;
    nebula.style.transform = `translateY(${y}px)`;
  }, { passive: true });
}

/* ── APPLICATION FORM ─────────────────────────────────────────────────── */
function initApplicationForm() {
  const form = document.getElementById('application-form');
  const confirmation = document.getElementById('form-confirmation');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check honeypot
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.style.display = 'none';
        if (confirmation) {
          confirmation.classList.add('show');
          window.scrollTo({ top: confirmation.offsetTop - 120, behavior: 'smooth' });
        }
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application →';
      alert('There was an error submitting your application. Please try again or email debi.mentoring@gmail.com directly.');
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   SANCTUARY NOTES SYSTEM
   ═══════════════════════════════════════════════════════════════════════ */

/* ---------- Frontmatter Parser ---------- */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta = {};
  match[1].split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  });

  return { meta, body: match[2] };
}

/* ---------- Markdown to HTML ---------- */
function markdownToHtml(md) {
  let html = md;

  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  html = html.replace(/^\- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  html = html.split('\n\n').map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<h') || block.startsWith('<ul') ||
        block.startsWith('<blockquote') || block.startsWith('<img')) {
      return block;
    }
    return `<p>${block}</p>`;
  }).join('\n');

  html = html.replace(/(?<!\n)\n(?!\n)/g, '<br>');

  return html;
}

/* ---------- Section Config ---------- */
const DEFAULT_SECTIONS = [
  { key: 'the-stirring', label: 'The Stirring' },
  { key: 'the-descent', label: 'The Descent' },
  { key: 'the-return', label: 'The Return' }
];

function buildSectionList(notes) {
  const sections = [...DEFAULT_SECTIONS];
  const knownKeys = new Set(sections.map(s => s.key));
  notes.forEach(note => {
    const sec = note.section;
    if (sec && !knownKeys.has(sec)) {
      knownKeys.add(sec);
      const label = sec.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      sections.push({ key: sec, label });
    }
  });
  return sections;
}

/* ---------- Fetch Notes ---------- */
async function fetchNotes() {
  let notes = [];

  try {
    const res = await fetch('/content/blog/index.json');
    if (res.ok) {
      const data = await res.json();
      notes = data.posts || [];
    }
  } catch {}

  if (!notes.length) {
    const knownFiles = ['crossing-the-threshold.md'];
    for (const file of knownFiles) {
      try {
        const res = await fetch(`/content/blog/${file}`);
        if (res.ok) {
          const content = await res.text();
          const { meta } = parseFrontmatter(content);
          notes.push({ ...meta, slug: file.replace('.md', ''), file });
        }
      } catch {}
    }
  }

  return notes;
}

/* ---------- Notes Archive Listing ---------- */
async function initNotesArchive() {
  const archive = document.getElementById('notes-archive');
  if (!archive) return;

  archive.innerHTML = '<div class="loading-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';

  try {
    const notes = await fetchNotes();

    if (!notes.length) {
      archive.innerHTML = '<div class="notes-empty reveal">The first note is coming soon.</div>';
      initScrollReveal();
      return;
    }

    const grouped = {};
    notes.forEach(note => {
      const sec = note.section || 'uncategorized';
      if (!grouped[sec]) grouped[sec] = [];
      grouped[sec].push(note);
    });

    // Sort within each section by note_number ascending
    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => (a.note_number || '').localeCompare(b.note_number || ''));
    });

    let html = '';
    buildSectionList(notes).forEach(({ key, label }) => {
      const sectionNotes = grouped[key];
      if (!sectionNotes || !sectionNotes.length) return;

      html += `<div class="archive-section reveal">`;
      html += `<h3 class="archive-section-heading">${label}</h3>`;
      html += `<div class="archive-entries">`;

      sectionNotes.forEach(note => {
        const slug = note.slug || note.file?.replace('.md', '') || '';
        const num = note.note_number || '???';
        html += `<a href="/blog.html?post=${slug}" class="archive-entry">${num} — ${note.title || 'Untitled'}</a>`;
      });

      html += `</div></div>`;
    });

    archive.innerHTML = html;
    initScrollReveal();
  } catch {
    archive.innerHTML = '<div class="notes-empty reveal">The first note is coming soon.</div>';
    initScrollReveal();
  }
}

/* ---------- Single Note View ---------- */
async function initSingleNote() {
  const container = document.getElementById('note-content');
  if (!container) return;

  const slug = new URLSearchParams(window.location.search).get('post');
  if (!slug) return;

  container.innerHTML = '<div class="loading-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';

  try {
    const response = await fetch(`/content/blog/${slug}.md`);
    if (!response.ok) throw new Error('Note not found');

    const content = await response.text();
    const { meta, body } = parseFrontmatter(content);

    const num = meta.note_number || '';
    const title = meta.title || 'Untitled';
    const date = meta.date ? new Date(meta.date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long'
    }) : '';
    const closingLine = meta.closing_line || '';

    document.title = `${title} — Soul Threshold`;

    container.innerHTML = `
      <div class="note-header reveal">
        ${num ? `<div class="note-number">Sanctuary Note ${num}</div>` : ''}
        <h1>${title}</h1>
        ${date ? `<div class="note-date">${date}</div>` : ''}
      </div>
      <div class="note-body reveal">${markdownToHtml(body)}</div>
      ${closingLine ? `<div class="note-closing reveal"><p>${closingLine}</p></div>` : ''}
      <a href="/blog.html" class="back-to-notes reveal">← Back to Sanctuary Notes</a>
    `;

    initScrollReveal();
  } catch {
    container.innerHTML = `
      <div class="note-header"><h1>Note not found</h1></div>
      <p style="text-align:center; color:var(--text-body);">This note may have been moved or removed.</p>
      <a href="/blog.html" class="back-to-notes">← Back to Sanctuary Notes</a>
    `;
  }
}
