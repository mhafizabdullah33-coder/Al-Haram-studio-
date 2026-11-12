import React from 'react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const About: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Banner */}
      <section className="relative py-20 bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            Our Heritage & Craft
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold tracking-tight">
            The Legend of AL-HARAM
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Preserving centuries of artisanal Eastern textile artistry, weaving royal grace into
            modern silhouettes since 1998.
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">
              Where It Began
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
              A Legacy Born in the Heart of Lahore
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
              AL-HARAM CLOTH STORE was established with a singular, uncompromising vision: to bring
              back the royal dignity and true purity of Eastern attire. In a market flooded with
              blended polyester and fast synthetic fabrics, we made a resolute vow to deal solely in
              authentic, unadulterated fibers.
            </p>
            <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
              From our flagship showroom on MM Alam Road, Gulberg III, to our dedicated hand-embroidery
              studios, every yard of cloth bearing the AL-HARAM monogram passes rigorous inspection
              for thread count, tensile strength, color fastness, and drape.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div>
                <h4 className="font-serif-luxury text-2xl font-bold text-emerald-900 dark:text-emerald-400">
                  28+ Years
                </h4>
                <p className="text-xs text-stone-500 mt-1">Of Unbroken Fabric Heritage</p>
              </div>
              <div>
                <h4 className="font-serif-luxury text-2xl font-bold text-amber-600">
                  100% Pure
                </h4>
                <p className="text-xs text-stone-500 mt-1">Certified Cotton & Spun Silk</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
              alt="Artisanal Handloom Fabric"
              className="rounded-3xl shadow-xl object-cover aspect-[4/3] w-full"
            />
            <div className="absolute -bottom-6 -right-6 hidden sm:block bg-emerald-950 text-white p-6 rounded-2xl shadow-2xl border border-amber-500/40 max-w-xs">
              <Sparkles className="w-6 h-6 text-amber-400 mb-2" />
              <p className="text-xs font-light text-stone-200">
                &quot;True luxury in clothing is felt through the skin before it is ever seen with the
                eyes.&quot;
              </p>
              <p className="text-[10px] text-amber-400 font-bold uppercase mt-2">
                — Master Craftsman, Al-Haram
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-stone-50 dark:bg-stone-900/60 py-16 border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100">
                Our Sacred Mission
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                To deliver authentic Eastern fashion that honors centuries-old Pakistani textile
                traditions while providing seamless, transparent online shopping experiences with
                fast nationwide delivery and honest pricing.
              </p>
            </div>

            <div className="bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100">
                Our Vision
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                To stand globally as the foremost symbol of Pakistani sartorial excellence—connecting
                heritage looms and contemporary styling for celebratory moments, weddings, and
                everyday poise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">
            The Al-Haram Standard
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Why Discerning Clients Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
            <ShieldCheck className="w-8 h-8 text-emerald-800 dark:text-emerald-400" />
            <h4 className="font-serif-luxury text-base font-bold text-stone-900 dark:text-stone-100">
              Guaranteed Authenticity
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Every yard is verified for fabric composition. No synthetic blends disguised as pure
              cotton.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
            <Sparkles className="w-8 h-8 text-amber-600" />
            <h4 className="font-serif-luxury text-base font-bold text-stone-900 dark:text-stone-100">
              Heirloom Needlework
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Zari, tilla, and schiffli chikankari worked by seasoned master artisans across Punjab
              and Sindh.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-800 dark:text-emerald-400" />
            <h4 className="font-serif-luxury text-base font-bold text-stone-900 dark:text-stone-100">
              Tailored Sizing
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Available in both ready-to-wear stitched cuts and generous 3-piece unstitched cuts.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
            <HeartHandshake className="w-8 h-8 text-amber-600" />
            <h4 className="font-serif-luxury text-base font-bold text-stone-900 dark:text-stone-100">
              7-Day Fair Exchange
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              We stand behind our products with complete customer support and straightforward
              exchanges.
            </p>
          </div>
        </div>
      </section>

      {/* Showroom Visit CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 border border-amber-500/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold">
              Experience the Fabric in Person
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Our master stylists and tailoring consultants welcome you to our boutique showroom on
              MM Alam Road for custom bridal fittings and men’s bespoke shalwar kameez trials.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-amber-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {settings.address}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {settings.openingHours}
              </span>
            </div>
          </div>

          <Link
            to="/contact"
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-7 py-3 rounded-xl text-xs uppercase tracking-wider transition shrink-0 shadow-lg"
          >
            Get Showroom Directions
          </Link>
        </div>
      </section>
    </div>
  );
};
