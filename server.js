const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const DATA_PATH = path.join(__dirname, 'data', 'users.json');
app.use(express.static('public'));
app.use(express.json());

// Ensure users.json exists
if (!fs.existsSync(DATA_PATH)) {
  fs.writeFileSync(DATA_PATH, '[]', 'utf8');
}

// Get registered users
app.get('/api/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync(DATA_PATH));
  res.json(users);
});

// Register user
app.post('/api/register', (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) return res.status(400).json({ error: "Missing fields" });

  let users = JSON.parse(fs.readFileSync(DATA_PATH));
  if (users.find(u => u.number === number)) {
    return res.status(409).json({ error: "Number already exists" });
  }

  if (users.length >= 500) {
    return res.status(403).json({ error: "Registration is full" });
  }

  users.push({ name, number });
  fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2), 'utf8');
  res.json({ message: "Registered successfully" });
});
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
