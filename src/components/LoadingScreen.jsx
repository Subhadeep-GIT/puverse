// src/components/LoadingScreen.jsx
import React from "react";
import "./LoadingScreen.css";

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}