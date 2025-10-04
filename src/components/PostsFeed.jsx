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

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/posts`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setPosts(res.data.posts);
          // Preload comments for each post
          res.data.posts.forEach((post) => fetchComments(post.post_id));
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

  // Fetch comments for a post
  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`${BASE_URL}/comments/${postId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setComments((prev) => ({ ...prev, [postId]: res.data.comments }));
      }
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
    }
  };

  // Handle new comment submission (optimistic)
  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    const text = newComment[postId]?.trim();
    if (!text) return;

    // Optimistically update UI
    const tempComment = {
      comment_id: `temp-${Date.now()}`, // temporary ID
      comment_text: text,
      User: { username: "You" }, // show as current user immediately
    };
    setComments((prev) => ({
      ...prev,
      [postId]: [tempComment, ...(prev[postId] || [])],
    }));
    setNewComment((prev) => ({ ...prev, [postId]: "" }));

    try {
      const res = await axios.post(
        `${BASE_URL}/comments`,
        { post_id: postId, comment_text: text },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Replace temp comment with actual comment from backend
        setComments((prev) => ({
          ...prev,
          [postId]: [res.data.comment, ...prev[postId].filter(c => c.comment_id !== tempComment.comment_id)],
        }));
      } else {
        // Remove temp comment if backend fails
        setComments((prev) => ({
          ...prev,
          [postId]: prev[postId].filter(c => c.comment_id !== tempComment.comment_id),
        }));
        console.error("Failed to add comment:", res.data.message);
      }
    } catch (err) {
      // Remove temp comment on error
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter(c => c.comment_id !== tempComment.comment_id),
      }));
      console.error("Error adding comment:", err);
    }
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
                <img
                  src={`http://localhost:5001${post.image_path}`}
                  alt="Post"
                />
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
                    <strong>{comment.User?.username || "User"}:</strong>{" "}
                    <span>{comment.comment_text}</span>
                  </div>
                ))}
              </div>

              {/* Add New Comment */}
              <form
                className="comment-form"
                onSubmit={(e) => handleCommentSubmit(post.post_id, e)}
              >
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment[post.post_id] || ""}
                  onChange={(e) =>
                    setNewComment((prev) => ({
                      ...prev,
                      [post.post_id]: e.target.value,
                    }))
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