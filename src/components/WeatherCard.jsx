// src/components/WeatherCard.jsx
import React, { useEffect, useState } from "react";
import "../styles/WeatherCard.css";

export default function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const weatherApiKey = "d492a9c5cc83fe84797ff4ef0bcc6f6f";

  useEffect(() => {
    if (!navigator.geolocation) return setWeatherError("Geolocation not available.");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${weatherApiKey}&units=metric`
        )
          .then(res => res.json())
          .then(data => {
            if (data.cod === 200) {
              const iconMap = {
                clear: "sunny",
                clouds: "cloudy",
                rain: "rainy",
                snow: "snowy",
                thunderstorm: "thunder",
                drizzle: "rainy",
                mist: "fog",
                fog: "fog",
              };
              const main = data.weather[0].main.toLowerCase();
              setWeather({
                location: `${data.name}, ${data.sys.country}`,
                temp: data.main.temp,
                feelsLike: data.main.feels_like,
                condition: data.weather[0].description,
                humidity: data.main.humidity,
                wind: data.wind.speed,
                main,
                icon: iconMap[main] || "sunny",
              });
            } else {
              setWeatherError("Could not fetch weather data.");
            }
          })
          .catch(() => setWeatherError("Could not fetch weather data."));
      },
      () => setWeatherError("Geolocation not available or denied.")
    );
  }, []);

  return (
    <div className={`post-card weather-${weather?.main || ""}`}>
      {/* Animated background */}
      <div className="weather-bg">
        <div className="particles">
          {[...Array(30)].map((_, i) => (
            <span key={i} className="particle"></span>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="post-header">
        <span role="img" aria-label="weather" className={`icon-${weather?.icon || "sunny"}`}>
          {weather?.icon === "sunny" && "☀️"}
          {weather?.icon === "cloudy" && "☁️"}
          {weather?.icon === "rainy" && "🌧️"}
        </span>
        <h3>Weather Update</h3>
      </div>

      {/* Body */}
      <div className="post-body">
        {weatherError && <p className="error">{weatherError}</p>}
        {weather ? (
          <>
            <p><strong>{weather.location}</strong></p>
            <p>{weather.condition}</p>
            <p>🌡️ {weather.temp}°C (Feels like {weather.feelsLike}°C)</p>
            <p>💧 Humidity: {weather.humidity}%</p>
            <p>🌬️ Wind: {weather.wind} m/s</p>
          </>
        ) : !weatherError ? (
          <p>Fetching weather...</p>
        ) : null}
      </div>
    </div>
  );
}