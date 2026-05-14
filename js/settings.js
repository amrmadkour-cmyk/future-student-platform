/* ============================================================
   settings.js — Future Students | Settings Page Scripts
   ============================================================ */

const user = Auth.requireAuth();
if (!user) throw '';
Auth.applyTopbar(user);
buildSidebar('settings.html');

const EMOJIS = ['👑','🌿','🔮','🔥','💎','🍊','🌸','🌫️','⭐','🌊','🪄','🌱','🌏'];
let savedIdx = ThemeManager.loadSaved();
const grid   = document.getElementById('themesGrid');

ThemeManager.THEMES.forEach((t, i) => {
  const btn = document.createElement('button');
  btn.className = 'theme-btn' + (i === savedIdx ? ' active' : '');
  btn.innerHTML = `
    <div class="theme-prev" style="background:linear-gradient(135deg,${t.p1},${t.p2},${t.acc})">${EMOJIS[i]}</div>
    <div class="theme-label">${t.name}</div>`;
  btn.onclick = () => {
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    ThemeManager.apply(i);
    showToast('✅ تم تطبيق ثيم ' + t.name);
  };
  grid.appendChild(btn);
});

/* ── FONT SIZE ── */
document.getElementById('fontSizeSel').addEventListener('change', function () {
  document.body.style.fontSize = this.value;
  localStorage.setItem('fs_font', this.value);
});
const savedFont = localStorage.getItem('fs_font');
if (savedFont) {
  document.body.style.fontSize = savedFont;
  document.getElementById('fontSizeSel').value = savedFont;
}

/* ── CLEAR DATA ── */
function clearData() {
  if (!confirm('هل تريد مسح كل البيانات المحلية؟ (ما عدا الحساب)')) return;
  const session = localStorage.getItem('fs_session') || sessionStorage.getItem('fs_session');
  const users   = localStorage.getItem('fs_users');
  const theme   = localStorage.getItem('fs_theme');
  localStorage.clear();
  sessionStorage.clear();
  if (session) localStorage.setItem('fs_session', session);
  if (users)   localStorage.setItem('fs_users', users);
  if (theme)   localStorage.setItem('fs_theme', theme);
  showToast('🗑️ تم مسح البيانات');
}
