import React from 'react';
import './game.css';

export function Game() {
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
            <span className="badge bg-danger">Opponent</span> CoolerKid <span className="badge bg-warning text-dark">Typing</span>
            </section>

            <section className="player card mb-2 bg-dark text-light p-2 d-flex justify-content-between align-items-center">
            <span className="badge bg-danger">Opponent</span> AnotherKid <span className="badge bg-secondary">Waiting</span>
            </section>

            <section className="player card mb-2 bg-dark text-light p-2 text-muted">
            <span className="badge bg-danger">Opponent</span> <span className="text-light">NO PLAYER</span> <span className="badge bg-danger">Disconnected</span>
            </section>

            <section className="player card mb-2 bg-dark text-light p-2 text-muted">
            <span className="badge bg-danger">Opponent</span> <span className="text-light">NO PLAYER</span> <span className="badge bg-danger">Disconnected</span>
            </section>

            <section className="player card mb-2 bg-dark text-light p-2 text-muted">
            <span className="badge bg-danger">Opponent</span> <span className="text-light">NO PLAYER</span> <span className="badge bg-danger">Disconnected</span>
            </section>
        </section>

        <section className="card bg-dark text-light p-2">
            <strong>Turn Order</strong>
            <ol className="mb-0 mt-1">
            <li>CoolerKid</li>
            <li><strong>You</strong></li>
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
                        <section className="story-feed mb-3" id="story-feed" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <article className="story-message my-player mb-2 p-2 bg-dark rounded">
                                <span className="player-name">SuperCoolKid!</span>: there was a
                            </article>
                            <article className="story-message other-player mb-2 p-2 bg-dark rounded">
                                <span className="player-name">CoolerKid</span>: big, giant, fearsome
                            </article>
                            <article className="story-message other-player mb-2 p-2 bg-dark rounded">
                                <span className="player-name">AnotherKid</span>: dragon upon us!
                            </article>
                        </section>

                        <button id="third-party-button" className="btn btn-primary mb-3">Narrate!</button>

                        <section className="whose-turn mb-3">
                            Your turn, <span className="player-name">CoolerKid</span>!
                            <span className="timer" id="turn-timer">30s left</span>
                        </section>

                        <section className="message-box input-group">
                            <textarea id="user-message" className="form-control" placeholder="Write your part of the story!"></textarea>
                            <button id="send-message" className="btn btn-success">Send</button>
                        </section>
                    </section>
                </div>
            </section>
        </div>
    </main>
  );
}