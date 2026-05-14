/* ============================================================
   dashboard.js — Future Students | Dashboard Scripts
   ============================================================ */

ThemeManager.loadSaved();
const user = Auth.requireAuth();
if (!user) throw '';
Auth.applyTopbar(user);
document.getElementById('wName').textContent = user.name.split(' ').slice(0,2).join(' ');
buildSidebar('dashboard.html');

Chart.defaults.color = '#8a9cc0';
Chart.defaults.borderColor = 'rgba(36,81,160,.2)';

const COLORS = ['#2451a0','#c9a84c','#00b4d8','#a07830','#7eb3ff','#00e676','#ff7043','#ab47bc'];

/* ── CHARTS ── */
const secCounts = Array.from({length:8}, (_,i) => STUDENTS_DATA.filter(s => s.section === i+1).length);

new Chart(document.getElementById('secChart'), {
  type: 'bar',
  data: {
    labels: Array.from({length:8}, (_,i) => `S${i+1}`),
    datasets: [{ data: secCounts, backgroundColor: COLORS, borderRadius: 7, borderWidth: 0 }]
  },
  options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
});

new Chart(document.getElementById('subChart'), {
  type: 'doughnut',
  data: {
    labels: ['Cloud','Web Dev','Data Mining','Algorithm','Tech English','IoT'],
    datasets: [{ data: [312,312,312,312,312,312], backgroundColor: COLORS, borderWidth: 2, borderColor: '#040c1e' }]
  },
  options: { plugins: { legend: { position: 'bottom', labels: { boxWidth: 9, padding: 8, font: { size: 10 } } } } }
});

/* ── SECTION CARDS ── */
const sl = document.getElementById('secList');
const sf = document.getElementById('secFilter');

for (let i = 1; i <= 8; i++) {
  const cnt = STUDENTS_DATA.filter(s => s.section === i).length;

  const div = document.createElement('a');
  div.href = 'students.html?sec=' + i;
  div.style.cssText = `display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--card2);border:1px solid var(--border);border-radius:11px;text-decoration:none;transition:all .3s;`;
  div.onmouseover = () => { div.style.borderColor = 'var(--acc)'; div.style.transform = 'translateY(-2px)'; };
  div.onmouseout  = () => { div.style.borderColor = 'var(--border)'; div.style.transform = ''; };
  div.innerHTML = `
    <div style="width:36px;height:36px;border-radius:9px;background:${COLORS[i-1]}33;border:1px solid ${COLORS[i-1]}55;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:${COLORS[i-1]};">${i}</div>
    <div>
      <div style="font-size:13px;font-weight:700;color:var(--text);">Section ${i}</div>
      <div style="font-size:11px;color:var(--muted);">${cnt} طالب</div>
    </div>`;
  sl.appendChild(div);

  const opt = document.createElement('option');
  opt.value = i; opt.textContent = 'Section ' + i;
  sf.appendChild(opt);
}

/* ── SEARCH ── */
let debounce;

function renderSearch() {
  const q   = document.getElementById('searchInput').value.trim().toLowerCase();
  const sec = parseInt(document.getElementById('secFilter').value);
  const filtered = STUDENTS_DATA.filter(s => {
    const ms   = !q   || s.name.toLowerCase().includes(q) || s.code.includes(q);
    const msec = !sec || s.section === sec;
    return ms && msec;
  }).slice(0, 50);

  document.getElementById('searchCount').textContent = `عرض ${filtered.length} طالب`;
  document.getElementById('searchBody').innerHTML = filtered.map((s,i) => `
    <tr>
      <td style="color:var(--muted)">${i+1}</td>
      <td style="font-weight:600">${s.name}</td>
      <td style="font-family:monospace;color:var(--acc)">${s.code}</td>
      <td><span class="badge badge-blue">S${s.section}</span></td>
    </tr>`).join('');
}

document.getElementById('searchInput').addEventListener('input', () => {
  clearTimeout(debounce);
  debounce = setTimeout(renderSearch, 250);
});
document.getElementById('secFilter').addEventListener('change', renderSearch);
renderSearch();
