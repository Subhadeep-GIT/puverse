import React, { useState } from "react";
import axios from "axios";
import "../styles/createpost.css";

export default function CreatePost({ user }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [allowCopy, setAllowCopy] = useState(false);
  const [filter, setFilter] = useState("none");

  // Handle image selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
    setFilter("none");
    setAllowCopy(false);
    setMessage("");
  };

  // Submit post
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
      const res = await axios.post("http://localhost:5001/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setMessage(res.data.message || "Post uploaded!");
      setAllowCopy(true);
      setCaption("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload post");
    } finally {
      setLoading(false);
    }
  };

  // Copy caption to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(caption || "");
    alert("Caption copied to clipboard!");
  };

  return (
    <div className="post-card create-post-card">
      <h3>Create a Post</h3>

      <form onSubmit={handleSubmit}>
        {/* Image Preview */}
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

        {/* Caption */}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Submit button */}
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Post"}
        </button>
      </form>

      {/* Allow copying if post successful */}
      {allowCopy && (
        <button className="copy-btn" onClick={handleCopy}>
          Copy Caption
        </button>
      )}

      {/* Message */}
      {message && <p className="message">{message}</p>}
    </div>
  );
}