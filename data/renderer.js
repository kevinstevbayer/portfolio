/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  KSB Portfolio — Data Renderer v2.0                             ║
 * ║  Reads data/portfolio.json and hydrates all five sections.      ║
 * ║  Drop this <script> at the bottom of your HTML, replacing the   ║
 * ║  existing DATA object and all section-build calls.              ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * HOW IT WORKS
 * ────────────
 * 1. On DOMContentLoaded, fetches /data/portfolio.json
 * 2. Calls five independent render functions, one per section
 * 3. Each renderer reads only its own slice of the JSON
 * 4. All existing CSS classes are preserved — nothing visual changes
 *
 * TO UPDATE CONTENT
 * ────────────────
 * Only ever touch  data/portfolio.json  — never touch this file.
 */

(async function KSBRenderer() {
  'use strict';

  /* ── 0. FETCH ────────────────────────────────────────────────── */
  let DATA;
  try {
    const res = await fetch('./data/portfolio.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    DATA = await res.json();
  } catch (err) {
    console.error('[KSBRenderer] Failed to load portfolio.json:', err);
    return; // Fail silently — static fallbacks remain visible
  }

  /* ── UTILITY HELPERS ─────────────────────────────────────────── */

  /** Safely get a DOM element, warn if missing */
  function el(id) {
    const node = document.getElementById(id);
    if (!node) console.warn(`[KSBRenderer] Missing element #${id}`);
    return node;
  }

  /** Escape HTML entities to prevent XSS from JSON strings */
  function esc(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** GitHub SVG icon */
  const ICON_GH = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>`;

  /** LinkedIn SVG icon */
  const ICON_LI = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>`;

  /** YouTube play icon */
  const ICON_YT = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
  </svg>`;

  /** External link icon */
  const ICON_LINK = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>`;

  /**
   * PROJECT SVG PLACEHOLDER
   * Used only when no image is available.
   */
  function projectPlaceholderSVG(color = '#7c3aed') {
    const h = color.replace('#', '');
    return `<svg viewBox="0 0 400 170" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">
      <defs>
        <pattern id="gp${h}" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M22 0H0V22" fill="none" stroke="${color}" stroke-opacity=".11" stroke-width=".5"/>
        </pattern>
        <radialGradient id="rg${h}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${color}" stop-opacity=".22"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="170" fill="#07101f"/>
      <rect width="400" height="170" fill="url(#gp${h})"/>
      <circle cx="200" cy="85" r="66" fill="url(#rg${h})"/>
      <circle cx="200" cy="85" r="46" fill="none" stroke="${color}" stroke-opacity=".18" stroke-width="1"/>
      <circle cx="200" cy="85" r="8"  fill="${color}" fill-opacity=".55"/>
      <line x1="200" y1="39" x2="200" y2="22" stroke="${color}" stroke-opacity=".45" stroke-width="1.2"/>
      <line x1="246" y1="85" x2="263" y2="85" stroke="${color}" stroke-opacity=".45" stroke-width="1.2"/>
    </svg>`;
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 1 — ABOUT ME
     Handles conditional image vs. video in the left column.
  ══════════════════════════════════════════════════════════════ */
  function renderAbout(about) {
    /* ── Hero name & badge ── */
    const nameEl = document.querySelector('.hero-name');
    if (nameEl) {
      const [first, ...rest] = about.name.split(' ');
      nameEl.innerHTML = `${esc(first)} <span class="grad">${esc(rest.join(' '))}</span>`;
    }

    /* ── About section: left visual container ── */
    const avatarEl = document.querySelector('.about-avatar');
    if (avatarEl && about.media) {
      const m = about.media;

      if (m.type === 'video' && m.video_path) {
        /* ── VIDEO MODE ── */
        avatarEl.innerHTML = `
          <video
            src="${esc(m.video_path)}"
            poster="${m.video_poster_path ? esc(m.video_poster_path) : ''}"
            ${m.video_autoplay ? 'autoplay' : ''}
            ${m.video_loop ? 'loop' : ''}
            ${m.video_muted ? 'muted' : ''}
            playsinline
            style="width:100%;height:100%;object-fit:cover;border-radius:inherit"
          ></video>
          ${m.caption ? `<div style="position:absolute;bottom:0;left:0;right:0;padding:.6rem .9rem;background:linear-gradient(to top,rgba(3,7,17,.9),transparent);font-family:'JetBrains Mono',monospace;font-size:.65rem;color:var(--muted2);letter-spacing:.08em">${esc(m.caption)}</div>` : ''}
        `;
      } else if (m.type === 'image' && m.image_path) {
        /* ── IMAGE MODE ── */
        avatarEl.innerHTML = `
          <img
            src="${esc(m.image_path)}"
            alt="${esc(m.image_alt || about.name)}"
            style="width:100%;height:100%;object-fit:cover;border-radius:inherit"
            loading="lazy"
          />
          ${m.caption ? `<div style="position:absolute;bottom:0;left:0;right:0;padding:.6rem .9rem;background:linear-gradient(to top,rgba(3,7,17,.9),transparent);font-family:'JetBrains Mono',monospace;font-size:.65rem;color:var(--muted2);letter-spacing:.08em">${esc(m.caption)}</div>` : ''}
        `;
      }
      /* If type is neither, the existing SVG placeholder stays untouched */
    }

    /* ── About section: right text column ── */
    const aboutTextEl = document.querySelector('.about-text');
    if (aboutTextEl && about.bio_paragraphs) {
      /* Preserve existing structure — only replace paragraphs */
      const existingPs = aboutTextEl.querySelectorAll('p');
      about.bio_paragraphs.forEach((para, i) => {
        if (existingPs[i]) {
          existingPs[i].textContent = para;
        } else {
          const p = document.createElement('p');
          p.textContent = para;
          p.style.marginTop = '.9rem';
          aboutTextEl.insertBefore(p, aboutTextEl.querySelector('.tech-cloud'));
        }
      });
    }

    /* ── Tech cloud ── */
    const techCloud = document.querySelector('.tech-cloud');
    if (techCloud && about.tech_tags) {
      techCloud.innerHTML = about.tech_tags
        .map(t => `<span class="tech-chip">${esc(t)}</span>`)
        .join('');
    }

    /* ── Meta pills (email, location, status) ── */
    const metaPills = document.querySelectorAll('.meta-pill .val');
    if (metaPills.length >= 3) {
      metaPills[0].textContent = about.email;
      metaPills[0].style.color = 'var(--p2)';
      metaPills[0].style.fontSize = '.82rem';
      metaPills[1].textContent = about.location;
      metaPills[2].innerHTML = `<span style="color:${about.status_active ? 'var(--green)' : 'var(--muted2)'}">● ${esc(about.status)}</span>`;
    }

    /* ── Contact info in footer ── */
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(a => { a.href = `mailto:${about.email}`; a.textContent = about.email; });

    /* ── Social links ── */
    const socialIcons = { github: ICON_GH, linkedin: ICON_LI };
    const heroSoc = el('hero-social');
    if (heroSoc && about.socials) {
      heroSoc.innerHTML = '';
      about.socials.forEach(s => {
        const a = document.createElement('a');
        a.href = s.url; a.target = '_blank'; a.rel = 'noopener';
        a.innerHTML = socialIcons[s.icon] || s.label;
        heroSoc.appendChild(a);
      });
    }

    /* ── Footer socials ── */
    const ftrSoc = el('footer-socials');
    if (ftrSoc && about.socials) {
      ftrSoc.innerHTML = '';
      about.socials.forEach(s => {
        const a = document.createElement('a');
        a.href = s.url; a.target = '_blank'; a.rel = 'noopener';
        a.className = 'footer-soc-btn'; a.title = s.label;
        a.innerHTML = socialIcons[s.icon] || `<span>${esc(s.label[0])}</span>`;
        ftrSoc.appendChild(a);
      });
      /* Email button */
      const emailBtn = document.createElement('a');
      emailBtn.href = `mailto:${about.email}`; emailBtn.rel = 'noopener';
      emailBtn.className = 'footer-soc-btn'; emailBtn.title = 'Email';
      emailBtn.innerHTML = `<span style="font-size:.8rem">✉</span>`;
      ftrSoc.appendChild(emailBtn);
    }
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 3 — PROJECTS
     Builds filter buttons + card grid + modal opener.
  ══════════════════════════════════════════════════════════════ */
  function renderProjects(projects) {
    /* Sort by order field */
    const sorted = [...projects].sort((a, b) => (a.order || 99) - (b.order || 99));

    /* ── Filter buttons ── */
    const filterEl = el('proj-filters');
    if (!filterEl) return;
    const categories = ['All', ...new Set(sorted.map(p => p.category))];
    filterEl.innerHTML = '';
    categories.forEach((cat, i) => {
      const btn = document.createElement('button');
      btn.className = 'pf-btn' + (i === 0 ? ' act' : '');
      btn.textContent = cat;
      btn.onclick = () => {
        document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('act'));
        btn.classList.add('act');
        document.querySelectorAll('.proj-card').forEach(c =>
          c.classList.toggle('hid', cat !== 'All' && c.dataset.cat !== cat)
        );
      };
      filterEl.appendChild(btn);
    });

    /* ── Card grid ── */
    const gridEl = el('proj-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '';

    sorted.forEach((proj, idx) => {
      const card = document.createElement('div');
      card.className = 'proj-card';
      card.dataset.cat = proj.category;
      card.dataset.projId = proj.id;

      /* Visual: prefer image, fall back to SVG */
      const hasImage = proj.media?.image_path;
      const visHTML = hasImage
        ? `<img src="${esc(proj.media.image_path)}" alt="${esc(proj.media.image_alt || proj.title)}" loading="lazy" style="width:100%;height:100%;object-fit:cover">`
        : projectPlaceholderSVG(proj.color_hex || '#7c3aed');

      /* Status badge */
      const statusColors = {
        active:   { text: 'var(--green)',  bg: 'rgba(16,185,129,.1)',  border: 'rgba(16,185,129,.3)' },
        complete: { text: 'var(--c2)',     bg: 'rgba(6,182,212,.08)',  border: 'rgba(6,182,212,.25)' },
        upcoming: { text: 'var(--hot)',    bg: 'rgba(245,158,11,.08)', border: 'rgba(245,158,11,.25)' },
      };
      const sc = statusColors[proj.status] || statusColors.complete;
      const statusBadge = `<span style="font-family:'JetBrains Mono',monospace;font-size:.62rem;color:${sc.text};background:${sc.bg};border:1px solid ${sc.border};border-radius:20px;padding:.18rem .6rem;letter-spacing:.08em">${esc(proj.status_label || proj.status)}</span>`;

      /* Link buttons */
      const links = proj.links || {};
      let linkHTML = '';
      if (links.github && links.github !== '')
        linkHTML += `<a href="${esc(links.github)}" target="_blank" rel="noopener" class="proj-link" title="GitHub">${ICON_GH} Code</a>`;
      if (links.video && links.video !== '')
        linkHTML += `<a href="${esc(links.video)}" target="_blank" rel="noopener" class="proj-link" title="Video Demo" style="color:var(--hot)">${ICON_YT} Video</a>`;
      if (links.demo && links.demo !== '')
        linkHTML += `<a href="${esc(links.demo)}" target="_blank" rel="noopener" class="proj-link" title="Live Demo">${ICON_LINK} Demo</a>`;

      card.innerHTML = `
        <div class="card-spotlight"></div>
        <div class="card-glare"></div>
        <div class="card-edge"></div>
        <div class="proj-vis">${visHTML}<div class="proj-overlay"></div></div>
        <div class="proj-body">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
            <div class="proj-cat">${esc(proj.category)}</div>
            ${statusBadge}
          </div>
          <div class="proj-title">${esc(proj.title)}</div>
          <p class="proj-desc">${esc(proj.short_description)}</p>
          <div class="proj-tags">${proj.tech_tags.map(t => `<span class="pt">${esc(t)}</span>`).join('')}</div>
          <div class="proj-footer">
            <div style="display:flex;gap:.7rem;flex-wrap:wrap;align-items:center">${linkHTML}</div>
            <div class="proj-more" data-proj-idx="${idx}">Details →</div>
          </div>
        </div>`;

      /* Tilt effect */
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(800px) rotateY(${(x * 12).toFixed(2)}deg) rotateX(${(-y * 10).toFixed(2)}deg) translateZ(10px) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .6s cubic-bezier(0.34,1.56,0.64,1)';
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0) scale(1)';
        setTimeout(() => card.style.transition = '', 640);
      });

      /* Modal opener */
      card.querySelector('.proj-more').addEventListener('click', () => openProjectModal(proj));

      gridEl.appendChild(card);
    });

    /* ── Scroll reveal for cards ── */
    const cards = [...gridEl.querySelectorAll('.proj-card')];
    const cardIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const idx = cards.indexOf(e.target);
        setTimeout(() => e.target.classList.add('card-in'), idx * 90);
        cardIO.unobserve(e.target);
      });
    }, { threshold: .08 });
    cards.forEach(c => cardIO.observe(c));
  }

  /* ── PROJECT MODAL ── */
  function openProjectModal(proj) {
    const hasImage = proj.media?.image_path;
    const visHTML = hasImage
      ? `<img src="${esc(proj.media.image_path)}" alt="${esc(proj.media.image_alt || proj.title)}" style="width:100%;height:100%;object-fit:cover">`
      : projectPlaceholderSVG(proj.color_hex || '#7c3aed');

    const modalVis = el('modal-vis');
    modalVis.innerHTML = `
      ${visHTML}
      <button class="modal-close-btn" onclick="closeModal()">✕</button>
    `;

    el('modal-cat').textContent = proj.category;
    el('modal-title').textContent = proj.title;
    el('modal-desc').textContent = proj.full_description;
    el('modal-hl').innerHTML = (proj.highlights || []).map(h => `<li>${esc(h)}</li>`).join('');
    el('modal-tags').innerHTML = (proj.tech_tags || []).map(t => `<span class="pt">${esc(t)}</span>`).join('');

    /* Action buttons */
    const acts = el('modal-acts');
    acts.innerHTML = '';
    const links = proj.links || {};
    if (links.github && links.github !== '') {
      acts.innerHTML += `<a href="${esc(links.github)}" target="_blank" rel="noopener" class="btn-ghost" style="font-size:.83rem;padding:.55rem 1.3rem;display:inline-flex;align-items:center;gap:.4rem">${ICON_GH} GitHub</a>`;
    }
    if (links.video && links.video !== '') {
      acts.innerHTML += `<a href="${esc(links.video)}" target="_blank" rel="noopener" class="btn-ghost" style="font-size:.83rem;padding:.55rem 1.3rem;color:var(--hot);border-color:rgba(245,158,11,.3);display:inline-flex;align-items:center;gap:.4rem">${ICON_YT} Watch Video</a>`;
    }
    if (links.demo && links.demo !== '') {
      acts.innerHTML += `<a href="${esc(links.demo)}" target="_blank" rel="noopener" class="btn-primary" style="font-size:.83rem;padding:.55rem 1.3rem">Live Demo →</a>`;
    }
    if (links.paper && links.paper !== '') {
      acts.innerHTML += `<a href="${esc(links.paper)}" target="_blank" rel="noopener" class="btn-ghost" style="font-size:.83rem;padding:.55rem 1.3rem">${ICON_LINK} Paper</a>`;
    }

    el('modal-bg').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /* Expose closeModal globally (called by inline onclick) */
  window.closeModal = function () {
    const bg = el('modal-bg');
    if (bg) bg.classList.remove('open');
    document.body.style.overflow = '';
  };
  el('modal-close').onclick = window.closeModal;
  el('modal-bg').onclick = e => { if (e.target.id === 'modal-bg') window.closeModal(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeModal(); });

  /* ══════════════════════════════════════════════════════════════
     SECTION 4 — JOURNEY (TIMELINE)
  ══════════════════════════════════════════════════════════════ */
  function renderJourney(journey) {
    const container = el('tl-items');
    if (!container) return;
    container.innerHTML = '';

    const typeBadgeClass = {
      education:  'student',
      activity:   'project',
      'self-study': 'intern',
    };

    journey.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'tl-item';

      const metricsHTML = item.metrics
        ? `<div class="tl-metrics">${item.metrics.map(m => `
            <div class="tl-metric">
              <div class="tl-metric-n">${esc(m.value)}</div>
              <div class="tl-metric-l">${esc(m.label)}</div>
            </div>`).join('')}</div>`
        : '';

      const bulletsHTML = item.highlights
        ? `<div class="tl-bullets">${item.highlights.map(b => `
            <div class="tl-bullet">
              <div class="tl-bullet-icon">${b.icon}</div>
              <div class="tl-bullet-text">${esc(b.text)}</div>
            </div>`).join('')}</div>`
        : '';

      const skillsHTML = item.skills
        ? `<div class="tl-skills">${item.skills.map(s => `<span class="tl-skill">${esc(s)}</span>`).join('')}</div>`
        : '';

      const cgpaHTML = item.cgpa
        ? `<span style="font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--green);background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:20px;padding:.18rem .65rem;margin-left:.5rem">CGPA ${esc(item.cgpa)}</span>`
        : '';

      div.innerHTML = `
        <div class="tl-node"><div class="tl-node-inner"></div></div>
        <div class="tl-connector"></div>
        <div class="tl-year-float">${esc(item.year_label)}</div>
        <div class="tl-card">
          <div class="tl-card-inner-glow"></div>
          <div class="tl-card-body">
            <div class="tl-card-head">
              <div class="tl-card-left">
                <div class="tl-year"><div class="tl-year-dot"></div>${esc(item.period)}</div>
                <div class="tl-role">${esc(item.role)} ${cgpaHTML}</div>
                <div class="tl-company">${esc(item.organisation)}</div>
              </div>
              <div class="tl-type-badge ${typeBadgeClass[item.type] || 'project'}">${esc(item.type_badge)}</div>
            </div>
            <p class="tl-desc-text">${esc(item.description)}</p>
            ${metricsHTML}${bulletsHTML}${skillsHTML}
          </div>
          <div class="tl-status-bar">
            <div class="tl-status-label">
              <div class="tl-status-dot ${item.status === 'active' ? 'active' : 'past'}"></div>
              ${esc(item.status_label)}
            </div>
            <div class="tl-status-right"># ${String(idx + 1).padStart(2, '0')} / ${String(journey.length).padStart(2, '0')}</div>
          </div>
        </div>`;

      container.appendChild(div);
    });

    /* ── Spine scroll animation ── */
    const spine = el('tl-spine');
    const spineWrap = document.querySelector('.tl-spine-wrap');
    const spinePulse = el('tl-spine-pulse');
    function updateSpine() {
      if (!spine || !spineWrap) return;
      const rect = spineWrap.getBoundingClientRect();
      const progress = Math.min(Math.max((window.innerHeight - rect.top) / rect.height, 0), 1);
      spine.style.transform = `scaleY(${progress})`;
      if (spinePulse) spinePulse.style.opacity = (progress > 0 && progress < 1) ? '1' : '0';
    }
    window.addEventListener('scroll', updateSpine, { passive: true });
    updateSpine();

    /* ── Scroll reveal ── */
    const tlIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('tl-in');
        tlIO.unobserve(e.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.tl-item').forEach(item => tlIO.observe(item));

    /* ── Card tilt ── */
    document.querySelectorAll('.tl-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(1200px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .5s cubic-bezier(0.34,1.56,0.64,1),border-color .35s,box-shadow .35s';
        card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateY(0)';
        setTimeout(() => card.style.transition = '', 520);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 5 — EDUCATION (driven from journey items typed 'education')
     Also renders the separate #edu-grid if present.
  ══════════════════════════════════════════════════════════════ */
  function renderEducation(journey) {
    const eduEl = el('edu-grid');
    if (!eduEl) return;
    eduEl.innerHTML = '';
    const eduItems = journey.filter(j => j.type === 'education');
    eduItems.forEach(e => {
      eduEl.innerHTML += `
        <div class="edu-card rv">
          <div class="edu-per">${esc(e.period)}</div>
          <div class="edu-badge">${esc(e.status_label)}</div>
          <div class="edu-deg">${esc(e.role)}</div>
          <div class="edu-sch">${esc(e.organisation)}</div>
          ${e.cgpa ? `<div class="edu-d" style="color:var(--green)">CGPA: ${esc(e.cgpa)}</div>` : ''}
          <div class="edu-d">${esc(e.location)}</div>
        </div>`;
    });
  }

  /* ══════════════════════════════════════════════════════════════
     SECTION 6 — CERTIFICATIONS
  ══════════════════════════════════════════════════════════════ */
  function renderCertifications(certs) {
    const certEl = el('cert-grid');
    if (!certEl) return;
    certEl.innerHTML = '';
    certs.forEach(c => {
      const inProgress = c.score?.toLowerCase().includes('progress');
      certEl.innerHTML += `
        <a href="${esc(c.url)}" class="cert-card rv" target="_blank" rel="noopener">
          <div class="cert-ico">${c.icon}</div>
          <div class="cert-n">${esc(c.name)}</div>
          <div class="cert-iss">${esc(c.issuer)}</div>
          ${c.score ? `<div style="font-family:'JetBrains Mono',monospace;font-size:.68rem;color:${inProgress ? 'var(--hot)' : 'var(--green)'};margin-top:.2rem">${esc(c.score)}</div>` : ''}
          <div class="cert-yr">${esc(c.year)} · ${esc(c.category)}</div>
        </a>`;
    });
  }

  /* ══════════════════════════════════════════════════════════════
     TRIGGER ALL RENDERERS
  ══════════════════════════════════════════════════════════════ */
  renderAbout(DATA.about);
  renderProjects(DATA.projects);
  renderJourney(DATA.journey);
  renderEducation(DATA.journey);   /* re-uses journey data */
  renderCertifications(DATA.certifications);

  /* ── Re-run reveal observer on newly created elements ── */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add('in'); revealIO.unobserve(e.target); });
  }, { threshold: .1 });
  document.querySelectorAll('.rv').forEach(el => revealIO.observe(el));

  console.info('[KSBRenderer] All sections hydrated from portfolio.json');

})();
