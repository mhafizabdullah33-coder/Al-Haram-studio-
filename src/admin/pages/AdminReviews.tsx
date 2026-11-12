import React, { useState } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Filter } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Review } from '../../types';

export const AdminReviews: React.FC = () => {
  const { reviews, updateReviewStatus, deleteReview } = useStore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'approved') return r.status === 'approved';
    if (filter === 'rejected') return r.status === 'rejected';
    return true;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer review?')) {
      deleteReview(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
            Customer Reviews Moderation
          </h1>
          <p className="text-xs text-stone-500">
            Moderate, approve, or reject customer feedback submitted across products.
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
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'pending'
                ? 'bg-amber-500 text-stone-950'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
            }`}
          >
            Pending ({reviews.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === 'approved'
                ? 'bg-emerald-700 text-white'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
            }`}
          >
            Approved ({reviews.filter((r) => r.status === 'approved').length})
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Customer Review</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No reviews in this moderation queue.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((rev) => (
                  <tr
                    key={rev.id}
                    className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition"
                  >
                    <td className="py-3 px-4 font-semibold text-stone-900 dark:text-stone-100 max-w-xs truncate">
                      {rev.productName}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-medium text-stone-800 dark:text-stone-200">
                        {rev.customerName}
                      </p>
                      <p className="text-[11px] text-stone-400">{rev.customerEmail}</p>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-md">
                      <p className="text-stone-600 dark:text-stone-300 italic line-clamp-2">
                        &quot;{rev.comment}&quot;
                      </p>
                    </td>

                    <td className="py-3 px-4 text-stone-400 font-mono text-[11px]">{rev.date}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          rev.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rev.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => updateReviewStatus(rev.id, 'approved')}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Approve Review"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {rev.status !== 'rejected' && (
                          <button
                            onClick={() => updateReviewStatus(rev.id, 'rejected')}
                            className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition"
                            title="Reject Review"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
