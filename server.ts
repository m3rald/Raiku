import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface Participant {
  nickname: string;
  score: number;
  joinedAt: number;
  lastActive: number;
}

interface QuizState {
  code: string;
  category: string;
  difficulty: "easy" | "intermediate" | "hard";
  status: "waiting" | "lobby" | "active" | "completed";
  currentQuestionIndex: number;
  lobbyTimeLeft: number;
  questionStartTime: number | null;
  shuffleMap: number[];
  allowNewParticipants: boolean;
}

interface Room {
  state: QuizState;
  participants: Record<string, Participant>;
  lastUpdated: number;
}

const app = express();

// CORS middleware for external client access - MUST be registered before body parsers & routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

const PORT = 3000;

// In-memory rooms registry
const rooms: Record<string, Room> = {};

// Clean inactive rooms/participants periodically (garbage collection)
setInterval(() => {
  const now = Date.now();
  for (const code in rooms) {
    // If no activity for 6 hours, delete the room
    if (now - rooms[code].lastUpdated > 6 * 60 * 60 * 1000) {
      delete rooms[code];
    } else {
      // Remove participants inactive for 20 minutes (unless in waiting mode)
      const room = rooms[code];
      if (room.state.status !== "waiting") {
        for (const nick in room.participants) {
          if (now - room.participants[nick].lastActive > 20 * 60 * 1000) {
            delete room.participants[nick];
          }
        }
      }
    }
  }
}, 60 * 1000);

// API Endpoints

// Helper to get or create room safely
function getOrCreateRoom(code: string): Room {
  const cleanCode = code.trim().toUpperCase();
  if (!rooms[cleanCode]) {
    rooms[cleanCode] = {
      state: {
        code: cleanCode,
        category: "raiku",
        difficulty: "easy",
        status: "waiting",
        currentQuestionIndex: -1,
        lobbyTimeLeft: 10,
        questionStartTime: null,
        shuffleMap: [],
        allowNewParticipants: true,
      },
      participants: {},
      lastUpdated: Date.now(),
    };
  }
  return rooms[cleanCode];
}

// 1. Get entire Room state (Admin and Participant polling)
app.get("/api/room/:code", (req, res) => {
  const code = (req.params.code || "").trim().toUpperCase();
  const room = getOrCreateRoom(code);
  res.json({
    state: room.state,
    participants: room.participants,
    serverTime: Date.now(),
  });
});

// 2. Admin creates or updates the room state
app.post("/api/room/:code/admin-update", (req, res) => {
  const code = (req.params.code || "").trim().toUpperCase();
  const { state, participants } = req.body || {};

  if (!state) {
    return res.status(400).json({ error: "Missing state data." });
  }

  const room = getOrCreateRoom(code);

  // Update general quiz state safely
  room.state = {
    ...room.state,
    ...state,
    code,
  };
  room.lastUpdated = Date.now();

  // If admin sent a master participants list, merge safely without downgrading participant scores
  if (participants) {
    const isExplicitReset = Object.keys(participants).length === 0;

    if (isExplicitReset) {
      room.participants = {};
    } else {
      const merged: Record<string, Participant> = { ...room.participants };
      
      for (const nick in participants) {
        if (merged[nick]) {
          merged[nick] = {
            ...merged[nick],
            ...participants[nick],
            score: Math.max(merged[nick].score || 0, participants[nick].score || 0),
          };
        } else {
          merged[nick] = participants[nick];
        }
      }

      room.participants = merged;
    }
  }

  res.json({
    success: true,
    state: room.state,
    participants: room.participants,
    serverTime: Date.now(),
  });
});

// 3. Participant Joins Room
app.post("/api/room/:code/join", (req, res) => {
  const code = (req.params.code || "").trim().toUpperCase();
  const { nickname } = req.body || {};

  if (!nickname) {
    return res.status(400).json({ error: "Discord Username is required." });
  }

  const room = getOrCreateRoom(code);

  // If participant already exists, allow reconnect/heartbeat regardless of allowNewParticipants flag
  if (room.participants && room.participants[nickname]) {
    room.participants[nickname].lastActive = Date.now();
    room.lastUpdated = Date.now();
    return res.json({
      success: true,
      state: room.state,
      participants: room.participants,
      serverTime: Date.now(),
    });
  }

  // Only block for NEW participants if host closed joining
  if (room.state.allowNewParticipants === false) {
    return res.status(403).json({ error: "Joining is currently closed by the host for this session." });
  }

  // Register new participant
  room.participants[nickname] = {
    nickname,
    score: 0,
    joinedAt: Date.now(),
    lastActive: Date.now(),
  };

  room.lastUpdated = Date.now();

  res.json({
    success: true,
    state: room.state,
    participants: room.participants,
    serverTime: Date.now(),
  });
});

// 4. Participant Submits Answer/Score Update
app.post("/api/room/:code/submit-answer", (req, res) => {
  const code = (req.params.code || "").trim().toUpperCase();
  const { nickname, score } = req.body || {};

  const room = getOrCreateRoom(code);

  if (room.participants && room.participants[nickname]) {
    room.participants[nickname].score = Math.max(
      room.participants[nickname].score || 0,
      typeof score === 'number' ? score : 0
    );
    room.participants[nickname].lastActive = Date.now();
  } else if (nickname) {
    room.participants[nickname] = {
      nickname,
      score: typeof score === 'number' ? score : 0,
      joinedAt: Date.now(),
      lastActive: Date.now(),
    };
  }

  room.lastUpdated = Date.now();

  res.json({
    success: true,
    state: room.state,
    participants: room.participants,
    serverTime: Date.now(),
  });
});

// 5. Admin Ejects a Participant
app.post("/api/room/:code/eject", (req, res) => {
  const code = (req.params.code || "").trim().toUpperCase();
  const { nickname } = req.body || {};

  const room = rooms[code];
  if (room && room.participants && room.participants[nickname]) {
    delete room.participants[nickname];
    room.lastUpdated = Date.now();
  }

  res.json({
    success: true,
    participants: room ? room.participants : {},
  });
});

// 6. Admin Clears Leaderboard
app.post("/api/room/:code/clear-leaderboard", (req, res) => {
  const code = (req.params.code || "").trim().toUpperCase();
  const room = rooms[code];
  if (room) {
    room.participants = {};
    room.lastUpdated = Date.now();
  }
  res.json({
    success: true,
    participants: {},
  });
});

// Integrate Vite / Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
