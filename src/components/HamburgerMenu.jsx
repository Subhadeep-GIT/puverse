// ✅ src/components/HamburgerMenu.jsx
import React, { useState, useEffect, useRef } from "react";
import "../styles/HamburgerMenu.css";

export default function HamburgerMenu({ username, email, onSignOut }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen(prev => !prev);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="hamburger-wrapper" ref={menuRef}>
      {/* Hamburger button */}
      <button
    className="hamburger-btn"
    onClick={toggleMenu}
    aria-label="Toggle menu"
  >
    <i className="fa-solid fa-bars fa-lg"></i> {/* cleaner single icon */}
  </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="hamburger-menu-dropdown full-right-menu">
          <div className="menu-bottom">
            <div className="menu-username">{username || "User"}</div>
            {email && <div className="menu-email">{email}</div>}
            <button className="signout-btn" onClick={onSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}