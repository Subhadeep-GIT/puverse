// src/components/Tabs.jsx
import React from "react";

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="tabs">
      <button
        className={activeTab === "feed" ? "active" : ""}
        onClick={() => setActiveTab("feed")}
      >
        Feed
      </button>
      <button
        className={activeTab === "post" ? "active" : ""}
        onClick={() => setActiveTab("post")}
      >
        Post
      </button>
    </div>
  );
}