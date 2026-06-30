'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Plus, BarChart3, Shield, MapPinned } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-red-600/30 border-l-4 border-red-600 text-red-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50';
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-950/50 backdrop-blur-xl border-r border-white/10 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-slate-400">The Potter's House</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin')}`}
          >
            <BarChart3 size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            href="/admin/events"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/events')}`}
          >
            <Plus size={20} />
            <span className="font-medium">Post Event</span>
          </Link>

          <Link
            href="/admin/churches"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/admin/churches')}`}
          >
            <MapPinned size={20} />
            <span className="font-medium">Add Church</span>
          </Link>

          <hr className="my-2 border-white/10" />

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
          >
            <Home size={20} />
            <span className="font-medium">Back to Website</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="mb-3 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            Logout
          </button>
          <p className="text-xs text-slate-500 text-center">TPHCC Admin v1.0</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
