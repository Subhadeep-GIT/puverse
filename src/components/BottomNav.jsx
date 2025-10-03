import React from "react";

const tabs = [
  { key: "feed", label: "Feed", icon: "fa-solid fa-house" },
  { key: "profile", label: "Profile", icon: "fa-solid fa-user" },
  { key: "chat", label: "Chat", icon: "fa-solid fa-comment" },
  { key: "notifications", label: "Notifications", icon: "fa-solid fa-bell" },
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
          <i className={tab.icon}></i>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}