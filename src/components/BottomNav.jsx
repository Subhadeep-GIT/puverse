import React from "react";

const tabs = [
  { key: "feed", label: "🏠 Feed" },
  { key: "profile", label: "👤 Profile" },
  { key: "chat", label: "💬 Chat" },
  { key: "notifications", label: "🔔 Notifications" },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? "active" : ""}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}