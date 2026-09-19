import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Calendar, FileText, Settings, LogOut } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Find Doctor', href: '/find-doctor' },
    { icon: Calendar, label: 'Appointments', href: '/appointments' },
    { icon: FileText, label: 'Records', href: '/records' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] border-r border-outline-variant bg-surface-container-lowest overflow-y-auto shrink-0 sticky top-16">
      <div className="flex-1 py-6 px-4 space-y-2">
        <p className="px-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-4">
          Main Menu
        </p>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-container rounded-xl transition-colors font-medium"
          >
            <item.icon className="w-5 h-5 text-on-surface-variant" />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="p-4 border-t border-outline-variant">
        <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium w-full text-left">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};
