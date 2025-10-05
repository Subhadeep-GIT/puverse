// src/App.jsx
import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { logout } from "./api/auth";
import axios from "axios";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const { user, setUser, loading } = useAuth();
  const [backendAlive, setBackendAlive] = useState(false);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Check backend health
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BACKEND_URL || "http://localhost:5001/api"}/health`,
          { headers: { "ngrok-skip-browser-warning": "true" } }
        );
        if (res.data.status === "ok") setBackendAlive(true);
      } catch (err) {
        setBackendAlive(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000); // optional: recheck every 30s
    return () => clearInterval(interval);
  }, []);

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

      {/* Backend status indicator */}
      <div
        className={`p-2 mt-4 rounded text-white transition-colors duration-300 ${
          backendAlive ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {backendAlive ? "Backend reachable ✅" : "Backend unreachable ❌"}
      </div>
    </div>
  );
}