"use strict";

// ======================================================
// SELECT ELEMENTS
// ======================================================

const searchForm = document.getElementById("searchForm");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const condition = document.getElementById("condition");

// ======================================================
// API SETTINGS
// ======================================================

const weatherFields =
  "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,pressure_msl";

const geocodingUrl = "https://geocoding-api.open-meteo.com/v1/search?name=";

const weatherUrl = "https://api.open-meteo.com/v1/forecast";

// ======================================================
// SEARCH CITY FUNCTION
// ======================================================

async function searchCity(cityName) {
  loading.classList.remove("hidden");
  errorMessage.classList.add("hidden");

  searchBtn.disabled = true;
  searchBtn.textContent = "Searching...";

  try {
    const response = await fetch(
      `${geocodingUrl}${encodeURIComponent(cityName)}`,
    );

    if (!response.ok) {
      throw new Error("Failed to load content.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("City not found.");
    }

    const city = data.results[0];

    const latitude = city.latitude;
    const longitude = city.longitude;

    await getWeather(latitude, longitude);
  } catch (error) {
    loading.classList.add("hidden");
    errorMessage.classList.remove("hidden");

    console.error(error);
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
}

// ======================================================
// GET WEATHER FUNCTION
// ======================================================

async function getWeather(latitude, longitude) {
  try {
    const apiUrl = `${weatherUrl}?latitude=${latitude}&longitude=${longitude}&current=${weatherFields}&timezone=auto`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch weather data.");
    }

    const data = await response.json();

    const delay = Math.floor(Math.random() * 500) + 500;

    await new Promise((resolve) => {
      setTimeout(resolve, delay);
    });

    renderWeather(data);
  } catch (error) {
    loading.classList.add("hidden");
    errorMessage.classList.remove("hidden");

    console.error("Weather API error:", error);
  }
}
// ======================================================
// RENDER WEATHER FUNCTION
// ======================================================

function renderWeather(data) {
  const current = data.current;

  temperature.textContent = `${current.temperature_2m}°C`;

  feelsLike.textContent = `${current.apparent_temperature}°C`;

  humidity.textContent = `${current.relative_humidity_2m}%`;

  windSpeed.textContent = `${current.wind_speed_10m} km/h`;

  pressure.textContent = `${current.pressure_msl} hPa`;

  condition.textContent = getWeatherCondition(current.weather_code);

  loading.classList.add("hidden");
}

// ======================================================
// WEATHER CODE FUNCTION
// ======================================================

function getWeatherCondition(weatherCode) {
  switch (weatherCode) {
    case 0:
      return "Clear Sky";

    case 1:
      return "Mainly Clear";

    case 2:
      return "Partly Cloudy";

    case 3:
      return "Overcast";

    case 61:
      return "Rain";

    default:
      return "Unknown";
  }
}

// ======================================================
// HANDLE SEARCH FUNCTION
// ======================================================

function handleSearch(e) {
  e.preventDefault();

  const value = cityInput.value.trim();

  if (value === "") return;

  searchCity(value);
}

// ======================================================
// EVENT LISTENERS
// ======================================================

searchForm.addEventListener("submit", handleSearch);

// ======================================================
// INITIAL LOAD
// ======================================================

searchCity("Bratislava");
