import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './login/login';
import { Game } from './game/game';
import { Leaderboard } from './leaderboard/leaderboard';
import { About } from './about/about';
import { AuthState } from './authState.jsx';

function RequireAuth({ authState, children }) {
  if (authState !== AuthState.Authenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const remembered = localStorage.getItem('userName');
    if (remembered) {
      setUserName(remembered);
      setAuthState(AuthState.Authenticated);
    } else {
      setAuthState(AuthState.Unauthenticated);
    }}, []);

  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        <header className="container-fluid">
          <nav className="navbar fixed-top navbar-dark bg-dark">
            <div className="navbar-brand" href="#">Keep Talking...</div>
            <menu className="navbar-nav">
              <li className="nav-item"><NavLink className="nav-link active" to="/">Home</NavLink></li>
              {/* Only displays Play Game and Leaderboards if the user has been authenticated */}
              {authState === AuthState.Authenticated &&
              <li className="nav-item"><NavLink className="nav-link" to="game">Play Game!</NavLink></li>
              }
              {/* Apparently triple equals is standard for safe checks */}
              {authState === AuthState.Authenticated &&
              <li className="nav-item"><NavLink className="nav-link" to="leaderboard">Leaderboards</NavLink></li>
              }
              <li className="nav-item"><NavLink className="nav-link" to="about">About</NavLink></li>
            </menu>
          </nav>
        </header>

        <Routes>
          <Route path='/' element={<Login userName = {userName} authState = {authState} onAuthChange={(newUserName, newAuthState) => {setUserName(newUserName); setAuthState(newAuthState);}}/>} />
          <Route path='/game' element={<RequireAuth authState={authState}><Game userName = {userName}/></RequireAuth>} />
          <Route path='/leaderboard' element={<RequireAuth authState={authState}><Leaderboard userName = {userName}/></RequireAuth>} />
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