/* ============================================================
   profile.js — Future Students | Profile Page Scripts
   ============================================================ */

ThemeManager.loadSaved();
const user = Auth.requireAuth();
if (!user) throw '';
Auth.applyTopbar(user);
buildSidebar('profile.html');

function loadUI() {
  document.getElementById('bigAvatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('pName').textContent     = user.name;
  document.getElementById('pEmail').textContent    = user.email;
  const parts = user.name.split(' ');
  document.getElementById('fName').value  = parts[0] || '';
  document.getElementById('lName').value  = parts.slice(1).join(' ') || '';
  document.getElementById('fEmail').value = user.email || '';
}
loadUI();

function saveProfile() {
  const fn    = document.getElementById('fName').value.trim();
  const ln    = document.getElementById('lName').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  if (!fn) { showToast('يرجى إدخال الاسم', 'err'); return; }
  user.name  = fn + (ln ? ' ' + ln : '');
  user.email = email;
  // Update session
  if (localStorage.getItem('fs_session'))
    localStorage.setItem('fs_session', JSON.stringify(user));
  else
    sessionStorage.setItem('fs_session', JSON.stringify(user));
  // Update users list
  const users = JSON.parse(localStorage.getItem('fs_users') || '[]');
  const idx   = users.findIndex(u => u.email === email || u.name === user.name);
  if (idx > -1) { users[idx] = { ...users[idx], name: user.name, email }; localStorage.setItem('fs_users', JSON.stringify(users)); }
  Auth.applyTopbar(user);
  loadUI();
  showToast('✅ تم حفظ التغييرات');
}

function savePassword() {
  const np = document.getElementById('newPass').value;
  const cp = document.getElementById('confPass').value;
  if (!np)        { showToast('أدخل كلمة المرور', 'err'); return; }
  if (np !== cp)  { showToast('كلمتا المرور غير متطابقتين', 'err'); return; }
  if (np.length < 4) { showToast('كلمة المرور قصيرة جداً', 'err'); return; }
  const users = JSON.parse(localStorage.getItem('fs_users') || '[]');
  const idx   = users.findIndex(u => u.email === user.email);
  if (idx > -1) { users[idx].password = np; localStorage.setItem('fs_users', JSON.stringify(users)); }
  document.getElementById('newPass').value  = '';
  document.getElementById('confPass').value = '';
  showToast('✅ تم تغيير كلمة المرور');
}
