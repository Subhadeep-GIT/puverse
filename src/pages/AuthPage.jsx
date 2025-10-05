import React, { useState, useEffect } from "react";
import AuthForm from "../components/AuthForm";
import "../styles/AuthForm.css";

export default function AuthPage({ onLogin }) {
  // Load last active tab from localStorage, default to signup
  const [isLogin, setIsLogin] = useState(() => {
    const saved = localStorage.getItem("puverse_isLogin");
    return saved !== null ? saved === "true" : false;
  });

  // Save current tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("puverse_isLogin", isLogin);
  }, [isLogin]);

  return (
    <div className="auth-page">
      {/* Background image */}
      <div
        className="auth-bg"
        style={{
          backgroundImage:
            "url('https://ums.paruluniversity.ac.in/Default/assets/pages/img/1.jpg')",
        }}
      ></div>

      {/* Main content */}
      <main className="auth-main">
        <div className="auth-wrapper">
          {/* Header */}
          <div className="auth-header">
            <h1>PUVerse</h1>
            <p>
              {isLogin
                ? "Welcome back! Please enter your details."
                : "Create an account to get started."}
            </p>
          </div>

          {/* Auth Form */}
          <AuthForm onLogin={onLogin} isLogin={isLogin} />

          {/* Sign In / Sign Up Toggle */}
          <div className="auth-toggle">
            <button
              className={isLogin ? "active" : ""}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={!isLogin ? "active" : ""}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <div className="footer-links">
          <a href="#">About</a>
          <span>•</span>
          <a href="#">Help</a>
          <span>•</span>
          <a href="#">More</a>
        </div>
      </footer>
    </div>
  );
}