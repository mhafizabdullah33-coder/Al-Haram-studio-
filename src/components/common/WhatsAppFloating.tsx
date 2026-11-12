import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { buildWhatsAppLink } from '../../utils/formatters';

export const WhatsAppFloating: React.FC = () => {
  const { settings } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const sendQuickMessage = (text: string) => {
    const url = buildWhatsAppLink(settings.whatsappNumber, text);
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    sendQuickMessage(customMsg);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 whatsapp-floating">
      {isOpen && (
        <div className="mb-3 w-80 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center font-bold text-amber-400">
                AH
              </div>
              <div>
                <h4 className="text-sm font-semibold">AL-HARAM Support</h4>
                <p className="text-[11px] text-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online | Typically replies in mins
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-300 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-stone-50 dark:bg-stone-950/50">
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Assalam-o-Alaikum! Welcome to <strong className="text-emerald-950 dark:text-emerald-400">AL-HARAM CLOTH STORE</strong>. How may we assist you today?
            </p>

            <div className="space-y-1.5 pt-1">
              <button
                onClick={() =>
                  sendQuickMessage(
                    'Assalam-o-Alaikum! I would like to inquire about the latest festive lawn collection and custom stitching.'
                  )
                }
                className="w-full text-left text-xs bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-800 dark:text-stone-200 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 transition flex items-center gap-2 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                  Inquire about New Arrivals & Sizes
                </span>
              </button>

              <button
                onClick={() =>
                  sendQuickMessage(
                    'Hello! I need assistance tracking my Al-Haram order. Here is my order number: '
                  )
                }
                className="w-full text-left text-xs bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-800 dark:text-stone-200 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 transition flex items-center gap-2 group"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                  Track an Existing Order
                </span>
              </button>

              <button
                onClick={() =>
                  sendQuickMessage(
                    'Salam! I want to order bulk fabrics / men wedding waistcoats. Please guide me.'
                  )
                }
                className="w-full text-left text-xs bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-800 dark:text-stone-200 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 transition flex items-center gap-2 group"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                  Bulk Wedding & Corporate Orders
                </span>
              </button>
            </div>

            {/* Custom input */}
            <form onSubmit={handleCustomSubmit} className="pt-2 flex gap-1.5">
              <input
                type="text"
                placeholder="Type your message..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white p-2 rounded-xl transition shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl shadow-emerald-900/30 transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="WhatsApp Support"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline-block">
          WhatsApp Assistance
        </span>
      </button>
    </div>
  );
};
