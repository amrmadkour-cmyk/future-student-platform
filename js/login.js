/* ============================================================
   login.js — Future Students | Login Page Scripts
   ============================================================ */

ThemeManager.loadSaved();

// لو مسجل دخول بالفعل، روح للداش بورد
if (Auth.isLoggedIn()) window.location.href = 'dashboard.html';

/* ── CANVAS BG ── */
const cv = document.getElementById('bgCanvas');
const cx = cv.getContext('2d');

function rsz() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
rsz();
window.addEventListener('resize', rsz);

const st = Array.from({length: 140}, () => ({
  x: Math.random() * cv.width,
  y: Math.random() * cv.height,
  r: Math.random() * 1.3 + .2,
  sp: Math.random() * .18 + .04,
  p: Math.random() * Math.PI * 2,
  o: Math.random() * .6 + .2
}));

(function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  const g = cx.createRadialGradient(cv.width*.5, cv.height*.5, 0, cv.width*.5, cv.height*.5, cv.width*.9);
  g.addColorStop(0, '#0b1830');
  g.addColorStop(1, '#040c1e');
  cx.fillStyle = g;
  cx.fillRect(0, 0, cv.width, cv.height);
  st.forEach(s => {
    s.p += .02;
    const a = s.o * (.6 + .4 * Math.sin(s.p));
    cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    cx.fillStyle = `rgba(255,255,255,${a})`; cx.fill();
    s.y -= s.sp;
    if (s.y < -5) { s.y = cv.height + 5; s.x = Math.random() * cv.width; }
  });
  requestAnimationFrame(draw);
})();

/* ── TABS ── */
const tabs = [
  document.querySelector('.tabs .tab:first-child'),
  document.querySelector('.tabs .tab:last-child')
];

function switchTab(t) {
  tabs[0].classList.toggle('active', t === 'login');
  tabs[1].classList.toggle('active', t === 'register');
  document.getElementById('loginSec').classList.toggle('active', t === 'login');
  document.getElementById('registerSec').classList.toggle('active', t === 'register');
}

/* ── HELPERS ── */
function showErr(id, m) { const e = document.getElementById(id); e.textContent = m; e.style.display = 'block'; }
function hideErr(id)     { document.getElementById(id).style.display = 'none'; }

/* ── LOGIN ── */
function doLogin() {
  hideErr('loginErr');
  const email = document.getElementById('lEmail').value.trim();
  const pass  = document.getElementById('lPass').value;
  const rem   = document.getElementById('lRemember').checked;
  if (!email || !pass) { showErr('loginErr', 'يرجى ملء جميع الحقول'); return; }
  const btn = document.querySelector('#loginSec .sbtn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'جارٍ التحقق...';
  setTimeout(() => {
    const r = Auth.loginEmail(email, pass, rem);
    if (r.ok) {
      btn.querySelector('span').textContent = '✅ جارٍ الدخول...';
      setTimeout(() => window.location.href = 'dashboard.html', 350);
    } else {
      showErr('loginErr', r.msg);
      btn.disabled = false;
      btn.querySelector('span').textContent = 'دخول ←';
    }
  }, 300);
}

/* ── REGISTER ── */
function doRegister() {
  hideErr('regErr');
  document.getElementById('regOk').style.display = 'none';
  const name  = document.getElementById('rName').value.trim();
  const email = document.getElementById('rEmail').value.trim();
  const pass  = document.getElementById('rPass').value;
  if (!name || !email || !pass) { showErr('regErr', 'يرجى ملء جميع الحقول'); return; }
  if (pass.length < 4) { showErr('regErr', 'كلمة المرور 4 أحرف على الأقل'); return; }
  const r = Auth.register(name, email, pass);
  if (r.ok) {
    const ok = document.getElementById('regOk');
    ok.textContent = '✅ تم إنشاء الحساب! يمكنك الدخول الآن';
    ok.style.display = 'block';
    setTimeout(() => switchTab('login'), 1400);
  } else {
    showErr('regErr', r.msg);
  }
}

/* ── ENTER KEY ── */
document.getElementById('lPass').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});
