// src/components/ProfileTab.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileTab({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState(null);

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
        // Use post_id here
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

  return (
    <div className="profile-tab">
      <h3>Your Profile</h3>
      <p>Username: {user?.username || "Not available"}</p>
      <p>Email: {user?.email || "Not available"}</p>

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