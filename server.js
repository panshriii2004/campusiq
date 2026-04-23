const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// --- GLOBAL DATABASE (In-Memory) ---
// Declared at the top so all routes can access it
let users = []; 

// 1. Middleware
app.use(cors({
    origin: ["http://localhost:5501", "https://your-github-username.github.io"],
    methods: ["GET", "POST"],
    credentials: true
})); // Allows cross-origin requests from port 5501
app.use(express.json()); // Parses incoming JSON data

// 2. Content Security Policy (CSP)
// Updated to allow 'data:' for the favicon and local connections
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "connect-src 'self' http://localhost:3000; " +
        "img-src 'self' data:; " + 
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com;"
    );
    next();
});

// 3. Static Folder
// Serves your frontend files from the 'campusiq' folder
app.use(express.static(path.join(__dirname, 'campusiq')));

// --- ROUTES ---

// Registration Route
app.post('/api/register', (req, res) => {
    try {
        const { name, email, role, dept, password } = req.body;
        
        // Safety check for existing users
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user object - role defaults to 'student' if missing
        const newUser = { 
            id: Date.now(), 
            name, 
            email, 
            role: role || 'student', 
            dept, 
            password 
        };

        users.push(newUser);
        console.log("✅ User Saved to Memory:", newUser.name, `(${newUser.role})`); 
        
        res.status(201).json({ message: "Success", user: newUser });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Login Route
app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email);

        // Find user with matching credentials
        const user = users.find(u => u && u.email === email && u.password === password);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        console.log("🔑 Login successful for:", user.name);
        res.json({ message: "Welcome back", user: user });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Favicon Helper (Silences 404s)
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 CampusIQ Server running at http://localhost:${PORT}`);
    console.log(`📂 Serving frontend from: ${path.join(__dirname, 'campusiq')}`);
});