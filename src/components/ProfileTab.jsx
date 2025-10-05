import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/ProfileTab.css";

export default function ProfileTab({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(user?.profile_pic || null);
  const [activeMenu, setActiveMenu] = useState(null); // Track which post's menu is open
  const [modal, setModal] = useState({ visible: false, postId: null });

  const BASE_URL_NO_API = import.meta.env.VITE_API_BACKEND_URL
    ? import.meta.env.VITE_API_BACKEND_URL.replace("/api", "")
    : "http://localhost:5001";

  const fetchUserPosts = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/posts/user/${user.id}`);
      if (res.data.success) setPosts(res.data.posts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  const handleDelete = async (postId) => {
    try {
      const res = await axiosInstance.delete(`/posts/${postId}`);
      if (res.data.success) {
        setPosts((prev) => prev.filter((p) => p.post_id !== postId));
      } else {
        alert(res.data.message || "Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    } finally {
      setModal({ visible: false, postId: null });
    }
  };

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
    }
  };

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className="profile-tab">
      {/* ---------- Profile Header ---------- */}
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
              <p>{post.caption}</p>
              <small>{new Date(post.created_at).toLocaleString()}</small>

              {/* ---------- 3-dot Menu ---------- */}
              <div className="post-actions">
                <span
                  className="three-dots"
                  onClick={() =>
                    setActiveMenu(activeMenu === post.post_id ? null : post.post_id)
                  }
                >
                  ⋮
                </span>
                {activeMenu === post.post_id && (
                  <div className="actions-menu">
                    <button onClick={() => setModal({ visible: true, postId: post.post_id })}>
                      Delete Post
                    </button>
                  </div>
                )}
              </div>

              {/* ---------- Comments Section ---------- */}
              <CommentsSection postId={post.post_id} />
            </div>
          ))}
        </div>
      )}

      {/* ---------- Modal for Delete Confirmation ---------- */}
      {modal.visible && (
        <div className="modal-overlay" onClick={() => setModal({ visible: false, postId: null })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>Are you sure you want to delete this post?</p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setModal({ visible: false, postId: null })}
              >
                Cancel
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(modal.postId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Comments Section Component ----------
function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/comments/${postId}`);
      if (res.data.success) setComments(res.data.comments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axiosInstance.post(`/comments`, {
        post_id: postId,
        comment_text: newComment,
      });
      if (res.data.success) {
        setComments((prev) => [res.data.comment, ...prev]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <div className="comments-section">
      <div className="comments-list">
        {comments.map((c) => (
          <div key={c.comment_id} className="comment-item">
            <strong>{c.User?.username || "User"}:</strong> {c.comment_text}
          </div>
        ))}
      </div>
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}