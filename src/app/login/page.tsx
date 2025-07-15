"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FloatingHearts } from "@/components/FloatingHearts";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingHearts />

      <div className="relative z-10 w-full max-w-md bg-black/60 backdrop-blur-lg rounded-xl p-8 shadow-xl border border-pink-500/30">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-300 romantic-glow mb-2">
            For Anna 💕
          </h1>
          <p className="text-pink-200">Login to see Daniel's messages</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-pink-300 mb-2 text-sm"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-pink-300 mb-2 text-sm"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-pink-300/70 text-sm">
            Only Anna has access to these messages 💕
          </p>
        </div>
      </div>
    </div>
  );
}
