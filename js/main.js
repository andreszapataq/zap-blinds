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
    const blindH = 100 - pct * 0.95;
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
    else if (act === 'p3') { stop(); setPct(5); }
  });
});

// form — no real submit
document.getElementById('quote').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.innerHTML = '✓ Sent · We\'ll be in touch within 24 h';
  btn.style.background = 'var(--red)';
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
