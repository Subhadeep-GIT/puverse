import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BACKEND_URL || "http://localhost:5001/api";

// Create a post (with image)
export const createPost = async (formData) => {
  try {
    const res = await axios.post(`${BASE_URL}/posts`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Post API error:", err);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to create post",
    };
  }
};

// Fetch all posts
export const fetchPosts = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/posts`, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Fetch posts error:", err);
    return { success: false, posts: [] };
  }
};