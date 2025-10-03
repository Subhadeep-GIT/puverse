// src/components/Tabs.jsx
import React from "react";
import "../styles/Tabs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUpload } from "@fortawesome/free-solid-svg-icons";

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="tabs">
      <button
        className={activeTab === "feed" ? "active" : ""}
        onClick={() => setActiveTab("feed")}
      >
        <FontAwesomeIcon icon={faHouse} /> Feed
      </button>
      <button
        className={activeTab === "post" ? "active" : ""}
        onClick={() => setActiveTab("post")}
      >
        <FontAwesomeIcon icon={faUpload} /> Post
      </button>
    </div>
  );
}