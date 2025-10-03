// ChatList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ChatList({ user, onSelect }) {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5001/api/users", {
        withCredentials: true,
      });
      if (res.data.success) {
        const others = res.data.users.filter(u => u.user_id !== user.user_id);
        setUsers(others);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, [user]);

  return (
    <div className="chat-list">
      {users.length === 0 ? (
        <p>No users available</p>
      ) : (
        users.map(u => (
          <div
            key={u.user_id}
            className="chat-user"
            onClick={() => onSelect(u)}
          >
            {u.username}
          </div>
        ))
      )}
    </div>
  );
}