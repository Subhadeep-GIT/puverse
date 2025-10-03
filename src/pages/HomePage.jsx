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

export default function HomePage({ user, onLogout }) {
  // Main bottom nav tab
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "feed";
  });

  // Nested feed/post tab
  const [feedTab, setFeedTab] = useState(() => {
    return localStorage.getItem("feedTab") || "feed";
  });

  // Notification toast state
  const [showNotification, setShowNotification] = useState(false);

  // Persist active tab in localStorage
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Persist nested feed tab
  useEffect(() => {
    localStorage.setItem("feedTab", feedTab);
  }, [feedTab]);

  // Handle notification toast
  const handleNotificationsClick = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="homepage">
      {/* Header with notifications */}
      <Header
        user={user}
        onLogout={onLogout}
        onNotificationsClick={handleNotificationsClick}
      />

      <main className="homepage-main page-content">
        {/* Feed Section */}
        {activeTab === "feed" && (
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

        {/* Profile Section */}
        {activeTab === "profile" && <ProfileTab user={user} />}

        {/* Chat Section */}
        {activeTab === "chat" && <ChatBox user={user} />}

        {/* Notifications Section (optional) */}
        {activeTab === "notifications" && (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            🔔 Notifications will appear here.
          </p>
        )}
      </main>

      {/* Bottom navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Notification toast */}
      <NotificationToast
        show={showNotification}
        message="You have 3 new notifications!"
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}