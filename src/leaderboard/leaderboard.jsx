import React from 'react';
import './leaderboard.css';

export function Leaderboard() {
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
          <tr>
            <td>1</td>
            <td>SuperCoolKid, CoolerKid, AnotherKid</td>
            <td>10</td>
            <td>January 26, 2026</td>
          </tr>
          <tr>
            <td>2</td>
            <td>MegaCoolKid, AverageKid, UberCoolKid</td>
            <td>8</td>
            <td>January 26, 2026</td>
          </tr>
          <tr>
            <td>3</td>
            <td>SuperDuperCoolKid, BigKid, LittleKid</td>
            <td>7</td>
            <td>January 25, 2026</td>
          </tr>
        </tbody>
      </table>
      </div>
    </main>
  );
}