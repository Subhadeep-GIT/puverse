import { useState, useEffect } from "react";
import { login, signup, verifyOTP } from "../api/auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function AuthForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(300);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLogin && step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isLogin, step, timer]);

  const formatTime = (t) =>
    `${Math.floor(t / 60).toString().padStart(2, "0")}:${(t % 60)
      .toString()
      .padStart(2, "0")}`;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await login({ email: form.email, password: form.password });
      if (res.success) onLogin(res.user || res);
      else setMessage(`❌ ${res.message}`);
    } catch {
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await signup(form);
      if (res.success) {
        setStep(2);
        setMessage("✅ OTP sent to your email!");
        setTimer(300);
      } else setMessage(`❌ ${res.message}`);
    } catch {
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return setMessage("❌ Please enter OTP");
    setLoading(true);
    setMessage("");
    try {
      const res = await verifyOTP({ email: form.email, otp });
      if (res.success) {
        setMessage("🎉 Signup complete! You can now login.");
        setStep(1);
        setIsLogin(true);
      } else setMessage(`❌ ${res.message}`);
    } catch {
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-toggle">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => {
            setIsLogin(true);
            setStep(1);
            setMessage("");
          }}
        >
          Sign In
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => {
            setIsLogin(false);
            setStep(1);
            setMessage("");
          }}
        >
          Sign Up
        </button>
      </div>

      {isLogin ? (
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            name="email"
            placeholder="Mobile number or email address"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <span
              className="password-icon"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? <EyeSlashIcon className="eye-icon" /> : <EyeIcon className="eye-icon" />}
            </span>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      ) : step === 1 ? (
        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <span
              className="password-icon"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? <EyeSlashIcon className="eye-icon" /> : <EyeIcon className="eye-icon" />}
            </span>
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="auth-form">
          <p>OTP sent to: <b>{form.email}</b></p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
            disabled={loading || timer === 0}
          />
          <p>Expires in: {Math.floor(timer/60).toString().padStart(2,"0")}:{(timer%60).toString().padStart(2,"0")}</p>
          <button type="submit" disabled={loading || timer === 0}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          {timer === 0 && <p className="otp-expired">OTP expired. Signup again.</p>}
        </form>
      )}

      {message && <p className="auth-message">{message}</p>}
    </div>
  );
}