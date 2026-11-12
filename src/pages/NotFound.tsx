import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-emerald-950 text-amber-400 font-brand font-bold text-3xl flex items-center justify-center mx-auto shadow-xl border border-amber-500/40">
          404
        </div>

        <div className="space-y-2">
          <h1 className="font-serif-luxury text-3xl font-bold text-stone-900 dark:text-stone-100">
            Article Not Found
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
            The page you are looking for may have been moved, renamed, or is temporarily
            unavailable.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold px-5 py-2.5 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </Link>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-emerald-950 hover:bg-emerald-900 text-amber-200 text-xs font-semibold px-5 py-2.5 rounded-xl border border-amber-500/40 shadow transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Collections</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
