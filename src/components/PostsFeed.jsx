import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/postsfeed.css";

const BASE_URL = "http://localhost:5001/api";

export default function PostsFeed() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({}); // { [post_id]: [...] }
  const [newComment, setNewComment] = useState({}); // { [post_id]: "text" }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------- Fetch all posts ----------
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/posts`, { withCredentials: true });
        if (data.success) {
          setPosts(data.posts);
          data.posts.forEach((post) => fetchComments(post.post_id));
        } else {
          setError("Failed to load posts");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // ---------- Fetch comments for a post ----------
  const fetchComments = async (postId) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/comments/${postId}`, { withCredentials: true });
      if (data.success) {
        setComments((prev) => ({ ...prev, [postId]: data.comments }));
      }
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
    }
  };

  // ---------- Submit a new comment ----------
  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    const text = newComment[postId]?.trim();
    if (!text) return;

    // Optimistic UI update
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
      const { data } = await axios({
        method: "POST",
        url: `${BASE_URL}/comments`,
        data: { post_id: postId, comment_text: text },
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (data.success) {
        setComments((prev) => ({
          ...prev,
          [postId]: [data.comment, ...prev[postId].filter(c => c.comment_id !== tempComment.comment_id)],
        }));
      } else {
        removeTempComment(postId, tempComment.comment_id);
        console.error("Failed to add comment:", data.message);
      }
    } catch (err) {
      removeTempComment(postId, tempComment.comment_id);
      console.error("Error adding comment:", err);
    }
  };

  // ---------- Remove temporary comment ----------
  const removeTempComment = (postId, tempId) => {
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].filter(c => c.comment_id !== tempId),
    }));
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="posts-feed">
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.post_id} className="post-card">
            {/* Post Header */}
            <div className="post-header">
              <strong>{post.User?.username || "Unknown"}</strong>
              <span className="post-time">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>

            {/* Post Image */}
            {post.image_path && (
              <div className="post-image">
                <img src={`http://localhost:5001${post.image_path}`} alt="Post" />
              </div>
            )}

            {/* Post Caption */}
            {post.caption && <p className="post-caption">{post.caption}</p>}

            {/* Comments Section */}
            <div className="comments-section">
              <h4 className="comments-title">Comments</h4>
              <div className="comments-list">
                {(comments[post.post_id] || []).map((comment) => (
                  <div key={comment.comment_id} className="comment-item">
                    <strong>{comment.User?.username || "User"}:</strong> {comment.comment_text}
                  </div>
                ))}
              </div>

              {/* Add New Comment */}
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
          </div>
        ))
      )}
    </div>
  );
}