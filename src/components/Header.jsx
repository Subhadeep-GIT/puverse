// src/components/Header.jsx
import React from "react";

export default function Header({ user, onLogout }) {
  return (
    <header className="homepage-header">
      <button className="hamburger">☰</button>
      <h1>Welcome, {user?.username || "User"}</h1>
      <button onClick={onLogout} className="logout-btn">Logout</button>
    </header>
  );
}