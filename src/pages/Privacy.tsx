import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, Database } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-3 pb-6 border-b border-stone-200 dark:border-stone-800">
        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">
          Customer Protection
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Privacy & Data Protection Policy
        </h1>
        <p className="text-xs text-stone-500">
          Last revised: November 2026 • AL-HARAM CLOTH STORE
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
        <p className="font-bold flex items-center gap-1.5">
          <Database className="w-4 h-4 text-amber-600" />
          Prototype Architecture Disclosure:
        </p>
        <p>
          This web application operates client-side persistence through your browser’s secure
          LocalStorage. No confidential credit card numbers or financial passwords are ever stored or
          transmitted to external third-party data brokers.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            1. Information We Collect
          </h2>
          <p>
            When you interact with AL-HARAM CLOTH STORE, we collect information necessary to fulfill
            your orders and provide personalized styling assistance:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400 text-xs">
            <li>Customer Name, Email Address, and Contact Telephone / WhatsApp number.</li>
            <li>Physical destination shipping address and city for TCS/Leopard parcel booking.</li>
            <li>Itemized cart selections, sizing preferences, and order history.</li>
            <li>Customer feedback, product ratings, and support inquiries.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            2. How We Use Your Data
          </h2>
          <p>We use your information strictly for:</p>
          <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400 text-xs">
            <li>Processing, dispatching, and tracking your garment parcels across Pakistan.</li>
            <li>Communicating status updates, shipping invoices, and courier tracking numbers.</li>
            <li>Responding to customer support tickets and fabric inquiries.</li>
            <li>Providing optional seasonal VIP privilege promotions and festive previews.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            3. Payment Data & Security
          </h2>
          <p>
            For Cash on Delivery (COD), no advance payment data is collected. For JazzCash, EasyPaisa,
            or Direct Bank Transfers, customers provide voluntary transaction reference numbers (TIDs)
            only to allow manual reconciliation by our accounts desk.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            4. Your Rights & Data Export
          </h2>
          <p>
            You retain complete control over your customer profile. Through our My Account page or
            Admin Console, you can update your contact information, review complete order logs, or
            export/reset stored records at any time.
          </p>
        </section>
      </div>
    </div>
  );
};
