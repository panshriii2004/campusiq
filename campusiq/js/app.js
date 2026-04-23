/* ══════════════════════════════════════════════
   CampusIQ — Main Application Controller
   File: js/app.js
   ══════════════════════════════════════════════ */

/* ─── STATE & CONFIG ─── */
const API_URL = "http://localhost:3000/api";
let currentRole = 'student';      
let registrationRole = 'student'; 
window.currentUser = null;

/* ─── AUTH UI TOGGLE ─── */
function toggleAuthMode(mode) {
  const loginFields = document.getElementById('loginFields');
  const signupFields = document.getElementById('signupFields');
  const btnLogin = document.getElementById('btnShowLogin');
  const btnSignup = document.getElementById('btnShowSignup');

  if (mode === 'signup') {
    loginFields.classList.add('hidden');
    signupFields.classList.remove('hidden');
    btnLogin.classList.remove('active');
    btnSignup.classList.add('active');
  } else {
    loginFields.classList.remove('hidden');
    signupFields.classList.add('hidden');
    btnLogin.classList.add('active');
    btnSignup.classList.remove('active');
  }
}

/* ─── LOGIN & REGISTRATION ─── */

function selectRole(role, btn) {
  currentRole = role;
  document.querySelectorAll('#roleTabs .role-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function selectRegRole(role, btn) {
  registrationRole = role;
  const parent = document.getElementById('regRoleTabs');
  if (parent) {
    parent.querySelectorAll('.role-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
}

async function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showToast('Please enter credentials.', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    // DEBUG: View exactly what the server sends
    console.log("DEBUG: Data received from server:", data);

    if (response.ok && data.user) {
      window.currentUser = data.user;
      enterApp();
    } else {
      showToast(data.message || "Invalid Login Credentials", "error");
    }
  } catch (err) {
    showToast("Server Connection Failed", "error");
    console.error("Connection Error:", err);
  }
}

async function doRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const dept = document.getElementById('regDept').value;

  if (!name || !email || !password) {
    showToast('Please fill all required fields.', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        role: registrationRole || 'student', // Fallback to 'student'
        dept: dept
      })
    });

    const data = await response.json();

    if (response.ok) {
      window.currentUser = data.user;
      enterApp();
    } else {
      showToast(data.message || "Registration Failed", "error");
    }
  } catch (err) {
    showToast("Server Connection Failed", "error");
  }
}

/* ─── APP TRANSITION LOGIC ─── */

function enterApp() {
  if (!window.currentUser) return;

  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('appShell').classList.remove('hidden');
  
  buildSidebar();
  navigate('dashboard');
  
  showToast(`Welcome, ${window.currentUser.name}! 👋`, 'success');
}

function doLogout() {
  window.currentUser = null;
  document.getElementById('appShell').classList.add('hidden');
  document.getElementById('loginPage').classList.remove('hidden');
  document.querySelectorAll('.form-input').forEach(i => i.value = '');
  toggleAuthMode('login');
  showToast('Logged out.', 'info');
}

/* ─── SIDEBAR & ROUTING ─── */

const NAV_ITEMS = [
  { id:'dashboard',    icon:'⊞',  label:'Dashboard',      roles:['student', 'faculty', 'professor', 'admin'] },
  { id:'faculty',      icon:'👨‍🏫', label:'Faculty',        roles:['student', 'admin'] },
  { id:'resources',    icon:'🏫', label:'Resources',       roles:['student', 'admin'] },
  { id:'navigation',   icon:'🗺', label:'Navigation',      roles:['student', 'faculty', 'professor', 'admin'] },
  { id:'chatbot',      icon:'🤖', label:'AI Chatbot',      roles:['student', 'faculty', 'professor', 'admin'] },
  { id:'emergency',    icon:'🚨', label:'Emergency',       roles:['student', 'faculty', 'professor', 'admin'] },
  { id:'faculty-dash', icon:'📊', label:'My Dashboard',    roles:['faculty', 'professor'] },
  { id:'admin',        icon:'⚙️', label:'Admin Panel',     roles:['admin'] }
];

function buildSidebar() {
  const user = window.currentUser;
  // If role is missing, use 'student' as a temporary safety fallback
  const role = user?.role || 'student'; 
  
  const navEl = document.getElementById('navItems');
  const chipEl = document.getElementById('userChip');
  if (!navEl || !chipEl) return;

  navEl.innerHTML = NAV_ITEMS.filter(n => n.roles.includes(role)).map(n =>
    `<button class="nav-btn" id="nav_${n.id}" onclick="navigate('${n.id}')">
        <span class="nav-icon">${n.icon}</span><span class="nav-label">${n.label}</span>
     </button>`).join('');

  chipEl.innerHTML = `
    <div class="user-avatar">${user.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
    <div class="user-info">
      <div class="user-name">${user.name}</div>
      <div class="user-role" style="text-transform: capitalize;">${role}</div>
    </div>`;
}

function navigate(pageId) {
  const user = window.currentUser;
  const item = NAV_ITEMS.find(n => n.id === pageId);

  // Use student as fallback if role is undefined to avoid app crash
  const userRole = user?.role || 'student';

  if (item && !item.roles.includes(userRole)) {
    console.error("Access Denied. User Role:", userRole, "Required:", item.roles);
    showToast('Access denied.', 'error');
    return;
  }

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`nav_${pageId}`);
  if (btn) btn.classList.add('active');

  const renderer = PAGE_MAP[pageId];
  const content = document.getElementById('mainContent');
  if (renderer && content) content.innerHTML = renderer();
}

const PAGE_MAP = { 
  dashboard: pageDashboard, 
  faculty: pageFaculty, 
  resources: pageResources, 
  navigation: pageNavigation, 
  chatbot: pageChatbot, 
  emergency: pageEmergency, 
  'faculty-dash': pageFacultyDash, 
  admin: pageAdmin 
};

/* ─── UTILS ─── */
function openModal() { document.getElementById('modalOverlay').classList.remove('hidden'); }
function closeModal() { document.getElementById('modalOverlay').classList.add('hidden'); }
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `${type==='success'?'✅':type==='error'?'❌':'ℹ️'} ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c CampusIQ — Active ⬡', 'color:#00d4ff;font-weight:bold;');
});