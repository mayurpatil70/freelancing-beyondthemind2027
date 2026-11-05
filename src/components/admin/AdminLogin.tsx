'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Lock, Shield, ArrowRight, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, email }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Invalid administrative credentials');
      }

      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failure');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02100d] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#07261F]/90 border border-gold-500/30 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gold-400/60 shadow-gold-sm mx-auto">
            <Image
              src="/images/brand/logo.jpg"
              alt="Beyond the Mind Logo"
              fill
              sizes="64px"
              className="object-contain"
            />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold block">
              Administrative Sanctuary
            </span>
            <h2 className="font-serif text-2xl text-ivory-50 font-light mt-0.5">
              Beyond the Mind Admin CMS
            </h2>
            <p className="text-xs text-stone-subtle/70 mt-1 font-light">
              Restricted management console for retreat coordinators.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
              Administrator Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@beyondthemindretreat.org"
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/70 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
              Access Secret Key *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-emerald-950/70 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
              />
              <Lock className="w-4 h-4 text-gold-400/60 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[10px] text-stone-subtle/60 pt-0.5">
              Default access configured via environment variables.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase transition-all shadow-gold-sm hover:shadow-gold-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Shield className="w-4 h-4 fill-current" />
                <span>Enter Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <a
            href="/"
            className="text-[11px] uppercase tracking-wider text-stone-subtle/70 hover:text-gold-300 transition-colors"
          >
            ← Return to Sanctuary Home
          </a>
        </div>
      </div>
    </div>
  );
}

