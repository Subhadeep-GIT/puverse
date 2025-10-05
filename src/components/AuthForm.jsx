import React, { useState, useEffect } from "react";
import { login, signup, verifyOTP } from "../api/auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

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

  // Placeholder functions for social login
  const handleGoogleLogin = () => alert("Google Login clicked");
  const handleFacebookLogin = () => alert("Facebook Login clicked");

  if (isLogin) {
    return (
      <form onSubmit={handleLogin} className="space-y-6">
        <input
          type="text"
          name="email"
          placeholder="Mobile number or email"
          className="w-full px-4 py-3 bg-input border-transparent rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
          value={form.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-input border-transparent rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none pr-12"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-4 flex items-center text-muted-foreground"
            onClick={() => setShowPassword(p => !p)}
          >
            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-right">
          <a href="#" className="text-sm font-medium text-primary hover:underline">Forgotten password?</a>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-all duration-300">
          {loading ? "Logging in..." : "Log In"}
        </button>
        {message && <p className="text-sm text-destructive mt-2">{message}</p>}
      </form>
    );
  }

  if (step === 1) {
    return (
      <>
        <form onSubmit={handleSignup} className="space-y-4">
          <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required disabled={loading}
            className="w-full px-4 py-3 bg-input border-transparent rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"/>
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required disabled={loading}
            className="w-full px-4 py-3 bg-input border-transparent rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"/>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} required disabled={loading}
              className="w-full px-4 py-3 bg-input border-transparent rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none pr-12"/>
            <button type="button" className="absolute inset-y-0 right-0 px-4 flex items-center text-muted-foreground" onClick={() => setShowPassword(p => !p)}>
              {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
            </button>
          </div>
          <div className="relative">
            <input type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required disabled={loading}
              className="w-full px-4 py-3 bg-input border-transparent rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none pr-12"/>
            <button type="button" className="absolute inset-y-0 right-0 px-4 flex items-center text-muted-foreground" onClick={() => setShowConfirm(p => !p)}>
              {showConfirm ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
            </button>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-all duration-300">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          {message && <p className="text-sm text-destructive mt-2">{message}</p>}
        </form>

        {/* Social login buttons */}
        <div className="relative my-6">
          <div aria-hidden="true" className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-sm text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-2 bg-input text-foreground font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-300">
            <img src="/icons/google.svg" alt="Google" className="w-5 h-5"/>
            <span>Google</span>
          </button>
          <button onClick={handleFacebookLogin} type="button" className="w-full flex items-center justify-center gap-2 bg-input text-foreground font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-300">
            <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5"/>
            <span>Facebook</span>
          </button>
        </div>
      </>
    );
  }

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <p>OTP sent to <b>{form.email}</b></p>
      <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" required disabled={loading || timer === 0}
        className="w-full px-4 py-3 bg-input border-transparent rounded-xl text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"/>
      <p>Expires in: {formatTime(timer)}</p>
      <button type="submit" disabled={loading || timer === 0} className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-all duration-300">
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      {timer === 0 && <p className="text-sm text-destructive mt-2">OTP expired. Signup again.</p>}
      {message && <p className="text-sm text-destructive mt-2">{message}</p>}
    </form>
  );
}