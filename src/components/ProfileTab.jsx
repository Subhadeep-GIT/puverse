import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/ProfileTab.css";

export default function ProfileTab({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(user?.profile_pic || null);
  const [menuOpen, setMenuOpen] = useState(null); // Track which post menu is open
  const [commentsOpen, setCommentsOpen] = useState({}); // Track open comments per post
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  const BASE_URL_NO_API = import.meta.env.VITE_API_BACKEND_URL
    ? import.meta.env.VITE_API_BACKEND_URL.replace("/api", "")
    : "http://localhost:5001";

  // ---------- Fetch User Posts ----------
  const fetchUserPosts = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/posts/user/${user.id}`);
      if (res.data.success) setPosts(res.data.posts);
      else console.error("Failed to fetch posts:", res.data.message);
    } catch (err) {
      console.error("Failed to fetch user posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  // ---------- Delete Post ----------
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await axiosInstance.delete(`/posts/${postId}`);
      if (res.data.success) {
        setPosts((prev) => prev.filter((p) => p.post_id !== postId));
      } else alert(res.data.message || "Failed to delete post");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    }
  };

  // ---------- Update Profile Picture ----------
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_pic", file);

    try {
      const res = await axiosInstance.post(
        `/user/${user.id}/profile-pic`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.success) setProfileImage(res.data.profile_pic);
    } catch (err) {
      console.error("Failed to update profile picture:", err);
      alert("Failed to update profile picture");
    }
  };

  // ---------- Comments ----------
  const toggleComments = async (postId) => {
    setCommentsOpen((prev) => ({ ...prev, [postId]: !prev[postId] }));
    if (!comments[postId]) fetchComments(postId);
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axiosInstance.get(`/comments/${postId}`);
      if (res.data.success) {
        setComments((prev) => ({ ...prev, [postId]: res.data.comments }));
      }
    } catch (err) {
      console.error(`Failed to fetch comments for post ${postId}:`, err);
    }
  };

  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    const text = newComment[postId]?.trim();
    if (!text) return;

    const tempComment = {
      comment_id: `temp-${Date.now()}`,
      comment_text: text,
      User: { username: "You" },
    };

    setComments((prev) => ({
      ...prev,
      [postId]: [tempComment, ...(prev[postId] || [])],
    }));
    setNewComment((prev) => ({ ...prev, [postId]: "" }));

    try {
      const res = await axiosInstance.post("/comments", { post_id: postId, comment_text: text });
      if (res.data.success) {
        setComments((prev) => ({
          ...prev,
          [postId]: [
            res.data.comment,
            ...prev[postId].filter((c) => c.comment_id !== tempComment.comment_id),
          ],
        }));
      } else {
        setComments((prev) => ({
          ...prev,
          [postId]: prev[postId].filter((c) => c.comment_id !== tempComment.comment_id),
        }));
        console.error("Failed to add comment:", res.data.message);
      }
    } catch (err) {
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.comment_id !== tempComment.comment_id),
      }));
      console.error("Error adding comment:", err);
    }
  };

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className="profile-tab">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-pic-wrapper">
          {profileImage ? (
            <img
              src={`${BASE_URL_NO_API}${profileImage}`}
              alt="Profile"
              className="profile-pic"
            />
          ) : (
            <div className="profile-pic placeholder">{getInitials(user?.username)}</div>
          )}
          <label className="edit-pic">
            <input type="file" accept="image/*" onChange={handleProfilePicChange} />
            <span className="pencil-icon">✏️</span>
          </label>
        </div>

        <div className="profile-info">
          <h3>{user?.username || "Username"}</h3>
          <p>{user?.email || "Email not available"}</p>
        </div>
      </div>

      {/* Posts */}
      <h4>Your Posts</h4>
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>You haven’t uploaded any posts yet.</p>
      ) : (
        <div className="profile-posts">
          {posts.map((post) => (
            <div key={post.post_id} className="post-card">
              {post.image_path && (
                <img
                  src={`${BASE_URL_NO_API}${post.image_path}`}
                  alt="Post"
                  className="post-image"
                />
              )}
              {post.caption && <p>{post.caption}</p>}
              <small>{new Date(post.created_at).toLocaleString()}</small>

              {/* 3-dot Menu */}
              <div className="post-actions">
                <span className="three-dots" onClick={() => setMenuOpen(menuOpen === post.post_id ? null : post.post_id)}>
                  ⋮
                </span>
                {menuOpen === post.post_id && (
                  <div className="actions-menu">
                    <button onClick={() => handleDelete(post.post_id)}>Delete Post</button>
                    <button onClick={() => toggleComments(post.post_id)}>
                      {commentsOpen[post.post_id] ? "Hide Comments" : "Show Comments"}
                    </button>
                  </div>
                )}
              </div>

              {/* Comments Section */}
              {commentsOpen[post.post_id] && (
                <div className="comments-section">
                  <div className="comments-list">
                    {(comments[post.post_id] || []).map((comment) => (
                      <div key={comment.comment_id} className="comment-item">
                        <strong>{comment.User?.username || "User"}:</strong> {comment.comment_text}
                      </div>
                    ))}
                  </div>
                  <form className="comment-form" onSubmit={(e) => handleCommentSubmit(post.post_id, e)}>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment[post.post_id] || ""}
                      onChange={(e) =>
                        setNewComment((prev) => ({ ...prev, [post.post_id]: e.target.value }))
                      }
                    />
                    <button type="submit">Post</button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}