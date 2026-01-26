# Keep Typing and the Story Continues!

[My Notes](notes.md)

This web application is an adaptation of the popular elementary game of "Once upon a time..." but with the implementation of a 6-player game room. The application uses a timer to make the game competitive, and the last one standing is the victor.

## 🚀 Specification Deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] Proper use of Markdown - Cloned the repository from Simon, understood how it worked, and implemented it
- [X] A concise and compelling elevator pitch - Added some informal humor into the pitch, made it not too long, and used a call to action for the pitch to sound great.
- [X] Description of key features - Extracted the key features of my web application from the images and the pitch, and added them in.
- [X] Description of how you will use each technology - Read up on what the technologies do to the best of my current ability and linked features to technologies.
- [X] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references. - Created a folder for images, and used Markdown image reference to put it inside my startup deliverable.

### Elevator pitch

Have you ever wondered who the most quick-witted person is in your friend group? Maybe you've tested that out in the playground, where each person continues the story you've started out with until it went from Antarctica to Narnia? This Keep Typing and the Story Continues! application lets you join a 6-player game where all players, in turn, attempt to continue the story while a timer ticks down. Once the timer reaches zero? Boom! You're out of the game. Channel your inner James Bond, and become the 007 of the writing world (at least, in your friend group!)

### Design

![Design image](images/startupimage1.jpg)
![Design image](images/startupimage2.jpg)

### Key features

- Secure login over HTTPS.
- The capability to play with 5 other unique players.
- Once the game concludes, an option to press a "Narrate!" button which will play Text-to-Speech for the end user using ElevenLabs.
- Games are persistently stored.
- A leaderboard to show the longest game, and who played in it.
- The prompts written by players displayed in real-time.
- A scrollbar for the story so far

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Six HTML pages: Login, How to Play, About, the game being played, the page after the game completes that has a Narrate! button, and the leaderboard. I may cut this down if some pages become redundant, such as folding the How to Play page into the About page.
- **CSS** - The aesthetics of the pages. Right now, I plan to implement a soft blue color persistently in the background using CSS styling. It will have good contrast with the rest of the page aesthetics, and needs to be able to fit both PC and mobile layouts.
- **React** - This is the frontend. Handles logic for Login, submitting an entry, the timer buzzing down, appending onto the string so that the story is updated in real-time
- **Service** - The backend for React. It will handle the actual login and entry submission so that the frontend and the backend both work together.
- **DB/Login** - This will store the player signups and logins, the longest games played as well as who played in them. This website cannot be used without this database authenticating the user's credentials
- **WebSocket** - Updates the current story so far in real-time. Also updates who the current player is during each timer countdown.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Server deployed and accessible with custom domain name** - [My server link](https://keeptalkingandthestorycontinues.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **HTML pages** - Four HTML pages, starting from index.html that has links to all other pages on all pages.
- [X] **Proper HTML element usage** - I used div elements with ids to differentiate one div from another, as well as spans. These IDs will be useful for CSS styling. Everything also uses other semantic elements, like nav for navigation bar, section for different sections, footer, etc.
- [X] **Links** - Properly used hrefs to link one part of the website to another. The login page will link to the game.html page.
- [X] **Text** - Everything in every page has proper textual context. The "story so far" tab has the actual story that users have inputted so far, to name one. Text boxes have placeholder text to help guide users along, if they have no idea what they need to do. Buttons also have text attached to them that tell you what they do.
- [X] **3rd party API placeholder** - The Narrate! button is the placeholder that will call in a third-party API for Text-to-Speech. It has a proper id to separate itself for this purpose.
- [X] **Images** - Added an image at about.html that suits the page's themes, altered the size, and added an alt for accessibility purposes. It also has its own unique id for CSS styling.
- [X] **Login placeholder** - Added a placeholder login/register with placeholder text. Implemented a "Remember Me" check that uses cookies, but will have to research on how this actually works. For now though, this placeholder will be sufficient.
- [X] **DB data placeholder** - The leaderboard.html will store the data of the top games that were played, ranking which games were played the longest from highest to lowest.
- [X] **WebSocket placeholder** - The real-time implementation of the story so far when users take their turns in game.html represent the WebSocket part of this deliverable. As users type their additions to the story, the story so far section will update in real time.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Visually appealing colors and layout. No overflowing elements.** - I did not complete this part of the deliverable.
- [ ] **Use of a CSS framework** - I did not complete this part of the deliverable.
- [ ] **All visual elements styled using CSS** - I did not complete this part of the deliverable.
- [ ] **Responsive to window resizing using flexbox and/or grid display** - I did not complete this part of the deliverable.
- [ ] **Use of a imported font** - I did not complete this part of the deliverable.
- [ ] **Use of different types of selectors including element, class, ID, and pseudo selectors** - I did not complete this part of the deliverable.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Bundled using Vite** - I did not complete this part of the deliverable.
- [ ] **Components** - I did not complete this part of the deliverable.
- [ ] **Router** - I did not complete this part of the deliverable.

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.
- [ ] **Supports registration, login, logout, and restricted endpoint** - I did not complete this part of the deliverable.

## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
