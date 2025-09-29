// src/api/auth.js
import axios from "axios";

// Base URL from environment variable (Vite-friendly)
// Fallback to localhost for local development
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

// Helper function for POST requests
const postRequest = async (url, data) => {
  try {
    const res = await axios.post(`${BASE_URL}${url}`, data, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("API request error:", err);
    return { success: false, message: err.response?.data?.message || err.message || "Request failed" };
  }
};

// Signup → request OTP
export const signup = async ({ username, email, password }) =>
  postRequest("/auth/signup", { username, email, password });

// Verify OTP → include email
export const verifyOTP = async ({ email, otp }) =>
  postRequest("/auth/verify-otp", { email, otp });

// Login → email + password
export const login = async ({ email, password }) =>
  postRequest("/auth/login", { email, password });

// Logout
export const logout = async () => postRequest("/auth/logout", {});