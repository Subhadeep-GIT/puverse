// src/App.jsx
import { useAuth } from "./hooks/useAuth";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { logout } from "./api/auth";

export default function App() {
  const { user, setUser, loading } = useAuth();

  // Logout handler: destroys session on backend and resets state
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null); // redirect to AuthPage
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        {user ? (
          <HomePage user={user} onLogout={handleLogout} />
        ) : (
          <AuthPage onLogin={setUser} />
        )}
      </div>
    </div>
  );
}