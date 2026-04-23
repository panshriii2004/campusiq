/* ══════════════════════════════════════════════
   CampusIQ — Navigation Engine (Dijkstra)
   File: js/navigation.js
   ══════════════════════════════════════════════ */

/**
 * Dijkstra shortest path on CAMPUS_GRAPH
 * @param {string} start - node id
 * @param {string} end   - node id
 * @returns {string[]|null} - ordered array of node ids, or null
 */
function dijkstra(start, end) {
  const dist = {}, prev = {}, visited = new Set();
  const adj  = {};

  CAMPUS_GRAPH.nodes.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; adj[n.id] = []; });
  CAMPUS_GRAPH.edges.forEach(e => {
    adj[e.from].push({ node: e.to,   w: e.w });
    adj[e.to  ].push({ node: e.from, w: e.w });
  });
  dist[start] = 0;

  const queue = [start];
  while (queue.length) {
    queue.sort((a, b) => dist[a] - dist[b]);
    const u = queue.shift();
    if (u === end) break;
    if (visited.has(u)) continue;
    visited.add(u);
    (adj[u] || []).forEach(({ node: v, w }) => {
      const alt = dist[u] + w;
      if (alt < dist[v]) { dist[v] = alt; prev[v] = u; queue.push(v); }
    });
  }

  const path = [];
  let cur = end;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  return (path.length > 1 && path[0] === start) ? path : null;
}

/**
 * Build an SVG campus map with optional highlighted path
 * @param {string[]|null} path - highlighted path node ids
 * @param {number} h           - svg height
 * @returns {string} - SVG markup string
 */
function buildMapSVG(path, h = 380) {
  const nodeMap = {};
  CAMPUS_GRAPH.nodes.forEach(n => nodeMap[n.id] = n);

  const nodeIcons = {
    entrance:"🚪", library:"📚", canteen:"🍽️", sports:"⚽",
    mainBlock:"M", blockA:"A", blockB:"B", blockC:"C", blockD:"D", blockE:"E"
  };

  let svg = `<svg viewBox="0 80 680 390" class="map-canvas" style="height:${h}px">
  <defs>
    <filter id="glow-f">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
      <path d="M0,0 L0,8 L8,4 z" fill="#00d4ff" opacity=".7"/>
    </marker>
  </defs>`;

  // Grid
  for (let i = 0; i < 10; i++) {
    svg += `<line x1="${i*80}" y1="0" x2="${i*80}" y2="600" stroke="#1e2d45" stroke-width="0.8"/>`;
  }
  for (let i = 0; i < 8; i++) {
    svg += `<line x1="0" y1="${i*80}" x2="800" y2="${i*80}" stroke="#1e2d45" stroke-width="0.8"/>`;
  }

  // Edges
  CAMPUS_GRAPH.edges.forEach(e => {
    const from = nodeMap[e.from], to = nodeMap[e.to];
    const inPath = path && path.includes(e.from) && path.includes(e.to) &&
                   Math.abs(path.indexOf(e.from) - path.indexOf(e.to)) === 1;
    svg += `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"
      stroke="${inPath ? '#00d4ff' : '#1e2d45'}"
      stroke-width="${inPath ? 3 : 1.5}"
      stroke-dasharray="${inPath ? '7 4' : 'none'}"
      ${inPath ? 'marker-end="url(#arrow)"' : ''}/>`;
  });

  // Nodes
  CAMPUS_GRAPH.nodes.forEach(n => {
    const inPath  = path && path.includes(n.id);
    const isStart = path && path[0] === n.id;
    const isEnd   = path && path[path.length - 1] === n.id;
    const r       = inPath ? 15 : 11;
    const fill    = isEnd ? '#ef4444' : isStart ? '#10b981' : inPath ? '#7c3aed' : '#131d2e';
    const stroke  = inPath ? '#00d4ff' : '#1e2d45';
    const lbl     = nodeIcons[n.id] || n.label.substring(0, 2);

    svg += `<g ${inPath ? 'filter="url(#glow-f)"' : ''}>
      <circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
      <text x="${n.x}" y="${n.y + 5}" text-anchor="middle"
        fill="${inPath ? '#fff' : '#94a3b8'}" font-size="9" font-weight="700">${lbl}</text>
      <text x="${n.x}" y="${n.y + 26}" text-anchor="middle"
        fill="${inPath ? '#00d4ff' : '#475569'}" font-size="8.5">${n.label}</text>
    </g>`;
  });

  svg += `</svg>`;
  return svg;
}

/**
 * Generate human-readable turn-by-turn step list HTML
 * @param {string[]} path
 * @returns {string}
 */
function buildStepsHTML(path) {
  if (!path || path.length < 2) return '<p class="text2 text-sm">No route found.</p>';
  const nodeMap = {};
  CAMPUS_GRAPH.nodes.forEach(n => nodeMap[n.id] = n);

  let html = '';
  path.forEach((id, i) => {
    const node = nodeMap[id];
    const isFirst = i === 0;
    const isLast  = i === path.length - 1;
    const next    = path[i + 1] ? nodeMap[path[i + 1]] : null;
    const desc    = isFirst ? 'Start from here'
                  : isLast  ? '🏁 You have arrived!'
                  : `Continue towards ${next ? next.label : ''}`;

    html += `<div class="nav-step">
      <div class="step-num">${i + 1}</div>
      <div>
        <div class="step-text">${node.label}</div>
        <div class="step-sub">${desc}</div>
      </div>
      ${isFirst ? '<span class="badge badge-green ms-auto">Start</span>' : ''}
      ${isLast  ? '<span class="badge badge-red ms-auto">End</span>'   : ''}
    </div>`;
  });

  const eta = path.length * 2;
  html += `<p class="text-sm text2" style="padding-top:12px">⏱ Estimated walk: ${eta}–${eta + 2} minutes</p>`;
  return html;
}
