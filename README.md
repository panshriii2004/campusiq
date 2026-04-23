# ⬡ CampusIQ — Smart Campus Navigation & Resource System

A fully web-based (HTML + CSS + JS) campus management system.
No framework, no build tools, no Node.js required. Just open in a browser!

---

## 🚀 How to Run in VS Code

### Option 1 — Live Server (Recommended)
1. Open the `campusiq/` folder in VS Code
2. Install the **Live Server** extension (Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. Opens at `http://127.0.0.1:5500`

### Option 2 — Direct Browser
1. Double-click `index.html`
2. Opens directly in your browser (some features need a server)

### Option 3 — VS Code Go Live button
- Click **Go Live** in the VS Code status bar (bottom right)

---

## 📁 Project Structure

```
campusiq/
├── index.html              ← Main entry point
├── css/
│   ├── style.css           ← Core styles, layout, components
│   ├── components.css      ← Extra component styles
│   └── animations.css      ← All @keyframe animations
├── js/
│   ├── data.js             ← All mock data (faculty, resources, map)
│   ├── navigation.js       ← Dijkstra algorithm + SVG map builder
│   ├── chatbot.js          ← AI chatbot engine + voice assistant
│   ├── pages.js            ← All page HTML renderers
│   └── app.js              ← App controller: routing, auth, modal, toast
└── README.md
```

---

## 🔑 Demo Login Credentials

| Role    | Email         | Password   |
|---------|---------------|------------|
| Student | any@email.com | any        |
| Faculty | any@email.com | any        |
| Admin   | any@email.com | any        |

Just select the role tab, enter any email, any password, and click Sign In.

---

## 📦 Modules Included

| Module              | Status |
|---------------------|--------|
| Student Login       | ✅ |
| Faculty Login       | ✅ |
| Admin Login         | ✅ |
| Faculty Directory   | ✅ |
| Campus Resources    | ✅ |
| Indoor Navigation   | ✅ (Dijkstra Algorithm) |
| AI Chatbot          | ✅ (NLP Pattern Matching) |
| Voice Assistant     | ✅ (Web Speech API) |
| Emergency Locator   | ✅ |
| Admin Analytics     | ✅ |
| Faculty Dashboard   | ✅ |
| Interactive SVG Map | ✅ |
| Toast Notifications | ✅ |
| Modal Popups        | ✅ |

---

## ✏️ How to Customize

### Change Faculty Data
Edit `js/data.js` → `FACULTY_DB` array.

### Change Resources
Edit `js/data.js` → `RESOURCES_DB` array.

### Change Campus Map
Edit `js/data.js` → `CAMPUS_GRAPH` (nodes + edges).

### Change Colors/Theme
Edit `css/style.css` → `:root` CSS variables at the top.

### Add New Pages
1. Add a renderer function in `js/pages.js`
2. Add a nav item in `js/app.js` → `NAV_ITEMS`
3. Add to `PAGE_MAP` in `js/app.js`

### Add Chatbot Responses
Edit `js/data.js` → `CHATBOT_KB` array.
Add `{ patterns: [...], reply: "..." }` objects.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+1   | Dashboard |
| Ctrl+2   | Faculty |
| Ctrl+3   | Resources |
| Ctrl+4   | Navigation |
| Ctrl+5   | Chatbot |
| Ctrl+6   | Emergency |
| Esc      | Close Modal |

---

## 🌐 Production Deployment

Upload the entire `campusiq/` folder to any static host:
- **Netlify**: Drag & drop the folder at netlify.com/drop
- **Vercel**: `vercel deploy`
- **GitHub Pages**: Push to repo, enable Pages
- **Any web server**: Copy files to `public_html/` or `www/`

No build step required. Pure HTML/CSS/JS.

---

## 🔧 Backend Integration (Future)

Replace mock data in `js/data.js` with `fetch()` API calls:

```javascript
// Example: Replace FACULTY_DB with real API
async function loadFaculty() {
  const res  = await fetch('https://your-api.com/faculty');
  const data = await res.json();
  // use data instead of FACULTY_DB
}
```

Suggested backend stack: Node.js + Express + MongoDB

---

Made with ❤️ for CampusIQ Smart Navigation System
