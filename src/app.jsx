import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";

import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Login } from "./login/login";
import { Game } from "./game/game";
import { Leaderboard } from "./leaderboard/leaderboard";
import { About } from "./about/about";
import { AuthState } from "./authState.jsx";

function RequireAuth({ authState, children }) {
  if (authState !== AuthState.Authenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userName, setUserName] = useState("");
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);

  async function loadScores() {
    try {
      const response = await fetch("/api/scores", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          return;
        }
        throw new Error("Failed to load scores");
      }

      const data = await response.json();
      setLeaderboardEntries(data);
    } catch (err) {
      console.error("Error loading scores:", err);
    }
  }

  async function handleGameEnd({ players, rounds, date }) {
    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          players,
          rounds,
          date,
          score: rounds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save score");
      }

      const data = await response.json();
      const ranked = data.map((entry, idx) => ({
        ...entry,
        rank: idx + 1,
      }));

      setLeaderboardEntries(ranked);
    } catch (err) {
      console.error("Error saving score:", err);
    }
  }

  useEffect(() => {
    const remembered = localStorage.getItem("userName");
    if (remembered) {
      setUserName(remembered);
    }
    setAuthState(AuthState.Unauthenticated);
  }, []);

  useEffect(() => {
    if (authState === AuthState.Authenticated) {
      loadScores();
    }
  }, [authState]);

  return (
    <BrowserRouter>
      <div className="body bg-dark text-light">
        <header className="container-fluid">
          <nav className="navbar fixed-top navbar-dark bg-dark">
            <div className="navbar-brand" href="#">
              Keep Talking...
            </div>
            <menu className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link active" to="/">
                  Home
                </NavLink>
              </li>

              {authState === AuthState.Authenticated && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="game">
                    Play Game!
                  </NavLink>
                </li>
              )}

              {authState === AuthState.Authenticated && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="leaderboard">
                    Leaderboards
                  </NavLink>
                </li>
              )}

              <li className="nav-item">
                <NavLink className="nav-link" to="about">
                  About
                </NavLink>
              </li>
            </menu>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(newUserName, newAuthState) => {
                  setUserName(newUserName);
                  setAuthState(newAuthState);
                }}
              />
            }
          />
          <Route
            path="/game"
            element={
              <RequireAuth authState={authState}>
                <Game userName={userName} onGameEnd={handleGameEnd} />
              </RequireAuth>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <RequireAuth authState={authState}>
                <Leaderboard entries={leaderboardEntries} />
              </RequireAuth>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer className="bg-dark text-white-50">
          <div className="container-fluid">
            <span className="text-reset">
              Created by Hamid Jaeyoung Jahangir
            </span>
            <a
              className="text-reset ms-2"
              href="https://github.com/hamidjae/keeptalkingandthestorycontinues"
            >
              Github
            </a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main className="container-fluid bg-secondary text-center">
      404: Return to sender. Address unknown.
    </main>
  );
}
