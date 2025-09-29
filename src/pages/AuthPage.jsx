// src/pages/AuthPage.jsx
import { useState } from "react";
import SignupForm from "../components/SignupForm";
import LoginPage from "../components/LoginPage";
import "../styles/login.css";   // shared login styles
import "../styles/signup.css";  // shared signup styles

export default function AuthPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'signup'

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Active Form */}
        <div className="auth-form-container">
          {activeTab === "login" ? (
            <LoginPage 
              switchToSignup={() => setActiveTab("signup")} 
              onLogin={onLogin}   // propagate login to App.jsx for SPA
            />
          ) : (
            <SignupForm 
              switchToLogin={() => setActiveTab("login")} 
            />
          )}
        </div>
      </div>
    </div>
  );
}