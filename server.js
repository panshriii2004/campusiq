const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin');

const app = express();
const PORT = 3000;

// --- 1. FIREBASE ADMIN SETUP ---
const serviceAccount = require("./firebase-key.json");
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// --- 2. MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'campusiq')));

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://localhost:3000; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;");
    next();
});

// --- 3. ROUTES ---

// REGISTRATION: Logic for Faculty vs Students
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, role, dept, password } = req.body;
    
    // Determine target collection
    const collectionName = (role === 'faculty' || role === 'professor') ? 'faculty' : 'students';
    const targetCollection = db.collection(collectionName);

    const userCheck = await targetCollection.where('email', '==', email).get();
    if (!userCheck.empty) return res.status(400).json({ message: `User already exists in ${collectionName}.` });

    const newUser = { 
      name, 
      email, 
      role: role || 'student', 
      dept, 
      password, 
      joinedAt: admin.firestore.FieldValue.serverTimestamp() 
    };

    await targetCollection.add(newUser);
    console.log(`✅ New registration: ${name} added to ${collectionName}`);
    res.status(201).json({ message: "Success", user: newUser });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Database Error" });
  }
});

// LOGIN: Updated to strictly use 'admins' plural
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Logic to select the correct collection
    let collectionName = 'students'; // default
    if (role === 'admin') collectionName = 'admins';
    else if (role === 'faculty' || role === 'professor') collectionName = 'faculty';

    console.log(`🔍 Login Request: Searching for [${email}] in collection [${collectionName}]`);

    const snapshot = await db.collection(collectionName).where('email', '==', email).limit(1).get();
    
    if (snapshot.empty) {
      console.log(`❌ Result: No account found in ${collectionName}`);
      return res.status(401).json({ message: `Account not found in ${collectionName} records.` });
    }

    const user = snapshot.docs[0].data();
    
    if (user.password !== password) {
      console.log(`❌ Result: Wrong password for ${email}`);
      return res.status(401).json({ message: "Invalid password" });
    }

    console.log(`✅ Result: Successful login for ${user.name}`);
    res.json({ message: "Welcome back", user: { id: snapshot.docs[0].id, ...user } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login Error" });
  }
});

// ADMIN CREATION: Private route for adding new admins
app.post('/api/admin/create', async (req, res) => {
  try {
    const { name, email, password, masterKey } = req.body;
    
    // Master Key Security
    if (masterKey !== "GEC_RAIPUR_ADMIN_2026") {
      return res.status(403).json({ message: "Unauthorized: Incorrect Master Key" });
    }

    const adminCheck = await db.collection('admins').where('email', '==', email).get();
    if (!adminCheck.empty) return res.status(400).json({ message: "Admin user already exists." });

    const newAdmin = { 
      name, 
      email, 
      password, 
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp() 
    };

    await db.collection('admins').add(newAdmin);
    console.log(`👑 New Admin Created: ${name}`);
    res.status(201).json({ message: "Admin Created Successfully" });
  } catch (error) { 
    console.error("Admin Create Error:", error);
    res.status(500).json({ message: "Error creating admin account" }); 
  }
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.listen(PORT, () => {
    console.log(`🚀 CampusIQ Server Live at http://localhost:${PORT}`);
    console.log(`📂 Collections: [students], [faculty], [admins]`);
});