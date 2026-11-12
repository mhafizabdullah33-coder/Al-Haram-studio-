import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export const AdminLogin: React.FC = () => {
  const { adminLogin, isAdmin } = useAuth();
  const { showToast } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already admin, redirect to dashboard
  if (isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await adminLogin(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/admin');
    } else {
      showToast('Authentication Error', res.message, 'error');
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@alharam.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-stone-100 dark:bg-stone-950">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-10 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-amber-400 font-brand font-bold text-2xl flex items-center justify-center mx-auto shadow-md border border-amber-500/40">
            AH
          </div>
          <h1 className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
            AL-HARAM Management Portal
          </h1>
          <p className="text-xs text-stone-500">
            Authorized administrative access for store operations and inventory control.
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@alharam.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Admin Security Key
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 pr-10 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider border border-amber-500/40 shadow-xl transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign In to Admin Console</span>
          </button>
        </form>

        {/* Demo Credentials Auto-Fill Button */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-2">
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="w-full py-2.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-amber-200 dark:border-amber-900/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Fill Admin Demo Credentials (admin@alharam.com)</span>
          </button>

          <Link
            to="/"
            className="block text-center text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 pt-2"
          >
            ← Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
