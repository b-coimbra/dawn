const CONFIG = new Config({
  crypto: {
    coin: 'ETH',
    currency: 'USD',
    refreshIn: 10
  },
  overrideStorage: true, // override localStorage with fixed userconfig values
  temperature: {
    location: 'Brasília',
    scale: 'C'
  },
  clock: {
    format: 'h:i',
    iconColor: '#ff7b95'
  },
  search: {
    engines: {
      g: ['https://google.com/search?q=', 'Google'],
      i: ['https://ixquick.com/do/search?q=', 'Ixquick'],
      d: ['https://duckduckgo.com/html?q=', 'DuckDuckGo'],
      y: ['https://youtube.com/results?search_query=', 'Youtube'],
      w: ['https://en.wikipedia.org/w/index.php?search=', 'Wikipedia']
    }
  },
  keybindings: {
    "t": 'todo-list',
    "s": 'search-bar'
  },
  disabled: ['todo-list', 'search-bar', 'crypto-rate'],
  openLastVisitedTab: true,
  tabs: [
    {
      name: '家',
      background_url: 'src/img/banners/bg-1.gif',
      categories: [{
        name: 'social',
        links: [
          {
            url: 'https://twitter.com/home',
            name: 'twitter'
          },
          {
            name: 'reddit',
            url: 'https://www.reddit.com/'
          },
          {
            name: 'gmail',
            url: 'https://mail.google.com/'
          },
          {
            name: 'steam',
            url: 'https://steamcommunity.com/my/profile'
          }
        ]
      },
      {
        name: 'Comfy',
        links: [
          {
            name: 'netflix',
            url: 'https://www.netflix.com/'
          },
          {
            name: 'twitch',
            url: 'https://www.twitch.tv/'
          },
          {
            name: 'prime video',
            url: 'https://www.primevideo.com/'
          },
          {
            name: 'cvnflix',
            url: 'https://plex.cvnflix.com/web/index.html#'
          }
        ]
      },
      {
        name: 'Misc',
        links: [
          {
            name: 'github',
            url: 'https://github.com/',
          },
          {
            name: 'dev.to',
            url: 'https://dev.to'
          },
          {
            name: 'radarr',
            url: 'https://radarr.cvnflix.com/'
          },
          {
            name: 'sonarr',
            url: 'https://sonarr.cvnflix.com/'
          },
          {
            name: 'overseerr',
            url: 'https://overseerr.cvnflix.com/'
          },
          {
            name: 'pocket',
            url: 'https://getpocket.com/saves'
          }
        ]
      }
      ]
    },
    {
      name: 'メディア',
      background_url: 'src/img/banners/bg-2.gif',
      categories: [
        {
          name: 'media',
          links: [
            {
              url: 'https://www.spotify.com',
              name: 'spotify'
            },
            {
              url: 'https://soundcloud.com/',
              name: 'soundcloud'
            },
            {
              url: 'https://youtu.be/',
              name: 'youtu.be'
            },
            {
              url: 'https://lofigenerator.com/',
              name: 'lo-fi'
            },
            {
              url: 'https://www.pixiv.net/en/',
              name: 'pixiv'
            }
          ]
        },
        {
          name: 'study',
          links: [
            {
              name: 'the odin project',
              url: 'https://www.theodinproject.com/'
            },
            {
              name: 'freecodecamp',
              url: 'https://www.freecodecamp.org/'
            },
            {
              name: 'udemy',
              url:'https://www.udemy.com/home/my-courses/learning/'
            },
            {
              name: 'coursera',
              url: 'https://www.coursera.org/'
            },
            {
              name: 'the algorithms',
              url: ' https://the-algorithms.com/'
            },
            {
              name: 'neetcode',
              url: 'https://neetcode.io'
            },
            {
              name: 'fullstackopen',
              url: 'https://fullstackopen.com/en/'
            }
          ]
        }
      ]
    },
    {
      name: 'テクノロジー',
      background_url: 'src/img/banners/bg-3.gif',
      categories: [
        {
          name: 'subreddits',
          links: [
            {
              name: 'r/startpages',
              url: 'https://www.reddit.com/r/startpages/'
            },
            {
              name: 'r/unixporn',
              url: 'https://www.reddit.com/r/unixporn/'
            },
            {
              name: 'r/programming',
              url: 'https://www.reddit.com/r/programming/'
            },
            {
              name: 'r/firefoxcss',
              url: 'https://www.reddit.com/r/FirefoxCSS/'
            },
            {
              name: 'r/desktops',
              url: 'https://www.reddit.com/r/desktops/'
            }
          ]
        },
          {
            name: 'others',
            links: [
            {
              name: 'codewars',
              url: 'https://www.codewars.com/dashboard'
            },            {
              name: 'keybr',
              url: 'https://www.keybr.com/'
            },            {
              name: 'ezgif',
              url: 'https://ezgif.com/'
            },
            {
              name: 'color picker',
              url: 'https://colorpicker.me'
            },
            {
              name: 'dev resources',
              url: 'https://devresourc.es/'
            }
          ]
        }
      ]
    }]
});
