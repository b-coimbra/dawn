# dawn

<p align="center">
  <img src="https://i.imgur.com/vjfMONS.png">
</div>

<p align="center">
  <img src="https://i.imgur.com/IrDF4LX.png">
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

For now, some settings can be tweaked by changing the `CONFIG` object located in `./userconfig.js`.

### Disabling a component

To disable a component, put their name into the list of `disabled` components:

```js
const CONFIG = new Config({
    // ...
    disabled: ['todo-list'] // search-bar, crypto-rate, current-time, weather-forecast, status-bar
});
```

### Tabs

Create new tabs and categories like so:

```js
const CONFIG = new Config({
    // ...
    tabs: [
        {
            name: 'boards',
            background_url: 'src/res/banners/bg-1.gif',
            categories: [{
                name: 'fun',
                links: [{
                    url: 'https://youtube.com',
                    name: 'youtube',
                    icon: 'brand-youtube',
                    icon_color: '#996767'
                }]
            }]
        }
    ]
)
```

All the available icons can be found on [tabler-icons](https://tabler-icons.io).

### Clock

Change the clock format in the status bar using [strftime.org](https://strftime.org) format.

Config example (`userconfig.js`):

```js
const CONFIG = new Config({
    // ...
    clock: 'h:i p',        // 13:30 PM
    clock: 'do B Y - h:i', // 18th January 2021 - 13:30
    clock: 'h:i - m/b/Y'   // 13:30 - 3/Jul/2021
});
```

### Weather temperature

Change your location and temperature scale (celius, fahrenheit) like such:

```js
const CONFIG = new Config({
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
const CONFIG = new Config({
  // ...
  crypto: {
    coin: 'ETH', // BTC, LINK, DOGE etc
    currency: 'USD', // EUR, JPY, BRL etc
    refreshIn: 15 // refresh time (in seconds)
  },
});
```

## Features

  - [X] No external libraries
  - [X] Web component based
  - [X] Status bar components
    - [X] Clock/Date
    - [X] Live crypto
    - [X] Current weather
      - [ ] `REFACTOR` Show weather location on hover
    - [ ] `MAYBE` RSS reader
    - [ ] Add new panels
    - [ ] Store last visited panel
  - [X] Quick search panel
  - [ ] Todo/schedule panel
    - [X] Reordering
    - [X] Task priority
    - [ ] Task reminder
      - [ ] `MAYBE` Sync todo with google calendar
    - [X] Link to external URL
    - [X] Filter by task status (TODO/DONE)
    - [ ] Filter by task priority
    - [X] Clean all tasks button
    - [X] Edit task button
    - [ ] `MAYBE` Subtasks w/ progress bar
    - [ ] `MAYBE` Subsections for todo DEADLINE ("today", "upcoming")
  - [ ] Links section
    - [ ] Add new links button
    - [ ] Add link icon
    - [ ] Drag/drop reorganize
    - [ ] Category styles (compact, icon, full)
  - [ ] Configuration
    - [X] Disable components
    - [ ] Change keybindings
    - [ ] Import/export settings
    - [ ] Randomize banner gifs
    - [ ] Toggle status bar sections
    - [ ] Status bar tab indicator (roman numerals, hiragana, numbers)
    - [ ] Colorscheme manipulation
    - [ ] `MAYBE` Optional sound fx
  - [ ] `REFACTOR` Unify storage into a single JSON object
  - [ ] Create favicon
  - [ ] Keybinding cheatsheet
  - [ ] Verify updates on startup
