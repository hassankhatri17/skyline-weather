# Skyline — live weather app 

A small app that fetches live weather data for any searched city, built to
practice real API integration: loading states, error handling, and a
search flow — not just static content.

## API used

**[Open-Meteo](https://open-meteo.com)** — free, no API key or sign-up
required, no rate-limit wall for normal use. Two endpoints:

- **Geocoding API** (`geocoding-api.open-meteo.com/v1/search`) — turns a
  typed city name into coordinates (and handles ambiguous names, like
  multiple cities called "Paris").
- **Forecast API** (`api.open-meteo.com/v1/forecast`) — returns current
  conditions and a 7-day forecast for those coordinates.

## Framework choice

Plain **HTML / CSS / vanilla JS**, native ES modules, no build step —
consistent with the other tasks. All network logic lives in one isolated
file (`js/api.js`), so the fetch/error logic is easy to test in isolation
and easy to swap for a different API later.

## Structure

```
weather-explorer/
├── index.html                 # shell: fonts, CSS, js/main.js
├── css/
│   ├── tokens.css             # design tokens
│   └── styles.css             # base styles, components, responsive rules
├── js/
│   ├── api.js                 # all fetch logic + WMO weather-code lookup
│   ├── main.js                # orchestrates search -> geocode -> fetch -> render
│   └── components/
│       ├── header.js
│       ├── searchbar.js       # search input + °C/°F toggle (the "filter")
│       ├── weather.js         # current card, forecast list, city picker,
│       │                        loading / error / empty / not-found states
│       └── footer.js
└── README.md
```

## How the task requirements are met

- **Fetch and display a list of items, with loading and error states**
  — the 7-day forecast is the "list of items"; `LoadingState()` renders a
  skeleton (not a blank screen) while the request is in flight.
- **Search/filter input that updates displayed results** — the city
  search re-fetches; the °C/°F toggle re-renders the *same* fetched data
  with converted numbers, with no network call — a genuine client-side
  filter on already-fetched data.
- **Handle API failure with a friendly message** — `js/api.js` throws a
  typed error (`NETWORK` vs `API_<status>`), and `main.js` turns that into
  a specific, non-technical message with a **Try again** button that
  retries the exact last request.
- **Not-found vs error, kept distinct** — searching a city that doesn't
  exist (empty geocoding results) is not the same failure as the network
  being down, so it gets its own state and message instead of being
  lumped into the generic error panel.

## How to demo the error state for your recording

The cleanest way, without needing to actually break your internet:

1. Open the deployed site.
2. Open DevTools (F12) → **Network** tab.
3. Find the throttling dropdown (usually says "No throttling") → select
   **Offline**.
4. Search a city, or click **Try again** — the request fails and the
   friendly error panel appears.
5. Switch throttling back to "No throttling" (or "Online") and click
   **Try again** to show recovery.

## Running locally

```bash
python3 -m http.server 8080
```
Open `http://localhost:8080`. (Double-clicking `index.html` won't work —
the JS uses ES module imports, which browsers block over `file://`.)

## Deploying

**Netlify Drop (fastest)** — unzip this folder, drag it onto
[app.netlify.com/drop](https://app.netlify.com/drop), get an instant
live URL.

**GitHub Pages**
```bash
git init
git add .
git commit -m "Initial commit: Skyline weather app"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
Then: repo **Settings → Pages → Deploy from branch → main → / (root)**.
