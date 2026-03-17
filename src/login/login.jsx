import React, { useState, useEffect } from "react";
import { AuthState } from "../authState.jsx";
import "./login.css";

export function Login({ userName, authState, onAuthChange }) {
  const [name, setName] = useState(userName ?? "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    setName(userName ?? "");
  }, [userName]);

  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        onAuthChange(data.email, AuthState.Authenticated);
      } catch (err) {
        console.error("Auth check error:", err);
      }
    }

    checkLogin();
  }, [onAuthChange]);

  useEffect(() => {
    if (!remember) {
      localStorage.removeItem("userName");
      setName("");
    }
  }, [remember]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName === "" || password === "") {
      alert("Please enter a username and password.");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: trimmedName,
          password: password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.msg || "Username or password is incorrect.");
        return;
      }

      if (remember) {
        localStorage.setItem("userName", trimmedName);
      } else {
        localStorage.removeItem("userName");
      }

      onAuthChange(data.email, AuthState.Authenticated);
      setPassword("");
    } catch (err) {
      console.error("Login error:", err);
      alert("Unable to log in right now.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName === "" || password === "") {
      alert("Please enter a username and password.");
      return;
    }

    try {
      const response = await fetch("/api/auth/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: trimmedName,
          password: password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(data.msg || "Unable to register.");
        return;
      }

      if (remember) {
        localStorage.setItem("userName", trimmedName);
      } else {
        localStorage.removeItem("userName");
      }

      onAuthChange(data.email, AuthState.Authenticated);
      setPassword("");
    } catch (err) {
      console.error("Register error:", err);
      alert("Unable to register right now.");
    }
  };

  if (authState === AuthState.Authenticated) {
    return (
      <main className="container-fluid text-center align-items-center">
        <h1 className="mt-4">Welcome, {userName}!</h1>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={async () => {
            try {
              await fetch("/api/auth/logout", {
                method: "DELETE",
                credentials: "include",
              });
            } catch (err) {
              console.error("Logout error:", err);
            }

            setPassword("");

            if (remember) {
              onAuthChange(userName, AuthState.Unauthenticated);
            } else {
              localStorage.removeItem("userName");
              setName("");
              onAuthChange("", AuthState.Unauthenticated);
            }
          }}
        >
          Logout
        </button>
      </main>
    );
  }

  return (
    <main className="container-fluid text-center align-items-center login-background">
      <form onSubmit={handleLogin}>
        <h1 className="title-text">Ready to get your game on?</h1>

        <div className="input-group mb-3">
          <span className="input-group-text">Username</span>
          <input
            className="form-control"
            type="text"
            placeholder="e.g. supercoolplayer"
            style={{ maxWidth: "400px" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text">Password</span>
          <input
            className="form-control"
            type="password"
            placeholder="e.g 1234"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="checkbox1"
            name="varCheckbox"
            value="checkbox1"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label className="form-check-label title-text" htmlFor="checkbox1">
            Remember Username
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={handleRegister}
        >
          Register
        </button>
      </form>
    </main>
  );
}
