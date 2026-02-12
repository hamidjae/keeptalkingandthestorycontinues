import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Game } from './game/game';
import { Leaderboard } from './leaderboard/leaderboard';
import { About } from './about/about';

export default function App() {
  return (
    <BrowserRouter>
    <div className="body bg-dark text-light">
      <header className="container-fluid">
        <nav className="navbar fixed-top navbar-dark bg-dark">
          <div className="navbar-brand" href="#">Keep Talking...</div>
          <menu className="navbar-nav">
            <li className="nav-item"><NavLink className="nav-link active" to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="game">Play Game!</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="leaderboard">Leaderboards</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="about">About</NavLink></li>
          </menu>
        </nav>
      </header>

    <Routes>
        <Route path='/' element={<Login />} exact />
        <Route path='/game' element={<Game />} />
        <Route path='/leaderboard' element={<Leaderboard />} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<NotFound />} />
    </Routes>

      <footer className="bg-dark text-white-50">
        <div className="container-fluid">
          <span className="text-reset">Created by Hamid Jaeyoung Jahangir</span>
          <a className="text-reset ms-2" href="https://github.com/hamidjae/keeptalkingandthestorycontinues">Github</a>
        </div>
      </footer>
    </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}