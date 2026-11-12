import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppLink } from '../utils/formatters';

const FAQS = [
  {
    q: 'What is the delivery time for orders across Pakistan?',
    a: 'We ship through TCS Express and Leopard Courier. Deliveries inside Lahore, Karachi, and Islamabad arrive within 24 to 48 hours. Other cities take 2 to 4 working days.',
  },
  {
    q: 'Do you offer Cash on Delivery (COD)?',
    a: 'Yes, Cash on Delivery is available nationwide across all major cities and towns up to an order value of Rs. 40,000.',
  },
  {
    q: 'Can unstitched fabric be exchanged?',
    a: 'Yes! All unwashed and uncut fabrics in original packaging with brand tags can be exchanged within 7 days of delivery.',
  },
  {
    q: 'How can I pay through JazzCash or EasyPaisa?',
    a: 'During checkout, select JazzCash or EasyPaisa to view our official merchant account details. Send the payment and paste your 12-digit Transaction ID into the checkout form.',
  },
  {
    q: 'Do you provide custom stitching for bridal and formal wear?',
    a: 'Yes, our master atelier on MM Alam Road, Lahore offers bespoke bridal fittings and groom waistcoat tailoring. Please contact us on WhatsApp to schedule an appointment.',
  },
];

export const Contact: React.FC = () => {
  const { settings, addSupportMessage } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Order & Sizing Inquiry');
  const [message, setMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    addSupportMessage({
      customerName: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Header */}
      <section className="bg-stone-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="inline-block text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            Showrooms & Concierge
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold">
            Contact AL-HARAM
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Have questions about fabrics, bridal orders, or wholesale? Our fashion advisors are here
            to help.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Info + Interactive Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">
                Flagship Showroom
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                MM Alam Road, Lahore
              </h2>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                Step into our boutique showroom to feel our pure lawn, raw silk, and hand-embroidered
                shawls in person.
              </p>
            </div>

            <div className="space-y-4 text-xs text-stone-700 dark:text-stone-300">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800">
                <MapPin className="w-5 h-5 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100">Boutique Address</h4>
                  <p className="text-stone-500 mt-0.5">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800">
                <Phone className="w-5 h-5 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100">Customer Helpline</h4>
                  <p className="text-stone-500 mt-0.5">{settings.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800">
                <Mail className="w-5 h-5 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100">Email Inquiries</h4>
                  <p className="text-stone-500 mt-0.5">{settings.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800">
                <Clock className="w-5 h-5 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100">Showroom Hours</h4>
                  <p className="text-stone-500 mt-0.5">{settings.openingHours}</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="bg-emerald-950 text-white p-6 rounded-3xl border border-amber-500/40 space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#25D366] fill-current" />
                <h4 className="font-serif-luxury text-base font-bold text-amber-300">
                  Instant WhatsApp VIP Stylist
                </h4>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Need immediate help choosing between sizes or matching dupattas? Our styling desk is
                live on WhatsApp daily.
              </p>
              <a
                href={buildWhatsAppLink(settings.whatsappNumber, 'Salam! I need assistance with an order.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow"
              >
                <span>Chat on WhatsApp ({settings.whatsappNumber})</span>
              </a>
            </div>
          </div>

          {/* Right: Interactive Contact Form */}
          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl space-y-6">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100">
                Send a Message to Support
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Your message is stored in our support queue and our team will get in touch promptly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samina Qureshi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Subject *
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="Order & Sizing Inquiry">Order & Sizing Inquiry</option>
                  <option value="Custom Bridal / Groom Sizing">Custom Bridal / Groom Sizing</option>
                  <option value="Bulk Corporate Orders">Bulk Corporate Orders</option>
                  <option value="Exchange or Return Assistance">Exchange or Return Assistance</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you with AL-HARAM garments?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-bold py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-amber-500/40 shadow-xl transition"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Simulated Interactive Google Maps Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-xl bg-white dark:bg-stone-900">
          <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                Find Our MM Alam Road Flagship Store
              </h3>
              <p className="text-xs text-stone-500">
                Opposite Ali Tower, Near Hussain Chowk, Gulberg III, Lahore, Pakistan
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=MM+Alam+Road+Gulberg+III+Lahore"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline"
            >
              Open in Google Maps App →
            </a>
          </div>

          {/* Interactive Map Visual Mockup */}
          <div className="relative aspect-[21/9] min-h-[300px] w-full bg-stone-200 dark:bg-stone-800 overflow-hidden flex items-center justify-center">
            {/* Map textured satellite background */}
            <div className="absolute inset-0 bg-emerald-950/10 dark:bg-emerald-950/40 flex items-center justify-center">
              <div className="text-center space-y-2 p-6 bg-white/90 dark:bg-stone-900/90 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-700 max-w-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-950 text-amber-400 flex items-center justify-center mx-auto shadow font-brand font-bold">
                  AH
                </div>
                <h4 className="font-serif-luxury font-bold text-sm text-stone-900 dark:text-stone-100">
                  AL-HARAM CLOTH STORE
                </h4>
                <p className="text-[11px] text-stone-500">
                  Ground Floor, Gulberg III, MM Alam Road, Lahore
                </p>
                <div className="pt-2">
                  <a
                    href="https://maps.google.com/?q=MM+Alam+Road+Gulberg+III+Lahore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-emerald-950 text-amber-200 text-xs font-semibold px-4 py-1.5 rounded-lg border border-amber-500/40"
                  >
                    Get GPS Navigation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">
            Frequently Asked Questions
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-stone-900 dark:text-stone-100"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-emerald-800 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-stone-600 dark:text-stone-400 leading-relaxed border-t border-stone-100 dark:border-stone-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
