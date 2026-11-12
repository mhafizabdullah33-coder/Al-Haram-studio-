import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const Categories: React.FC = () => {
  const { categories, products } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/60">
          <Sparkles className="w-3.5 h-3.5" />
          The Al-Haram Catalog
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100">
          Discover All Collections
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
          From unstitched pure Swiss Voile lawn to ready-to-wear formal wedding ensembles and
          regal men’s Giza cotton attire.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => {
          const matchingCount = products.filter((p) => p.category === cat.id).length;

          return (
            <div
              key={cat.id}
              className="group relative bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-emerald-950/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md border border-amber-400/40">
                  {matchingCount} Articles
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <Link
                  to={`/shop?category=${cat.id}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-400 hover:text-amber-600 dark:hover:text-amber-400 tracking-wider uppercase pt-2 transition group-hover:translate-x-1"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
