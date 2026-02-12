import React from 'react';
import './about.css';

export function About() {
  return (
    <main className="container-fluid text-center">
      <div>
        <div id="picture" className="picture-boxes">
          <img src="/public/writing.jpg" alt="Image of a pen resting on a blank notebook." />
        </div>

        <p>
          Keep Talking and the Story Continues is a game where you and two other players attempt to complete a narrative, three words at a time, until everyone but one runs out of time.
        </p>

        <p>
          Any likeness to existing intellectual properties is purely inspirational, and this website has been designed as a non-profit. The purpose of this website is for personal use, and any derivative uses reflects this.
        </p>

        <div id="inspirational-quote" className="quote-box bg-light text-dark">
          <div>You start coding, and I'll go figure out what the customer wants.</div>
          <div id="quote-author">- Someone in application development, probably.</div>
        </div>
      </div>
    </main>
  );
}
