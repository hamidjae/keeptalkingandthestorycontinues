import React, { useEffect, useRef, useState } from "react";
import "./game.css";
import { GameSocket } from "./gameSocket";

export function Game({ userName }) {
  const you = userName || "SuperCoolKid!";

  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [draft, setDraft] = useState("");
  const [connected, setConnected] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);

  const socketRef = useRef(null);
  const feedRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const socket = new GameSocket();
    socketRef.current = socket;

    socket.onOpen(() => {
      console.log("Frontend connected to WebSocket");
      setConnected(true);
      socket.send("join", { name: you });
    });

    socket.onMessage((msg) => {
      console.log("Frontend received:", msg);

      if (msg.type === "gameState") {
        setPlayers(msg.game.players || []);
        setMessages(msg.game.messages || []);
        setTurnIndex(msg.game.turnIndex || 0);
        setRound(msg.game.round || 0);
        setSecondsLeft(msg.game.secondsLeft ?? 30);
        setGameOver(!!msg.game.gameOver);
        setStarted(!!msg.game.started);
      }
    });

    socket.onClose(() => {
      console.log("Frontend disconnected");
      setConnected(false);
    });

    return () => socket.close();
  }, [you]);

  useEffect(() => {
    if (!feedRef.current) return;
    feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [messages]);

  const currentTurn = players[turnIndex] || "Nobody";
  const isYourTurn = currentTurn === you;

  function handleSend() {
    const trimmed = draft.trim();
    if (!trimmed || !socketRef.current) return;

    socketRef.current.send("submit", { text: trimmed });
    setDraft("");
  }

  function onDraftKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleNarrate() {
    if (messages.length === 0 || isNarrating) return;

    const fullStory = messages.map((m) => m.text).join(" ");

    try {
      setIsNarrating(true);

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullStory }),
      });

      if (!res.ok) {
        console.error("TTS failed:", await res.text());
        setIsNarrating(false);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        setIsNarrating(false);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setIsNarrating(false);
      };

      await audio.play();
    } catch (err) {
      console.error("Narration error:", err);
      setIsNarrating(false);
    }
  }

  return (
    <main className="container-fluid">
      <div className="row g-4">
        <section className="col-md-3">
          <div className="card bg-secondary text-light h-100 d-flex flex-column">
            <header className="card-header">
              <h3 className="mb-0">Players ({players.length}/6)</h3>
              <small>{connected ? "Connected to game server" : "Disconnected"}</small>
            </header>

            <div className="card-body d-flex flex-column">
              <section className="mb-3 flex-grow-0">
                {players.length === 0 ? (
                  <div className="text-muted">Waiting for players...</div>
                ) : (
                  players.map((player, idx) => (
                    <section
                      key={player}
                      className="player card mb-2 bg-dark text-light p-2 d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {player === you ? (
                          <span className="badge bg-success me-2">You</span>
                        ) : (
                          <span className="badge bg-danger me-2">Player</span>
                        )}
                        {player}
                      </span>

                      {idx === turnIndex ? (
                        <span className="badge bg-warning text-dark">Typing</span>
                      ) : (
                        <span className="badge bg-secondary">Waiting</span>
                      )}
                    </section>
                  ))
                )}
              </section>

              <section className="card bg-dark text-light p-2">
                <strong>Turn Order</strong>
                <ol className="mb-0 mt-1">
                  {players.map((name, idx) => (
                    <li key={name}>
                      {idx === turnIndex ? <strong>{name}</strong> : name}
                    </li>
                  ))}
                </ol>
              </section>

              <div className="mt-auto"></div>
            </div>

            <footer className="card-footer text-muted small">
              Room: GLOBAL
              <br />
              Status: {gameOver ? "Game Over" : started ? "In Progress" : "Waiting"}
            </footer>
          </div>
        </section>

        <section className="col-md-9">
          <div className="card bg-secondary text-light">
            <header className="card-header">
              <h3>Once upon a time...</h3>
              <h5>Round {round}</h5>
            </header>

            <section className="card-body">
              <section
                className="story-feed mb-3"
                id="story-feed"
                ref={feedRef}
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {messages.length === 0 ? (
                  <div className="text-muted fst-italic">
                    The story hasn't started yet...
                  </div>
                ) : (
                  messages.map((m, idx) => (
                    <article
                      key={idx}
                      className={`story-message ${m.from === you ? "my-player" : "other-player"} mb-2 p-2 bg-dark rounded`}
                    >
                      <span className="player-name">{m.from}</span>: {m.text}
                    </article>
                  ))
                )}
              </section>

              <button
                id="third-party-button"
                className="btn btn-primary mb-3"
                type="button"
                onClick={handleNarrate}
                disabled={messages.length === 0 || isNarrating}
              >
                {isNarrating ? "Narrating..." : "Narrate!"}
              </button>

              <section className="whose-turn mb-3">
                {gameOver ? (
                  <span className="text-danger fw-bold">GAME OVER</span>
                ) : !started ? (
                  <span className="text-warning">Waiting for at least 2 players...</span>
                ) : (
                  <>
                    Your turn,
                    <span className="player-name"> {isYourTurn ? you : currentTurn}</span>!
                    <span className="timer" id="turn-timer">
                      {secondsLeft}s left
                    </span>
                  </>
                )}
              </section>

              <section className="message-box input-group">
                <textarea
                  id="user-message"
                  className="form-control"
                  placeholder={
                    isYourTurn
                      ? "Write your part of the story!"
                      : "Wait for your turn..."
                  }
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onDraftKeyDown}
                  disabled={!isYourTurn || gameOver || !started}
                ></textarea>
                <button
                  id="send-message"
                  className="btn btn-success"
                  type="button"
                  onClick={handleSend}
                  disabled={!isYourTurn || gameOver || !started}
                >
                  Send
                </button>
              </section>

              {gameOver && (
                <button
                  className="btn btn-warning mt-3"
                  type="button"
                  onClick={() => socketRef.current?.send("restart")}
                >
                  Restart Game
                </button>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}