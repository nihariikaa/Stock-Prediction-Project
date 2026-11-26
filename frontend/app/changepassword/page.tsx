"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:5000/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to change password");
    } else {
      console.log("Password change response:", data);
      setMessage("Password changed successfully");
      setEmail("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => router.push("/login"), 2000); // optional redirect after success
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Change Password</h1>

        {error && <div className="text-red-600 mb-4">{error}</div>}
        {message && <div className="text-green-600 mb-4">{message}</div>}

        <form onSubmit={handleChangePassword} className="space-y-4">
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

          <div>
            <label className="block text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
