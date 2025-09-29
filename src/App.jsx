// src/App.jsx
import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { logout } from "./api/auth";

export default function App() {
  const [user, setUser] = useState(null); // null = not logged in

  // Logout handler: destroys session on backend and resets state
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null); // redirect to AuthPage
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">PUVerse</h1>

        {user ? (
          <HomePage user={user} onLogout={handleLogout} />
        ) : (
          <AuthPage onLoginSuccess={setUser} />
        )}
      </div>
    </div>
  );
}