/* ============================================================
   my-dashboard.js — Future Students | Student Dashboard Scripts
   ============================================================ */

ThemeManager.loadSaved();
const user = Auth.requireAuth();
if (!user) throw '';
Auth.applyTopbar(user);
buildSidebar('my-dashboard.html');

const SUBJECTS = [
  { key:'Cloud',   label:'Cloud Computing', icon:'☁️' },
  { key:'Web',     label:'Web Dev',          icon:'🌐' },
  { key:'Data',    label:'Data Mining',      icon:'⛏️' },
  { key:'Algo',    label:'Algorithm Design', icon:'🧮' },
  { key:'English', label:'Tech English',     icon:'🗣️' },
  { key:'IoT',     label:'IoT',              icon:'📡' },
];

function getGrade(s) {
  if (s >= 90) return { letter:'A', cls:'gA', color:'#00e676', status:'ممتاز ✅' };
  if (s >= 80) return { letter:'B', cls:'gB', color:'#7eb3ff', status:'جيد جداً ✅' };
  if (s >= 70) return { letter:'C', cls:'gC', color:'var(--acc)', status:'جيد ✅' };
  if (s >= 60) return { letter:'D', cls:'gD', color:'#ff9800', status:'مقبول ✅' };
  return { letter:'F', cls:'gF', color:'#ff5252', status:'راسب ❌' };
}

/* ── CHECK SAVED CODE ── */
const savedCode = Auth.getStudentCode();
if (savedCode) {
  const student = STUDENTS_DATA.find(s => s.code === savedCode);
  if (student) {
    renderDashboard(student);
    document.getElementById('codeModal').style.display = 'none';
  }
}

/* ── SUBMIT CODE ── */
function submitCode() {
  const code = document.getElementById('codeInput').value.trim();
  const err  = document.getElementById('codeErr');
  err.style.display = 'none';
  if (!code) { err.textContent = 'يرجى إدخال الكود'; err.style.display = 'block'; return; }
  const btn = document.getElementById('codeBtnText');
  btn.textContent = 'جارٍ التحقق...';
  setTimeout(() => {
    const r = Auth.loginCode(code);
    if (r.ok) {
      document.getElementById('codeModal').style.display = 'none';
      renderDashboard(r.student);
    } else {
      err.textContent = r.msg;
      err.style.display = 'block';
      btn.textContent = 'دخول ←';
    }
  }, 300);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('codeModal').style.display !== 'none')
    submitCode();
});

/* ── RENDER DASHBOARD ── */
function renderDashboard(student) {
  const gradesKey  = 'fs_grades_' + student.code;
  const grades     = JSON.parse(localStorage.getItem(gradesKey) || 'null');
  const classmates = STUDENTS_DATA.filter(s => s.section === student.section);
  const scores     = grades ? SUBJECTS.map(s => grades[s.key] || 0) : null;
  const avg        = scores ? (scores.reduce((a,b) => a+b, 0) / scores.length) : null;
  const passCount  = scores ? scores.filter(v => v >= 60).length : null;
  const avgG       = avg != null ? getGrade(avg) : null;

  document.getElementById('pageContent').innerHTML = `
    <div class="info-banner fade-in">
      <div class="info-avatar">${student.name.charAt(0)}</div>
      <div class="info-text">
        <div class="info-name">${student.name}</div>
        <div class="info-tags">
          <span class="info-tag">🎓 ${student.code}</span>
          <span class="info-tag">🏷️ Section ${student.section}</span>
          <span class="info-tag">🏛️ HITU — CS</span>
          ${avg != null ? `<span class="info-tag" style="color:${avgG.color};border-color:${avgG.color}55;">📊 متوسط: ${avg.toFixed(1)}</span>` : ''}
        </div>
      </div>
      <button class="logout-code" style="margin-right:auto;" onclick="changeStudent()">🔄 تغيير الطالب</button>
    </div>

    <div class="stats-grid fade-in-1">
      <div class="stat-card"><div class="stat-icon">📊</div><div><div class="stat-value">${avg != null ? avg.toFixed(0) : '--'}</div><div class="stat-label">متوسط الدرجات</div></div></div>
      <div class="stat-card"><div class="stat-icon">🏆</div><div><div class="stat-value" style="color:${avgG ? avgG.color : 'var(--acc2)'}">${avgG ? avgG.letter : '--'}</div><div class="stat-label">التقدير</div></div></div>
      <div class="stat-card"><div class="stat-icon">✅</div><div><div class="stat-value">${passCount != null ? passCount : '--'}</div><div class="stat-label">مواد ناجح / 6</div></div></div>
      <div class="stat-card"><div class="stat-icon">👥</div><div><div class="stat-value">${classmates.length}</div><div class="stat-label">زملاء السكشن</div></div></div>
    </div>

    <div class="card fade-in-2" style="margin-bottom:14px;">
      <div class="card-title">📈 درجاتي في المواد</div>
      ${grades ? `
        <div class="grades-grid" id="gradesGrid"></div>
        <canvas id="gradeChart" style="max-height:180px;margin-top:10px;"></canvas>
      ` : `
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <div style="font-size:14px;font-weight:700;color:var(--text);">لم تُرفع الدرجات بعد</div>
          <div style="font-size:12px;margin-top:6px;">ستظهر هنا عند إضافتها من قِبل الإدارة</div>
        </div>`}
    </div>

    <div class="card fade-in-3">
      <div class="card-title">👥 زملائي — Section ${student.section}</div>
      <div class="classmates-list" id="cmList"></div>
    </div>
  `;

  // Classmates list
  const cmList = document.getElementById('cmList');
  classmates.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'cm-item' + (s.code === student.code ? ' me' : '');
    div.innerHTML = `
      <span style="font-size:11px;color:var(--muted);width:22px;">${i+1}</span>
      <span style="font-weight:${s.code === student.code ? '800' : '500'};color:${s.code === student.code ? 'var(--acc2)' : 'var(--text)'};">${s.name}</span>
      ${s.code === student.code ? '<span class="cm-me-tag">أنت ✦</span>' : ''}
    `;
    cmList.appendChild(div);
  });

  // Grade cards + chart
  if (grades && scores) {
    Chart.defaults.color = '#8a9cc0';
    const grid = document.getElementById('gradesGrid');
    SUBJECTS.forEach((s, i) => {
      const score = scores[i];
      const g = getGrade(score);
      const card = document.createElement('div');
      card.className = `grade-card ${g.cls}`;
      card.innerHTML = `
        <div class="g-subj">${s.icon} ${s.label}</div>
        <div style="display:flex;align-items:baseline;gap:4px;">
          <div class="g-num" style="color:${g.color}">${score}</div>
          <div style="font-size:12px;color:var(--muted);">/100</div>
          <div style="font-size:16px;font-weight:900;color:${g.color};margin-right:auto;">${g.letter}</div>
        </div>
        <div class="g-bar"><div class="g-fill" style="width:${score}%;background:${g.color};"></div></div>
        <div class="g-status" style="color:${g.color};">${g.status}</div>
      `;
      grid.appendChild(card);
    });
    new Chart(document.getElementById('gradeChart'), {
      type: 'bar',
      data: {
        labels: SUBJECTS.map(s => s.icon + ' ' + s.label),
        datasets: [{
          data: scores,
          backgroundColor: scores.map(v => getGrade(v).color + '99'),
          borderColor: scores.map(v => getGrade(v).color),
          borderWidth: 2, borderRadius: 7
        }]
      },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } } }, responsive: true }
    });
  }
}

/* ── CHANGE STUDENT ── */
function changeStudent() {
  sessionStorage.removeItem('fs_student_code');
  document.getElementById('pageContent').innerHTML = '';
  document.getElementById('codeInput').value = '';
  document.getElementById('codeModal').style.display = 'flex';
}
