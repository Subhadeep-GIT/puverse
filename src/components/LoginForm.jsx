// src/components/LoginForm.jsx
import { useState } from "react";
import { login } from "../api/auth";

export default function LoginForm({ switchToSignup, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await login(form);
      if (res.success) {
        setMessage("✅ Logged in successfully!");
        onLogin(res);
      } else {
        setMessage(`❌ ${res.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Login</h2>

      <form onSubmit={handleLogin} className="signup-form">
        {["email", "password"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            required
            disabled={loading}
            className="signup-input"
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          className="signup-btn"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes("❌") ? "signup-error" : "signup-success"
          }`}
        >
          {message}
        </p>
      )}

      <p className="signup-switch">
        Don't have an account?{" "}
        <button
          className="signup-switch-btn"
          onClick={switchToSignup}
        >
          Sign Up now
        </button>
      </p>
    </div>
  );
}