const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const __dirname = path.resolve();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'matches.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// Load initial data
let matchesData = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    matchesData = JSON.parse(data);
  } catch (error) {
    console.error('Error loading matches data:', error);
    matchesData = [];
  }
}

// Save data function
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(matchesData, null, 2));
  } catch (error) {
    console.error('Error saving matches data:', error);
  }
}

// API Routes
app.get('/api/matches', (req, res) => {
  res.json(matchesData);
});

app.get('/api/matches/:sport', (req, res) => {
  const sport = req.params.sport;
  const filtered = matchesData.filter(match => match.sport === sport);
  res.json(filtered);
});

app.post('/api/matches/:id/score', (req, res) => {
  const matchId = req.params.id;
  const { teamA, teamB } = req.body;
  
  const matchIndex = matchesData.findIndex(match => match.matchId === matchId);
  if (matchIndex === -1) {
    return res.status(404).json({ error: 'Match not found' });
  }
  
  matchesData[matchIndex].teamA.score = teamA;
  matchesData[matchIndex].teamB.score = teamB;
  
  saveData();
  
  // Broadcast update to all connected clients
  io.emit('score-updated', matchesData[matchIndex]);
  
  res.json({ success: true, match: matchesData[matchIndex] });
});

app.post('/api/matches/:id/status', (req, res) => {
  const matchId = req.params.id;
  const { status } = req.body;
  
  const matchIndex = matchesData.findIndex(match => match.matchId === matchId);
  if (matchIndex === -1) {
    return res.status(404).json({ error: 'Match not found' });
  }
  
  matchesData[matchIndex].status = status;
  
  saveData();
  
  // Broadcast update to all connected clients
  io.emit('status-changed', matchesData[matchIndex]);
  
  res.json({ success: true, match: matchesData[matchIndex] });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current match data to new client
  socket.emit('match-data', matchesData);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});