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

## React Part 1: Routing

Setting up Vite and React was pretty simple. I had a bit of trouble because of conflicting CSS. This isn't as straight forward as you would find with Svelte or Vue, but I made it work in the end. If there was a ton of CSS it would be a real problem. It sure was nice to have the code structured in a more usable way.

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
