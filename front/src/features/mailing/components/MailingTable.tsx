// Login.tsx
import React, { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new URLSearchParams();
      formData.append("grant_type", "password");
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch("/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        // Try to parse error message
        let errorMsg = "Login failed. Please check your credentials.";
        try {
          const errorData = await response.json();
          if (errorData.detail && Array.isArray(errorData.detail)) {
            errorMsg = errorData.detail.map((d: any) => d.msg).join(", ");
          }
        } catch {
          // ignore JSON parse errors
        }
        setError(errorMsg);
        setSubmitting(false);
        return;
      }

      // If successful, you may want to store the token
      // const data = await response.json();
      // localStorage.setItem("token", data.access_token);

      setSubmitting(false);
      navigate("/home");
    } catch (err) {
      setError("An unexpected error occurred.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center justify-center mb-6 gap-2">
          <FaRobot className="text-blue-600 text-3xl" />
          <span className="font-bold text-2xl text-gray-800">ProspectAI</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
