/* ============================================================
   home.js — Future Students | Home Page Scripts
   ============================================================ */

/* ── CANVAS BG ── */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const stars = Array.from({length: 220}, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.6 + .2,
  speed: Math.random() * .2 + .04,
  pulse: Math.random() * Math.PI * 2,
  op: Math.random() * .7 + .2
}));

(function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const g = ctx.createRadialGradient(canvas.width*.4, canvas.height*.4, 0, canvas.width*.5, canvas.height*.5, canvas.width*.9);
  g.addColorStop(0, '#0b1830');
  g.addColorStop(.6, '#060e1c');
  g.addColorStop(1, '#040c1e');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const n1 = ctx.createRadialGradient(canvas.width*.75, canvas.height*.25, 0, canvas.width*.75, canvas.height*.25, canvas.width*.4);
  n1.addColorStop(0, 'rgba(36,81,160,.12)');
  n1.addColorStop(1, 'transparent');
  ctx.fillStyle = n1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const n2 = ctx.createRadialGradient(canvas.width*.2, canvas.height*.75, 0, canvas.width*.2, canvas.height*.75, canvas.width*.35);
  n2.addColorStop(0, 'rgba(201,168,76,.08)');
  n2.addColorStop(1, 'transparent');
  ctx.fillStyle = n2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(36,81,160,.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 90) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 90) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  stars.forEach(s => {
    s.pulse += .016;
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

/* ── PARTICLES ── */
const pc = document.getElementById('particlesWrap');
for (let i = 0; i < 30; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const g = Math.random() > .5, sz = Math.random() * 4 + 1;
  p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;background:${g ? 'rgba(201,168,76,.8)' : 'rgba(100,150,255,.7)'};--dur:${Math.random()*8+5}s;--op:${Math.random()*.5+.2};animation-delay:${Math.random()*8}s;box-shadow:0 0 ${sz*3}px ${g ? 'rgba(201,168,76,.5)' : 'rgba(100,150,255,.4)'};`;
  pc.appendChild(p);
}

/* ── TYPING ── */
const phrases = [
  'كل خطوة في التعلم تبني مستقبلك...',
  'العلم نور يضيء طريق النجاح ✨',
  'أنت طالب اليوم وقائد الغد 👑',
  'HITU — CS Department 💙',
  'تقنية اليوم تصنع غد أفضل 🚀',
  'ابدأ اليوم ولا تنتظر الغد ⭐'
];
let pi = 0, ci = 0, del = false;
const el = document.getElementById('typingText');

function type() {
  const cur = phrases[pi];
  el.textContent = del ? cur.substring(0, ci - 1) : cur.substring(0, ci + 1);
  del ? ci-- : ci++;
  if (!del && ci === cur.length) { del = true; setTimeout(type, 2200); return; }
  if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
  setTimeout(type, del ? 35 : 65);
}
setTimeout(type, 2500);

/* ── NAV SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', scrollY > 50);
});

/* ── COUNTER ANIMATION ── */
function animateCounter(el, target) {
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current;
  }, 25);
}

/* ── REVEAL ON SCROLL ── */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('[data-target]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
    }
  });
}, { threshold: .12 });
revealEls.forEach(el => observer.observe(el));

document.querySelectorAll('[data-target]').forEach(el => {
  const parent = el.closest('.stats-bar');
  if (parent) {
    const o2 = new IntersectionObserver(e => {
      if (e[0].isIntersecting) animateCounter(el, parseInt(el.dataset.target));
    }, { threshold: .3 });
    o2.observe(parent);
  }
});

/* ── SUBJECTS ── */
const subjects = [
  { icon:'☁️', name:'Cloud Computing',   desc:'AWS، Azure، Google Cloud' },
  { icon:'🌐', name:'Web Development',   desc:'HTML، CSS، JS، React' },
  { icon:'⛏️', name:'Data Mining',       desc:'ML، Big Data، Python' },
  { icon:'🧮', name:'Algorithm Design',  desc:'Sorting، DP، Graph Theory' },
  { icon:'🗣️', name:'Technical English', desc:'Academic Writing، IT Terms' },
  { icon:'📡', name:'IoT',               desc:'Arduino، Raspberry Pi' },
];

const sr = document.getElementById('subjectsRow');
subjects.forEach(s => {
  const card = document.createElement('a');
  card.href = 'subjects.html';
  card.className = 'subj-card reveal';
  card.innerHTML = `<div class="subj-icon">${s.icon}</div><div class="subj-name">${s.name}</div><div class="subj-desc">${s.desc}</div>`;
  sr.appendChild(card);
  observer.observe(card);
});
