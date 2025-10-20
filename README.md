# 🎯 Tic Tac Toe Multiplayer - Real-Time Gaming Platform
A full-stack, real-time multiplayer Tic Tac Toe game built with modern web technologies. Experience seamless gameplay with live opponent matching, private rooms, and competitive leaderboards.

Play Now: [https://lila-tictactoe.vercel.app](https://lila-tictactoe.vercel.app)

---

## ✨ Features

### 🎮 Core Gameplay
- Real-time Multiplayer: Play against opponents worldwide with instant moves
- Quick Match System: Automatic opponent matching with intelligent queue
- Private Rooms: Create and share rooms with friends using unique codes
- Live Game State: Synchronized game state across all players
- Turn-Based Mechanics: Smooth turn transitions with visual indicators

### 🏆 Competitive Features
- Leaderboard System: Track wins, losses, and rankings
- Game Statistics: Personal performance analytics
- Win/Loss Tracking: Comprehensive game history
- Player Profiles: Persistent player identity

### 🎨 User Experience
- Responsive Design: Optimized for desktop and mobile devices
- Beautiful Animations: Smooth transitions and winning animations
- Real-time Notifications: Toast messages for game events
- Intuitive UI: Clean, modern interface with Tailwind CSS
- Dark Theme: Eye-friendly dark mode design

### ⚡ Technical Excellence
- Instant Matching: Efficient queue system for quick gameplay
- Connection Management: Automatic reconnection handling
- Game Persistence: Resume interrupted games
- Error Handling: Comprehensive error management

---

## 🛠 Tech Stack

### Frontend
- Next.js 14 - React framework with App Router
- TypeScript - Type-safe JavaScript
- React - UI library with hooks
- Tailwind CSS - Utility-first CSS framework
- Framer Motion - Animation library
- Axios - HTTP client for API calls
- React Hot Toast - Notification system

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- Socket.IO - Real-time bidirectional communication
- MongoDB - NoSQL database
- Mongoose - MongoDB object modeling
- UUID - Unique identifier generation
- CORS - Cross-origin resource sharing

### Infrastructure & APIs
- RESTful APIs - Game data management
- WebSocket - Real-time game communication
- Vercel - Deployment platform
- Environment Variables - Secure configuration

---

## 🏗 Project Architecture

```bash
tic-tac-toe-multiplayer/
├── app/                          # Next.js App Router
│   ├── api/                     # REST API endpoints
│   │   ├── games/               # Game data management
│   │   └── leaderboard/         # Leaderboard data
│   ├── play/                    # Game pages
│   │   ├── game/               # Main game interface
│   │   ├── room/               # Private room management
│   │   └── search/             # Opponent search
│   ├── leaderboard/            # Rankings page
│   └── layout.tsx             # Root layout
├── components/                 # React components
│   ├── playWithOpponent/      # Game components
│   ├── common/               # Shared components
│   └── winAnimations/        # Victory animations
├── context/                  # React contexts
│   └── SocketContext.tsx    # Socket.IO management
├── lib/                     # Utility libraries
│   ├── dbConnect.ts        # Database connection
│   └── motion.ts          # Animation config
├── models/                 # Database models
│   └── Game.ts           # Game schema
├── server/                # Socket.IO server
│   ├── services/         # Business logic
│   ├── gameLogic.js     # Game rules engine
│   └── index.js        # Socket server entry
└── types/              # TypeScript definitions
```

---

## 🚀 Installation & Setup
### Prerequisites
- Node.js 18+
- MongoDB database
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/ADNUKUNHOME/LILA-MULTIPLAYER-TICTACTOE.git
cd LILA-MULTIPLAYER-TICTACTOE
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create .env.local in the root directory:
```bash
NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:4000
MONGODB_URI=your-mongodb-url...
```

Create .env in the server folder:
```bash
MONGODB_URI=your-mongodb-url...
PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Start Development Servers
```bash
# Terminal 1 - Start Next.js frontend (port 3000)
npm run dev

# Terminal 2 - Start Socket.IO server (port 4000)
npm run start-server
```

### 5. Access the Application
```bash
Frontend: http://localhost:3000
Socket Server: http://localhost:4000
API Endpoints: http://localhost:3000/api/*
```

---

## 🎯 How to Play
### Quick Match
- Enter your player name
- Click "Quick Match"
- Wait for opponent matching
- Play in real-time!

### Private Room
- Click "Create Private Room"
- Share the room code with a friend
- Friend joins using "Join Room"
- Private game starts automatically

### Game Rules
- Traditional 3x3 Tic Tac Toe rules
- X always goes first (randomly assigned)
- Three in a row wins (horizontal, vertical, diagonal)
- Draw when board is full with no winner


---

## 🔌 API Documentation
### 🧩 Game Management API
| **Endpoint**        | **Method** | **Description**       | **Body / Params** |
|----------------------|------------|------------------------|-------------------|
| `/api/games`         | **POST**   | Save a game result     | `GameData` (JSON) |
| `/api/games`         | **GET**    | Fetch all games        | Query parameters (optional) |
| `/api/leaderboard`   | **GET**    | Get leaderboard data    | - |


### 🔄 Socket.IO Events

| **Event**        | **Direction**     | **Data**                            | **Description**                     |
|------------------|------------------|-------------------------------------|-------------------------------------|
| `join_queue`     | Client → Server  | `{ playerId, playerName }`          | Join matchmaking queue              |
| `leave_queue`    | Client → Server  | -                                   | Leave the matchmaking queue         |
| `match_found`    | Server → Client  | Game data object                    | Notify players when match is found  |
| `playerMove`     | Client → Server  | `{ room, index, symbol }`           | Send player move to server          |
| `opponentMove`   | Server → Client  | Move data object                    | Update opponent’s move on board     |
| `game_over`      | Server → Client  | Result data object                  | Broadcast game result               |
| `turn_update`    | Server → Client  | `{ currentTurn }`                   | Update active player’s turn         |


---

## 🎮 Game Flow
### 1. Player Authentication
```bash
// Auto-generate player ID if not exists
const playerId = localStorage.getItem('playerId') || nanoid();
localStorage.setItem('playerId', playerId);
```

### 2. Matchmaking Process
```bash
// Join queue
socket.emit('join_queue', { playerId, playerName });

// Server matches opponents
const game = gameManager.createGame(player1, player2);

// Both players receive game data
socket.emit('match_found', {
  room: game.room,
  players: game.players,
  yourSymbol: assignedSymbol,
  currentTurn: game.turn
});
```

### 3. Gameplay Loop
```bash
// Player makes move
socket.emit('playerMove', { room, index, symbol });

// Server validates and broadcasts
const result = gameManager.makeMove(room, playerId, index, symbol);

// Update all clients
io.to(room).emit('opponentMove', {
  index, symbol, board: game.board, nextTurn: game.turn
});
```

### 4. Game Completion
```bash
// Check winner
const winner = checkWinner(game.board);

// Save to database
await gameManager.saveGameCompletion(game, winner);

// Notify players
io.to(room).emit('game_over', {
  winner, board: game.board, winningLine
});
```

---

## 🗄 Database Schema
### Game Model
```bash
{
  player1: String,          // Player 1 ID
  player2: String,          // Player 2 ID
  player1Name: String,      // Player 1 display name
  player2Name: String,      // Player 2 display name
  winner: String,           // Winner player ID (null for draw)
  result: String,           // Game result: 'win', 'loss', 'draw'
  type: String,             // 'quick' or 'private'
  winningSymbol: String,    // 'X' or 'O' (winner's symbol)
  duration: Number,         // Game duration in ms
  date: Date                // Game completion timestamp
}
```

---

## 🔧 Configuration
### Socket.IO Server
```bash
const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_API_URL,
    methods: ["GET", "POST"]
  }
});
```

### MongoDB Connection
```bash
export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  
  return mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DATABASE_NAME,
  });
}
```

---

## 🚀 Deployment
### Vercel Deployment (Frontend)
- Push code to GitHub
- Connect repository to Vercel
- Configure environment variables
- Deploy automatically

### Render Deployment (Socket Server)
- Connect repository to Render
- Configure environment variables
- Deploy automatically


---


## 📈 Performance Optimizations
- Efficient Re-renders: React memo and useCallback hooks
- Optimized Animations: Framer Motion with hardware acceleration
- Database Indexing: Optimized queries for leaderboard
- Socket Room Management: Efficient room-based broadcasting
- Bundle Optimization: Next.js code splitting and tree shaking

--- 

## 🤝 Contributing
welcome contributions! Please add a star if in GitHub if like this.

---

## Development Workflow
- Fork the repository
- Create a feature branch
- Make your changes
- Add tests if applicable
- Submit a pull request


---


## 🙏 Acknowledgments
- Socket.IO Team - For the excellent real-time communication library
- Next.js Team - For the amazing React framework
- MongoDB - For the reliable database solution
- Tailwind CSS - For the utility-first CSS framework


---


## 💡 Developer Notes
Note: This is my first project implementing Socket.IO for real-time multiplayer functionality. The learning curve included understanding WebSocket connections, room management, and real-time state synchronization across multiple clients.

---

## Key Learnings:
- Real-time bidirectional communication patterns
- Socket room management for multiplayer games
- State synchronization across clients
- Connection lifecycle management
- Error handling in real-time applications

---

## Future Enhancements:
- Add reconnect and resume game features (in progress)
- Implement AI opponent mode for solo play
- Integrate Nakama for advanced matchmaking
- Add player authentication and session persistence

---

## Built with ❤️ by Muhammad Adnan K

Backend Engineering Test Project - Demonstrating full-stack development capabilities with real-time multiplayer functionality.
