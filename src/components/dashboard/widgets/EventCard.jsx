export default function EventCard() {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className="w-24 h-20 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 font-extrabold">
        EVENT
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <span className="bg-rose-50 text-rose-600 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
            Office Events
          </span>
          <span className="text-[10px] text-slate-400 font-bold">
            3 days ago
          </span>
        </div>

        <h4 className="text-sm font-extrabold text-slate-800 mt-1">
          Annual Town Hall 2026
        </h4>

        <div className="flex gap-2 mt-3">
          <button className="px-4 py-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-full shadow-md shadow-rose-100">
            RSVP Now
          </button>
          <button className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">
            Details
          </button>
        </div>
      </div>
    </div>
  );
}