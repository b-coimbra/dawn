# dawn
A startpage called "dawn".

<p align="center">
  <img src="https://i.imgur.com/cTT6yNk.png">
  <a href="https://b-coimbra.github.io/dawn/">LIVE PREVIEW</a>
</div>

## Keybindings

- <kbd>Numrow</kbd> Switch tabs
- <kbd>t</kbd> Open the create task panel
  - <kbd>Enter</kbd> Create a task
  - <kbd>Tab</kbd> Go to next field
- <kbd>s</kbd> Open the search dialog
- <kbd>Esc</kbd> Close the edit/create task panel (when field is focused)

## Configuration

For now, some settings can be tweaked by changing the `GLOBAL_CONFIG` object located in `./userconfig.js`.

### Disabling a component

To disable a component, put their name into the list of `disabled` components:

```js
const GLOBAL_CONFIG = new Config({
    // ...
    disabled: ['todo-list'] // search-bar, crypto-rate, current-time, weather-forecast, status-bar
});
```

### Clock

Change the clock format in the status bar using [strftime.org](https://strftime.org) format.

Config example (`userconfig.js`):

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

### Crypto status

For the live crypto status, provide a crypto coin and a FIAT currency. Example:

```js
const GLOBAL_CONFIG = new Config({
  // ...
  crypto: {
    coin: 'ETH', // BTC, LINK, DOGE etc
    currency: 'USD', // EUR, JPY, BRL etc
    refreshIn: 15 // refresh time (in seconds)
  },
});
```

## Features / TODOs

  - [ ] Add more statusbar sections
    - [X] Live crypto price
    - [ ] `MAYBE` RSS reader
  - [X] `REFACTOR` Use web components
    - [X] Crypto
    - [X] Weather
    - [X] Clock
    - [X] Todo
    - [X] Statusbar
    - [X] Search
  - [X] Update low-res task close button
  - [X] Handle component loading (fix pop-in)
  - [X] Setting to disable components
  - [ ] `REFACTOR` Show weather location on hover
    - [ ] Settings tab/modal/page
    - [ ] Statusbar tab indicator (roman numerals, hiragana, numbers)
    - [ ] Colorscheme manipulation
    - [ ] Toggle statusbar sections
    - [ ] Toggle TODO panel
    - [ ] `MAYBE` Optional sound fx
  - [ ] Task section
    - [X] Task reordering
    - [X] Task clean all button
    - [X] Filter by done/TBD
    - [X] Task add subtitles
    - [X] Make todo list scrollable
    - [X] Task filter by completion state
    - [X] Task add priority
    - [X] Task add external URLs
    - [ ] Task add reminder
      - [X] Clicking on reminder opens the link assigned to the task
    - [ ] Ability to schedule deadlines for tasks
      - [ ] Add option in the addTodo pane or in the task itself
      - [ ] Calendar select
      - [ ] Time diff when completing tasks
      - [ ] Use windows' notification feature
    - [ ] Task menu
      - [X] Edit task
      - [X] Edit priority
    - [ ] `MAYBE` Subtasks with todos
      - [ ] Progress bar at the top
  - [ ] Make search bar more accessible
    - [ ] Create statusbar button for search
  - [ ] Unify storage into a single JSON object
  - [ ] Change search engine prefix
  - [ ] Ability to add link icons
  - [ ] Import/export todos
  - [ ] Import/export settings
  - [ ] Keybinding cheatsheet
  - [ ] `MAYBE` Sync todo with google calendar
  - [ ] Randomize banner gifs
  - [ ] Create favicon
  - [ ] Store last visited panel
  - [ ] `MAYBE` Subsections for todo DEADLINE ("today", "upcoming")
  - [ ] Ability to add panels dynamically
    - [ ] Specific folder to keep default settings
  - [ ] Verify updates on startup
