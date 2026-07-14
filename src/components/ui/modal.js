"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * Simple Modal component
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {string} title
 * @param {React.ReactNode} children
 * @param {string} className
 */
export default function Modal({ isOpen, onClose, title, children, className }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 p-6",
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-rounded text-[20px]">close</span>
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
