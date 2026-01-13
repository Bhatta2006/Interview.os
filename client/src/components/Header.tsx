'use client';

import Link from 'next/link';
import { Search, Trophy, LogOut, User as UserIcon } from 'lucide-react';
import useStore from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user, logout } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="border-b border-white/10 bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between font-terminal tracking-wider">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-terminal-green flex items-center justify-center text-black font-bold">
              &gt;
            </div>
            <span className="font-bold text-2xl tracking-tighter text-white group-hover:text-terminal-green transition-colors">INTERVIEW.OS_</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <Link href="/" className="hover:text-terminal-green hover:underline decoration-terminal-green decoration-2 underline-offset-4 transition-all">TERMINAL</Link>
            <Link href="/dashboard" className="hover:text-terminal-green hover:underline decoration-terminal-green decoration-2 underline-offset-4 transition-all">STATS_</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {mounted && user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 border border-white/20 px-3 py-1">
                <span className="text-xs text-terminal-green animate-pulse">●</span>
                <span className="text-sm font-mono text-white uppercase">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors text-xs font-bold uppercase tracking-widest"
              >
                [ LOGOUT ]
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-gray-400 hover:text-white hover:text-terminal-green transition-colors uppercase">
                &gt; Login
              </Link>
              <Link href="/signup" className="px-6 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-black transition-colors text-sm font-bold uppercase tracking-widest">
                [ INITIALIZE ]
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
