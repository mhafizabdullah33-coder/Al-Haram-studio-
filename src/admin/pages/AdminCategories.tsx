import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderTree, X, Check, Eye } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';

export const AdminCategories: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImage(cat.image);
    setIsActive(cat.isActive);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedSlug = slug.trim()
      ? slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: name.trim(),
        slug: generatedSlug,
        description: description.trim(),
        image: image.trim(),
        isActive,
      });
    } else {
      addCategory({
        name: name.trim(),
        slug: generatedSlug,
        description: description.trim(),
        image: image.trim(),
        isActive,
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, catName: string) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl font-bold text-stone-900 dark:text-stone-100">
            Category Management
          </h1>
          <p className="text-xs text-stone-500">
            Organize products into distinct collections, seasonal drops, and fabric lines.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-semibold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 border border-amber-500/40 shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c.id).length;

          return (
            <div
              key={c.id}
              className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden">
                <img src={c.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      c.isActive ? 'bg-emerald-600 text-white' : 'bg-stone-500 text-white'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Disabled'}
                  </span>
                  <span className="bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {count} articles
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif-luxury font-bold text-base text-stone-900 dark:text-stone-100">
                    {c.name}
                  </h3>
                  <p className="text-[11px] font-mono text-stone-400 mt-0.5">slug: /{c.slug}</p>
                  <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[11px] text-stone-400">ID: {c.id}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 text-stone-500 hover:text-emerald-800 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-serif-luxury text-lg font-bold text-stone-900 dark:text-stone-100">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Custom Slug (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. festive-chiffon"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Image URL *</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
              </div>

              <label className="flex items-center gap-2 text-xs cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-emerald-800"
                />
                <span>Active in Store Navigation</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-950 text-amber-200 rounded-xl text-xs font-semibold border border-amber-500/40 shadow hover:bg-emerald-900 transition"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
