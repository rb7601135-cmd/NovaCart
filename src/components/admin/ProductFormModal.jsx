import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Check } from 'lucide-react';
import { useCms } from '../../hooks/useCms';
import { categories } from '../../data/categories';

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'
];

export const ProductFormModal = ({ product, isOpen, onClose, onSave }) => {
  const { settings } = useCms();

  const [formData, setFormData] = useState({
    name: '',
    category: 'accessories',
    price: '',
    oldPrice: '',
    stock: 25,
    badge: 'New',
    image: PRESET_IMAGES[0],
    description: '',
    isFeatured: true,
    isNew: true,
    isBestSeller: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'accessories',
        price: product.price ?? '',
        oldPrice: product.oldPrice ?? '',
        stock: product.stock ?? 25,
        badge: product.badge || 'New',
        image: product.image || PRESET_IMAGES[0],
        description: product.description || '',
        isFeatured: Boolean(product.isFeatured),
        isNew: Boolean(product.isNew),
        isBestSeller: Boolean(product.isBestSeller)
      });
    } else {
      setFormData({
        name: '',
        category: 'accessories',
        price: '',
        oldPrice: '',
        stock: 25,
        badge: 'New',
        image: PRESET_IMAGES[0],
        description: '',
        isFeatured: true,
        isNew: true,
        isBestSeller: false
      });
    }
    setErrors({});
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Valid price is required';
    if (!formData.image.trim()) errs.image = 'Image URL is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSave({
      ...formData,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : Number(formData.price) * 1.25,
      stock: Number(formData.stock)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-neutral-50/60">
          <div>
            <h2 className="text-lg font-black text-neutral-900 tracking-tight">
              {product ? 'Edit Product' : 'Create New Product'}
            </h2>
            <p className="text-xs text-neutral-500">
              {product ? `Updating SKU / ID: ${product.id}` : 'Fill in the details to publish a new catalog item'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Product Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Lumina Chronograph Swiss Watch"
              className={`w-full px-4 py-2.5 rounded-xl border ${
                errors.name ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-200'
              } text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium`}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Category & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Display Badge
              </label>
              <select
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
              >
                <option value="New">New Arrival</option>
                <option value="Best Seller">Best Seller</option>
                <option value="Featured">Featured</option>
                <option value="Limited">Limited Edition</option>
                <option value="Sale">Special Sale</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Price ({settings.currencySymbol}) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="249.99"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.price ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-200'
                } text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold`}
              />
              {errors.price && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Original / Old Price
              </label>
              <input
                type="number"
                step="0.01"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleChange}
                placeholder="299.99"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-neutral-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="25"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>
          </div>

          {/* Image URL & Live Preview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Image URL <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className={`w-full px-4 py-2.5 rounded-xl border ${
                    errors.image ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-200'
                  } text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono text-xs`}
                />
                
                {/* Preset Quick Selectors */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-neutral-500 font-medium">Presets:</span>
                  {PRESET_IMAGES.slice(0, 4).map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, image: url }))}
                      className="w-6 h-6 rounded-md overflow-hidden border border-neutral-300 hover:border-indigo-600 transition-colors"
                    >
                      <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Box */}
              <div className="w-20 h-20 rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = PRESET_IMAGES[0];
                    }}
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-neutral-400" />
                )}
              </div>
            </div>
            {errors.image && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.image}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the product and materials..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Visibility Toggles */}
          <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
              />
              <span>Featured on Homepage</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={formData.isBestSeller}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
              />
              <span>Best Seller Tag</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
              />
              <span>Mark as New Release</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{product ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
