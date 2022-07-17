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
    openLastVisitedTab: false,
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
  clock: {
    format: 'h:i p',        // 13:30 PM
    // format: 'do B Y - h:i', // 18th January 2021 - 13:30
    // format: 'h:i - m/b/Y',  // 13:30 - 3/Jul/2021
    iconColor: 'grey'
  }
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

Alternatively, click on the weather widget to swap between Celius and Fahrenheit.

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

Alternatively, click on the crypto widget to change the settings:

<p align="left">
  <img src="https://i.imgur.com/aUnoJLA.png">
</div>

## Features/TODO

  - [X] Status bar
    - [X] Clock/Date
    - [X] Live crypto
    - [X] Current weather
      - [X] `REFACTOR` Show weather location on hover
    - [ ] `MAYBE` RSS reader
  - [X] Quick search panel
  - [ ] Todo/schedule panel
    - [X] Reordering
    - [X] Task priority
    - [ ] Task reminder
      - [ ] `MAYBE` Sync todo with google calendar
    - [X] Link to external URL
    - [X] Filter by task status (TODO/DONE)
    - [ ] Sort by creation date
    - [ ] Sort by task priority
    - [X] Clean all tasks button
    - [X] Edit task button
    - [ ] `MAYBE` Subtasks w/ progress bar
    - [ ] `MAYBE` Subsections for todo DEADLINE ("today", "upcoming")
  - [ ] Tabs/Links section
    - [ ] Show link domain on hover
    - [ ] Category styles (compact, icon, full)
    - [ ] Add "create new tab" button
    - [X] Add link icon
    - [ ] Drag/drop reorganize
  - [ ] Crypto section
    - [ ] Load top 10 coins and currencies via API
  - [ ] Configuration
    - [X] Disable components
    - [ ] Toggle status bar sections
    - [X] Open last visited panel on new tab
    - [ ] Reset settings to default
    - [X] Change keybindings
    - [ ] Import/export settings
    - [ ] Randomize banner gifs
    - [ ] Status bar tab indicator (roman numerals, hiragana, numbers)
    - [ ] Colorscheme manipulation
    - [ ] `MAYBE` Optional sound fx
  - [ ] Create favicon
  - [ ] Keybinding cheatsheet
  - [ ] Verify updates on startup
