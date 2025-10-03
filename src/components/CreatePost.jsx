// src/components/CreatePost.jsx
import React, { useState } from "react";
import axios from "axios";
import "../styles/createpost.css"; // CSS file

export default function CreatePost({ user }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");

  // Handle image selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setMessage("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
    formData.append("userId", user?.id);

    try {
      const res = await axios.post("http://localhost:5001/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setMessage(res.data.message || "Post uploaded!");
      setCaption("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload post");
    }
  };

  return (
    <div className="post-card create-post-card">
      <h3>Create a Post</h3>

      <form onSubmit={handleSubmit}>
        {/* Image Preview */}
        {preview ? (
          <img src={preview} alt="Preview" className="preview-image" />
        ) : (
          <label className="file-label">
            Choose an image
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        )}

        {/* Caption */}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button type="submit">Post</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}