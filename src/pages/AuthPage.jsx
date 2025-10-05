import React from "react";
import AuthForm from "../components/AuthForm";
import "../styles/AuthForm.css";

export default function AuthPage({ onLogin }) {
  return (
    <div className="auth-page">
      {/* Mobile top image */}
      <div className="mobile-top-image"></div>

      {/* Form container */}
      <div className="form-wrapper">
        <h1 className="form-title">PUVerse</h1>
        <AuthForm onLogin={onLogin} />

        {/* Secondary links */}
        <div className="secondary-links">
          <a href="#">Forgotten password?</a>
          <a href="#">Create new account</a>
          <span>About • Help • More</span>
        </div>
      </div>
    </div>
  );
}