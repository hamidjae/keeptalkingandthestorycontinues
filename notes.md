# CS 260 Notes

[My startup - Keep Typing and the Story Continues!](https://keeptalkingandthestorycontinues.click)

The top-level domain is .click<br>
The root domain is keeptalkingandthestorycontinues.click<br>
The domain name correctly handles subdomains.

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

My IP address is: 100.50.162.166<br>
Faced no problems establishing this part of the deliverable. However, I need to remember that I use Git Bash in order to ssh, etc.

## Caddy

No problems. I used Git Bash here as well to access my Caddyfile.

## HTML

Form elements are how I can have "input boxes."
Example:
<form action="submission.html" method="post">
  <label for="ta">TextArea: </label>
  <textarea id="ta" name="ta-id">
Some text
  </textarea>
  <button type="submit">Submit</button>
</form>

The quote after "type" can be changed to alter the type of button it needs to be.
text	Single line textual value
password	Obscured password
email	Email address
tel	Telephone number
url	URL address
number	Numerical value
checkbox	Inclusive selection
radio	Exclusive selection
range	Range limited number
date	Year, month, day
datetime-local	Date and time
month	Year, month
week	Week of year
color	Color
file	Local file
submit	button to trigger form submission

Otherwise, HTML was quite straightforward. I need to remember to provide alts for any visuals I add.
Additionally, giving buttons their own IDs is extremely helpful when doing CSS styling.

## CSS

CSS is quite confusing at first, but it looks to be straightforward once you understand what's going on. Bootstrap also seems very useful, and I definitely want to implement Bootstrap elements into my webpage to quickly stylize buttons. 
The reading in Canvas also was the exact format I wanted my game.html page to be in, so I'll need to figure out how to correctly adapt that into my webpage.

Bootstrap is surprisingly easy to use once you get over the initial hurdle. I have to make sure I use the proper version of CSS, otherwise nothing works.

Resizing an image with Flexbox was a bit more complicated. I managed to get it working, but the important part to note is to make everything related to the picture relative to the entire webpage. Otherwise, the picture starts weirdly zooming in and out.

## React Part 1: Routing

This step was quite straightforward. I did not have to change any of my CSS thankfully (since I know some students had issues since React basically takes in every single CSS file.) However, I did have to change parts of my code, notably where I established style inside of an html instead of css, to make it compatible with .jsx
Alongside this, some elements needed to be self-closing, such as <br> and <input>
I must remember to do that in the future as well. 
Other than that, this was an incredibly straightforward deliverable and I wish I did it sooner to stock up on some more grace days.
I am running into some trouble with the Simon deliverable, so I'll have to visit the TAs about it.

## React Part 2: Reactivity

This was a lot of fun to see it all come together. I had to keep remembering to use React state instead of just manipulating the DOM directly.

Handling the toggling of the checkboxes was particularly interesting.

```jsx
<div className="input-group sound-button-container">
  {calmSoundTypes.map((sound, index) => (
    <div key={index} className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        value={sound}
        id={sound}
        onChange={() => togglePlay(sound)}
        checked={selectedSounds.includes(sound)}
      ></input>
      <label className="form-check-label" htmlFor={sound}>
        {sound}
      </label>
    </div>
  ))}
</div>
```
