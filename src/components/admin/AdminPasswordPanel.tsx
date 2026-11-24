'use client';

import React, { useEffect, useState } from 'react';
import { KeyRound, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const inputClass =
  'w-full px-3 py-2.5 pr-10 rounded-xl bg-emerald-950 border border-gold-500/25 text-sm text-ivory-100 focus:border-gold-400 outline-none';

function PasswordInput({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="block space-y-1">
      <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold">{label}</span>
      <span className="relative block">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          maxLength={128}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-400 hover:text-gold-200"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </span>
    </label>
  );
}

// Lets the logged-in admin change the login password at any time.
export function AdminPasswordPanel() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [status, setStatus] = useState<{ available: boolean; lastChanged: string | null; minLength: number } | null>(null);

  const loadStatus = () =>
    fetch('/api/admin/auth/password', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => d.success && setStatus({ available: d.available, lastChanged: d.lastChanged, minLength: d.minLength }))
      .catch(() => {});

  useEffect(() => {
    loadStatus();
  }, []);

  const minLength = status?.minLength ?? 8;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    if (next.trim().length < minLength) {
      setResult({ ok: false, message: `The new password must be at least ${minLength} characters.` });
      return;
    }
    if (next !== confirm) {
      setResult({ ok: false, message: 'The new password and the confirmation do not match.' });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/admin/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json().catch(() => ({}));
      setResult({ ok: Boolean(data.success), message: data.message || (res.ok ? 'Password changed.' : 'Could not change the password.') });
      if (data.success) {
        setCurrent('');
        setNext('');
        setConfirm('');
        loadStatus();
      }
    } catch {
      setResult({ ok: false, message: 'Network error. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
        <h3 className="font-serif text-2xl text-ivory-50 font-light">Change Admin Password</h3>
        <p className="text-xs text-stone-subtle/80 mt-1">
          Change your login password at any time. Your username stays the same. The new password works from your next login.
        </p>
        {status?.lastChanged && (
          <p className="text-[11px] text-gold-300/80 mt-2">
            Last changed: {new Date(status.lastChanged).toLocaleString()}
          </p>
        )}
      </div>

      <form onSubmit={submit} className="max-w-md p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4">
        {status && !status.available && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-400/60 text-red-100 text-xs">
            Password change needs the database (DATABASE_URL) to be set in Vercel.
          </div>
        )}
        <PasswordInput label="Current password" value={current} onChange={setCurrent} autoComplete="current-password" />
        <PasswordInput label={`New password (at least ${minLength} characters)`} value={next} onChange={setNext} autoComplete="new-password" />
        <PasswordInput label="Confirm new password" value={confirm} onChange={setConfirm} autoComplete="new-password" />

        {result && (
          <div
            className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
              result.ok ? 'bg-emerald-900/90 border border-gold-400 text-gold-100' : 'bg-red-950/80 border border-red-400/60 text-red-100'
            }`}
          >
            {result.ok ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{result.message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={busy || !current || !next || !confirm}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>{busy ? 'Changing...' : 'Change Password'}</span>
        </button>
      </form>
    </div>
  );
}
