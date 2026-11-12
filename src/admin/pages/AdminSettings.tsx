import React, { useState } from 'react';
import {
  Settings,
  Save,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Building,
  Truck,
  CreditCard,
  MessageCircle,
  Film,
  Eye,
  Play,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, exportDatabase, importDatabase, resetToDemo, showToast } =
    useStore();

  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHeroVideoChange = (
    field: 'enabled' | 'videoUrl' | 'posterUrl' | 'heading' | 'subtitle' | 'buttonText' | 'buttonLink' | 'overlayOpacity',
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      heroVideo: {
        enabled: prev.heroVideo?.enabled ?? true,
        videoUrl:
          prev.heroVideo?.videoUrl ||
          '/assets/aistudio/Add_hero_video_to_homepage_0d586848_aa5d6908.mp4',
        posterUrl:
          prev.heroVideo?.posterUrl || '/assets/aistudio/hero_video_poster.jpg',
        heading: prev.heroVideo?.heading || 'Elegance in Every Thread.',
        subtitle:
          prev.heroVideo?.subtitle || 'Discover Premium Fashion & Timeless Style.',
        buttonText: prev.heroVideo?.buttonText || 'Explore Collection',
        buttonLink: prev.heroVideo?.buttonLink || '/shop',
        overlayOpacity: prev.heroVideo?.overlayOpacity ?? 45,
        [field]: value,
      },
    }));
  };

  const handlePaymentChange = (field: 'jazzcash' | 'easypaisa' | 'bank', value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentInstructions: {
        ...prev.paymentInstructions,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleExport = () => {
    const jsonStr = exportDatabase();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `al_haram_db_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Database Exported', 'Complete JSON backup downloaded to your device.');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    const success = importDatabase(importJsonText);
    if (success) {
      showToast('Database Restored', 'Store data successfully updated from backup!');
      setShowImportBox(false);
    } else {
      showToast('Import Error', 'Invalid JSON backup format.', 'error');
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Warning: This will reset all products, orders, categories, and settings back to original factory demo data. Continue?'
      )
    ) {
      resetToDemo();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
          Store Settings & Database Management
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Configure branding, currency, shipping rates, and manage local database backups.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Store Identity */}
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
            <Building className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            General Brand Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Store Brand Name *</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Customer Helpline Phone *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Official WhatsApp Number *</label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Customer Support Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Showroom Opening Hours</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => handleChange('openingHours', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold">Showroom Physical Address</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold">Top Announcement Bar Text</label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => handleChange('announcementText', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Thresholds */}
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
            <Truck className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            Shipping & Inventory Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Standard Delivery Fee (PKR)</label>
              <input
                type="number"
                min="0"
                value={formData.deliveryCharges}
                onChange={(e) => handleChange('deliveryCharges', Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Free Delivery Order Minimum (PKR)</label>
              <input
                type="number"
                min="0"
                value={formData.freeDeliveryThreshold}
                onChange={(e) => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Low Stock Alert Threshold (Units)</label>
              <input
                type="number"
                min="1"
                value={formData.lowStockThreshold}
                onChange={(e) => handleChange('lowStockThreshold', Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>
          </div>
        </div>

        {/* Cinematic Homepage Video Hero Configuration */}
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Cinematic Video Hero (Homepage Top Section)
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage the homepage opening experience (3D Kinetic Chain or Cinematic Video).
              </p>
            </div>
          </div>

          {/* Hero Experience Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Active Opening Hero Experience
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('heroType', 'chain')}
                className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                  (formData.heroType ?? 'chain') === 'chain'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 ring-1 ring-amber-500'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                }`}
              >
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <span>3D Kinetic Chain Hero</span>
                    {(formData.heroType ?? 'chain') === 'chain' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-semibold">Active</span>
                    )}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Three.js interactive interlocking Torus chain with CatmullRomCurve3, scroll kinematics, and 3-stage light transitions.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleChange('heroType', 'video')}
                className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                  formData.heroType === 'video'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 ring-1 ring-amber-500'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                }`}
              >
                <Film className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <span>Cinematic Video Hero</span>
                    {formData.heroType === 'video' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-semibold">Active</span>
                    )}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Original haute couture video clip with responsive 90vh full-width video element and brand typography.
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Video File URL or Asset Path *</label>
              <input
                type="text"
                required
                value={
                  formData.heroVideo?.videoUrl ??
                  '/assets/aistudio/Add_hero_video_to_homepage_0d586848_aa5d6908.mp4'
                }
                onChange={(e) => handleHeroVideoChange('videoUrl', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
              />
              <span className="text-[10px] text-stone-400">
                Current: User uploaded 720p haute couture video clip.
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Poster Image URL (Preload / Fallback)</label>
              <input
                type="text"
                value={formData.heroVideo?.posterUrl ?? '/assets/aistudio/hero_video_poster.jpg'}
                onChange={(e) => handleHeroVideoChange('posterUrl', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
              />
              <span className="text-[10px] text-stone-400">
                Displays while the video loads or if autoplay is blocked by browser.
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Main Heading Text</label>
              <input
                type="text"
                value={formData.heroVideo?.heading ?? 'Elegance in Every Thread.'}
                onChange={(e) => handleHeroVideoChange('heading', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Subtitle Text</label>
              <input
                type="text"
                value={
                  formData.heroVideo?.subtitle ??
                  'Discover Premium Fashion & Timeless Style.'
                }
                onChange={(e) => handleHeroVideoChange('subtitle', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Call To Action Button Label</label>
              <input
                type="text"
                value={formData.heroVideo?.buttonText ?? 'Explore Collection'}
                onChange={(e) => handleHeroVideoChange('buttonText', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold">Button Destination Link</label>
              <input
                type="text"
                value={formData.heroVideo?.buttonLink ?? '/shop'}
                onChange={(e) => handleHeroVideoChange('buttonLink', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold">
                Dark Transparent Overlay Intensity ({formData.heroVideo?.overlayOpacity ?? 45}%)
              </label>
              <span className="text-[11px] text-stone-400">
                Recommended: 35% - 55% for luxury contrast
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={formData.heroVideo?.overlayOpacity ?? 45}
              onChange={(e) => handleHeroVideoChange('overlayOpacity', Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Admin Live Preview Box */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-700" />
              <span>Live Video & Typography Preview</span>
            </div>
            <div className="relative h-60 rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-700 bg-stone-950">
              <video
                src={
                  formData.heroVideo?.videoUrl ||
                  '/assets/aistudio/Add_hero_video_to_homepage_0d586848_aa5d6908.mp4'
                }
                poster={formData.heroVideo?.posterUrl || '/assets/aistudio/hero_video_poster.jpg'}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: `rgba(12, 10, 9, ${(formData.heroVideo?.overlayOpacity ?? 45) / 100})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white pointer-events-none">
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  AL-HARAM CLOTH STORE
                </p>
                <h4 className="font-serif-luxury text-lg font-bold">
                  {formData.heroVideo?.heading || 'Elegance in Every Thread.'}
                </h4>
                <p className="text-xs text-stone-300">
                  {formData.heroVideo?.subtitle || 'Discover Premium Fashion & Timeless Style.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Account Instructions */}
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
          <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
            <CreditCard className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            Payment Gateway Account Instructions
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                JazzCash Instructions & Account #
              </label>
              <textarea
                rows={2}
                value={formData.paymentInstructions.jazzcash}
                onChange={(e) => handlePaymentChange('jazzcash', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                EasyPaisa Instructions & Account #
              </label>
              <textarea
                rows={2}
                value={formData.paymentInstructions.easypaisa}
                onChange={(e) => handlePaymentChange('easypaisa', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Meezan / Islamic Bank Details (Account Title, IBAN)
              </label>
              <textarea
                rows={2}
                value={formData.paymentInstructions.bank}
                onChange={(e) => handlePaymentChange('bank', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-bold px-8 py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 border border-amber-500/40 shadow-xl transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>

      {/* Database Backup & Restore Section */}
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            LocalStorage Database Backup & Migration
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Export a full snapshot of products, categories, orders, customers, and reviews to JSON,
            or restore an existing backup file.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Database JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setShowImportBox(!showImportBox)}
            className="bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Restore from JSON</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {showImportBox && (
          <form onSubmit={handleImportSubmit} className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
            <label className="text-xs font-semibold">Paste Backup JSON Content:</label>
            <textarea
              required
              rows={5}
              placeholder='Paste JSON exported from AL-HARAM: {"products": [...], ...}'
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full text-xs font-mono p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportBox(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-950 text-amber-200 rounded-xl text-xs font-semibold border border-amber-500/40"
              >
                Execute Restore & Reload
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
