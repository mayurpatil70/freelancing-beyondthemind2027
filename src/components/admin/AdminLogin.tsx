'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Lock, Shield, ArrowRight, AlertCircle, Clock } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const [attemptsNotice, setAttemptsNotice] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>('');

  // Initialize or fetch persistent device ID
  useEffect(() => {
    try {
      let storedId = localStorage.getItem('btm_admin_device_id');
      if (!storedId) {
        storedId = typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `dev-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        localStorage.setItem('btm_admin_device_id', storedId);
      }
      setDeviceId(storedId);
    } catch {
      // LocalStorage fallback
      setDeviceId('anonymous-device');
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;

    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setLoading(true);
    setError(null);
    setAttemptsNotice(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-device-id': deviceId,
        },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 429) {
        const retry = Number(json.retryAfter) || 900;
        setLockoutSeconds(retry);
        setError(json.message || `Security lockout active. Please wait ${retry}s before trying again.`);
        setPassword('');
        return;
      }

      if (!res.ok || !json.success) {
        if (json.remainingAttempts !== undefined && json.remainingAttempts <= 2) {
          setAttemptsNotice(`Security Alert: ${json.remainingAttempts} attempt(s) remaining before automatic 15-minute IP/device lockout.`);
        }
        throw new Error(json.message || 'Invalid administrative credentials');
      }

      onSuccess();
    } catch (err: unknown) {
      setPassword('');
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failure');
      }
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockoutSeconds > 0;

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
              Restricted management console with active brute-force shield.
            </p>
          </div>
        </div>

        {isLocked && (
          <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-semibold text-amber-300">
              <Clock className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
              <span>Sanctuary Defense Shield Active</span>
            </div>
            <p className="text-amber-100/90 leading-relaxed">
              Rate limiting triggered from this IP/device. Security lockout active for{' '}
              <strong className="text-amber-300 font-mono text-sm underline">
                {Math.floor(lockoutSeconds / 60)}m {lockoutSeconds % 60}s
              </strong>
              .
            </p>
          </div>
        )}

        {error && !isLocked && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {attemptsNotice && !isLocked && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{attemptsNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
              User Name *
            </label>
            <input
              type="text"
              required
              disabled={isLocked || loading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              autoComplete="username"
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/70 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                disabled={isLocked || loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-emerald-950/70 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 disabled:opacity-50"
              />
              <Lock className="w-4 h-4 text-gold-400/60 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[10px] text-stone-subtle/50 pt-0.5 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-gold-400/70 shrink-0" />
              <span>Multi-tiered IP & device rate limiting protected.</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full py-3 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase transition-all shadow-gold-sm hover:shadow-gold-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isLocked ? (
              <span>Locked ({lockoutSeconds}s)</span>
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
