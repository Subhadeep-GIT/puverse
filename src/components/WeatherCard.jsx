// src/components/WeatherCard.jsx
import React from "react";

export default function WeatherCard({ weather, error }) {
  return (
    <div className="post-card">
      <div className="post-header">
        <span role="img" aria-label="weather">🌍</span>
        <h3>Weather Update</h3>
      </div>
      <div className="post-body">
        {error && <p className="error">{error}</p>}
        {weather ? (
          <>
            <p><strong>{weather.location}</strong></p>
            <p>{weather.condition}</p>
            <p>🌡️ {weather.temp}°C (Feels like {weather.feelsLike}°C)</p>
            <p>💧 Humidity: {weather.humidity}%</p>
            <p>🌬️ Wind: {weather.wind} m/s</p>
          </>
        ) : <p>Fetching weather...</p>}
      </div>
    </div>
  );
}