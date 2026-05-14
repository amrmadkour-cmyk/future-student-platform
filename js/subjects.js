/* ============================================================
   subjects.js — Future Students | Subjects Page Scripts
   ============================================================ */

ThemeManager.loadSaved();
const user = Auth.requireAuth();
if (!user) throw '';
Auth.applyTopbar(user);
buildSidebar('subjects.html');

const SUBJECTS = [
  {
    name:'Cloud Computing', code:'CS-401', icon:'☁️', color:'#2451a0',
    desc:'مفاهيم الحوسبة السحابية، خدمات AWS, Azure, GCP، الـ IaaS والـ SaaS والـ PaaS.',
    videos:[
      { title:'Cloud Computing Full Course 2024',          channel:'freeCodeCamp.org',          dur:'11h',  url:'https://www.youtube.com/watch?v=M988_fsOSWo' },
      { title:'AWS Cloud Practitioner — Complete Course',  channel:'freeCodeCamp.org',          dur:'13h',  url:'https://www.youtube.com/watch?v=SOTamWNgDKc' },
      { title:'Cloud Computing بالعربي — شرح كامل',        channel:'Codezilla',                 dur:'1.5h', url:'https://www.youtube.com/watch?v=_a6us8kaq0g' },
      { title:'Google Cloud Fundamentals: Core Infrastructure', channel:'Google Cloud',         dur:'2h',   url:'https://www.youtube.com/watch?v=IeMYQ-qJeK4' },
    ]
  },
  {
    name:'Web Development', code:'CS-402', icon:'🌐', color:'#c9a84c',
    desc:'HTML5, CSS3, JavaScript ES6+, React.js — من المبتدئ حتى المحترف.',
    videos:[
      { title:'HTML & CSS Full Course — Beginner to Pro',  channel:'SuperSimpleDev',            dur:'6.5h', url:'https://www.youtube.com/watch?v=G3e-cpL7ofc' },
      { title:'JavaScript Full Course for Beginners',      channel:'freeCodeCamp.org',          dur:'3.5h', url:'https://www.youtube.com/watch?v=PkZNo7MFNFg' },
      { title:'React JS Full Course 2024',                 channel:'Dave Gray',                 dur:'9h',   url:'https://www.youtube.com/watch?v=RVFAyFWO4go' },
      { title:'تطوير الويب بالعربي — دورة كاملة',          channel:'Elzero Web School',         dur:'5h',   url:'https://www.youtube.com/watch?v=qHoFHMbrz8w' },
    ]
  },
  {
    name:'Data Mining', code:'CS-403', icon:'⛏️', color:'#00b4d8',
    desc:'استخراج المعرفة من البيانات، خوارزميات Classification, Clustering, Regression.',
    videos:[
      { title:'Data Mining Full Course',                   channel:'Simplilearn',               dur:'7h',   url:'https://www.youtube.com/watch?v=1Rs9HpuKqjQ' },
      { title:'Machine Learning Full Course 2024',         channel:'freeCodeCamp.org',          dur:'10h',  url:'https://www.youtube.com/watch?v=GwIo3gDZCVQ' },
      { title:'Python for Data Science — Full Course',     channel:'freeCodeCamp.org',          dur:'12h',  url:'https://www.youtube.com/watch?v=LHBE6Q9XlzI' },
      { title:'Data Mining بالعربي',                       channel:'Dr. Emad',                  dur:'2h',   url:'https://www.youtube.com/watch?v=bPrmA1SEN2k' },
    ]
  },
  {
    name:'Algorithm Design', code:'CS-404', icon:'🧮', color:'#a07830',
    desc:'تصميم وتحليل الخوارزميات، Big O، Dynamic Programming، Graph Algorithms.',
    videos:[
      { title:'Algorithms & Data Structures Full Course',  channel:'freeCodeCamp.org',          dur:'5.5h', url:'https://www.youtube.com/watch?v=8hly31xKli0' },
      { title:'Data Structures Easy to Advanced',          channel:'William Fiset',             dur:'8h',   url:'https://www.youtube.com/watch?v=RBSGKlAvoiM' },
      { title:'Dynamic Programming — Learn to Solve',      channel:'freeCodeCamp.org',          dur:'5h',   url:'https://www.youtube.com/watch?v=oBt53YbR9Kk' },
      { title:'الخوارزميات بالعربي — Big O Notation',      channel:'Codezilla',                 dur:'1.5h', url:'https://www.youtube.com/watch?v=s-CYnVz-uh4' },
    ]
  },
  {
    name:'Technical English', code:'CS-405', icon:'🗣️', color:'#7eb3ff',
    desc:'اللغة الإنجليزية التقنية، مصطلحات IT، الكتابة الأكاديمية وتقديم المشاريع.',
    videos:[
      { title:'English for IT Professionals',              channel:'Oxford University Press ELT', dur:'2h', url:'https://www.youtube.com/watch?v=1bEqzARFLB8' },
      { title:'Academic Writing & Research',               channel:'Academic English Help',      dur:'3h',  url:'https://www.youtube.com/watch?v=z7wr9-bSjnE' },
      { title:'Technical Presentation Skills',             channel:'Skillshare',                 dur:'1h',  url:'https://www.youtube.com/watch?v=i68a6M5FFBc' },
      { title:'CS English Vocabulary — 100 Terms',         channel:'CS Dojo',                    dur:'45m', url:'https://www.youtube.com/watch?v=GVNyvtXVFJM' },
    ]
  },
  {
    name:'IoT', code:'CS-406', icon:'📡', color:'#00e676',
    desc:'إنترنت الأشياء، Arduino، Raspberry Pi، MQTT، الأنظمة المدمجة.',
    videos:[
      { title:'IoT Full Course 2024',                      channel:'Simplilearn',               dur:'8h',   url:'https://www.youtube.com/watch?v=h0gWfVCSGQQ' },
      { title:'Arduino Full Course for Beginners',         channel:'freeCodeCamp.org',          dur:'3h',   url:'https://www.youtube.com/watch?v=09zfRaLEasY' },
      { title:'Raspberry Pi Full Course',                  channel:'NetworkChuck',              dur:'4h',   url:'https://www.youtube.com/watch?v=T8t9GqIKFG8' },
      { title:'IoT بالعربي — من الصفر',                    channel:'أكاديمية حسوب',              dur:'2.5h', url:'https://www.youtube.com/watch?v=6mBO2XXI948' },
    ]
  }
];

const grid = document.getElementById('subjGrid');
SUBJECTS.forEach((s, i) => {
  const card = document.createElement('div');
  card.className = 'subj-card fade-in';
  card.style.animationDelay = (i * .08) + 's';
  card.innerHTML = `
    <div class="subj-head">
      <div class="subj-icon" style="background:${s.color}22;border:1px solid ${s.color}44;">${s.icon}</div>
      <div><div class="subj-name">${s.name}</div><div class="subj-code">${s.code}</div></div>
    </div>
    <div class="subj-desc">${s.desc}</div>
    <div class="videos-label">▶ فيديوهات مقترحة على YouTube</div>
    <div class="video-list">
      ${s.videos.map(v => `
        <a href="${v.url}" target="_blank" rel="noopener" class="video-item">
          <div class="yt-thumb">▶</div>
          <div class="video-info">
            <div class="video-title">${v.title}</div>
            <div class="video-channel">${v.channel}</div>
          </div>
          <div class="video-dur">${v.dur}</div>
        </a>`).join('')}
    </div>`;
  grid.appendChild(card);
});
