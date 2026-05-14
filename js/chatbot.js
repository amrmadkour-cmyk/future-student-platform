/* ============================================================
   chatbot.js — Future Students | Chatbot Page Scripts
   ============================================================ */

ThemeManager.loadSaved();
const user = Auth.requireAuth();
if (!user) throw '';
Auth.applyTopbar(user);
buildSidebar('chatbot.html');

/* ── API KEY CHECK ── */
const apiKey = (typeof CONFIG !== 'undefined' && CONFIG.GROQ_API_KEY && CONFIG.GROQ_API_KEY !== 'YOUR_GROQ_API_KEY_HERE')
  ? CONFIG.GROQ_API_KEY : null;

const badge = document.getElementById('apiStatusBadge');
if (apiKey) {
  badge.textContent = '✅ API Key جاهز';
  badge.className   = 'api-status-badge api-ok';
} else {
  badge.textContent = '⚠️ أضف API Key في config.js';
  badge.className   = 'api-status-badge api-no';
}

let history = [];

/* ── HELPERS ── */
function getTime() {
  const n = new Date();
  return `${n.getHours()}:${String(n.getMinutes()).padStart(2,'0')}`;
}

function addMsg(text, role) {
  const msgs = document.getElementById('chatMsgs');
  const div  = document.createElement('div');
  div.className = `msg ${role}`;
  const av = role === 'user' ? user.name.charAt(0) : '🤖';
  div.innerHTML = `
    <div class="msg-av">${av}</div>
    <div>
      <div class="msg-bubble">${text.replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}</div>
      <div class="msg-time">${getTime()}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMsgs');
  const div  = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typingMsg';
  div.innerHTML = `<div class="msg-av">🤖</div><div class="typing-ind"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}
function hideTyping() { const t = document.getElementById('typingMsg'); if (t) t.remove(); }

/* ── SEND MESSAGE ── */
async function sendMsg() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text) return;
  if (!apiKey) {
    addMsg('⚠️ يرجى إضافة Groq API Key في ملف config.js أولاً.', 'bot');
    return;
  }
  input.value = '';
  input.style.height = 'auto';
  addMsg(text, 'user');
  history.push({ role:'user', content:text });
  document.getElementById('sendBtn').disabled = true;
  showTyping();

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':'Bearer ' + apiKey },
      body: JSON.stringify({
        model:      CONFIG.GROQ_MODEL || 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role:'system', content:`أنت مساعد تعليمي ذكي لمنصة Future Students في جامعة حلوان التكنولوجية الدولية (HITU)، قسم علوم الحاسب. تساعد الطلاب في: Cloud Computing, Web Development, Data Mining, Algorithm Design, Technical English, IoT. أجب دائماً بالعربية بأسلوب واضح ومحفز. استخدم الأمثلة والنقاط للشرح.` },
          ...history
        ]
      })
    });
    const data = await res.json();
    hideTyping();
    if (data.choices && data.choices[0]) {
      const reply = data.choices[0].message.content;
      history.push({ role:'assistant', content:reply });
      addMsg(reply, 'bot');
    } else if (data.error) {
      addMsg('❌ خطأ: ' + data.error.message, 'bot');
    }
  } catch (e) {
    hideTyping();
    addMsg('❌ حدث خطأ في الاتصال. تأكد من صحة API Key والإنترنت.', 'bot');
  }
  document.getElementById('sendBtn').disabled = false;
}

/* ── SUGGEST & CLEAR ── */
function suggest(btn) {
  document.getElementById('chatInput').value = btn.textContent;
  document.getElementById('chatInput').focus();
}

function clearChat() {
  history = [];
  document.getElementById('chatMsgs').innerHTML = `
    <div class="msg bot">
      <div class="msg-av">🤖</div>
      <div>
        <div class="msg-bubble">تم مسح المحادثة 🧹<br>كيف يمكنني مساعدتك؟</div>
        <div class="msg-time">${getTime()}</div>
      </div>
    </div>`;
}

/* ── EVENTS ── */
document.getElementById('chatInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
});
document.getElementById('chatInput').addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 100) + 'px';
});
