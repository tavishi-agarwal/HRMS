"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    // temporary until Spring Boot login API is connected
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-[#f8f9ff] font-sans">
      {/* Left Visual Panel */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop')",
          }}
        />

        <div className="absolute inset-0 bg-slate-900/65" />

        <div className="relative z-10 p-10 max-w-md text-white">
          <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase mb-5">
            Enterprise HRMS
          </span>

          <h1 className="text-5xl leading-tight font-extrabold mb-5">
            Manage people, attendance, and growth in one place.
          </h1>

          <p className="text-white/75 text-lg leading-relaxed">
            A central HR portal for employees, team leads, HR teams, and admins.
          </p>

          <div className="mt-10 rounded-2xl p-5 bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-rounded text-white">
                groups
              </span>
            </div>

            <div>
              <p className="font-bold text-lg">One portal for everyone</p>
              <p className="text-white/60 text-sm">
                Attendance, leave, claims, payroll & reports
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 text-white/10 text-[120px] font-extrabold select-none">
          HRMS
        </div>
      </section>

      {/* Right Login Panel */}
      <main className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 bg-[#f8f9ff] relative py-8">
        <div className="w-full max-w-[440px]">
          
          {/* Header */}
<div className="mb-10">
  <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
    Welcome Back{" "}
    <span className="inline-block origin-[70%_70%] animate-wave">
      👋
    </span>
  </h1>

  <p className="mt-3 text-slate-500 text-base leading-relaxed">
    Sign in to continue to your HRMS dashboard.
  </p>
</div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-800">
                Email or Employee ID
              </label>

              <div className="relative group">
                <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] group-focus-within:text-slate-900">
                  badge
                </span>

                <input
                  type="text"
                  placeholder="e.g. EMP-12345 or jane@company.com"
                  className="w-full pl-10 pr-3 py-3 bg-[#eff4ff] border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-800">
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-bold text-slate-900 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative group">
                <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] group-focus-within:text-slate-900">
                  lock
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#eff4ff] border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <span className="material-symbols-rounded text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-1">
              <input
                id="remember-me"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />

              <label
                htmlFor="remember-me"
                className="text-sm text-slate-500 cursor-pointer"
              >
                Keep me signed in for 30 days
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
            >
              Sign In
              <span className="material-symbols-rounded text-sm">login</span>
            </button>
          </form>

          <div className="mt-8 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Problems logging in?{" "}
              <button className="text-slate-900 font-semibold hover:underline">
                Contact IT Support
              </button>
            </p>
          </div>
        </div>

        <footer className="absolute bottom-4 w-full px-6 text-center text-[12px] text-slate-400">
          © 2024 HRMS. All rights reserved.
        </footer>
      </main>
    </div>
  );
}