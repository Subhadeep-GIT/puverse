// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import "../styles/homepage.css";

import Header from "../components/Header";
import NotificationToast from "../components/NotificationToast";
import BottomNav from "../components/BottomNav";
import Tabs from "../components/Tabs";
import PostsFeed from "../components/PostsFeed";
import CreatePost from "../components/CreatePost";
import ProfileTab from "../components/ProfileTab";
import ChatBox from "../components/ChatBox";
import WeatherCard from "../components/WeatherCard";
import DogCard from "../components/DogCard";
import SearchTab from "../components/SearchTab";

export default function HomePage({ user, onLogout }) {
  // ✅ Main bottom nav tab
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "feed";  // ✅ changed
  });

  // Nested feed/post tab
  const [feedTab, setFeedTab] = useState(() => {
    return localStorage.getItem("feedTab") || "feed";
  });

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("feedTab", feedTab);
  }, [feedTab]);

  const handleNotificationsClick = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="homepage">
      <Header
        user={user}
        onLogout={onLogout}
        onNotificationsClick={handleNotificationsClick}
      />

      <main className="homepage-main page-content">
        {/* ✅ Home / Feed Section */}
        {activeTab === "feed" && (     // ✅ changed from "home" to "feed"
          <>
            <Tabs activeTab={feedTab} setActiveTab={setFeedTab} />

            {feedTab === "feed" && (
              <>
                <WeatherCard />
                <DogCard />
                <PostsFeed user={user} />
              </>
            )}

            {feedTab === "post" && <CreatePost user={user} />}
          </>
        )}

        {activeTab === "search" && <SearchTab user={user} />}
        {activeTab === "profile" && <ProfileTab user={user} />}
        {activeTab === "chat" && <ChatBox user={user} />}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <NotificationToast
        show={showNotification}
        message="You have 3 new notifications!"
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}