// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import "../styles/homepage.css";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import PostsFeed from "../components/PostsFeed";
import CreatePost from "../components/CreatePost";
import ProfileTab from "../components/ProfileTab";
import ChatBox from "../components/ChatBox";
import WeatherCard from "../components/WeatherCard";
import DogCard from "../components/DogCard";
import Tabs from "../components/Tabs";

export default function HomePage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("feed");   // main bottom nav
  const [feedTab, setFeedTab] = useState("feed");       // nested tabs for feed/post

  // Weather state
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
                clear: "☀️",
                clouds: "☁️",
                rain: "🌧️",
                snow: "❄️",
                thunderstorm: "⛈️",
                drizzle: "🌦️",
                mist: "🌫️",
                fog: "🌫️",
              };
              const icon = iconMap[data.weather[0].main.toLowerCase()] || "🌡️";
              setWeather({
                location: `${data.name}, ${data.sys.country}`,
                temp: data.main.temp,
                feelsLike: data.main.feels_like,
                condition: `${icon} ${data.weather[0].description}`,
                humidity: data.main.humidity,
                wind: data.wind.speed,
              });
            } else setWeatherError("Could not fetch weather data.");
          })
          .catch(() => setWeatherError("Could not fetch weather data."));
      },
      () => setWeatherError("Geolocation not available or denied.")
    );
  }, []);

  // Dog API state
  const [dogImage, setDogImage] = useState(null);
  const [dogHeading, setDogHeading] = useState("");
  const dogHeadings = [
    "Paws and Relax: Latest Doggos in Action!",
    "Barking News: Meet Our Furry Friends!",
    "Tail-Wagging Tales: Canine Chronicles",
    "Fetch the Fun: Dogs That Make Your Day!",
    "Woof-Worthy Moments: Dogs Stealing the Show!",
    "Pawprints and Smiles: The Dog Diaries",
    "Fur-ever Friends: Highlighting Doggo Adventures!",
    "Bark-a-lot: Latest Pups on Patrol!",
    "Sniffing Out Joy: Dogs on the Go!",
    "Canine Corner: Where Happiness Has a Tail!"
  ];

  useEffect(() => {
    fetch("https://dog.ceo/api/breeds/image/random")
      .then(res => res.json())
      .then(data => setDogImage(data.message))
      .catch(() => setDogImage(null));
    setDogHeading(dogHeadings[Math.floor(Math.random() * dogHeadings.length)]);
  }, []);

  return (
    <div className="homepage">
      <Header user={user} onLogout={onLogout} />

      <main className="homepage-main">
        {/* Feed Section with Tabs */}
        {activeTab === "feed" && (
          <>
            <Tabs activeTab={feedTab} setActiveTab={setFeedTab} />
            {feedTab === "feed" && (
              <>
                <WeatherCard weather={weather} error={weatherError} />
                <DogCard dogImage={dogImage} dogHeading={dogHeading} />
                <PostsFeed user={user} />
              </>
            )}
            {feedTab === "post" && <CreatePost user={user} />}
          </>
        )}

        {/* Profile Section */}
        {activeTab === "profile" && <ProfileTab user={user} />}

        {/* Chat Section */}
        {activeTab === "chat" && <ChatBox user={user} />}

        {/* Notifications Section (placeholder) */}
        {activeTab === "notifications" && (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            🔔 Notifications will appear here.
          </p>
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}