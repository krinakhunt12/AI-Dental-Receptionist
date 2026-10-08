import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import { HiGlobeAlt, HiSparkles } from 'react-icons/hi2';

export default function PortalLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[275px_1fr] h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <main className="h-full w-full overflow-y-auto bg-slate-50 flex flex-col">
        {/* Top Portal Banner Bar */}
        <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1 font-heading">
              <HiSparkles />
              <span>SmileCare Staff & Admin Portal</span>
            </span>
          </div>

          <NavLink
            to="/"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <HiGlobeAlt className="text-sm" />
            <span>🌐 View Public Website</span>
          </NavLink>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
