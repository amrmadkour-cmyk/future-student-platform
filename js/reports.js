/* ============================================================
   reports.js — Future Students | Reports Page Scripts
   ============================================================ */

ThemeManager.loadSaved();
const user = Auth.requireAuth();
if (!user) throw '';
Auth.applyTopbar(user);
buildSidebar('reports.html');

Chart.defaults.color       = '#8a9cc0';
Chart.defaults.borderColor = 'rgba(36,81,160,.2)';

const SUBJECTS = [
  { key:'Cloud',   icon:'☁️', label:'Cloud' },
  { key:'Web',     icon:'🌐', label:'Web' },
  { key:'Data',    icon:'⛏️', label:'Data' },
  { key:'Algo',    icon:'🧮', label:'Algo' },
  { key:'English', icon:'🗣️', label:'English' },
  { key:'IoT',     icon:'📡', label:'IoT' },
];

function getGrade(s) {
  if (s >= 90) return { letter:'A', color:'#00e676' };
  if (s >= 80) return { letter:'B', color:'#7eb3ff' };
  if (s >= 70) return { letter:'C', color:'var(--acc)' };
  if (s >= 60) return { letter:'D', color:'#ff9800' };
  return { letter:'F', color:'#ff5252' };
}

function getStudentGrades(code) {
  return JSON.parse(localStorage.getItem('fs_grades_' + code) || 'null');
}

/* ── CHARTS ── */
function buildCharts() {
  const allGrades = [];
  const subjTotals = {}, subjCounts = {};
  SUBJECTS.forEach(s => { subjTotals[s.key] = 0; subjCounts[s.key] = 0; });

  STUDENTS_DATA.forEach(st => {
    const g = getStudentGrades(st.code);
    if (!g) return;
    SUBJECTS.forEach(s => {
      const v = g[s.key] || 0;
      allGrades.push(v);
      subjTotals[s.key] += v;
      subjCounts[s.key]++;
    });
  });

  const dist = [0, 0, 0, 0, 0];
  allGrades.forEach(g => {
    if      (g >= 90) dist[0]++;
    else if (g >= 80) dist[1]++;
    else if (g >= 70) dist[2]++;
    else if (g >= 60) dist[3]++;
    else              dist[4]++;
  });

  new Chart(document.getElementById('distChart'), {
    type: 'doughnut',
    data: {
      labels: ['A≥90','B≥80','C≥70','D≥60','F<60'],
      datasets: [{ data: dist, backgroundColor: ['#00e676','#7eb3ff','#c9a84c','#ff9800','#ff5252'], borderWidth: 2, borderColor: '#040c1e' }]
    },
    options: { plugins: { legend: { position:'bottom', labels: { boxWidth:9, padding:8, font:{ size:10 } } } } }
  });

  const avgs = SUBJECTS.map(s => subjCounts[s.key] > 0 ? (subjTotals[s.key] / subjCounts[s.key]).toFixed(1) : 0);
  new Chart(document.getElementById('avgChart'), {
    type: 'bar',
    data: {
      labels: SUBJECTS.map(s => s.icon + s.label),
      datasets: [{ data: avgs, backgroundColor: ['rgba(36,81,160,.7)','rgba(201,168,76,.7)','rgba(0,180,255,.7)','rgba(160,120,48,.7)','rgba(126,179,255,.7)','rgba(0,230,118,.7)'], borderRadius: 7, borderWidth: 0 }]
    },
    options: { plugins: { legend: { display:false } }, scales: { y: { beginAtZero:true, max:100 } } }
  });
}
buildCharts();

/* ── RENDER REPORTS ── */
let deb;

function render() {
  const q    = document.getElementById('searchInput').value.trim().toLowerCase();
  const sec  = parseInt(document.getElementById('secFilter').value);
  const subj = document.getElementById('subjFilter').value;
  const list = STUDENTS_DATA.filter(s =>
    (!sec || s.section === sec) &&
    (!q   || s.name.toLowerCase().includes(q) || s.code.includes(q))
  );

  document.getElementById('countLabel').textContent = `عرض ${list.length} طالب`;
  const container = document.getElementById('reportsList');
  container.innerHTML = '';

  list.slice(0, 60).forEach(st => {
    const grades   = getStudentGrades(st.code);
    const scores   = grades ? SUBJECTS.map(s => grades[s.key] || 0) : null;
    const avg      = scores ? (scores.reduce((a,b) => a+b, 0) / scores.length) : null;
    const g        = avg != null ? getGrade(avg) : { letter:'--', color:'var(--muted)' };
    const showSubj = subj && grades ? [SUBJECTS.find(s => s.key === subj)] : SUBJECTS;

    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
      <div class="student-header" onclick="this.parentElement.classList.toggle('expanded');this.nextElementSibling.style.display=this.parentElement.classList.contains('expanded')?'grid':'none';">
        <div class="s-avatar">${st.name.charAt(0)}</div>
        <div>
          <div class="s-name">${st.name}</div>
          <div class="s-meta">${st.code} · S${st.section}</div>
        </div>
        ${avg != null
          ? `<div class="s-avg" style="color:${g.color}">${avg.toFixed(0)} <span style="font-size:13px;">${g.letter}</span></div>`
          : `<div class="s-avg" style="color:var(--muted);font-size:13px;">لا يوجد</div>`}
        <span class="toggle-arrow" style="color:var(--muted);font-size:14px;">▼</span>
      </div>
      <div class="subject-rows" style="display:none;">
        ${showSubj.map(s => {
          const score = grades ? (grades[s.key] || 0) : null;
          const sg    = score != null ? getGrade(score) : { letter:'--', color:'var(--muted)' };
          return `<div class="subj-row">
            <span>${s.icon}</span>
            <span style="flex:1;">${s.label}</span>
            ${score != null
              ? `<div class="perf-bar-wrap"><div class="perf-fill" style="width:${score}%;background:${sg.color};"></div></div>
                 <span style="font-size:13px;color:${sg.color}">${score}</span>`
              : `<span style="color:var(--muted);font-size:11px;">لم تُرفع</span>`}
            <span class="subj-grade" style="color:${sg.color}">${sg.letter}</span>
          </div>`;
        }).join('')}
      </div>`;
    container.appendChild(card);
  });
}

document.getElementById('searchInput').addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(render, 220); });
document.getElementById('secFilter').addEventListener('change', render);
document.getElementById('subjFilter').addEventListener('change', render);
render();
