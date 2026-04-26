/* ══════════════════════════════════════════════
    CampusIQ — Page Renderers
    File: js/pages.js
    Each function returns an HTML string for a page.
    ══════════════════════════════════════════════ */

/* ─── HELPERS ──────────────────────────────────── */
function availBadge(val) {
  return val
    ? `<span class="badge badge-green"><span class="dot dot-green"></span>Available</span>`
    : `<span class="badge badge-red"><span class="dot dot-red"></span>Busy</span>`;
}
function openBadge(val) {
  return val
    ? `<span class="badge badge-green"><span class="dot dot-green"></span>Open</span>`
    : `<span class="badge badge-red"><span class="dot dot-red"></span>Occupied</span>`;
}
function initials(name) {
  return name ? name.split(' ').filter(w => w).slice(0, 2).map(w => w[0]).join('') : '??';
}

/* ─── DASHBOARD ────────────────────────────────── */
function pageDashboard() {
  const avail  = FACULTY_DB.filter(f => f.available).length;
  const open   = RESOURCES_DB.filter(r => r.available).length;
  const now    = new Date();
  const greet  = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = now.toDateString();

  const actHTML = RECENT_ACTIVITY.map(a => `
    <div class="activity-item">
      <div class="activity-icon">${a.icon}</div>
      <div>
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>`).join('');

  const resHTML = RESOURCES_DB.slice(0, 6).map(r => `
    <div class="toggle-row">
      <div>
        <div class="text-sm font-bold">${r.name}</div>
        <div class="text-xs text2">${r.building}</div>
      </div>
      ${openBadge(r.available)}
    </div>`).join('');

  return `
  <div class="page fade-in">
    <div class="hero-banner">
      <div class="hero-title">${greet}, ${window.currentUser ? window.currentUser.name.split(' ')[0] : 'User'} 👋</div>
      <div class="hero-sub">${dateStr} · CampusIQ Smart System · ${(window.currentUser?.role||'').toUpperCase()}</div>
    </div>

    <div class="stats-row stagger">
      <div class="stat-card fade-in"><div class="stat-num c-accent">${avail}</div><div class="stat-label">Faculty Available</div></div>
      <div class="stat-card fade-in"><div class="stat-num c-green">${open}</div><div class="stat-label">Resources Open</div></div>
      <div class="stat-card fade-in"><div class="stat-num c-warn">${FACULTY_DB.length}</div><div class="stat-label">Total Faculty</div></div>
      <div class="stat-card fade-in"><div class="stat-num c-purple">${RESOURCES_DB.length}</div><div class="stat-label">Campus Resources</div></div>
      <div class="stat-card fade-in"><div class="stat-num c-green">99.9%</div><div class="stat-label">System Uptime</div></div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">⚡ Recent Activity</div>
        ${actHTML}
      </div>
      <div class="card">
        <div class="card-title">📊 Resource Status</div>
        ${resHTML}
      </div>
    </div>
  </div>`;
}

/* ─── FACULTY PAGE ─────────────────────────────── */
function pageFaculty() {
  const cards = FACULTY_DB.map(f => `
    <div class="faculty-card" onclick='openFacultyModal("${f.id}")'>
      <div class="faculty-header">
        <div class="faculty-avatar">${initials(f.name)}</div>
        <div>
          <div class="faculty-name">${f.name}</div>
          <div class="faculty-dept">${f.dept}</div>
        </div>
        <div class="ms-auto">${availBadge(f.available)}</div>
      </div>
      <div class="faculty-info">
        <div class="faculty-row">📍 <span>${f.cabin}</span></div>
        <div class="faculty-row">📚 <span>${f.subjects.join(', ')}</span></div>
        <div class="faculty-row">📅 <span>${f.schedule[0]}</span></div>
      </div>
      <div class="faculty-actions">
        <button class="btn btn-primary btn-sm" onclick='event.stopPropagation();openNavModal("entrance","${f.building}","${f.name}&rsquo;s Cabin")'>🗺 Navigate</button>
        <button class="btn btn-ghost btn-sm" onclick='event.stopPropagation();openFacultyModal("${f.id}")'>👁 Details</button>
      </div>
    </div>`).join('');

  return `
  <div class="page fade-in">
    <div class="page-header">
      <div class="page-title">👨‍🏫 Faculty Directory</div>
      <div class="page-subtitle">Search faculty, check availability, and get cabin directions</div>
    </div>
    <div class="header-actions">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search by name, department, or subject…" oninput="filterFaculty(this.value)" id="facultySearch"/>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="filterFacultyStatus('all')">All</button>
      <button class="btn btn-ghost btn-sm" onclick="filterFacultyStatus('available')">✅ Available</button>
      <button class="btn btn-ghost btn-sm" onclick="filterFacultyStatus('busy')">🔴 Busy</button>
    </div>
    <div class="grid-auto stagger" id="facultyGrid">${cards}</div>
  </div>`;
}

function filterFaculty(q) {
  const lower = q.toLowerCase();
  const grid  = document.getElementById('facultyGrid');
  if (!grid) return;
  const filtered = q
    ? FACULTY_DB.filter(f => f.name.toLowerCase().includes(lower) || f.dept.toLowerCase().includes(lower) || f.subjects.some(s => s.toLowerCase().includes(lower)))
    : FACULTY_DB;
  renderFacultyCards(filtered, grid);
}

function filterFacultyStatus(status) {
  const grid = document.getElementById('facultyGrid');
  if (!grid) return;
  const list = status === 'available' ? FACULTY_DB.filter(f => f.available)
             : status === 'busy'       ? FACULTY_DB.filter(f => !f.available)
             : FACULTY_DB;
  renderFacultyCards(list, grid);
}

function renderFacultyCards(list, grid) {
  if (!list.length) { grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>No faculty found.</p></div>'; return; }
  grid.innerHTML = list.map(f => `
    <div class="faculty-card" onclick='openFacultyModal("${f.id}")'>
      <div class="faculty-header">
        <div class="faculty-avatar">${initials(f.name)}</div>
        <div><div class="faculty-name">${f.name}</div><div class="faculty-dept">${f.dept}</div></div>
        <div class="ms-auto">${availBadge(f.available)}</div>
      </div>
      <div class="faculty-info">
        <div class="faculty-row">📍 <span>${f.cabin}</span></div>
        <div class="faculty-row">📚 <span>${f.subjects.join(', ')}</span></div>
        <div class="faculty-row">📅 <span>${f.schedule[0]}</span></div>
      </div>
      <div class="faculty-actions">
        <button class="btn btn-primary btn-sm" onclick='event.stopPropagation();openNavModal("entrance","${f.building}","${f.name}&rsquo;s Cabin")'>🗺 Navigate</button>
        <button class="btn btn-ghost btn-sm" onclick='event.stopPropagation();openFacultyModal("${f.id}")'>👁 Details</button>
      </div>
    </div>`).join('');
}

/* ─── RESOURCES PAGE ───────────────────────────── */
function pageResources() {
  const types   = ['All', ...new Set(RESOURCES_DB.map(r => r.type))];
  const typeIcons = { Lab:'🔬', Library:'📚', 'Seminar Hall':'🎓', Hall:'🏛️', Sports:'⚽', Canteen:'🍽️' };

  const filterBtns = types.map(t =>
    `<button class="btn btn-ghost btn-sm" onclick="filterResType('${t}',this)">${typeIcons[t]||'📌'} ${t}</button>`
  ).join('');

  const cards = RESOURCES_DB.map(r => `
    <div class="resource-card" onclick='openResourceModal("${r.id}")'>
      <div class="resource-icon">${r.icon}</div>
      <div class="flex items-center gap-8 mb-8">
        <span class="resource-name">${r.name}</span>
        <span class="ms-auto">${openBadge(r.available)}</span>
      </div>
      <div class="resource-loc">📍 ${r.building}, Floor ${r.floor}, Room ${r.room}</div>
      <div class="resource-desc">${r.desc}</div>
      <div class="flex items-center gap-8">
        <span class="badge badge-blue">👥 ${r.capacity}</span>
        <button class="btn btn-primary btn-sm ms-auto" onclick='event.stopPropagation();openNavModal("entrance","mainBlock","${r.name}")'>🗺 Navigate</button>
      </div>
    </div>`).join('');

  return `
  <div class="page fade-in">
    <div class="page-header">
      <div class="page-title">🏫 Campus Resources</div>
      <div class="page-subtitle">Find labs, library, seminar halls, and all campus facilities</div>
    </div>
    <div class="header-actions">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search resources…" oninput="filterResSearch(this.value)"/>
      </div>
    </div>
    <div class="filter-row" id="resFilterRow">${filterBtns}</div>
    <div class="grid-auto stagger" id="resourceGrid">${cards}</div>
  </div>`;
}

function filterResType(type, btn) {
  document.querySelectorAll('#resFilterRow .btn').forEach(b => b.className = 'btn btn-ghost btn-sm');
  if (btn) btn.className = 'btn btn-primary btn-sm';
  const list = type === 'All' ? RESOURCES_DB : RESOURCES_DB.filter(r => r.type === type);
  renderResourceCards(list);
}

function filterResSearch(q) {
  const lower = q.toLowerCase();
  const list  = q ? RESOURCES_DB.filter(r => r.name.toLowerCase().includes(lower) || r.building.toLowerCase().includes(lower)) : RESOURCES_DB;
  renderResourceCards(list);
}

function renderResourceCards(list) {
  const grid = document.getElementById('resourceGrid');
  if (!grid) return;
  if (!list.length) { grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🏫</div><p>No resources found.</p></div>'; return; }
  grid.innerHTML = list.map(r => `
    <div class="resource-card" onclick='openResourceModal("${r.id}")'>
      <div class="resource-icon">${r.icon}</div>
      <div class="flex items-center gap-8 mb-8">
        <span class="resource-name">${r.name}</span>
        <span class="ms-auto">${openBadge(r.available)}</span>
      </div>
      <div class="resource-loc">📍 ${r.building}, Floor ${r.floor}, Room ${r.room}</div>
      <div class="resource-desc">${r.desc}</div>
      <div class="flex items-center gap-8">
        <span class="badge badge-blue">👥 ${r.capacity}</span>
        <button class="btn btn-primary btn-sm ms-auto" onclick='event.stopPropagation();openNavModal("entrance","mainBlock","${r.name}")'>🗺 Navigate</button>
      </div>
    </div>`).join('');
}

/* ─── NAVIGATION PAGE ──────────────────────────── */
function pageNavigation() {
  const nodeOptions = CAMPUS_GRAPH.nodes.map(n => `<option value="${n.id}">${n.label}</option>`).join('');
  return `
  <div class="page fade-in">
    <div class="page-header">
      <div class="page-title">🗺 Indoor Navigation</div>
      <div class="page-subtitle">Step-by-step directions using Dijkstra shortest-path algorithm</div>
    </div>
    <div class="grid-2">
      <div>
        <div class="card mb-16" style="margin-bottom:16px">
          <div class="card-title">🧭 Set Route</div>
          <div class="form-group">
            <label class="form-label">From</label>
            <select class="form-input" id="navFrom">${nodeOptions}</select>
          </div>
          <div class="form-group">
            <label class="form-label">To</label>
            <select class="form-input" id="navTo">
              ${CAMPUS_GRAPH.nodes.map((n,i) => `<option value="${n.id}" ${i===2?'selected':''}>${n.label}</option>`).join('')}
            </select>
          </div>
          <button class="btn btn-primary w-full" onclick="calcRoute()">🗺 Calculate Route</button>
        </div>
        <div class="nav-panel" id="navSteps">
          <p class="text2 text-sm">Select From → To and click Calculate Route.</p>
        </div>
      </div>
      <div>
        <div id="mapContainer">${buildMapSVG(null)}</div>
        <div class="map-legend">
          <div class="legend-item"><div class="legend-dot" style="background:#10b981"></div> Start</div>
          <div class="legend-item"><div class="legend-dot" style="background:#ef4444"></div> End</div>
          <div class="legend-item"><div class="legend-dot" style="background:#7c3aed"></div> Waypoint</div>
          <div class="legend-item"><div class="legend-dot" style="background:#1e2d45"></div> Location</div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ─── CHATBOT PAGE ─────────────────────────────── */
function pageChatbot() {
  const quickPrompts = ["Where is the HOD?","Computer Lab location","Is Dr. Sharma available?","Navigate to library","Seminar Hall 2","Emergency help"];
  const chipsHTML = quickPrompts.map(q => `<div class="quick-chip" onclick="quickPrompt('${q}')">${q}</div>`).join('');

  return `
  <div class="page fade-in">
    <div class="page-header">
      <div class="page-title">🤖 AI Campus Chatbot</div>
      <div class="page-subtitle">Ask anything about faculty, resources, or campus navigation</div>
    </div>
    <div class="grid-2">
      <div class="chat-wrap">
        <div class="chat-head">
          <span style="font-size:26px">🤖</span>
          <div>
            <div style="font-weight:700">CampusAI</div>
            <div style="font-size:11px;color:var(--text2);display:flex;gap:6px;align-items:center">
              <div class="chat-ai-dot"></div> Online · NLP Navigation Assistant
            </div>
          </div>
          <button class="btn btn-ghost btn-sm ms-auto" onclick="chatHistory=[];document.getElementById('chatMsgs').innerHTML='';appendMessage('bot','Chat cleared! How can I help?')">🗑 Clear</button>
        </div>
        <div class="chat-msgs" id="chatMsgs">
          <div class="msg-row bot fade-in">
            <div class="msg-avatar">🤖</div>
            <div class="msg-bubble">👋 Hello! I'm <strong>CampusAI</strong>. Ask me about faculty locations, labs, navigation, or anything about the campus!</div>
          </div>
        </div>
        <div class="chat-quick">${chipsHTML}</div>
        <div class="chat-input-row">
          <input class="chat-input" id="chatInput" placeholder="Ask about faculty, labs, directions…" onkeydown="if(event.key==='Enter')chatSend()"/>
          <button class="chat-send" onclick="chatSend()">➤</button>
        </div>
      </div>

      <div>
        <div class="card mb-16" style="margin-bottom:16px">
          <div class="card-title">🎙 Voice Assistant</div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:18px;padding:20px 0">
            <button class="voice-btn" id="voiceBtn" onclick="toggleVoice()">🎙</button>
            <div class="wave-bars" id="waveBars" style="display:none">
              <div class="wave-bar"></div><div class="wave-bar"></div>
              <div class="wave-bar"></div><div class="wave-bar"></div>
            </div>
            <div style="color:var(--text2);font-size:13px" id="voiceStatus">Tap to use voice commands</div>
            <div class="callout" style="width:100%;margin:0">
              Try saying: <em>"Take me to the library"</em> or <em>"Find Dr. Sharma"</em>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-title">💡 Sample Questions</div>
          ${["Where is the HOD cabin?","Guide me to Computer Lab","Is Dr. Sharma available?","Where is Seminar Hall 2?","Navigate to the library","Find Physics Lab"].map(q =>
            `<div class="activity-item pointer" onclick="quickPrompt('${q}');document.getElementById('chatInput').focus()">
              <div class="activity-icon">💬</div>
              <div class="activity-text">"${q}"</div>
              <div class="ms-auto text3" style="font-size:18px">↗</div>
            </div>`
          ).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

/* ─── EMERGENCY PAGE ───────────────────────────── */
function pageEmergency() {
  const contacts = [
    { name:"Campus Security", info:"1800-CAMPUS",   icon:"🛡️" },
    { name:"Medical Center",  info:"Block F, GF",   icon:"🏥" },
    { name:"Fire Control",    info:"101",            icon:"🚒" },
    { name:"Police",          info:"100",            icon:"🚔" },
    { name:"Ambulance",       info:"108",            icon:"🚑" },
    { name:"Principal Office",info:"0771-2345678",   icon:"👔" }
  ];
  const contactsHTML = contacts.map(c => `
    <div class="toggle-row">
      <div class="flex items-center gap-12">
        <span style="font-size:22px">${c.icon}</span>
        <div>
          <div class="text-sm font-bold">${c.name}</div>
          <div class="text-xs text2">${c.info}</div>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="showToast('Calling ${c.name}…','info')">📞 Call</button>
    </div>`).join('');

  const types = [
    { label:"Medical Emergency", icon:"🏥", bg:"rgba(220,38,38,.15)",  border:"rgba(220,38,38,.4)",  color:"#fca5a5" },
    { label:"Fire / Smoke",      icon:"🔥", bg:"rgba(234,88,12,.15)",  border:"rgba(234,88,12,.4)",  color:"#fdba74" },
    { label:"Security Threat",   icon:"⚠️", bg:"rgba(124,58,237,.15)", border:"rgba(124,58,237,.4)", color:"#c4b5fd" },
    { label:"Accident",          icon:"🚑", bg:"rgba(245,158,11,.15)", border:"rgba(245,158,11,.4)", color:"#fde68a" }
  ];
  const typeHTML = types.map(t =>
    `<button class="emergency-type-btn" style="background:${t.bg};border-color:${t.border};color:${t.color}"
      onclick="sendAlert('${t.label}')">${t.icon}<span>${t.label}</span></button>`
  ).join('');

  return `
  <div class="page fade-in">
    <div class="page-header">
      <div class="page-title danger">🚨 Emergency Locator</div>
      <div class="page-subtitle">Quick emergency alerts, location sharing, and evacuation guidance</div>
    </div>

    <div id="alertSentBox" class="hidden alert-sent">
      <div style="font-size:52px;margin-bottom:12px">🚨</div>
      <div class="page-title danger mb-8" style="margin-bottom:8px">ALERT SENT!</div>
      <div class="text2 mb-16" id="alertTypeLabel" style="margin-bottom:16px"></div>
      <div class="callout danger" style="text-align:left">Security has been notified. Your location has been shared. Help is on the way. Stay calm and follow evacuation signs.</div>
      <button class="btn btn-ghost" style="margin-top:16px" onclick="resetAlert()">Reset</button>
    </div>

    <div id="alertControls">
      <div class="grid-4 mb-16" style="margin-bottom:16px">${typeHTML}</div>
      <button class="emergency-big" onclick="sendAlert('General Emergency')">
        🚨 SEND EMERGENCY ALERT — CLICK TO ACTIVATE
      </button>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">📞 Emergency Contacts</div>
        ${contactsHTML}
      </div>
      <div class="card">
        <div class="card-title">🚪 Evacuation Route</div>
        ${buildMapSVG(['blockA','mainBlock','entrance'], 260)}
        <div class="callout success" style="margin-top:12px;margin-bottom:0">
          ✅ Blue path = nearest exit route. Follow green EXIT signs on corridors.
        </div>
      </div>
    </div>
  </div>`;
}

/* ─── FACULTY DASHBOARD ────────────────────────── */
function pageFacultyDash() {
  const f = FACULTY_DB[0]; // In real app, match logged-in user
  const schedHTML = f.schedule.map((s, i) => `
    <div class="activity-item">
      <div class="activity-icon">📘</div>
      <div>
        <div class="activity-text">${s} — ${f.subjects[i % f.subjects.length]}</div>
        <div class="activity-time">Scheduled class</div>
      </div>
      <span class="badge badge-blue ms-auto">Class</span>
    </div>`).join('');

  return `
  <div class="page fade-in">
    <div class="hero-banner">
      <div class="hero-title">Faculty Dashboard — ${f.name}</div>
      <div class="hero-sub">${f.dept} · ${f.cabin}</div>
    </div>
    <div class="grid-2">
      <div>
        <div class="card mb-16" style="margin-bottom:16px">
          <div class="card-title">👤 Profile & Status</div>
          <div class="toggle-row">
            <div>
              <div class="text-sm font-bold">Availability Status</div>
              <div class="text-xs text2">Visible to all students in real-time</div>
            </div>
            <label class="toggle">
              <input type="checkbox" ${f.available?'checked':''} onchange="showToast('Availability updated!','success')"/>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div style="padding:12px 0">
            ${f.available
              ? `<span class="badge badge-green" style="font-size:13px;padding:8px 16px">✅ Currently AVAILABLE</span>`
              : `<span class="badge badge-red"   style="font-size:13px;padding:8px 16px">🔴 Currently BUSY/AWAY</span>`}
          </div>
        </div>
        <div class="card">
          <div class="card-title">📩 Student Queries <span class="badge badge-warn" style="font-size:11px">3 Pending</span></div>
          ${["Where is your cabin?","When is your next free slot?"].map(q => `
            <div class="activity-item">
              <div class="activity-icon">🎓</div>
              <div>
                <div class="activity-text">${q}</div>
                <div class="activity-time">Student query · Just now</div>
              </div>
              <button class="btn btn-ghost btn-sm ms-auto" onclick="showToast('Reply sent!','success')">Reply</button>
            </div>`).join('')}
        </div>
      </div>
      <div>
        <div class="card mb-16" style="margin-bottom:16px">
          <div class="card-title">📅 My Schedule</div>
          ${schedHTML}
        </div>
      </div>
    </div>
  </div>`;
}

/* ─── ADMIN DASHBOARD ──────────────────────────── */
function pageAdmin() {
  return `
  <div class="page fade-in">
    <div class="page-header">
      <div class="page-title">⚙️ Admin Control Panel</div>
      <div class="page-subtitle">Full campus management, analytics and system configuration</div>
    </div>
    <div class="tabs" id="adminTabs">
      <button class="tab-btn active" onclick="switchAdminTab('overview',this)">Overview</button>
      <button class="tab-btn" onclick="switchAdminTab('faculty',this)">Faculty</button>
      <button class="tab-btn" onclick="switchAdminTab('students',this)">Students</button>
      <button class="tab-btn" onclick="switchAdminTab('resources',this)">Resources</button>
      <button class="tab-btn" onclick="switchAdminTab('analytics',this)">Analytics</button>
      <button class="tab-btn" onclick="switchAdminTab('security',this)">🔐 Security</button>
    </div>
    <div id="adminTabContent">${adminOverview()}</div>
  </div>`;
}

function switchAdminTab(tab, btn) {
  document.querySelectorAll('#adminTabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById('adminTabContent');
  const map = { 
    overview: adminOverview, 
    faculty: adminFaculty, 
    students: adminStudents, 
    resources: adminResources, 
    analytics: adminAnalytics,
    security: adminSecurity 
  };
  content.innerHTML = map[tab] ? map[tab]() : '';
  content.classList.add('fade-in');
}

function adminOverview() {
  const sysFeatures = [["AI Chatbot","Enabled"],["Voice Assistant","Enabled"],["Emergency Alerts","Enabled"],["Auto-Navigation","Enabled"],["QR Code Navigation","Enabled"]];
  return `
  <div class="fade-in">
    <div class="stats-row">
      <div class="stat-card"><div class="stat-num c-accent">${FACULTY_DB.length}</div><div class="stat-label">Total Faculty</div></div>
      <div class="stat-card"><div class="stat-num c-green">1,247</div><div class="stat-label">Students</div></div>
      <div class="stat-card"><div class="stat-num c-warn">${RESOURCES_DB.length}</div><div class="stat-label">Resources</div></div>
      <div class="stat-card"><div class="stat-num c-purple">5</div><div class="stat-label">Buildings</div></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-title">🏗 Campus Management</div>
        ${["Upload Campus Map","Add New Block","Configure Nodes","Set Emergency Protocols"].map((a,i) =>
          `<button class="btn btn-ghost w-full" style="justify-content:flex-start;margin-bottom:8px" onclick="showToast('Opening: ${a}','info')">
            ${["🗺","🏢","📍","🚨"][i]} ${a}
          </button>`).join('')}
      </div>
      <div class="card">
        <div class="card-title">⚙️ System Features</div>
        ${sysFeatures.map(([name,status]) => `
          <div class="toggle-row">
            <div class="text-sm font-bold">${name}</div>
            <span class="badge ${status==="Enabled"?"badge-green":"badge-red"}">${status}</span>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function adminFaculty() {
  return `
  <div class="fade-in">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
       <h3 style="margin:0;">Manage Faculty Members</h3>
       <button class="btn btn-primary btn-sm" onclick="openFacultyEditor()">+ Add Faculty</button>
    </div>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>Name</th><th>Dept</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody id="adminFacultyTableBody">
          ${FACULTY_DB.map(f => `
            <tr>
              <td><strong>${f.name}</strong></td>
              <td>${f.dept}</td>
              <td>${f.available ? '✅ Available' : '🔴 Busy'}</td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="editFaculty('${f.id}')">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEntry('faculty', '${f.id}')">🗑</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function adminStudents() {
  return `
  <div class="fade-in">
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Status</th></tr></thead>
        <tbody>
          ${STUDENTS_DB.map(s => `
            <tr>
              <td><span class="badge badge-purple">${s.id}</span></td>
              <td><strong>${s.name}</strong></td>
              <td>${s.dept}</td>
              <td>${s.status==='Active'?'<span class="badge badge-green">Active</span>':'<span class="badge badge-red">Inactive</span>'}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function adminResources() {
  return `
  <div class="fade-in">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
       <h3 style="margin:0;">Manage Campus Facilities</h3>
       <button class="btn btn-primary btn-sm" onclick="openResourceEditor()">+ Add Resource</button>
    </div>
    <div class="table-container">
      <table class="data-table">
        <thead><tr><th>Resource Name</th><th>Building</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${RESOURCES_DB.map(r => `
            <tr>
              <td>${r.icon} <strong>${r.name}</strong></td>
              <td>${r.building}</td>
              <td>${r.available ? '🟢 Open' : '🔴 Occupied'}</td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="editResource('${r.id}')">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEntry('resources', '${r.id}')">🗑</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function adminAnalytics() {
  const topRes = [["Computer Lab 1","34%"],["Central Library","28%"]];
  return `
  <div class="fade-in">
    <div class="grid-2">
      <div class="card">
        <div class="card-title">📊 Top Resources</div>
        ${topRes.map(([n,p]) => `
          <div style="margin-bottom:14px">
            <div class="flex items-center gap-8 mb-8">
              <span class="text-sm">${n}</span><span class="ms-auto text-xs text2">${p}</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${p};background:var(--accent)"></div></div>
          </div>`).join('')}
      </div>
    </div>
  </div>`;
}

/* ─── SECURITY / ADMIN PROVISIONING ─────────── */
function adminSecurity() {
  return `
  <div class="fade-in">
    <div class="admin-panel">
      <div class="card mb-24">
        <div class="card-title">🔐 Admin Provisioning</div>
        <p class="text2 text-sm mb-16" style="margin-bottom:16px">
          Create new administrative accounts. This action requires the <strong>Master Secret Key</strong>.
        </p>
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" id="newAdminName" class="form-input" placeholder="e.g. Pankaj Shrivas">
        </div>
        <div class="form-group">
          <label class="form-label">Admin Email</label>
          <input type="email" id="newAdminEmail" class="form-input" placeholder="admin@campusiq.edu">
        </div>
        <div class="form-group">
          <label class="form-label">Set Password</label>
          <input type="password" id="newAdminPass" class="form-input" placeholder="••••••••">
        </div>
        <div class="form-group">
          <label class="form-label">Master Secret Key</label>
          <input type="password" id="masterKey" class="form-input" placeholder="Enter System Master Key">
        </div>
        <button class="btn btn-primary btn-full mt-12" onclick="createNewAdmin()">Create Admin Account</button>
      </div>
      
      <div class="callout warn">
        <strong>Security Note:</strong> New admins will have full access to campus configurations, faculty data, and student records.
      </div>
    </div>
  </div>`;
}

/* ─── MODAL OPENERS ────────────────────────────── */
function openFacultyModal(id) {
  const f = FACULTY_DB.find(x => x.id === id);
  if (!f) return;
  document.getElementById('modalTitle').textContent = '👨‍🏫 Faculty Details';
  document.getElementById('modalBody').innerHTML = `
    <div class="faculty-header" style="margin-bottom:20px">
      <div class="faculty-avatar" style="width:56px;height:56px;font-size:20px">${initials(f.name)}</div>
      <div>
        <div class="faculty-name" style="font-size:18px">${f.name}</div>
        <div class="faculty-dept">${f.dept}</div>
      </div>
      <div class="ms-auto">${availBadge(f.available)}</div>
    </div>
    ${[['📍 Cabin',f.cabin],['📧 Email',f.email],['📚 Subjects',f.subjects.join(', ')]]
      .map(([k,v]) => `<div class="info-row"><span class="info-label">${k}</span><span class="info-value">${v}</span></div>`)
      .join('')}
    <div style="margin-top:16px;display:flex;gap:10px">
      <button class="btn btn-primary" onclick='closeModal();openNavModal("entrance","${f.building}","${f.name}&rsquo;s Cabin")'>🗺 Navigate</button>
      <button class="btn btn-ghost" onclick="closeModal()">Close</button>
    </div>`;
  openModal();
}

function openResourceModal(id) {
  const r = RESOURCES_DB.find(x => x.id === id);
  if (!r) return;
  document.getElementById('modalTitle').textContent = '🏫 Resource Details';
  document.getElementById('modalBody').innerHTML = `
    <div style="font-size:40px;margin-bottom:12px">${r.icon}</div>
    <div style="font-size:18px;font-weight:700;margin-bottom:6px">${r.name}</div>
    ${openBadge(r.available)}
    <div style="margin-top:16px">
      ${[['📍 Location',`${r.building}, Room ${r.room}`],['👥 Capacity',`${r.capacity} persons`]]
        .map(([k,v]) => `<div class="info-row"><span class="info-label">${k}</span><span class="info-value">${v}</span></div>`)
        .join('')}
    </div>
    <button class="btn btn-ghost" style="margin-top:16px" onclick="closeModal()">Close</button>`;
  openModal();
}

function openNavModal(from, to, label) {
  const path = dijkstra(from, to);
  document.getElementById('modalTitle').textContent = `🗺 Route to ${label}`;
  document.getElementById('modalBody').innerHTML = `
    <div class="callout" style="margin-bottom:14px">Navigating to: <strong>${label}</strong></div>
    ${buildMapSVG(path, 260)}
    <div style="margin-top:12px">${path ? buildStepsHTML(path) : 'Route unavailable.'}</div>
    <button class="btn btn-ghost" style="margin-top:14px" onclick="closeModal()">Close</button>`;
  openModal();
}