"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  
  // Steps: 'login' | 'otp'
  const [step, setStep] = useState("login");
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(57); // 57 seconds as per screenshot

  useEffect(() => {
    let interval;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Calling the new OTP login API with the email and password
      const res = await authService.loginOtp({ email, password });

      if (res?.success !== false) {
        // If successful, transition to OTP screen
        setStep("otp");
      } else {
        alert(res?.message || "Failed to send OTP");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow only one character
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if typing a number
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  async function handleVerifySubmit(e) {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 4) return;

    setIsLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp: otpValue });
      if (res?.success !== false) {
        // Assume verifyOtp sets the tokens in authService
        router.push("/dashboard");
      } else {
        alert(res?.message || "Invalid OTP");
      }
    } catch (error) {
      alert("Verification failed");
    } finally {
      setIsLoading(false);
    }
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
              <span className="material-symbols-rounded text-white">groups</span>
            </div>

            <div>
              <p className="font-bold text-lg">One portal for everyone</p>
              <p className="text-white/60 text-sm">
                Attendance, leave, claims, payroll &amp; reports
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

          {step === "login" ? (
            <>
              {/* Header */}
              <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
                  Welcome Back{" "}
                  <span className="inline-block origin-[70%_70%] animate-wave">👋</span>
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-[#eff4ff] border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
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
                  disabled={isLoading}
                  className="w-full py-4 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 disabled:opacity-70"
                >
                  {isLoading ? "Sending OTP..." : "Sign In"}
                  {!isLoading && <span className="material-symbols-rounded text-sm">login</span>}
                </button>
              </form>
            </>
          ) : (
            // OTP VERIFICATION SCREEN
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <span className="material-symbols-rounded text-slate-600">admin_panel_settings</span>
              </div>
              
              <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
                Verify Your Identity
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">
                We've sent a 4-digit verification code to your registered email address.
              </p>

              <form onSubmit={handleVerifySubmit} className="w-full">
                <div className="flex justify-center gap-3 mb-8">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 bg-slate-100 border border-transparent rounded-lg text-center text-xl font-bold text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 transition-all outline-none"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.join("").trim().length !== 4}
                  className="w-full py-4 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mb-6"
                >
                  {isLoading ? "Verifying..." : "Verify & Proceed"}
                  {!isLoading && <span className="material-symbols-rounded text-sm">arrow_forward</span>}
                </button>
              </form>

              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-slate-500">
                  Didn't receive the code?{" "}
                  {timer > 0 ? (
                    <span className="font-semibold text-slate-900">Resend in 0:{timer.toString().padStart(2, '0')}</span>
                  ) : (
                    <button 
                      onClick={handleSubmit} 
                      className="font-semibold text-slate-900 hover:underline"
                      disabled={isLoading}
                    >
                      Resend now
                    </button>
                  )}
                </p>

                <button 
                  onClick={() => setStep("login")}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
                >
                  <span className="material-symbols-rounded text-[16px]">arrow_back</span>
                  Back to login screen
                </button>
              </div>
            </div>
          )}

          {step === "login" && (
            <div className="mt-8 pt-4 text-center">
              <p className="text-xs text-slate-500">
                Problems logging in?{" "}
                <button className="text-slate-900 font-semibold hover:underline">
                  Contact IT Support
                </button>
              </p>
            </div>
          )}
        </div>

        <footer className="absolute bottom-4 w-full px-6 text-center text-[12px] text-slate-400">
          © 2024 HRMS. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
