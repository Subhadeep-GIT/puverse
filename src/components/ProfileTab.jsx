// src/components/ProfileTab.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ProfileTab.css"; // dedicated CSS

export default function ProfileTab({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [profileImage, setProfileImage] = useState(user?.profile_pic || null);

  const fetchUserPosts = () => {
    if (!user?.id) return;
    setLoading(true);
    axios
      .get(`http://localhost:5001/api/posts/user/${user.id}`)
      .then((res) => {
        if (res.data.success) setPosts(res.data.posts);
      })
      .catch((err) => console.error("Failed to fetch user posts:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserPosts();
  }, [user]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setDeletingPostId(postId);
      const res = await axios.delete(`http://localhost:5001/api/posts/${postId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setPosts(posts.filter((p) => p.post_id !== postId));
      } else {
        alert(res.data.message || "Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post");
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_pic", file);

    try {
      const res = await axios.post(
        `http://localhost:5001/api/user/${user.id}/profile-pic`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.success) {
        setProfileImage(res.data.profile_pic);
      }
    } catch (err) {
      console.error("Failed to update profile picture:", err);
      alert("Failed to update profile picture");
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="profile-tab">
      <div className="profile-header">
        <div className="profile-pic-wrapper">
          {profileImage ? (
            <img src={`http://localhost:5001${profileImage}`} alt="Profile" className="profile-pic" />
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
                  src={`http://localhost:5001${post.image_path}`}
                  alt="Post"
                  className="post-image"
                />
              )}
              <p>{post.caption}</p>
              <small>{new Date(post.created_at).toLocaleString()}</small>
              <button
                onClick={() => handleDelete(post.post_id)}
                disabled={deletingPostId === post.post_id}
                className="delete-button"
              >
                {deletingPostId === post.post_id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}