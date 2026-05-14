/* ============================================================
   students.js — Future Students | Students Page Scripts
   ============================================================ */

ThemeManager.loadSaved();
const user = Auth.requireAuth();
if (!user) throw '';
Auth.applyTopbar(user);
buildSidebar('students.html');

const COLORS = ['#2451a0','#c9a84c','#00b4d8','#a07830','#7eb3ff','#00e676','#ff7043','#ab47bc'];
let curSec = 0;

// Read ?sec= from URL
const urlSec = parseInt(new URLSearchParams(window.location.search).get('sec') || '0');
if (urlSec >= 1 && urlSec <= 8) curSec = urlSec;

// Build section tabs
const tabs   = document.getElementById('secTabs');
const allBtn = document.createElement('button');
allBtn.className = 'sec-tab' + (curSec === 0 ? ' active' : '');
allBtn.textContent = 'الكل (312)';
allBtn.onclick = () => filter(0);
tabs.appendChild(allBtn);

for (let i = 1; i <= 8; i++) {
  const cnt = STUDENTS_DATA.filter(s => s.section === i).length;
  const b   = document.createElement('button');
  b.className   = 'sec-tab' + (curSec === i ? ' active' : '');
  b.textContent = `Section ${i} (${cnt})`;
  b.onclick = () => filter(i);
  tabs.appendChild(b);
}

let deb;

function filter(sec) {
  curSec = sec;
  document.querySelectorAll('.sec-tab').forEach((b, i) => b.classList.toggle('active', i === sec));
  render();
}

function render() {
  const q    = document.getElementById('searchInput').value.trim().toLowerCase();
  const list = STUDENTS_DATA.filter(s =>
    (!curSec || s.section === curSec) &&
    (!q || s.name.toLowerCase().includes(q) || s.code.includes(q))
  );
  document.getElementById('countLabel').textContent = `عرض ${list.length} طالب`;
  document.getElementById('tbody').innerHTML = list.map((s, i) => `
    <tr>
      <td style="color:var(--muted)">${i+1}</td>
      <td style="font-weight:600">${s.name}</td>
      <td style="font-family:monospace;color:var(--acc)">${s.code}</td>
      <td><span class="badge" style="background:${COLORS[s.section-1]}22;color:${COLORS[s.section-1]};border:1px solid ${COLORS[s.section-1]}44;">S${s.section}</span></td>
    </tr>`).join('');
}

document.getElementById('searchInput').addEventListener('input', () => {
  clearTimeout(deb);
  deb = setTimeout(render, 220);
});

render();
