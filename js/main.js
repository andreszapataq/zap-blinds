// remote interactivity — drives position bar AND the physical blind
const bar = document.querySelector('.remote-bar i');
const pctEl = document.getElementById('remote-pct');
const blind = document.getElementById('blind');
const lightCast = document.getElementById('lightCast');
let pct = 62;
let moveTimer = null;

const render = () => {
  pct = Math.max(0, Math.min(100, pct));
  bar.style.setProperty('--pos', pct + '%');
  pctEl.textContent = Math.round(pct) + '%';
  if (blind) {
    const blindH = 100 - pct;
    blind.style.setProperty('--blind-h', blindH + '%');
  }
  if (lightCast) {
    lightCast.style.setProperty('--light', (0.08 + pct / 100 * 0.55).toFixed(2));
  }
};

const setPct = (v) => { pct = v; render(); };
const stop = () => { if (moveTimer) { clearInterval(moveTimer); moveTimer = null; } };
const start = (dir) => {
  stop();
  moveTimer = setInterval(() => {
    pct += dir * 2;
    if (pct <= 0 || pct >= 100) stop();
    render();
  }, 40);
};

render();

document.querySelectorAll('#remote .remote-keys button').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('#remote .remote-keys button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const act = b.dataset.act;
    if (act === 'up') start(1);
    else if (act === 'down') start(-1);
    else if (act === 'stop') stop();
    else if (act === 'p1') { stop(); setPct(100); }
    else if (act === 'p2') { stop(); setPct(50); }
    else if (act === 'p3') { stop(); setPct(0); }
  });
});

// form — submits to Formspree via fetch
document.getElementById('quote').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;
  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    const res = await fetch('https://formspree.io/f/xdayynlp', {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      btn.innerHTML = '✓ Sent · We\'ll be in touch within 24 h';
      form.reset();
    } else {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
  } catch {
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
});

// auto-fill reel duration tags from video metadata
document.querySelectorAll('.reel').forEach(reel => {
  const v = reel.querySelector('video');
  const tag = reel.querySelector('.reel-meta .tag.red');
  if (!v || !tag) return;
  const update = () => {
    if (!isFinite(v.duration)) return;
    const m = Math.floor(v.duration / 60);
    const s = Math.floor(v.duration % 60);
    const time = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    const prefix = tag.textContent.includes('REEL') ? '● REEL · ' : '● ';
    tag.textContent = prefix + time;
  };
  if (v.readyState >= 1) update();
  else v.addEventListener('loadedmetadata', update);
});

// lightbox — opens photos and videos in an overlay
const lb = document.getElementById('lightbox');
const lbMedia = document.getElementById('lbMedia');
const lbCaption = document.getElementById('lbCaption');
const lbClose = document.getElementById('lbClose');

const openLightbox = (src, type, title, sub, alt) => {
  lbMedia.innerHTML = '';
  if (type === 'video') {
    const v = document.createElement('video');
    v.src = src;
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    lbMedia.appendChild(v);
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    lbMedia.appendChild(img);
  }
  lbCaption.innerHTML = (title ? `<b>${title}</b>` : '') + (sub || '');
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lb-open');
};

const closeLightbox = () => {
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lb-open');
  lbMedia.innerHTML = '';
};

lbClose.addEventListener('click', closeLightbox);
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox(); });

document.querySelectorAll('.tile, .reel').forEach(el => {
  const img = el.querySelector(':scope > img');
  const video = el.querySelector(':scope > video');
  const media = video || img;
  if (!media) return;
  el.style.cursor = 'pointer';
  el.addEventListener('click', ev => {
    if (ev.target.closest('a')) return;
    const labelB = el.querySelector('.tile-label b, .reel-label b');
    const labelS = el.querySelector('.tile-label small, .reel-label small');
    openLightbox(
      media.src || media.currentSrc,
      video ? 'video' : 'photo',
      labelB ? labelB.textContent : '',
      labelS ? labelS.textContent : '',
      media.alt
    );
  });
});

// live-ish animation on channels strip
const bars = document.querySelectorAll('.chan-bar i');
setInterval(() => {
  bars.forEach(i => {
    if (Math.random() < .25) {
      const w = Math.round(Math.random() * 100);
      i.style.setProperty('--w', w + '%');
      const row = i.closest('.chan-row');
      row.querySelector('.pct').textContent = w + '%';
    }
  });
}, 2400);
