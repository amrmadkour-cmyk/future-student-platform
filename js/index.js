/* ============================================================
   index.js — Future Students | Landing Page Scripts
   ============================================================ */

/* ── CANVAS BG ── */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});

const stars = Array.from({length: 200}, () => ({
  x:     Math.random() * canvas.width,
  y:     Math.random() * canvas.height,
  r:     Math.random() * 1.6 + .2,
  speed: Math.random() * .25 + .05,
  pulse: Math.random() * Math.PI * 2,
  op:    Math.random() * .7 + .2
}));

(function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const g = ctx.createRadialGradient(canvas.width*.4, canvas.height*.4, 0, canvas.width*.5, canvas.height*.5, canvas.width*.9);
  g.addColorStop(0, '#0b1830');
  g.addColorStop(.6, '#060e1c');
  g.addColorStop(1, '#040c1e');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const n1 = ctx.createRadialGradient(canvas.width*.75, canvas.height*.25, 0, canvas.width*.75, canvas.height*.25, canvas.width*.42);
  n1.addColorStop(0, 'rgba(36,81,160,0.13)');
  n1.addColorStop(1, 'transparent');
  ctx.fillStyle = n1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const n2 = ctx.createRadialGradient(canvas.width*.2, canvas.height*.75, 0, canvas.width*.2, canvas.height*.75, canvas.width*.35);
  n2.addColorStop(0, 'rgba(201,168,76,0.09)');
  n2.addColorStop(1, 'transparent');
  ctx.fillStyle = n2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(36,81,160,0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 80) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  stars.forEach(s => {
    s.pulse += .018;
    const a = s.op * (.6 + .4 * Math.sin(s.pulse));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fill();
    s.y -= s.speed;
    if (s.y < -5) { s.y = canvas.height + 5; s.x = Math.random() * canvas.width; }
  });

  requestAnimationFrame(draw);
})();

/* ── TYPING EFFECT ── */
const phrases = [
  'كل خطوة في التعلم تبني مستقبلك...',
  'العلم نور يضيء طريق النجاح...',
  'أنت طالب اليوم وقائد الغد...',
  'HITU — CS Department 💙',
  'تقنية اليوم تصنع غد أفضل...'
];
let pi = 0, ci = 0, del = false;
const el = document.getElementById('typingText');

function type() {
  const cur = phrases[pi];
  el.textContent = del ? cur.substring(0, ci - 1) : cur.substring(0, ci + 1);
  del ? ci-- : ci++;
  if (!del && ci === cur.length) { del = true; setTimeout(type, 2000); return; }
  if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
  setTimeout(type, del ? 38 : 68);
}
setTimeout(type, 2800);

/* ── PARTICLES ── */
const pc = document.getElementById('particles');
for (let i = 0; i < 28; i++) {
  const p    = document.createElement('div');
  p.className = 'particle';
  const gold = Math.random() > .5;
  const sz   = Math.random() * 4 + 1;
  p.style.cssText = `
    width:${sz}px; height:${sz}px;
    left:${Math.random()*100}%; top:${Math.random()*100}%;
    background:${gold ? 'rgba(201,168,76,0.8)' : 'rgba(100,150,255,0.7)'};
    --dur:${Math.random()*6+4}s;
    --op:${Math.random()*.5+.2};
    animation-delay:${Math.random()*6}s;
    box-shadow:0 0 ${sz*3}px ${gold ? 'rgba(201,168,76,0.5)' : 'rgba(100,150,255,0.4)'};
  `;
  pc.appendChild(p);
}
