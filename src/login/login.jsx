import React from 'react';

export function Login() {
  return (
    <main className="container-fluid text-center align-items-center">
        <form method="get" action="game.html">
        <h1>Ready to get your game on?</h1>
        <div className="input-group mb-3">
          <span className="input-group-text">Username</span>
          <input className="form-control" type="text" placeholder="e.g. supercoolplayer" style={{maxWidth: '400px' }}/>
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Password</span>
          <input className="form-control" type="password" placeholder="e.g 1234" />
        </div>

        <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="checkbox1" name="varCheckbox" value="checkbox1"/>
            <label className="form-check-label" htmlfor="checkbox1">Remember Username</label>
        </div>
        
        <button type="submit" className="btn btn-primary">Login</button>
        <button type="submit" className="btn btn-success">Register</button>
      </form>
    </main>
  );
}