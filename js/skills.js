/* ============================================================
   skills.js — Future Students | Skills Page Scripts
   ============================================================ */

ThemeManager.loadSaved();
const user = Auth.requireAuth();
if (!user) throw '';
Auth.applyTopbar(user);
buildSidebar('skills.html');

const SKILLS = [
  // BEGINNER
  { name:'HTML & CSS',          icon:'🌐', cat:'Web',          level:'b', desc:'بناء صفحات الويب بـ HTML5 وتنسيقها بـ CSS3 وFlexbox وGrid.',                    prog:30, tags:['HTML5','CSS3','Flexbox','Grid'] },
  { name:'Python Basics',       icon:'🐍', cat:'Programming',  level:'b', desc:'متغيرات، حلقات، دوال، ملفات، مكتبات Python الأساسية.',                           prog:30, tags:['Python','Variables','Loops','Functions'] },
  { name:'Git & GitHub',        icon:'🔧', cat:'DevOps',       level:'b', desc:'إدارة الكود المصدري، Commits، Branches، Pull Requests.',                           prog:35, tags:['Git','GitHub','Commits','Branches'] },
  { name:'Linux CLI',           icon:'🐧', cat:'Systems',      level:'b', desc:'أوامر Linux الأساسية، الملفات، الصلاحيات، الـ Scripts.',                           prog:28, tags:['Linux','Bash','Terminal','Commands'] },
  { name:'SQL Basics',          icon:'🗄️', cat:'Databases',    level:'b', desc:'SELECT, INSERT, UPDATE, DELETE, JOIN في MySQL.',                                  prog:32, tags:['SQL','MySQL','JOIN','CRUD'] },
  { name:'Networking 101',      icon:'🌍', cat:'Networks',     level:'b', desc:'IP, TCP/IP, DNS, HTTP/HTTPS، OSI Model.',                                          prog:25, tags:['TCP/IP','DNS','HTTP','OSI'] },
  { name:'Arduino',             icon:'🔌', cat:'IoT',          level:'b', desc:'برمجة Arduino، ربط المستشعرات، التحكم بـ GPIO.',                                   prog:30, tags:['Arduino','C++','Sensors','GPIO'] },
  { name:'Markdown',            icon:'📝', cat:'Docs',         level:'b', desc:'كتابة توثيق احترافي، README، تقارير تقنية.',                                       prog:20, tags:['Markdown','README','Docs'] },
  // INTERMEDIATE
  { name:'JavaScript ES6+',     icon:'⚡', cat:'Frontend',     level:'i', desc:'Promises, Async/Await, Classes, Modules، DOM.',                                   prog:60, tags:['ES6','Promises','Async','DOM'] },
  { name:'React.js',            icon:'⚛️', cat:'Frontend',     level:'i', desc:'Components, Hooks, State Management, React Router.',                               prog:60, tags:['React','Hooks','Redux','JSX'] },
  { name:'Python Data Analysis',icon:'📊', cat:'Data',         level:'i', desc:'Pandas, NumPy, Matplotlib, تحليل وتصوير البيانات.',                                prog:55, tags:['Pandas','NumPy','Matplotlib','Jupyter'] },
  { name:'REST APIs',           icon:'🔗', cat:'Backend',      level:'i', desc:'تصميم وبناء REST APIs، JSON, Postman, Swagger.',                                  prog:58, tags:['REST','JSON','Postman','Swagger'] },
  { name:'AWS Basics',          icon:'☁️', cat:'Cloud',        level:'i', desc:'EC2, S3, Lambda, RDS, IAM، خدمات AWS الأساسية.',                                  prog:55, tags:['AWS','EC2','S3','Lambda'] },
  { name:'Machine Learning',    icon:'🤖', cat:'AI/ML',        level:'i', desc:'Regression, Classification, Clustering, Scikit-learn.',                            prog:55, tags:['Scikit-learn','ML','Training','Models'] },
  { name:'Docker',              icon:'🐳', cat:'DevOps',       level:'i', desc:'Containers, Images, Dockerfile, Docker Compose.',                                  prog:60, tags:['Docker','Containers','Images','Compose'] },
  { name:'Node.js & Express',   icon:'🟩', cat:'Backend',      level:'i', desc:'بناء Servers وAPIs بـ Node.js وExpress.js.',                                      prog:58, tags:['Node.js','Express','NPM','Backend'] },
  // ADVANCED
  { name:'Kubernetes',          icon:'☸️', cat:'DevOps',       level:'a', desc:'Container Orchestration, Pods, Deployments, Helm.',                               prog:85, tags:['K8s','Pods','Helm','Cluster'] },
  { name:'Deep Learning',       icon:'🧠', cat:'AI/ML',        level:'a', desc:'Neural Networks, CNN, RNN, Transformers, TensorFlow.',                             prog:80, tags:['TensorFlow','PyTorch','CNN','NLP'] },
  { name:'Microservices',       icon:'🏗️', cat:'Architecture', level:'a', desc:'Distributed Systems, Message Queues, gRPC, Service Mesh.',                        prog:82, tags:['Microservices','Kafka','gRPC','RabbitMQ'] },
  { name:'Cybersecurity',       icon:'🔐', cat:'Security',     level:'a', desc:'Penetration Testing, OWASP Top 10, Cryptography, SIEM.',                          prog:80, tags:['Security','OWASP','Pentesting','Encryption'] },
  { name:'Blockchain',          icon:'⛓️', cat:'Web3',         level:'a', desc:'Smart Contracts, Solidity, Ethereum, DeFi.',                                      prog:78, tags:['Blockchain','Solidity','Ethereum','Web3'] },
  { name:'Advanced Algorithms', icon:'🧮', cat:'CS Theory',    level:'a', desc:'DP, Graph Theory, NP-Complete, Approximation.',                                   prog:85, tags:['DP','Graphs','Complexity','Optimization'] },
  { name:'Apache Spark',        icon:'💥', cat:'Big Data',     level:'a', desc:'Big Data Processing, RDDs, DataFrames, Spark Streaming.',                         prog:80, tags:['Spark','Hadoop','HDFS','Hive'] },
  { name:'Cloud Architecture',  icon:'🏛️', cat:'Cloud',        level:'a', desc:'Multi-Cloud, Serverless, IaC (Terraform), Well-Architected.',                    prog:83, tags:['Architecture','Serverless','Terraform','Multi-Cloud'] },
];

const LABEL = { b:'🟢 مبتدئ', i:'🟡 متوسط', a:'🔴 متقدم' };
let curLevel = 'all';

function filterLevel(level, btn) {
  curLevel = level;
  document.querySelectorAll('.lvl-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  render();
}

function render() {
  const list = curLevel === 'all' ? SKILLS : SKILLS.filter(s => s.level === curLevel);
  const grid = document.getElementById('skillsGrid');
  grid.innerHTML = list.map((s, i) => `
    <div class="skill-card ${s.level} fade-in" style="animation-delay:${i*.04}s">
      <div class="sk-head">
        <div class="sk-icon">${s.icon}</div>
        <div><div class="sk-name">${s.name}</div><div class="sk-cat">${s.cat}</div></div>
      </div>
      <span class="sk-badge ${s.level}">${LABEL[s.level]}</span>
      <p class="sk-desc">${s.desc}</p>
      <div class="sk-bar"><div class="sk-fill" style="width:0%" data-w="${s.prog}%"></div></div>
      <div class="sk-tags">${s.tags.map(t => `<span class="sk-tag">${t}</span>`).join('')}</div>
    </div>`).join('');
  setTimeout(() => document.querySelectorAll('.sk-fill').forEach(b => { b.style.width = b.dataset.w; }), 80);
}

render();
