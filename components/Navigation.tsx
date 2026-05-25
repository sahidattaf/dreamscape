'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

export default function Navigation() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const email = prompt('Enter your email for magic link login:');
    if (email) {
      await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      alert('Check your email for the magic link!');
    }
  };

  return (
    <nav className="flex justify-between items-center p-6 bg-gradient-to-r from-primary to-secondary border-b border-gold">
      <Link href="/" className="text-2xl font-bold text-gold">
        DreamScape
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/" className="text-white hover:text-gold transition">
          Home
        </Link>
        {session ? (
          <>
            <Link href="/dashboard" className="text-white hover:text-gold transition">
              Dashboard
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-white hover:text-gold transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-gold text-primary px-4 py-2 rounded hover:opacity-90 font-semibold"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
