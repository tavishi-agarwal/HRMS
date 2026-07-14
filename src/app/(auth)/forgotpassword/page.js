"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    // TODO: connect to Spring Boot API
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] px-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900">Forgot Password?</h1>
          <p className="mt-2 text-slate-500 text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-700 text-sm font-medium">
            ✅ Reset link sent! Please check your email.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full px-4 py-3 bg-[#eff4ff] border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 font-medium">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
