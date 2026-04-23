/* ══════════════════════════════════════════════
   CampusIQ — AI Chatbot Engine
   File: js/chatbot.js
   ══════════════════════════════════════════════ */

let chatHistory = [];

/**
 * Get bot reply for user input
 */
function getBotReply(text) {
  const lower = text.toLowerCase().trim();

  // Knowledge base match
  for (const kb of CHATBOT_KB) {
    if (kb.patterns.some(p => lower.includes(p))) return kb.reply;
  }

  // Faculty name match
  for (const f of FACULTY_DB) {
    const lastName = f.name.split(' ').pop().toLowerCase();
    if (lower.includes(lastName) || lower.includes(f.name.toLowerCase())) {
      return `👨‍🏫 <strong>${f.name}</strong> (${f.dept}) is in <strong>${f.cabin}</strong>.
        Status: ${f.available ? '✅ Available' : '🔴 Busy'}.<br>
        Subjects: ${f.subjects.join(', ')}.<br>
        Schedule: ${f.schedule.join(' · ')}.`;
    }
  }

  // Resource name match
  for (const r of RESOURCES_DB) {
    const nameLower = r.name.toLowerCase();
    if (lower.includes(nameLower) || lower.includes(nameLower.split(' ')[0])) {
      return `📍 <strong>${r.name}</strong> is in ${r.building}, Floor ${r.floor}, Room ${r.room}.<br>
        Status: ${r.available ? '✅ Open' : '🔴 Occupied'}. Capacity: ${r.capacity} persons.`;
    }
  }

  // Fallback
  return `🤖 I'm not sure about that. You can try:<br>
    <em>"Where is the HOD?"</em><br>
    <em>"Find Computer Lab"</em><br>
    <em>"Is Dr. Sharma available?"</em><br>
    <em>"Navigate to library"</em>`;
}

/**
 * Append a message bubble to #chatMsgs
 */
function appendMessage(role, html) {
  const container = document.getElementById('chatMsgs');
  if (!container) return;
  const row = document.createElement('div');
  row.className = `msg-row ${role} fade-in`;
  row.innerHTML = `
    <div class="msg-avatar">${role === 'bot' ? '🤖' : '👤'}</div>
    <div class="msg-bubble">${html}</div>`;
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

/**
 * Show typing indicator, remove after delay, then show reply
 */
function showTypingThenReply(replyHtml) {
  const container = document.getElementById('chatMsgs');
  if (!container) return;

  const typingRow = document.createElement('div');
  typingRow.className = 'msg-row bot fade-in';
  typingRow.id = 'typingRow';
  typingRow.innerHTML = `
    <div class="msg-avatar">🤖</div>
    <div class="msg-bubble">
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>`;
  container.appendChild(typingRow);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    const tr = document.getElementById('typingRow');
    if (tr) tr.remove();
    appendMessage('bot', replyHtml);
  }, 1100);
}

/**
 * Main send handler — called by chat send button & Enter key
 */
function chatSend() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  appendMessage('user', text);
  chatHistory.push({ role:'user', text });

  const reply = getBotReply(text);
  chatHistory.push({ role:'bot', text: reply });
  showTypingThenReply(reply);
}

/**
 * Fill input with a quick prompt chip
 */
function quickPrompt(text) {
  const input = document.getElementById('chatInput');
  if (input) { input.value = text; input.focus(); }
}

/* ── VOICE (Web Speech API) ───────────────────── */
let recognition = null;
let isListening  = false;

function toggleVoice() {
  const btn = document.getElementById('voiceBtn');
  const status = document.getElementById('voiceStatus');

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast('Voice input not supported in this browser. Use Chrome.', 'error');
    return;
  }

  if (isListening) {
    recognition && recognition.stop();
    isListening = false;
    btn && btn.classList.remove('listening');
    if (status) status.textContent = 'Tap to use voice commands';
    return;
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening = true;
    btn && btn.classList.add('listening');
    if (status) status.textContent = '🔴 Listening… Speak now';
  };
  recognition.onresult = e => {
    const transcript = e.results[0][0].transcript;
    if (status) status.textContent = `Heard: "${transcript}"`;
    const input = document.getElementById('chatInput');
    if (input) { input.value = transcript; chatSend(); }
  };
  recognition.onerror = () => {
    showToast('Voice recognition error. Try again.', 'error');
  };
  recognition.onend = () => {
    isListening = false;
    btn && btn.classList.remove('listening');
  };
  recognition.start();
}
