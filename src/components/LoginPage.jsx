import { useState } from "react";
import { login } from "../api/auth";
import "../styles/login.css";

export default function LoginPage({ switchToSignup, onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await login(form);
      if (res.success) {
        setMessage("✅ Logged in successfully!");
        onLoginSuccess(res); // Notify parent that login succeeded
      } else {
        setMessage(`❌ ${res.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="login-input"
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="login-input"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="login-btn"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && (
        <p
          className={`login-message ${
            message.includes("❌") ? "error-msg" : "success-msg"
          }`}
        >
          {message}
        </p>
      )}

      <p className="login-switch">
        Don't have an account?{" "}
        <button className="login-switch-btn" onClick={switchToSignup}>
          Sign Up now
        </button>
      </p>
    </div>
  );
}