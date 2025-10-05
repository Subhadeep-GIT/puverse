import React, { useState, useEffect } from "react";
import { login, signup, verifyOTP } from "../api/auth";
import "../styles/AuthForm.css";

export default function AuthForm({ onLogin, isLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // For signup OTP
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(300);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isLogin && step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isLogin, step, timer]);

  const formatTime = t => `${Math.floor(t / 60).toString().padStart(2,"0")}:${(t % 60).toString().padStart(2,"0")}`;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true); setMessage("");
    try {
      const res = await login({ email: form.email, password: form.password });
      if (res.success) onLogin(res.user || res);
      else setMessage(`❌ ${res.message}`);
    } catch { setMessage("❌ Something went wrong."); }
    finally { setLoading(false); }
  };

  const handleSignup = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setMessage("❌ Passwords do not match");
    setLoading(true); setMessage("");
    try {
      const res = await signup(form);
      if (res.success) { setStep(2); setTimer(300); setMessage("✅ OTP sent to your email!"); }
      else setMessage(`❌ ${res.message}`);
    } catch { setMessage("❌ Something went wrong."); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async e => {
    e.preventDefault();
    if (!otp) return setMessage("❌ Please enter OTP");
    setLoading(true); setMessage("");
    try {
      const res = await verifyOTP({ email: form.email, otp });
      if (res.success) { setMessage("🎉 Signup complete! You can now login."); setStep(1); }
      else setMessage(`❌ ${res.message}`);
    } catch { setMessage("❌ Something went wrong."); }
    finally { setLoading(false); }
  };

  const handleGoogleLogin = () => alert("Google Login clicked");
  const handleFacebookLogin = () => alert("Facebook Login clicked");

  // Login Form
  if (isLogin) {
    return (
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="text"
          name="email"
          placeholder="Mobile number or email"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <button type="button" onClick={() => setShowPassword(p => !p)}>👁</button>
        </div>
        <div className="text-right">
          <a href="#">Forgotten password?</a>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
        {message && <p className="auth-message">{message}</p>}
      </form>
    );
  }

  // Signup Form - Step 1
  if (step === 1) {
    return (
      <>
        <form onSubmit={handleSignup} className="auth-form">
          <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} disabled={loading} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} disabled={loading} required />
          <div className="input-group">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} disabled={loading} required />
            <button type="button" onClick={() => setShowPassword(p => !p)}>👁</button>
          </div>
          <div className="input-group">
            <input type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} disabled={loading} required />
            <button type="button" onClick={() => setShowConfirm(p => !p)}>👁</button>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          {message && <p className="auth-message">{message}</p>}
        </form>

        <div className="auth-divider"><span>Or continue with</span></div>
        <div className="social-buttons">
          <button onClick={handleGoogleLogin}>Google</button>
          <button onClick={handleFacebookLogin}>Facebook</button>
        </div>
      </>
    );
  }

  // Signup Form - Step 2 (OTP)
  return (
    <form onSubmit={handleVerifyOTP} className="auth-form">
      <p>OTP sent to <b>{form.email}</b></p>
      <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" disabled={loading || timer === 0} required />
      <p>Expires in: {formatTime(timer)}</p>
      <button type="submit" disabled={loading || timer === 0}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      {timer === 0 && <p className="auth-message">OTP expired. Signup again.</p>}
      {message && <p className="auth-message">{message}</p>}
    </form>
  );
}