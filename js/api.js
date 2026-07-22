// api.js
// All network logic lives here. Two public functions:
//   geocodeCity(name)  -> list of matching places
//   fetchWeather(lat, lon) -> { current, daily } weather data

const GEOCODE_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

// WMO weather codes, mapped to a short label + emoji icon (no image assets needed).
export const WEATHER_CODES = {
  0: ['Clear sky', '☀️'],
  1: ['Mostly clear', '🌤️'],
  2: ['Partly cloudy', '⛅'],
  3: ['Overcast', '☁️'],
  45: ['Fog', '🌫️'],
  48: ['Depositing fog', '🌫️'],
  51: ['Light drizzle', '🌦️'],
  53: ['Drizzle', '🌦️'],
  55: ['Dense drizzle', '🌦️'],
  61: ['Light rain', '🌧️'],
  63: ['Rain', '🌧️'],
  65: ['Heavy rain', '🌧️'],
  71: ['Light snow', '🌨️'],
  73: ['Snow', '🌨️'],
  75: ['Heavy snow', '❄️'],
  80: ['Rain showers', '🌦️'],
  81: ['Rain showers', '🌦️'],
  82: ['Violent showers', '⛈️'],
  95: ['Thunderstorm', '⛈️'],
  96: ['Thunderstorm, hail', '⛈️'],
  99: ['Thunderstorm, hail', '⛈️'],
};

export function describeCode(code) {
  return WEATHER_CODES[code] ?? ['Unknown', '🌡️'];
}

async function safeFetch(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (networkErr) {
    throw new Error('NETWORK');
  }
  if (!response.ok) {
    throw new Error('API_' + response.status);
  }
  return response.json();
}

export async function geocodeCity(name) {
  const url = `${GEOCODE_ENDPOINT}?name=${encodeURIComponent(name)}&count=5&language=en&format=json`;
  const data = await safeFetch(url);
  return (data.results ?? []).map(r => ({
    name: r.name,
    country: r.country ?? '',
    admin1: r.admin1 ?? '',
    lat: r.latitude,
    lon: r.longitude,
  }));
}

export async function fetchWeather(lat, lon) {
  const url = `${FORECAST_ENDPOINT}?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=7`;
  const data = await safeFetch(url);

  return {
    current: {
      temp: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      wind: data.current.wind_speed_10m,
      code: data.current.weather_code,
    },
    daily: data.daily.time.map((date, i) => ({
      date,
      code: data.daily.weather_code[i],
      max: data.daily.temperature_2m_max[i],
      min: data.daily.temperature_2m_min[i],
    })),
  };
}
