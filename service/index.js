const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const cookieParser = require("cookie-parser");
const DB = require('./database');
const bcrypt = require("bcryptjs");
const express = require("express");
const uuid = require("uuid");
const app = express();

const authCookieName = "token";
const port = process.env.PORT || 4000;

const http = require("http");
const { WebSocketServer } = require("ws");

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

const apiRouter = express.Router();
app.use("/api", apiRouter);

apiRouter.post("/auth/create", async (req, res) => {
  try {
    if (await findUser("email", req.body.email)) {
      return res.status(409).send({ msg: "Existing user" });
    }

    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  } catch (err) {
    console.error("ERROR in /auth/create:", err);
    res.status(500).send({ msg: "Failed to create user", error: err.message });
  }
});

apiRouter.get("/auth/me", async (req, res) => {
  try {
    const user = await findUser("token", req.cookies[authCookieName]);

    if (user) {
      return res.send({ email: user.email });
    }

    res.status(401).send({ msg: "Error. Please check password/username, and whether the account is already registered!" });
  } catch (err) {
    console.error("ERROR in /auth/me:", err);
    res.status(500).send({ msg: "Auth check failed", error: err.message });
  }
});

apiRouter.post("/auth/login", async (req, res) => {
  try {
    const user = await findUser("email", req.body.email);

    if (user && (await bcrypt.compare(req.body.password, user.password))) {
      const token = uuid.v4();
      await DB.updateUserToken(user.email, token);
      setAuthCookie(res, token);
      return res.send({ email: user.email });
    }

    res.status(401).send({ msg: "Unauthorized" });
  } catch (err) {
    console.error("ERROR in /auth/login:", err);
    res.status(500).send({ msg: "Login failed", error: err.message });
  }
});

apiRouter.delete("/auth/logout", async (req, res) => {
  try {
    const token = req.cookies[authCookieName];
    if (token) {
      await DB.clearUserToken(token);
    }

    res.clearCookie(authCookieName);
    res.status(204).end();
  } catch (err) {
    console.error("ERROR in /auth/logout:", err);
    res.status(500).send({ msg: "Logout failed", error: err.message });
  }
});

const verifyAuth = async (req, res, next) => {
  try {
    const user = await findUser("token", req.cookies[authCookieName]);
    if (user) {
      next();
    } else {
      res.status(401).send({ msg: "Error. Please check password/username, and whether the account is already registered!" });
    }
  } catch (err) {
    console.error("ERROR in verifyAuth:", err);
    res.status(500).send({ msg: "Auth check failed", error: err.message });
  }
};

apiRouter.get("/scores", verifyAuth, async (_req, res) => {
  const scores = await DB.getHighScores();
  res.send(scores);
});

apiRouter.post("/score", verifyAuth, async (req, res) => {
  await DB.addScore(req.body);
  const scores = await DB.getHighScores();
  res.send(scores);
});

apiRouter.get("/test", (_req, res) => {
  res.send({ msg: "Backend is running" });
});

apiRouter.post("/tts", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).send({ msg: "Text is required" });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    console.log("VOICE ID USED:", process.env.ELEVENLABS_VOICE_ID);

    if (!apiKey || !voiceId) {
      return res.status(500).send({ msg: "Missing ElevenLabs credentials" });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs error:", response.status, errorText);
      return res.status(response.status).send(errorText);
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    res.set("Content-Type", "audio/mpeg");
    res.send(audioBuffer);
  } catch (err) {
    console.error("ERROR in /tts:", err);
    res.status(500).send({ msg: "TTS failed", error: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error("UNHANDLED ERROR:", err);
  res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
  res.sendFile("index.html", { root: "public" });
});

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email,
    password: passwordHash,
    token: uuid.v4(),
  };

  await DB.createUser(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === 'email') {
    return DB.getUser(value);
  }

  if (field === 'token') {
    return DB.getUserByToken(value);
  }

  return null;
}

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });
}

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

const game = {
  players: [],
  messages: [],
  turnIndex: 0,
  round: 0,
  secondsLeft: 30,
  turnTime: 30,
  started: false,
  gameOver: false,
};

const connections = new Map(); // ws -> playerName

function publicGameState() {
  return {
    players: game.players,
    messages: game.messages,
    turnIndex: game.turnIndex,
    round: game.round,
    secondsLeft: game.secondsLeft,
    turnTime: game.turnTime,
    started: game.started,
    gameOver: game.gameOver,
    currentTurn: game.players[game.turnIndex] || null,
  };
}

function broadcast(payload) {
  const text = JSON.stringify(payload);
  for (const client of connections.keys()) {
    if (client.readyState === 1) {
      client.send(text);
    }
  }
}

function broadcastState() {
  broadcast({ type: "gameState", game: publicGameState() });
}

function resetIfEmpty() {
  if (game.players.length === 0) {
    game.messages = [];
    game.turnIndex = 0;
    game.round = 0;
    game.secondsLeft = 30;
    game.turnTime = 30;
    game.started = false;
    game.gameOver = false;
  }
}

function advanceTurn() {
  if (game.players.length === 0) return;

  game.turnIndex = (game.turnIndex + 1) % game.players.length;

  if (game.turnIndex === 0) {
    game.round += 1;
    game.turnTime = Math.max(game.turnTime - 5, 5);
  }

  game.secondsLeft = game.turnTime;
}

function startGameIfReady() {
  if (!game.started && game.players.length >= 2) {
    game.started = true;
    game.round = 1;
    game.turnIndex = 0;
    game.turnTime = 30;
    game.secondsLeft = 30;
  }
}

setInterval(async () => {
  if (!game.started || game.gameOver || game.players.length < 2) {
    return;
  }

  game.secondsLeft -= 1;

  if (game.secondsLeft <= 0) {
    game.gameOver = true;

    try {
      await DB.addScore({
        players: [...game.players],
        rounds: game.round,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        score: game.round,
      });
    } catch (err) {
      console.error("Failed to save score:", err);
    }
  }

  broadcastState();
}, 1000);

wss.on("connection", (ws) => {
  console.log("WebSocket connected");

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      console.log("Received:", msg);

      if (msg.type === "join") {
        const name = (msg.name || "").trim();
        if (!name) return;
        if (game.players.includes(name)) return;
        if (game.players.length >= 6) return;

        game.players.push(name);
        connections.set(ws, name);
        startGameIfReady();
        broadcastState();
      }

      if (msg.type === "submit") {
        const name = connections.get(ws);
        const text = (msg.text || "").trim();

        if (!name || !text || game.gameOver || !game.started) return;
        if (game.players[game.turnIndex] !== name) return;

        game.messages.push({ from: name, text });
        advanceTurn();
        broadcastState();
      }

      if (msg.type === "restart") {
        game.messages = [];
        game.turnIndex = 0;
        game.round = game.players.length >= 2 ? 1 : 0;
        game.secondsLeft = 30;
        game.turnTime = 30;
        game.started = game.players.length >= 2;
        game.gameOver = false;
        broadcastState();
      }
    } catch (err) {
      console.error("WebSocket message error:", err);
    }
  });

  ws.on("close", () => {
    const name = connections.get(ws);
    connections.delete(ws);

    if (name) {
      game.players = game.players.filter((player) => player !== name);

      if (game.turnIndex >= game.players.length) {
        game.turnIndex = 0;
      }

      if (game.players.length < 2) {
        game.started = false;
      }

      resetIfEmpty();
      broadcastState();
    }

    console.log("WebSocket disconnected");
  });

  ws.send(JSON.stringify({ type: "gameState", game: publicGameState() }));
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});