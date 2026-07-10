// Settings - will connect to backend API
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">System and account settings</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        <span className="material-symbols-rounded text-slate-300 text-5xl">settings</span>
        <p className="text-slate-500 mt-3 font-medium">Settings data will load here from API</p>
      </div>
    </div>
  );
}
