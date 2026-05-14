// ============================================================
//  sidebar builder — call buildSidebar(activePage)
// ============================================================
function buildSidebar(active) {
  const links = [
    { href:'home.html',         icon:'🏠', label:'الرئيسية' },
    { href:'dashboard.html',    icon:'📊', label:'لوحة التحكم' },
    { href:'my-dashboard.html', icon:'🎓', label:'داش بورد الطالب' },
    { href:'subjects.html',     icon:'📚', label:'المواد' },
    { href:'students.html',     icon:'👥', label:'الطلاب' },
    { href:'skills.html',       icon:'⚡', label:'المهارات' },
    { href:'reports.html',      icon:'📈', label:'التقارير' },
    { href:'chatbot.html',      icon:'🤖', label:'AI Chatbot' },
    { href:'profile.html',      icon:'👤', label:'ملفي' },
    { href:'settings.html',     icon:'⚙️', label:'الإعدادات' },
  ];
  const nav = links.map(l =>
    `<a href="${l.href}" class="nav-item${l.href===active?' active':''}">
       <span class="nav-icon">${l.icon}</span>${l.label}
     </a>`
  ).join('');

  const html = `
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <aside class="sidebar" id="mainSidebar">
      <a href="home.html" class="sidebar-logo">
        <img src="assets/logo.jpg" alt="HITU">
        <div class="sidebar-logo-text">
          <span class="site-name">Future Students</span>
          <span class="site-sub">HITU — CS Dept.</span>
        </div>
      </a>
      <nav class="sidebar-nav">${nav}</nav>
      <div class="sidebar-footer">Future Students © 2025</div>
    </aside>`;

  document.getElementById('sidebarMount').innerHTML = html;
  initSidebar();
}
