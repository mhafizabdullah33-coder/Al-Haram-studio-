import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-emerald-950/95 text-emerald-50 border-emerald-700/60 shadow-emerald-950/20'
                : isError
                ? 'bg-rose-950/95 text-rose-50 border-rose-700/60 shadow-rose-950/20'
                : isWarning
                ? 'bg-amber-950/95 text-amber-50 border-amber-700/60 shadow-amber-950/20'
                : 'bg-stone-900/95 text-stone-50 border-stone-700/60 shadow-stone-950/20'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-sky-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold tracking-wide">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-stone-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white p-0.5 rounded transition"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
