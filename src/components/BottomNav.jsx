// src/components/BottomNav.jsx
import React from "react";

const TABS = [
  { key: "feed", label: "Home", icon: "fa-solid fa-house" },
  { key: "search", label: "Search", icon: "fa-solid fa-magnifying-glass" },
  { key: "chat", label: "Chat", icon: "fa-solid fa-comment" },
  { key: "profile", label: "Profile", icon: "fa-solid fa-user" },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  const handleTabClick = (key) => {
    setActiveTab(key);
    if (key === "feed") {
      localStorage.setItem("feedTab", "feed"); // ✅ Reset nested tab when going home
    }
  };

  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      {TABS.map(({ key, label, icon }) => (
        <button
          key={key}
          className={activeTab === key ? "active" : ""}
          onClick={() => handleTabClick(key)}
          aria-label={label}
        >
          <i className={icon}></i>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}