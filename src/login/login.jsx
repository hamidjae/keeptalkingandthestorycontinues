import React, {useState, useEffect} from 'react';
import { AuthState } from '../authState.jsx';

export function Login({userName, authState, onAuthChange}) {
  const [name, setName] = useState(userName ?? '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    setName(userName ?? '');
  }, [userName]);

  useEffect(() => {
  if (!remember) {
    localStorage.removeItem('userName');
    setName('');
  }
  }, [remember]);

  const handleLogin = (e) => {
  e.preventDefault();

  const trimmedName = name.trim();

  if (trimmedName === '' || password === '') {
    alert('Please enter a username and password.');
    return;
  }

  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

  let foundUser = null;

  for (let i = 0; i < storedUsers.length; i++) {
    if (
      storedUsers[i].name === trimmedName &&
      storedUsers[i].password === password
    ) {
      foundUser = storedUsers[i];
      break;
    }
  }

  if (!foundUser) {
    alert('Username or password is incorrect.');
    return;
  }

  if (remember) {
    localStorage.setItem('userName', trimmedName);
  } else {
    localStorage.removeItem('userName');
  }

  onAuthChange(trimmedName, AuthState.Authenticated);
  setPassword('');
};

const handleRegister = (e) => {
  e.preventDefault();

  const trimmedName = name.trim();

  if (trimmedName === '' || password === '') {
    alert('Please enter a username and password.');
    return;
  }

  const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

  for (let i = 0; i < storedUsers.length; i++) {
    if (storedUsers[i].name === trimmedName) {
      alert('That username is already taken.');
      return;
    }
  }

  storedUsers.push({
    name: trimmedName,
    password: password,
  });

  localStorage.setItem('users', JSON.stringify(storedUsers));

  if (remember) {
    localStorage.setItem('userName', trimmedName);
  }

  onAuthChange(trimmedName, AuthState.Authenticated);
  setPassword('');
};

if (authState === AuthState.Authenticated) {
  return (
    <main className="container-fluid text-center align-items-center">
      <h1 className="mt-4">Welcome, {userName}!</h1>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => {
          onAuthChange(userName, AuthState.Unauthenticated);
          setPassword('');

        if (!remember) {
          onAuthChange('', AuthState.Unauthenticated);
          setName('');}}}>
        Logout
      </button>
    </main>
  );
}

  return (
    <main className="container-fluid text-center align-items-center">
        <form onSubmit={handleLogin}>
        <h1>Ready to get your game on?</h1>
        <div className="input-group mb-3">
          <span className="input-group-text">Username</span>
          <input className="form-control" type="text" placeholder="e.g. supercoolplayer" style={{maxWidth: '400px' }} value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Password</span>
          <input className="form-control" type="password" placeholder="e.g 1234" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="checkbox1" name="varCheckbox" value="checkbox1" checked={remember} onChange={(e) => setRemember(e.target.checked)}/>
            <label className="form-check-label" htmlFor="checkbox1">Remember Username</label>
        </div>
        
        <button type="submit" className="btn btn-primary">Login</button>
        <button type="button" className="btn btn-success" onClick={handleRegister}>Register</button>
      </form>
    </main>
  );
}