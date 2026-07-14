"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-800">
      <Sidebar />

      <div className="ml-[260px] min-h-screen">
        <Header />

        <main className="p-8 space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
