// src/components/SignupForm.jsx
import { useState, useEffect } from "react";
import { signup, verifyOTP } from "../api/auth";
import "../styles/signup.css"; // CSS import

export default function SignupForm({ switchToLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = signup, 2 = OTP verification, 3 = completed
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(300); // 5 min countdown

  // OTP countdown
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const formatTime = (t) =>
    `${Math.floor(t / 60).toString().padStart(2, "0")}:${(t % 60)
      .toString()
      .padStart(2, "0")}`;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) return setMessage("❌ Please enter the OTP");
    setLoading(true);
    setMessage("");
    try {
      const res = await verifyOTP({ email: form.email, otp });
      if (res.success) {
        setStep(3);
        setMessage("🎉 Signup complete! You can now login.");
      } else setMessage(`❌ ${res.message}`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {step === 1 && (
        <form onSubmit={handleSignup} className="signup-form">
          {["username", "email", "password"].map((field) => (
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
          <button type="submit" disabled={loading} className="signup-btn">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          {switchToLogin && (
            <p className="signup-switch">
              Already have an account?{" "}
              <button onClick={switchToLogin} className="signup-switch-btn">
                Login
              </button>
            </p>
          )}
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify} className="signup-form">
          <p className="signup-info">
            OTP sent to: <b>{form.email}</b>
          </p>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            disabled={loading || timer === 0}
            className="signup-input"
          />
          <p className="signup-timer">Expires in: {formatTime(timer)}</p>
          <button type="submit" disabled={loading || timer === 0} className="signup-btn verify-btn">
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          {timer === 0 && <p className="otp-expired">OTP expired. Please signup again.</p>}
        </form>
      )}

      {step === 3 && (
        <>
          <p className="signup-success">{message}</p>
          {switchToLogin && (
            <button onClick={switchToLogin} className="signup-switch-btn">
              Go to Login
            </button>
          )}
        </>
      )}

      {message && step !== 3 && step !== 2 && <p className="signup-error">{message}</p>}
    </div>
  );
}