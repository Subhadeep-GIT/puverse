import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatList from "./ChatList"; // 👈 Import

export default function ChatBox({ user }) {
  const [chatWith, setChatWith] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Fetch messages between current user and selected user
  const fetchMessages = async () => {
    if (!chatWith) return;
    try {
      const res = await axios.get(
        `http://localhost:5001/api/chat/${user.user_id}/${chatWith.user_id}`,
        { withCredentials: true }
      );
      if (res.data.success) setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !chatWith) return;
    try {
      const res = await axios.post(
        "http://localhost:5001/api/chat",
        { senderId: user.user_id, receiverId: chatWith.user_id, message: input },
        { withCredentials: true }
      );
      if (res.data.success) {
        setMessages(prev => [...prev, res.data.chat]);
        setInput("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [chatWith]);

  return (
    <div className="chat-container">
      <div className="chat-users">
        <h4>Select a user:</h4>
        {/* 👇 Use ChatList to render user list */}
        <ChatList user={user} onSelect={setChatWith} />
      </div>

      <div className="chat-box">
        {!chatWith && <p>Select a user to start chatting.</p>}

        {chatWith && (
          <>
            <div className="messages">
              {messages.map(msg => (
                <div
                  key={msg.chat_id}
                  className={msg.sender_id === user.user_id ? "message-sent" : "message-received"}
                >
                  <strong>{msg.sender?.username || "Unknown"}:</strong> {msg.message}
                </div>
              ))}
            </div>

            <div className="input-box">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} disabled={!input.trim()}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}