// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth"; // use centralized helper

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser(); // now uses helper with ngrok header
        if (res.success) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, setUser, loading };
};