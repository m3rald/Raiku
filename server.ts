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
app.use(express.json());

const PORT = 3000;

// In-memory rooms registry
const rooms: Record<string, Room> = {};

// Clean inactive rooms/participants periodically (garbage collection)
setInterval(() => {
  const now = Date.now();
  for (const code in rooms) {
    // If no activity for 3 hours, delete the room
    if (now - rooms[code].lastUpdated > 3 * 60 * 60 * 1000) {
      delete rooms[code];
    } else {
      // Remove participants inactive for 10 minutes (unless in waiting mode)
      const room = rooms[code];
      if (room.state.status !== "waiting") {
        for (const nick in room.participants) {
          if (now - room.participants[nick].lastActive > 10 * 60 * 1000) {
            delete room.participants[nick];
          }
        }
      }
    }
  }
}, 60 * 1000);

// API Endpoints

// 1. Get entire Room state (Admin and Participant polling)
app.get("/api/room/:code", (req, res) => {
  const code = req.params.code.toUpperCase();
  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ error: "Quiz session not found." });
  }
  res.json({
    state: room.state,
    participants: room.participants,
    serverTime: Date.now(),
  });
});

// 2. Admin creates or updates the room state
app.post("/api/room/:code/admin-update", (req, res) => {
  const code = req.params.code.toUpperCase();
  const { state, participants } = req.body;

  if (!state) {
    return res.status(400).json({ error: "Missing state data." });
  }

  if (!rooms[code]) {
    rooms[code] = {
      state,
      participants: participants || {},
      lastUpdated: Date.now(),
    };
  } else {
    // Update general quiz status
    rooms[code].state = state;
    rooms[code].lastUpdated = Date.now();

    // If admin sent a master participants list (e.g. from direct edits or reset), merge/overwrite safely
    if (participants) {
      // Retain newly server-joined participants that might have arrived during the admin's fetch interval
      const merged: Record<string, Participant> = { ...rooms[code].participants };
      
      for (const nick in participants) {
        // If participant exists locally, sync their score ONLY if resetting (score is 0) or if in waiting/lobby status
        if (merged[nick]) {
          if (participants[nick].score === 0 || state.status === "waiting" || state.status === "lobby") {
            merged[nick].score = participants[nick].score;
          }
        } else {
          // Otherwise adopt the admin's record (e.g., cleared, or mock, or reset)
          merged[nick] = participants[nick];
        }
      }

      // Always use the safely merged list to avoid race-condition deletions of newly server-joined participants.
      rooms[code].participants = merged;
    }
  }

  res.json({
    success: true,
    state: rooms[code].state,
    participants: rooms[code].participants,
    serverTime: Date.now(),
  });
});

// 3. Participant Joins Room
app.post("/api/room/:code/join", (req, res) => {
  const code = req.params.code.toUpperCase();
  const { nickname } = req.body;

  if (!nickname) {
    return res.status(400).json({ error: "Nickname is required." });
  }

  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ error: "Quiz session not found. Check the invite code!" });
  }

  if (!room.state.allowNewParticipants) {
    return res.status(403).json({ error: "Joining is currently closed by the host." });
  }

  // Register participant
  if (!room.participants[nickname]) {
    room.participants[nickname] = {
      nickname,
      score: 0,
      joinedAt: Date.now(),
      lastActive: Date.now(),
    };
  } else {
    // Update active heartbeat
    room.participants[nickname].lastActive = Date.now();
  }

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
  const code = req.params.code.toUpperCase();
  const { nickname, score } = req.body;

  const room = rooms[code];
  if (!room) {
    return res.status(404).json({ error: "Session not found." });
  }

  if (room.participants[nickname]) {
    room.participants[nickname].score = score;
    room.participants[nickname].lastActive = Date.now();
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
  const code = req.params.code.toUpperCase();
  const { nickname } = req.body;

  const room = rooms[code];
  if (room && room.participants[nickname]) {
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
  const code = req.params.code.toUpperCase();
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
