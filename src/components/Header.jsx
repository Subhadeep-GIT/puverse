// ✅ src/components/Header.jsx
import React from "react";
import "../styles/Header.css";
import HamburgerMenu from "./HamburgerMenu";

export default function Header({ user, onNotificationsClick, onLogout }) {
  return (
    <header className="homepage-header">
      {/* Branding */}
      <div className="header-greeting">PU_Verse</div>

      {/* Right-side actions */}
      <div className="header-actions">
        {/* Notifications button */}
        <button
          className="notifications-btn"
          onClick={onNotificationsClick}
          aria-label="Notifications"
        >
          <i className="fa-solid fa-bell"></i>
          <span className="notification-dot"></span>
        </button>

        {/* Hamburger menu with username and logout callback */}
        <HamburgerMenu
          username={user?.username}
          email={user?.email}    // optional
          onSignOut={onLogout}   // callback from HomePage
        />
      </div>
    </header>
  );
}