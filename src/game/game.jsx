import React, { useRef, useState, useEffect } from 'react';
import './game.css';

export function Game() {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([
    { from: 'SuperCoolKid!', text: 'there was a' },
    { from: 'CoolerKid', text: 'big, giant, fearsome' },
    { from: 'AnotherKid', text: 'dragon upon us!' },
  ]);

  const feedRef = useRef(null);

  useEffect(() => {
    if (!feedRef.current) return;
    feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [messages]);

  function handleSend() {
    const trimmed = draft.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { from: 'SuperCoolKid!', text: trimmed }]);
    setDraft('');
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
                  <span className="badge bg-success">You</span> SuperCoolKid!
                  <span className="badge bg-secondary">Waiting</span>
                </section>

                <section className="player card mb-2 bg-dark text-light p-2 d-flex justify-content-between align-items-center">
                  <span className="badge bg-danger">Opponent</span> CoolerKid{' '}
                  <span className="badge bg-warning text-dark">Typing</span>
                </section>

                <section className="player card mb-2 bg-dark text-light p-2 d-flex justify-content-between align-items-center">
                  <span className="badge bg-danger">Opponent</span> AnotherKid{' '}
                  <span className="badge bg-secondary">Waiting</span>
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
                  <li>CoolerKid</li>
                  <li>
                    <strong>You</strong>
                  </li>
                  <li>AnotherKid</li>
                  <li>NO PLAYER</li>
                  <li>NO PLAYER</li>
                  <li>NO PLAYER</li>
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
              <h5>Round 4</h5>
            </header>

            <section className="card-body">
              <section
                className="story-feed mb-3"
                id="story-feed"
                ref={feedRef}
                style={{ maxHeight: '300px', overflowY: 'auto' }}
              >
                {messages.map((m, idx) => (
                  <article key={idx} className="story-message other-player mb-2 p-2 bg-dark rounded">
                    <span className="player-name">{m.from}</span>: {m.text}
                  </article>
                ))}
              </section>

              <button id="third-party-button" className="btn btn-primary mb-3" type="button">
                Narrate!
              </button>

              <section className="whose-turn mb-3">
                Your turn, <span className="player-name">CoolerKid</span>!
                <span className="timer" id="turn-timer">
                  30s left
                </span>
              </section>

              <section className="message-box input-group">
                <textarea
                  id="user-message"
                  className="form-control"
                  placeholder="Write your part of the story!"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                ></textarea>
                <button id="send-message" className="btn btn-success" type="button" onClick={handleSend}>
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