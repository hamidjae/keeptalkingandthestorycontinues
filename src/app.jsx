import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className="body bg-dark text-light">
      <header className="container-fluid">
        <nav className="navbar fixed-top navbar-dark bg-dark">
          <a className="navbar-brand" href="#">Keep Talking...</a>
          <menu className="navbar-nav">
            <li className="nav-item"><a className="nav-link active" href="index.html">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="game.html">Play Game!</a></li>
            <li className="nav-item"><a className="nav-link" href="leaderboard.html">Leaderboards</a></li>
            <li className="nav-item"><a className="nav-link" href="about.html">About</a></li>
          </menu>
        </nav>
      </header>

      <main className="container-fluid text-center align-items-center">
        App components go here
      </main>

      <footer className="bg-dark text-white-50">
        <div className="container-fluid">
          <span className="text-reset">Created by Hamid Jaeyoung Jahangir</span>
          <a className="text-reset ms-2" href="https://github.com/hamidjae/keeptalkingandthestorycontinues">Github</a>
        </div>
      </footer>
    </div>
  );
}
