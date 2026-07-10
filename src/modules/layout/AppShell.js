import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#fafaff] text-slate-800">
      <Sidebar />

      <div className="min-h-screen lg:ml-[260px]">
        <Header />

        <main className="p-5 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </main>
      </div>
    </div>
  );
}