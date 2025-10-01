// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth"; // import the new helper

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser(); // use helper
        if (res.success) setUser(res.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, setUser, loading };
};