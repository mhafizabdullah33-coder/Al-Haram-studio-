import React, { useState } from 'react';
import { Inbox, MessageCircle, CheckCircle2, Clock, Send, Trash2, X, Phone, Mail } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SupportMessage } from '../../types';
import { buildWhatsAppLink, formatDate } from '../../utils/formatters';

export const AdminSupport: React.FC = () => {
  const { supportMessages, replySupportMessage, resolveSupportMessage } = useStore();

  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [activeMessage, setActiveMessage] = useState<SupportMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredMessages = supportMessages.filter((m) => {
    if (filter === 'open') return m.status === 'open';
    if (filter === 'resolved') return m.status === 'resolved';
    return true;
  });

  const handleOpenReplyModal = (msg: SupportMessage) => {
    setActiveMessage(msg);
    setReplyText(msg.adminReply || '');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMessage || !replyText.trim()) return;
    replySupportMessage(activeMessage.id, replyText.trim());
    setActiveMessage(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
            Customer Support Inbox
          </h1>
          <p className="text-xs text-stone-500">
            Direct customer inquiries received through the storefront Contact Us form.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-emerald-950 text-amber-300'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
            }`}
          >
            All ({supportMessages.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'open'
                ? 'bg-amber-500 text-stone-950'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
            }`}
          >
            Open Tickets ({supportMessages.filter((m) => m.status === 'open').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'resolved'
                ? 'bg-emerald-700 text-white'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
            }`}
          >
            Resolved ({supportMessages.filter((m) => m.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-2">
            <Inbox className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-serif-luxury font-bold text-base text-stone-900 dark:text-stone-100">
              No support tickets found
            </h3>
            <p className="text-xs text-stone-500">Your customer inbox is clear.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                    {msg.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {msg.customerName}
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      {msg.email} {msg.phone ? `• ${msg.phone}` : ''} • Received {msg.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      msg.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block mb-1">
                  Subject: {msg.subject}
                </span>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
                  {msg.message}
                </p>
              </div>

              {msg.adminReply && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 text-xs space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Admin Reply:
                  </span>
                  <p className="text-stone-700 dark:text-stone-300">{msg.adminReply}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  {msg.phone && (
                    <a
                      href={buildWhatsAppLink(
                        msg.phone,
                        `Assalam-o-Alaikum ${msg.customerName}! Regarding your inquiry about "${msg.subject}" at AL-HARAM CLOTH STORE:`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#25D366] font-semibold hover:underline"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Reply on WhatsApp</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {msg.status === 'open' && (
                    <button
                      onClick={() => resolveSupportMessage(msg.id)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold hover:bg-emerald-50"
                    >
                      Mark Resolved
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenReplyModal(msg)}
                    className="px-4 py-1.5 bg-emerald-950 text-amber-200 rounded-xl text-xs font-semibold border border-amber-500/40 shadow transition hover:bg-emerald-900"
                  >
                    {msg.adminReply ? 'Update Note' : 'Add Response'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100">
                Reply to {activeMessage.customerName}
              </h3>
              <button
                onClick={() => setActiveMessage(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-stone-500 bg-stone-50 dark:bg-stone-800 p-3 rounded-xl">
              <span className="font-bold text-stone-700 dark:text-stone-300">Inquiry: </span>
              {activeMessage.message}
            </div>

            <form onSubmit={handleSendReply} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Admin Response Note</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type official response note or resolution..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveMessage(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-950 text-amber-200 rounded-xl text-xs font-semibold border border-amber-500/40 shadow hover:bg-emerald-900 transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Save Response & Resolve
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
