export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-50">
      <div className="relative w-96">
        <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          search
        </span>
        <input
          className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-11 text-sm focus:ring-2 focus:ring-indigo-500/20"
          placeholder="Search anything..."
          type="text"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 bg-slate-100 rounded-full text-slate-600">
          <span className="material-symbols-rounded">notifications</span>
        </button>

        <button className="px-5 py-2.5 bg-rose-500 text-white text-sm font-bold rounded-full">
          Apply for Leave
        </button>

        <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-full">
          Create Claim
        </button>
      </div>
    </header>
  );
}