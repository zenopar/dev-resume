"use client";

import React, { useState } from "react";
import { loginAction } from "../actions/auth.action";
import { Button, Icon } from "@/components/ui";

export const PasswordGate: React.FC = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await loginAction(password.trim());
      if (res.success) {
        // Successful login - reload the page to load authenticated Server Component
        window.location.reload();
      } else {
        setError(res.error || "Incorrect password. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4 selection:bg-zinc-800">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-inner text-indigo-400">
              <Icon name="lock" size={22} />
            </div>

            <div>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="font-bold text-base tracking-tight text-white">DevResume</span>
                <span className="font-mono text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
                  PROTECTED
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                This application is password-protected. Enter the master password to access your CVs.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="gate-password"
                className="block text-xs font-medium text-zinc-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="gate-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter master password"
                  autoFocus
                  required
                  className="w-full bg-zinc-950/80 border border-zinc-750 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400 rounded-lg px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition p-0.5 rounded cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon name={showPassword ? "eye" : "lock"} size={14} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs animate-in fade-in duration-200">
                <Icon name="alert" size={14} className="shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!password.trim() || isLoading}
              className="w-full justify-center text-xs font-medium py-2.5 h-9"
              icon={
                isLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Icon name="key" size={14} />
                )
              }
            >
              {isLoading ? "Verifying..." : "Unlock"}
            </Button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-4 text-[11px] text-zinc-600 font-mono">
          DevResume • 1-Page A4 Resume Generator
        </div>
      </div>
    </div>
  );
};
