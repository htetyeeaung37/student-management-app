"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Colors
  const colors = {
    navy: "#1A365D",
    navyDark: "#102A43",
    gold: "#D4AF37",
    goldHover: "#B8860B",
    bg: "#F7FAFC",
    text: "#2D3748",
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async () => {
    setError("");
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      setShowToast(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Background Decorative Circles */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
        style={{ backgroundColor: colors.navy }}
      ></div>
      <div
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-10"
        style={{ backgroundColor: colors.gold }}
      ></div>

      {/* Success Toast */}
      {showToast && (
        <div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 text-white px-6 py-4 rounded-2xl shadow-2xl animate-bounce"
          style={{ backgroundColor: colors.navy }}
        >
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          <p className="font-bold">Login Successful!</p>
        </div>
      )}

      <div
        className="w-full max-w-md z-10"
        style={{ animation: "slideUp 0.6s ease-out" }}
      >
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 shadow-2xl transform hover:rotate-6 transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${colors.navy}, ${colors.navyDark})`,
            }}
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: colors.navy }}
          >
            Heritage International
          </h1>
          <p
            className="text-sm font-medium tracking-widest uppercase mt-1"
            style={{ color: colors.gold }}
          >
            University Management System
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-3xl shadow-2xl p-8 border backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderColor: "#E2E8F0",
          }}
        >
          <h2
            className="text-xl font-bold mb-8 text-center"
            style={{ color: colors.navy }}
          >
            Sign in to Student Dashboard
          </h2>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Username Field */}
            <div className="relative group">
              <label
                className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1"
                style={{ color: colors.navy }}
              >
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_username"
                  className="peer w-full rounded-2xl pl-12 pr-4 py-3.5 text-sm transition-all duration-300 border focus:ring-0 focus:outline-none focus:border-blue-500"
                  style={{
                    backgroundColor: "#F8FAFC",
                    borderColor: "#E2E8F0",
                    color: "#1A365D",
                  }}
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 text-[#CBD5E0] peer-focus:text-blue-600" />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label
                className="block text-xs font-bold uppercase tracking-wider mb-2 ml-1"
                style={{ color: colors.navy }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="peer w-full rounded-2xl pl-12 pr-12 py-3.5 text-sm transition-all duration-300 border focus:ring-0 focus:outline-none focus:border-blue-500"
                  style={{
                    backgroundColor: "#F8FAFC",
                    borderColor: "#E2E8F0",
                    color: "#1A365D",
                  }}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 text-[#CBD5E0] peer-focus:text-blue-600" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading || showToast}
              className="w-full group relative overflow-hidden text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-3 transform active:scale-95 disabled:opacity-70 cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${colors.navy}, ${colors.navyDark})`,
              }}
            >
              <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "ACCESS DASHBOARD"
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <div
            className="w-16 h-1 mx-auto mb-4 rounded-full opacity-20"
            style={{ backgroundColor: colors.gold }}
          ></div>
          <p
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#A0AEC0" }}
          >
            Faculty & Admin Access Only
          </p>
          <p
            className="text-[10px] mt-2 font-medium"
            style={{ color: "#CBD5E0" }}
          >
            HERITAGE INTERNATIONAL UNIVERSITY © 2026
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        input:focus {
          border-color: ${colors.navy} !important;
          outline: none;
        }
        input:focus + svg {
          color: ${colors.navy} !important;
        }
      `}</style>
    </div>
  );
}
