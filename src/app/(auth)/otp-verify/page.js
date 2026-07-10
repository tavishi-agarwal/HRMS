"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OtpVerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  function handleChange(index, value) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: verify OTP via Spring Boot API
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] px-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-rounded text-indigo-600 text-3xl">lock</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Verify OTP</h1>
          <p className="mt-2 text-slate-500 text-sm">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 justify-center mb-8">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-12 text-center text-xl font-bold bg-[#eff4ff] border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-6 text-center">
          <button className="text-sm text-indigo-600 font-medium hover:underline">
            Resend Code
          </button>
          <span className="mx-3 text-slate-300">|</span>
          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
