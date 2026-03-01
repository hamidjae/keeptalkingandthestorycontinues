import React, { useEffect, useMemo, useRef, useState } from 'react';
import './game.css';

const DUMMY_PHRASES = [
  'and suddenly...',
  'I started dreaming',
  'about a glorious round pizza',
  'but with pineapples where pepperoni should be',
  'yet that pizza was undoubtedly',
  'still the most delicious one to me',
];

export function Game({ userName }) {
  const you = userName || 'SuperCoolKid!';

const [players, setPlayers] = useState([
  { name: you, role: 'you', status: 'waiting' },
  { name: 'CoolerKid', role: 'opponent', status: 'waiting' },
  { name: 'AnotherKid', role: 'opponent', status: 'waiting' },
  { name: 'NO PLAYER', role: 'opponent', status: 'disconnected' },
  { name: 'NO PLAYER', role: 'opponent', status: 'disconnected' },
  { name: 'NO PLAYER', role: 'opponent', status: 'disconnected' },
]);

  const turnOrder = useMemo(() => players.map((p) => p.name), [players]);

  const [turnIndex, setTurnIndex] = useState(0);
  const [round, setRound] = useState(4);

  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([
    { from: you, text: 'there was a' },
    { from: 'CoolerKid', text: 'big, giant, fearsome' },
    { from: 'AnotherKid', text: 'dragon upon us!' },
  ]);

  const [remainingPhrases, setRemainingPhrases] = useState(DUMMY_PHRASES);
  const feedRef = useRef(null);

  useEffect(() => {
    if (!feedRef.current) return;
    feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [messages]);

  const currentTurn = turnOrder[turnIndex] || 'NO PLAYER';
  const isYourTurn = currentTurn === you;
  
  const typingBadge = <span className="badge bg-warning text-dark">Typing</span>;
  const waitingBadge = <span className="badge bg-secondary">Waiting</span>;

  useEffect(() => {
  setPlayers((prev) =>
    prev.map((p) => {
      if (p.status === 'disconnected' || p.name === 'NO PLAYER') return p;
      return { ...p, status: p.name === currentTurn ? 'typing' : 'waiting' };
    })
  );
}, [currentTurn]);

  useEffect(() => {
  if (isYourTurn) return;
  if (currentTurn === 'NO PLAYER') return;

  const timeout = setTimeout(() => {
    setRemainingPhrases((prev) => {
      let pool = prev.length ? prev : DUMMY_PHRASES;

      const index = Math.floor(Math.random() * pool.length);
      const phrase = pool[index];

      const newPool = pool.filter((_, i) => i !== index);

      setMessages((m) => [...m, { from: currentTurn, text: phrase }]);
      advanceTurn();

      return newPool;
    });
  }, 2000);

  return () => clearTimeout(timeout);
}, [currentTurn, isYourTurn, turnOrder]);

  function isEmptySlot(name) {
    return name === 'NO PLAYER';
  }

  function advanceTurn() {
    setTurnIndex((prev) => {
      const max = turnOrder.length;
      let next = (prev + 1) % max;

      for (let tries = 0; tries < max; tries++) {
        if (!isEmptySlot(turnOrder[next])) break;
        next = (next + 1) % max;
      }

      if (next === 0) {
        setRound((r) => r + 1);
      }

      return next;
    });
  }

  function handleSend() {
    const trimmed = draft.trim();
    if (!trimmed) return;

    if (!isYourTurn) {
      alert("It's not your turn.");
      return;
    }

    setMessages((prev) => [...prev, { from: you, text: trimmed }]);
    setDraft('');
    advanceTurn();
  }

  function onDraftKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <main className="container-fluid">
      <div className="row g-4">
        <section className="col-md-3">
          <div className="card bg-secondary text-light h-100 d-flex flex-column">
            <header className="card-header">
              <h3 className="mb-0">Players (3/6)</h3>
              <small>The ones authoring the story</small>
            </header>

            <div className="card-body d-flex flex-column">
              <section className="mb-3 flex-grow-0">
                <section className="player card mb-2 bg-dark text-light p-2">
                  <span className="badge bg-success">You</span> {you}
                  {players[0]?.status === 'typing' ? typingBadge : waitingBadge}
                </section>

                <section className="player card mb-2 bg-dark text-light p-2 d-flex justify-content-between align-items-center">
                  <span className="badge bg-danger">Opponent</span> CoolerKid{' '}
                  {players[1]?.status === 'typing' ? typingBadge : waitingBadge}
                </section>

                <section className="player card mb-2 bg-dark text-light p-2 d-flex justify-content-between align-items-center">
                  <span className="badge bg-danger">Opponent</span> AnotherKid{' '}
                  {players[2]?.status === 'typing' ? typingBadge : waitingBadge}
                </section>

                <section className="player card mb-2 bg-dark text-light p-2 text-muted">
                  <span className="badge bg-danger">Opponent</span>{' '}
                  <span className="text-light">NO PLAYER</span>{' '}
                  <span className="badge bg-danger">Disconnected</span>
                </section>

                <section className="player card mb-2 bg-dark text-light p-2 text-muted">
                  <span className="badge bg-danger">Opponent</span>{' '}
                  <span className="text-light">NO PLAYER</span>{' '}
                  <span className="badge bg-danger">Disconnected</span>
                </section>

                <section className="player card mb-2 bg-dark text-light p-2 text-muted">
                  <span className="badge bg-danger">Opponent</span>{' '}
                  <span className="text-light">NO PLAYER</span>{' '}
                  <span className="badge bg-danger">Disconnected</span>
                </section>
              </section>

              <section className="card bg-dark text-light p-2">
                <strong>Turn Order</strong>
                <ol className="mb-0 mt-1">
                  {turnOrder.map((n, idx) => (
                    <li key={idx}>
                      {idx === turnIndex ? <strong>{n === you ? 'You' : n}</strong> : n}
                    </li>
                  ))}
                </ol>
              </section>

              <div className="mt-auto"></div>
            </div>

            <footer className="card-footer text-muted small">
              Room: SIGMA-6767
              <br />
              Status: In Progress
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
                style={{ maxHeight: '300px', overflowY: 'auto' }}
              >
                {messages.map((m, idx) => (
                  <article
                    key={idx}
                    className={`story-message ${m.from === you ? 'my-player' : 'other-player'} mb-2 p-2 bg-dark rounded`}
                  >
                    <span className="player-name">{m.from}</span>: {m.text}
                  </article>
                ))}
              </section>

              <button id="third-party-button" className="btn btn-primary mb-3" type="button">
                Narrate!
              </button>

              <section className="whose-turn mb-3">
                {isYourTurn ? (
                  <>
                    Your turn, <span className="player-name">{you}</span>!
                  </>
                ) : (
                  <>
                    Your turn, <span className="player-name">{currentTurn}</span>!
                  </>
                )}
                <span className="timer" id="turn-timer">
                </span>
              </section>

              <section className="message-box input-group">
                <textarea
                  id="user-message"
                  className="form-control"
                  placeholder={isYourTurn ? 'Write your part of the story!' : 'Wait for your turn...'}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onDraftKeyDown}
                  disabled={!isYourTurn}
                ></textarea>
                <button
                  id="send-message"
                  className="btn btn-success"
                  type="button"
                  onClick={handleSend}
                  disabled={!isYourTurn}
                >
                  Send
                </button>
              </section>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}