// components/weather.js
import { describeCode } from '../api.js';

function toDisplayTemp(celsius, unit) {
  const value = unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
  return Math.round(value);
}

function dayLabel(dateStr, index) {
  if (index === 0) return 'Today';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function CityPicker(matches) {
  return `
    <div class="state-panel picker-panel">
      <h3>Multiple places match — pick one</h3>
      <ul class="city-list">
        ${matches.map((m, i) => `
          <li>
            <button class="city-option" data-index="${i}">
              <span class="city-name">${m.name}</span>
              <span class="city-region">${[m.admin1, m.country].filter(Boolean).join(', ')}</span>
            </button>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}

export function CurrentWeather(place, current, unit) {
  const [label, icon] = describeCode(current.code);
  return `
    <div class="current-card">
      <div class="current-top">
        <div>
          <h2>${place.name}</h2>
          <span class="current-region">${[place.admin1, place.country].filter(Boolean).join(', ')}</span>
        </div>
        <span class="current-icon" aria-hidden="true">${icon}</span>
      </div>
      <div class="current-temp">${toDisplayTemp(current.temp, unit)}°<span class="unit-label">${unit}</span></div>
      <p class="current-label">${label}</p>
      <div class="current-stats">
        <div><span>Humidity</span><strong>${current.humidity}%</strong></div>
        <div><span>Wind</span><strong>${Math.round(current.wind)} km/h</strong></div>
      </div>
    </div>
  `;
}

export function ForecastList(daily, unit) {
  return `
    <div class="forecast-section">
      <h3>7-day forecast</h3>
      <div class="forecast-list">
        ${daily.map((d, i) => {
          const [label, icon] = describeCode(d.code);
          return `
            <div class="forecast-item">
              <span class="forecast-day">${dayLabel(d.date, i)}</span>
              <span class="forecast-icon" aria-hidden="true">${icon}</span>
              <span class="forecast-label">${label}</span>
              <span class="forecast-temps">
                <strong>${toDisplayTemp(d.max, unit)}°</strong>
                <span class="forecast-min">${toDisplayTemp(d.min, unit)}°</span>
              </span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function LoadingState() {
  return `
    <div class="state-panel loading-panel" role="status" aria-live="polite">
      <div class="skeleton-current"></div>
      <div class="skeleton-forecast">
        ${Array.from({ length: 7 }).map(() => `<div class="skeleton-day"></div>`).join('')}
      </div>
      <p class="loading-label">Fetching forecast…</p>
    </div>
  `;
}

export function ErrorState(message) {
  return `
    <div class="state-panel error-panel" role="alert">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <h3>Couldn't load the forecast</h3>
      <p>${message}</p>
      <button class="btn btn-retry" id="retry-btn">Try again</button>
    </div>
  `;
}

export function EmptyState() {
  return `
    <div class="state-panel empty-panel">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21C7 16 4 12.4 4 8.5 4 5.4 6.4 3 9.5 3c1.6 0 3 .7 4 1.9C14.5 3.7 16 3 17.5 3 20.6 3 23 5.4 23 8.5 23 12.4 20 16 15 21z"/></svg>
      <h3>Search for a city to get started</h3>
      <p>Try "Karachi," "London," or any city name.</p>
    </div>
  `;
}

export function NotFoundState(query) {
  return `
    <div class="state-panel empty-panel">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <h3>No city found matching "${query}"</h3>
      <p>Check the spelling, or try a nearby larger city.</p>
    </div>
  `;
}
