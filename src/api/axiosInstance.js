// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND_URL || "http://localhost:5001/api",
  withCredentials: true,
});

export default axiosInstance;