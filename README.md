# dawn
A startpage called "dawn".

<p align="center">
  <img src="https://i.imgur.com/xOjR4Gq.png">
  <a href="https://b-coimbra.github.io/dawn/">LIVE PREVIEW</a>
</div>

## Keybindings

- <kbd>Numrow</kbd> to switch tabs
- <kbd>t</kbd> to open create task panel
- <kbd>s</kbd> to open search dialog

## Configuration

Some settings can be tweaked by changing the `GLOBAL_CONFIG` object located in `src/js/script.js`.

### Clock

Change the clock format in the status bar using [strftime.org](https://strftime.org) format.

Config example (`script.js`):

```js
const GLOBAL_CONFIG = new Config({
    // ...
    clock: 'h:i p',        // 13:30 PM
    clock: 'do B Y - h:i', // 18th January 2021 - 13:30
    clock: 'h:i - m/b/Y'   // 13:30 - 3/Jul/2021
});
```

### Weather temperature

Change your location and temperature scale (celius, fahrenheit) like such:

```js
const GLOBAL_CONFIG = new Config({
  // ...
  temperature: {
    location: 'New York',
    scale: 'C'
  }
});
```

## Features / TODOs

  - Add more statusbar sections
    - [X] Live crypto price
    - [ ] `MAYBE` RSS reader
    - [ ] `MAYBE` Terminal section
  - `REFACTOR` Use web components
    - [X] Crypto
    - [X] Weather
    - [X] Clock
    - [X] Todo
    - [X] Statusbar
    - [ ] Search
  - [X] Update low-res task close button
  - [X] Handle component loading (fix pop-in)
  - [ ] Task section
    - [X] Task reordering
    - [ ] Add task subtitle
    - [ ] Task priority ('!' '!!', '!!!') or colour representation (red, yellow, green)
    - [ ] Task add hyperlinks
    - [ ] Ability to schedule deadlines for tasks
      - [ ] Add option in the addTodo pane or in the task itself
      - [ ] `MAYBE` Calendar select
      - [ ] Time diff when completing tasks
    - [ ] Task menu
      - [ ] Change priority
      - [ ] Edit task title/subtitle
    - [ ] `MAYBE` Subtasks with todos
      - [ ] Progress bar at the top
  - [ ] Make search bar more accessible
    - [ ] Create statusbar button for search
  - [ ] Import/export todos
  - [ ] Import/export settings
  - [ ] Settings tab/modal/page
    - [ ] Statusbar tab indicator (roman numerals, hiragana, numbers)
    - [ ] Colorscheme manipulation
    - [ ] `MAYBE` Optional sound fx
  - [ ] `MAYBE` Sync todo with google calendar
  - [ ] Clock toggle on the "boards" banner
  - [ ] Randomize banner gifs
  - [ ] Create favicon
  - [ ] Make todo list scrollable
  - [ ] Store last visited panel
  - [ ] `MAYBE` Subsections for todo DEADLINE ("today", "upcoming")
  - [ ] Better animation for marking as "done"
  - [ ] Ability to add panels dynamically
    - [ ] Specific folder to keep default settings, localStorage overrides it
  - [ ] Verify updates on startup (keep track of versions)
