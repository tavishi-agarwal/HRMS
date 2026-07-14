export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff]">
      <div className="text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-rounded text-rose-500 text-4xl">block</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-500 mb-8">You don&apos;t have permission to view this page.</p>
        <a
          href="/dashboard"
          className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
