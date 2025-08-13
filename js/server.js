const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const basicAuth = require('basic-auth');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database file
const DATA_FILE = path.join(__dirname, 'data', 'contacts.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE));
}

// Create empty file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}

// Simple authentication middleware
const authMiddleware = (req, res, next) => {
  const credentials = basicAuth(req);
  
  // Replace these with your actual admin credentials
  const validUsername = 'admin';
  const validPassword = 'robotics123';

  if (!credentials || credentials.name !== validUsername || credentials.pass !== validPassword) {
    res.set('WWW-Authenticate', 'Basic realm="Admin Access"');
    return res.status(401).send('Authentication required');
  }
  next();
};

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const contacts = JSON.parse(fs.readFileSync(DATA_FILE));
  
  contacts.push({
    id: Date.now(),
    name,
    email,
    subject: subject || 'No subject',
    message,
    date: new Date().toISOString()
  });
  
  fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2));
  res.json({ success: true });
});

// Get all messages (protected)
app.get('/api/messages', authMiddleware, (req, res) => {
  try {
    const messages = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

// Delete a message (protected)
app.delete('/api/messages/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  let messages = JSON.parse(fs.readFileSync(DATA_FILE));
  
  messages = messages.filter(msg => msg.id != id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
  
  res.json({ success: true });
});

// Serve admin panel
app.get('/admin*', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'admin.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});