// src/components/NotificationToast.jsx
import React from "react";
import "../styles/NotificationToast.css";

export default function NotificationToast({ message, show, onClose }) {
  return (
    <div className={`notification-toast ${show ? "show" : ""}`}>
      <div className="message">{message}</div>
      <button className="close-btn" onClick={onClose} aria-label="Close">
        &times;
      </button>
    </div>
  );
}