import React, { useState } from "react";
import { createPost } from "../api/posts"; // ✅ Uses API helper
import "../styles/createpost.css";

export default function CreatePost({ user }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [allowCopy, setAllowCopy] = useState(false);
  const [filter, setFilter] = useState("none");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
    setFilter("none");
    setAllowCopy(false);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setMessage("Please select an image");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
    formData.append("userId", user?.id);

    try {
      const res = await createPost(formData); // ✅ Hitting correct backend

      if (res.success) {
        setMessage("Post uploaded successfully!");
        setAllowCopy(true);
        setCaption("");
        setImage(null);
        setPreview(null);
        setFilter("none");
      } else {
        setMessage(res.message || "Failed to upload post");
      }
    } catch (err) {
      console.error("❌ Error uploading post:", err);
      setMessage("An error occurred while uploading post");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caption || "");
    alert("Caption copied to clipboard!");
  };

  return (
    <div className="post-card create-post-card">
      <h3>Create a Post</h3>

      <form onSubmit={handleSubmit}>
        {preview ? (
          <div className="preview-wrapper">
            <img
              src={preview}
              alt="Preview"
              className="preview-image"
              style={{ filter }}
            />
            <div className="filter-buttons">
              <button type="button" onClick={() => setFilter("none")}>Normal</button>
              <button type="button" onClick={() => setFilter("grayscale(100%)")}>Gray</button>
              <button type="button" onClick={() => setFilter("brightness(1.2)")}>Bright</button>
              <button type="button" onClick={() => setFilter("contrast(1.5)")}>Contrast</button>
            </div>
          </div>
        ) : (
          <label className="file-label">
            Choose an image
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        )}

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Post"}
        </button>
      </form>

      {allowCopy && (
        <button className="copy-btn" onClick={handleCopy}>
          Copy Caption
        </button>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}