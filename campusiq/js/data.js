/* ══════════════════════════════════════════════
   CampusIQ — Data Layer
   File: js/data.js
   Replace mock arrays with real API calls here.
   ══════════════════════════════════════════════ */

/* ── FACULTY ──────────────────────────────────── */
const FACULTY_DB = [
  {
    id:"F001", name:"Dr. Anil Sharma", dept:"Computer Science",
    cabin:"Block A, Room 204", floor:2, building:"blockA",
    subjects:["DBMS","Operating Systems","Cloud Computing"],
    available:true, phone:"9876543210", email:"anil.sharma@college.edu",
    schedule:["Mon 10–12","Wed 2–4","Fri 10–11"],
    bio:"PhD (IIT Delhi). 18 years experience. Specializes in distributed systems."
  },
  {
    id:"F002", name:"Prof. Meena Patel", dept:"Electronics",
    cabin:"Block B, Room 110", floor:1, building:"blockB",
    subjects:["Circuit Theory","VLSI Design","Signal Processing"],
    available:false, phone:"9876543211", email:"meena.patel@college.edu",
    schedule:["Tue 9–11","Thu 3–5"],
    bio:"M.Tech (NIT Raipur). 12 years. Expert in VLSI & embedded systems."
  },
  {
    id:"F003", name:"Dr. Rajesh Kumar", dept:"Mathematics",
    cabin:"Block C, Room 305", floor:3, building:"blockC",
    subjects:["Calculus","Linear Algebra","Probability & Statistics"],
    available:true, phone:"9876543212", email:"rajesh.kumar@college.edu",
    schedule:["Mon 9–11","Wed 11–1","Fri 2–4"],
    bio:"PhD (IISc Bangalore). Research in Applied Mathematics & Cryptography."
  },
  {
    id:"F004", name:"Prof. Sunita Rao", dept:"Physics",
    cabin:"Block A, Room 102", floor:1, building:"blockA",
    subjects:["Engineering Physics","Optics","Quantum Mechanics"],
    available:true, phone:"9876543213", email:"sunita.rao@college.edu",
    schedule:["Tue 10–12","Thu 10–12"],
    bio:"M.Sc Physics (Pune Univ). 10 years. Research in photonics."
  },
  {
    id:"F005", name:"Dr. Vikram Singh", dept:"Civil Engineering",
    cabin:"Block D, Room 201", floor:2, building:"blockD",
    subjects:["Structural Analysis","Fluid Mechanics","Surveying"],
    available:false, phone:"9876543214", email:"vikram.singh@college.edu",
    schedule:["Mon 2–4","Wed 9–11"],
    bio:"PhD (IIT Bombay). Expert in structural design & earthquake engineering."
  },
  {
    id:"F006", name:"HOD Dr. Priya Nair", dept:"Computer Science",
    cabin:"Block A, Room 210 (HOD Office)", floor:2, building:"blockA",
    subjects:["Artificial Intelligence","Machine Learning","Data Science"],
    available:true, phone:"9876543215", email:"priya.nair@college.edu",
    schedule:["Mon 11–1","Fri 9–10"],
    bio:"PhD (IIT Madras). HOD — CSE Dept. Pioneer in AI/ML research."
  }
];

/* ── RESOURCES ────────────────────────────────── */
const RESOURCES_DB = [
  { id:"R001", name:"Computer Lab 1",  type:"Lab",          building:"Block A",    floor:1, room:"101", available:true,  capacity:60,  icon:"🖥️",  desc:"60 high-performance workstations, 1Gbps LAN" },
  { id:"R002", name:"Computer Lab 2",  type:"Lab",          building:"Block A",    floor:2, room:"201", available:false, capacity:40,  icon:"🖥️",  desc:"Linux lab, 40 systems, GPU-enabled" },
  { id:"R003", name:"Physics Lab",     type:"Lab",          building:"Block B",    floor:1, room:"105", available:true,  capacity:30,  icon:"⚗️",  desc:"Optics, mechanics & electromagnetism setups" },
  { id:"R004", name:"Central Library", type:"Library",      building:"Main Block", floor:0, room:"GF",  available:true,  capacity:200, icon:"📚",  desc:"50,000+ books, journals, 24/7 digital access" },
  { id:"R005", name:"Seminar Hall 1",  type:"Seminar Hall", building:"Main Block", floor:1, room:"101", available:true,  capacity:150, icon:"🎓",  desc:"AC hall, projector, PA system, 150 seats" },
  { id:"R006", name:"Seminar Hall 2",  type:"Seminar Hall", building:"Main Block", floor:2, room:"201", available:false, capacity:100, icon:"🎓",  desc:"Smart board, video conferencing, 100 seats" },
  { id:"R007", name:"Electronics Lab", type:"Lab",          building:"Block B",    floor:2, room:"210", available:true,  capacity:25,  icon:"🔌",  desc:"PCB design, oscilloscopes, signal analysers" },
  { id:"R008", name:"Exam Hall A",     type:"Hall",         building:"Block E",    floor:1, room:"101", available:false, capacity:300, icon:"🏛️",  desc:"Main exam hall, CCTV monitored" },
  { id:"R009", name:"Sports Complex",  type:"Sports",       building:"Ground",     floor:0, room:"Outdoor", available:true, capacity:500, icon:"⚽",  desc:"Indoor badminton + outdoor cricket/football" },
  { id:"R010", name:"Canteen",         type:"Canteen",      building:"Main Block", floor:0, room:"GF",  available:true,  capacity:150, icon:"🍽️",  desc:"Open 7:30AM–6PM · Veg & non-veg meals" }
];

/* ── CAMPUS MAP GRAPH ─────────────────────────── */
const CAMPUS_GRAPH = {
  nodes: [
    { id:"entrance",  label:"Main Entrance", x:400, y:430 },
    { id:"mainBlock", label:"Main Block",    x:400, y:340 },
    { id:"blockA",    label:"Block A",       x:220, y:240 },
    { id:"blockB",    label:"Block B",       x:360, y:190 },
    { id:"blockC",    label:"Block C",       x:510, y:240 },
    { id:"blockD",    label:"Block D",       x:600, y:310 },
    { id:"blockE",    label:"Block E",       x:550, y:160 },
    { id:"library",   label:"Library",       x:400, y:270 },
    { id:"canteen",   label:"Canteen",       x:290, y:370 },
    { id:"sports",    label:"Sports",        x:150, y:390 }
  ],
  edges: [
    { from:"entrance",  to:"mainBlock", w:2 },
    { from:"entrance",  to:"canteen",   w:3 },
    { from:"mainBlock", to:"blockA",    w:3 },
    { from:"mainBlock", to:"blockB",    w:2 },
    { from:"mainBlock", to:"blockC",    w:3 },
    { from:"mainBlock", to:"library",   w:1 },
    { from:"mainBlock", to:"canteen",   w:2 },
    { from:"blockA",    to:"blockB",    w:2 },
    { from:"blockB",    to:"blockC",    w:2 },
    { from:"blockC",    to:"blockD",    w:2 },
    { from:"blockD",    to:"blockE",    w:2 },
    { from:"blockB",    to:"blockE",    w:3 },
    { from:"blockA",    to:"sports",    w:3 }
  ]
};

/* ── CHATBOT KNOWLEDGE BASE ───────────────────── */
const CHATBOT_KB = [
  {
    patterns:["hod","head of department","hod cabin","hod office"],
    reply:"The HOD of Computer Science is <strong>Dr. Priya Nair</strong>. Her office is at <strong>Block A, Room 210</strong>. She is currently ✅ Available. Shall I show you the route?"
  },
  {
    patterns:["computer lab","comp lab","lab 1","lab1"],
    reply:"<strong>Computer Lab 1</strong> is in Block A, Room 101 (Floor 1) — 60 workstations, currently ✅ Open.<br><strong>Computer Lab 2</strong> is on Floor 2, Room 201 — Linux lab, currently 🔴 Occupied."
  },
  {
    patterns:["library","central library","book"],
    reply:"📚 <strong>Central Library</strong> is in the Main Block, Ground Floor. Open <strong>8AM–8PM</strong> Monday–Saturday. Capacity: 200. Currently ✅ Open."
  },
  {
    patterns:["seminar hall","seminar hall 2","hall 2","seminar 2"],
    reply:"🎓 <strong>Seminar Hall 1</strong> (Main Block, Floor 1) — 150 seats, ✅ Available.<br><strong>Seminar Hall 2</strong> (Floor 2) — 100 seats, 🔴 Occupied currently."
  },
  {
    patterns:["canteen","food","lunch","eat","cafeteria"],
    reply:"🍽️ <strong>Canteen</strong> is in the Main Block, Ground Floor. Open <strong>7:30AM–6PM</strong>. Serves breakfast, lunch & snacks."
  },
  {
    patterns:["dr sharma","anil sharma","sharma"],
    reply:"👨‍🏫 <strong>Dr. Anil Sharma</strong> (CSE) is in <strong>Block A, Room 204</strong>. Status: ✅ Available. Subjects: DBMS, OS, Cloud Computing. Next office hours: Mon 10–12."
  },
  {
    patterns:["dr kumar","rajesh kumar","math","maths","mathematics"],
    reply:"👨‍🏫 <strong>Dr. Rajesh Kumar</strong> (Mathematics) is in <strong>Block C, Room 305</strong>. Status: ✅ Available. Teaches Calculus, Linear Algebra, Statistics."
  },
  {
    patterns:["prof patel","meena patel","electronics"],
    reply:"👩‍🏫 <strong>Prof. Meena Patel</strong> (Electronics) is in <strong>Block B, Room 110</strong>. Status: 🔴 Busy. Schedule: Tue 9–11, Thu 3–5."
  },
  {
    patterns:["physics lab","physics"],
    reply:"⚗️ <strong>Physics Lab</strong> is in Block B, Room 105, Floor 1. Currently ✅ Available. Capacity: 30 students."
  },
  {
    patterns:["emergency","accident","fire","help","danger"],
    reply:"🚨 <strong>EMERGENCY:</strong> Campus Security: <strong>1800-CAMPUS</strong> | Medical Center: Block F, GF | Fire: 101 | Ambulance: 108.<br>Please use the <strong>Emergency page</strong> to send an instant alert!"
  },
  {
    patterns:["hello","hi","hey","good morning","good afternoon"],
    reply:"👋 Hello! I'm <strong>CampusAI</strong>. I can help you find faculty, labs, and navigate campus. Try: <em>'Where is the HOD?'</em> or <em>'Find Computer Lab'</em>."
  },
  {
    patterns:["navigate","how to reach","where is","location","find","go to"],
    reply:"Use the <strong>🗺 Navigation</strong> tab to get step-by-step directions using our Dijkstra routing engine. Or just tell me what you're looking for and I'll guide you!"
  },
  {
    patterns:["schedule","timetable","class","when"],
    reply:"📅 Faculty schedules are shown on each faculty card. Use the <strong>Faculty</strong> tab to search a name and see their full timetable."
  }
];

/* ── RECENT ACTIVITY ──────────────────────────── */
const RECENT_ACTIVITY = [
  { icon:"🔍", text:"Dr. Sharma's location was queried",             time:"2 min ago" },
  { icon:"🗺️", text:"Navigation to Computer Lab 1 completed",        time:"18 min ago" },
  { icon:"🤖", text:"Chatbot answered: 'Where is seminar hall 2?'",  time:"35 min ago" },
  { icon:"📍", text:"Prof. Patel updated availability to Busy",       time:"1 hr ago" },
  { icon:"🚨", text:"Emergency alert drill completed successfully",   time:"3 hr ago" },
  { icon:"🎓", text:"New student Rahul Verma registered",             time:"5 hr ago" }
];

/* ── STUDENTS (sample) ────────────────────────── */
const STUDENTS_DB = [
  { id:"S001", name:"Rahul Verma",   dept:"Computer Science",  queries:12, status:"Active" },
  { id:"S002", name:"Priya Joshi",   dept:"Electronics",       queries:7,  status:"Active" },
  { id:"S003", name:"Aman Gupta",    dept:"Mathematics",       queries:3,  status:"Inactive" },
  { id:"S004", name:"Sneha Patel",   dept:"Physics",           queries:15, status:"Active" },
  { id:"S005", name:"Karan Singh",   dept:"Civil Engineering", queries:5,  status:"Active" },
  { id:"S006", name:"Divya Sharma",  dept:"Computer Science",  queries:9,  status:"Active" },
  { id:"S007", name:"Rohit Mishra",  dept:"Electronics",       queries:2,  status:"Inactive" }
];
