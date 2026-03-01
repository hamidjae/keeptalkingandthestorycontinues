import React from 'react';
import './leaderboard.css';

export function Leaderboard({ entries = [] }) {
  return (
    <main className="container-fluid text-center">
      <div className="table-responsive">
        <table className="table table-danger table-striped-columns">
          <thead className="table-dark">
            <tr>
              <th>Ranking</th>
              <th>Players</th>
              <th>Rounds</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-muted fst-italic">
                  No games recorded yet.
                </td>
              </tr>
            ) : (
              entries.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.rank ?? idx + 1}</td>
                  <td>{Array.isArray(row.players) ? row.players.join(', ') : row.players}</td>
                  <td>{row.rounds}</td>
                  <td>{row.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}