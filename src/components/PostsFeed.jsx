// src/components/PostsFeed.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/postsfeed.css";

export default function PostsFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/posts", {
          withCredentials: true,
        });

        if (res.data.success) {
          setPosts(res.data.posts);
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
          </div>
        ))
      )}
    </div>
  );
}