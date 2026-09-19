import React from 'react';
import Link from 'next/link';
import { Menu, UserCircle, Bell, LogOut } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60 border-b border-outline-variant">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 -ml-2 text-on-surface-variant hover:text-on-surface">
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-on-primary font-bold text-xl leading-none">R</span>
            </div>
            <span className="text-xl font-semibold text-primary hidden sm:inline-block">RuralCare</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-on-surface-variant">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <Link href="/find-doctor" className="hover:text-primary transition-colors">Find a Doctor</Link>
          <Link href="/appointments" className="hover:text-primary transition-colors">Appointments</Link>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button className="text-on-surface-variant hover:text-primary transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link href={`/${user?.role}/dashboard`}>
                <Avatar size="sm" src={user?.profile_image} alt={user?.name} />
              </Link>
              <button onClick={logout} className="text-on-surface-variant hover:text-red-500 transition-colors ml-2" title="Log out">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

