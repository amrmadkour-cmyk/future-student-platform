// ============================================================
//  Future Students — Auth + Theme + Sidebar
// ============================================================

/* ── AUTH ── */
const Auth = {
  KEY: 'fs_session',

  // تسجيل حساب جديد
  register(name, email, password) {
    const users = this._getUsers();
    if (users.find(u => u.email === email.toLowerCase()))
      return { ok: false, msg: 'هذا البريد مسجل مسبقاً' };
    const user = { name: name.trim(), email: email.toLowerCase().trim(), password };
    users.push(user);
    this._saveUsers(users);
    return { ok: true, user };
  },

  // تسجيل الدخول بإيميل + باسورد
  loginEmail(email, password, remember) {
    const users = this._getUsers();
    const user = users.find(u => u.email === email.toLowerCase().trim() && u.password === password);
    if (!user) return { ok: false, msg: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    this._saveSession({ type: 'general', ...user }, remember);
    return { ok: true, user };
  },

  // دخول بكود الطالب (للداش بورد الشخصي)
  loginCode(code) {
    if (!window.STUDENTS_DATA) return { ok: false, msg: 'لم تُحمَّل بيانات الطلاب' };
    const student = STUDENTS_DATA.find(s => s.code === code.trim());
    if (!student) return { ok: false, msg: 'كود الطالب غير موجود' };
    // نحفظ الكود في sessionStorage فقط (مؤقت)
    sessionStorage.setItem('fs_student_code', student.code);
    return { ok: true, student };
  },

  getStudentCode() {
    return sessionStorage.getItem('fs_student_code') || null;
  },

  _saveSession(data, remember) {
    const s = JSON.stringify(data);
    if (remember) localStorage.setItem(this.KEY, s);
    else sessionStorage.setItem(this.KEY, s);
  },

  getUser() {
    const s = localStorage.getItem(this.KEY) || sessionStorage.getItem(this.KEY);
    try { return s ? JSON.parse(s) : null; } catch { return null; }
  },

  isLoggedIn() { return !!this.getUser(); },

  logout() {
    localStorage.removeItem(this.KEY);
    sessionStorage.removeItem(this.KEY);
    sessionStorage.removeItem('fs_student_code');
    window.location.href = 'login.html';
  },

  requireAuth() {
    const u = this.getUser();
    if (!u) { window.location.href = 'login.html'; return null; }
    return u;
  },

  applyTopbar(user) {
    const av = document.getElementById('userAvatar');
    const nm = document.getElementById('userName');
    if (av) av.textContent = (user.name || '?').charAt(0).toUpperCase();
    if (nm) nm.textContent = (user.name || '').split(' ').slice(0, 2).join(' ');
  },

  _getUsers() {
    try { return JSON.parse(localStorage.getItem('fs_users') || '[]'); } catch { return []; }
  },
  _saveUsers(u) { localStorage.setItem('fs_users', JSON.stringify(u)); }
};

/* ── SIDEBAR ── */
function initSidebar() {
  const btn     = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('mainSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!btn || !sidebar) return;
  btn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
  });
  if (overlay) overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

/* ── TOAST ── */
function showToast(msg, type = 'ok') {
  let t = document.getElementById('globalToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'globalToast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  const colors = { ok: ['#00c853','#040c1e'], err: ['#ff1744','#fff'], info: ['#2451a0','#fff'] };
  const [bg, color] = colors[type] || colors.ok;
  t.style.background = bg; t.style.color = color;
  t.style.display = 'block';
  clearTimeout(t._t);
  t._t = setTimeout(() => { t.style.display = 'none'; }, 3000);
}

/* ── THEME MANAGER ── */
const ThemeManager = {
  THEMES: [
    { name:'أزرق ملكي 👑',  p1:'#1a3a6b', p2:'#2451a0', acc:'#c9a84c', acc2:'#e8c96a' },
    { name:'أخضر زمردي 🌿', p1:'#0d3b2e', p2:'#1a6b4a', acc:'#4caf50', acc2:'#81c784' },
    { name:'بنفسجي 🔮',     p1:'#2d1b69', p2:'#5c35cc', acc:'#ce93d8', acc2:'#e1bee7' },
    { name:'أحمر 🔥',       p1:'#6b1a1a', p2:'#a02424', acc:'#ef9a9a', acc2:'#ffcdd2' },
    { name:'فيروزي 💎',     p1:'#0d3b3b', p2:'#1a6b6b', acc:'#4dd0e1', acc2:'#b2ebf2' },
    { name:'برتقالي 🍊',    p1:'#4a2000', p2:'#a05000', acc:'#ffcc02', acc2:'#ffe57f' },
    { name:'وردي 🌸',       p1:'#4a0030', p2:'#8b005a', acc:'#f48fb1', acc2:'#fce4ec' },
    { name:'رمادي 🌫️',     p1:'#1a1a2e', p2:'#2d2d44', acc:'#b0bec5', acc2:'#eceff1' },
    { name:'ذهبي ⭐',       p1:'#2e1f00', p2:'#5c3d00', acc:'#ffd700', acc2:'#fff176' },
    { name:'نيلي 🌊',       p1:'#001a3d', p2:'#003580', acc:'#42a5f5', acc2:'#bbdefb' },
    { name:'أرجواني 🪄',    p1:'#2e0034', p2:'#5c0066', acc:'#ce93d8', acc2:'#f3e5f5' },
    { name:'زيتي 🌱',       p1:'#1a2e00', p2:'#3d6b00', acc:'#aed581', acc2:'#dcedc8' },
    { name:'بحري 🌏',       p1:'#001a2e', p2:'#00366b', acc:'#29b6f6', acc2:'#e1f5fe' },
  ],

  apply(idx) {
    const t = this.THEMES[idx];
    if (!t) return;
    const r = document.documentElement;
    r.style.setProperty('--p1',  t.p1);
    r.style.setProperty('--p2',  t.p2);
    r.style.setProperty('--acc', t.acc);
    r.style.setProperty('--acc2',t.acc2);
    r.style.setProperty('--border',     `rgba(${this._rgb(t.p2)},.35)`);
    r.style.setProperty('--border-acc', `rgba(${this._rgb(t.acc)},.35)`);
    r.style.setProperty('--glow-p', `0 0 22px rgba(${this._rgb(t.p2)},.45)`);
    r.style.setProperty('--glow-a', `0 0 22px rgba(${this._rgb(t.acc)},.4)`);
    localStorage.setItem('fs_theme', idx);
  },

  loadSaved() {
    const idx = parseInt(localStorage.getItem('fs_theme') || '0');
    if (idx > 0) this.apply(idx);
    return idx;
  },

  _rgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(hex);
    return m ? `${parseInt(m[1],16)},${parseInt(m[2],16)},${parseInt(m[3],16)}` : '255,255,255';
  }
};
