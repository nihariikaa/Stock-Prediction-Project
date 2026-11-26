"use client";

import { useState, FormEvent } from "react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequestOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const res = await fetch(
      "http://localhost:5000/api/request-password-reset",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to send OTP");
    } else {
      setMessage("OTP sent to your email");
      setStep("otp");
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:5000/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, new_password: newPassword }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to reset password");
    } else {
      setMessage("Password reset successfully");
      setStep("email");
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>

        {error && <div className="text-red-600 mb-4">{error}</div>}
        {message && <div className="text-green-600 mb-4">{message}</div>}

        {step === "email" ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">OTP</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Reset Password
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="text-sm text-gray-600 underline mt-2"
            >
              Back to email step
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
