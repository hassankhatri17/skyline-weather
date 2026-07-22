// main.js
import { Header } from './components/header.js';
import { SearchBar, mountSearchBar } from './components/searchbar.js';
import {
  CityPicker, CurrentWeather, ForecastList,
  LoadingState, ErrorState, EmptyState, NotFoundState,
} from './components/weather.js';
import { Footer } from './components/footer.js';
import { geocodeCity, fetchWeather } from './api.js';

const resultsEl = () => document.getElementById('results');

let unit = 'C';
let lastQuery = '';
let currentPlace = null;
let currentWeatherData = null;

function friendlyMessage(err) {
  if (err.message === 'NETWORK') {
    return "We couldn't reach the weather service. Check your internet connection and try again.";
  }
  if (err.message?.startsWith('API_')) {
    const status = err.message.split('_')[1];
    return `The weather service responded with an error (status ${status}). This is usually temporary — try again in a moment.`;
  }
  return 'Something unexpected went wrong while loading the forecast.';
}

function renderWeather() {
  resultsEl().innerHTML =
    `<div class="weather-grid">
      ${CurrentWeather(currentPlace, currentWeatherData.current, unit)}
      ${ForecastList(currentWeatherData.daily, unit)}
    </div>`;
}

async function loadWeatherFor(place) {
  currentPlace = place;
  resultsEl().innerHTML = LoadingState();
  try {
    currentWeatherData = await fetchWeather(place.lat, place.lon);
    renderWeather();
  } catch (err) {
    resultsEl().innerHTML = ErrorState(friendlyMessage(err));
    document.getElementById('retry-btn')?.addEventListener('click', () => loadWeatherFor(place));
  }
}

async function handleSearch(query) {
  lastQuery = query;
  resultsEl().innerHTML = LoadingState();

  let matches;
  try {
    matches = await geocodeCity(query);
  } catch (err) {
    resultsEl().innerHTML = ErrorState(friendlyMessage(err));
    document.getElementById('retry-btn')?.addEventListener('click', () => handleSearch(query));
    return;
  }

  if (matches.length === 0) {
    resultsEl().innerHTML = NotFoundState(query);
    return;
  }

  if (matches.length === 1) {
    loadWeatherFor(matches[0]);
    return;
  }

  resultsEl().innerHTML = CityPicker(matches);
  document.querySelectorAll('.city-option').forEach(btn => {
    btn.addEventListener('click', () => loadWeatherFor(matches[Number(btn.dataset.index)]));
  });
}

function handleUnitChange(newUnit) {
  unit = newUnit;
  if (currentPlace && currentWeatherData) renderWeather();
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = [
    Header(),
    SearchBar(),
    `<main class="container"><div id="results">${EmptyState()}</div></main>`,
    Footer(),
  ].join('');

  mountSearchBar({ onSearch: handleSearch, onUnitChange: handleUnitChange });
}

document.addEventListener('DOMContentLoaded', render);
