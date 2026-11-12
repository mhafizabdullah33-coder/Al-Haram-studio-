import React from 'react';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertTriangle, MessageCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppLink } from '../utils/formatters';

export const Returns: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="text-center space-y-3 pb-6 border-b border-stone-200 dark:border-stone-800">
        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">
          Client Care & Assurance
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Return & Exchange Policy
        </h1>
        <p className="text-xs text-stone-500">
          7-Day Hassle-Free Exchange Guarantee • AL-HARAM CLOTH STORE
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
          <RotateCcw className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">7-Day Window</h4>
          <p className="text-xs text-stone-500">
            Notify us within 7 days of receiving your parcel to initiate an exchange.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
          <ShieldCheck className="w-6 h-6 text-amber-600" />
          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">Uncut & Unwashed</h4>
          <p className="text-xs text-stone-500">
            Fabric must retain original brand seals, tags, and unstitched dimensions.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">Free Defect Replacement</h4>
          <p className="text-xs text-stone-500">
            Any weaving defect or misprint is replaced free of cost with expedited shipping.
          </p>
        </div>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100">
            1. Exchange Conditions
          </h2>
          <p>
            At AL-HARAM CLOTH STORE, customer delight is our hallmark. We gladly accept exchanges under
            the following guidelines:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-400 text-xs">
            <li>The item was purchased through our official website or authorized showroom.</li>
            <li>The garment has not been altered, tailored, washed, or worn.</li>
            <li>Original packaging, ribbons, and invoice receipts are intact.</li>
            <li>Size exchanges for stitched prêt are facilitated subject to stock availability.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100">
            2. How to Initiate an Exchange
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-stone-600 dark:text-stone-400 text-xs">
            <li>
              <strong>Contact Us:</strong> Message our WhatsApp concierge with your Order Number
              (e.g., <code>AHC-2026-1001</code>) and brief reason for exchange.
            </li>
            <li>
              <strong>Courier Dispatch:</strong> Safely pack the article and send it to our Lahore
              Head Atelier via any reputable courier (TCS, Leopard, Call Courier).
            </li>
            <li>
              <strong>Replacement Dispatched:</strong> Upon receipt and inspection by our master
              cutters, your replacement article will be dispatched within 48 hours.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100">
            3. Damaged or Defective Items
          </h2>
          <p>
            In the rare event that an article arrives damaged or with incorrect stitching specifications,
            AL-HARAM CLOTH STORE assumes full responsibility. We will arrange a reverse pickup or
            reimburse your courier expenses and dispatch a brand new replacement immediately.
          </p>
        </section>

        <div className="bg-stone-50 dark:bg-stone-800/80 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif-luxury font-bold text-base text-stone-900 dark:text-stone-100">
              Need assistance with a return?
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Our concierge team is available Mon-Sat, 11 AM - 10 PM.
            </p>
          </div>
          <a
            href={buildWhatsAppLink(settings.whatsappNumber, 'Salam! I would like to exchange an article from my order.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow transition hover:bg-[#20ba59]"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
