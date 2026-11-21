import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="font-serif text-6xl text-gold-400 font-light">404</h1>
        <h2 className="font-serif text-2xl text-ivory-50">Sanctuary Page Not Found</h2>
        <p className="text-sm text-stone-subtle/80">
          The sanctuary page you seek does not exist or has moved. Return to the home sanctuary.
        </p>
        <div>
          <Link
            href="/"
            prefetch={true}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 text-xs font-semibold uppercase tracking-widest shadow-gold-sm hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
