// src/api/auth.js
import axios from "axios";

// Base URL from environment variable (Vite-friendly)
// Fallback to localhost for local development
const BASE_URL = import.meta.env.VITE_API_BACKEND_URL || "http://localhost:5001/api";

// ---------- Axios helpers ----------
const request = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      withCredentials: true, // ✅ keep session cookies
      data,
    };

    const res = await axios(config);
    return res.data;
  } catch (err) {
    console.error("API request error:", err);
    return {
      success: false,
      message: err.response?.data?.message || err.message || "Request failed",
    };
  }
};

const get = (url) => request("get", url);
const post = (url, data) => request("post", url, data);

// ---------- Auth API ----------
export const signup = ({ username, email, password }) =>
  post("/auth/signup", { username, email, password });

export const verifyOTP = ({ email, otp }) =>
  post("/auth/verify-otp", { email, otp });

export const login = ({ email, password }) =>
  post("/auth/login", { email, password });

export const logout = () => post("/auth/logout");

export const getCurrentUser = () => get("/auth/me");