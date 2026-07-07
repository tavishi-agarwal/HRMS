import AttendanceCard from "./widgets/AttendanceCard";
import CalendarCard from "./widgets/CalendarCard";
import EventCard from "./widgets/EventCard";
import StatusTracker from "./widgets/StatusTracker";
import ActivityFeed from "./widgets/ActivityFeed";

export default function EmployeeDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">
            Welcome back, Abhi! 👋
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Here&apos;s what&apos;s happening with your employee dashboard today.
          </p>
        </div>

        <div className="bg-slate-100 p-1 rounded-lg flex">
          <button className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-md shadow-sm">
            Overview
          </button>
          <button className="px-6 py-2 text-slate-600 text-xs font-bold rounded-md">
            Performance
          </button>
        </div>
      </div>

      {/* Top Grid */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <AttendanceCard />
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
          <CalendarCard />
          <EventCard />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-12 gap-6 pb-12">
        <div className="col-span-12 lg:col-span-8">
          <StatusTracker />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}