import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[275px_1fr] h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <main className="h-full w-full overflow-y-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}
