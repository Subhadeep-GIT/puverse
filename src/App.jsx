// src/App.jsx
import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { logout } from "./api/auth";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const { user, setUser, loading } = useAuth();

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Show loading screen while auth state is initializing
  if (loading) return <LoadingScreen message="Initializing PUVerse..." />;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-md flex-1 flex flex-col justify-center">
        {user ? (
          <HomePage user={user} onLogout={handleLogout} />
        ) : (
          <AuthPage onLogin={setUser} />
        )}
      </div>
    </div>
  );
}