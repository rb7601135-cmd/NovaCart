import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/currency';
import { RatingStars } from './RatingStars';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const QuickViewContent = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedOption, setSelectedOption] = useState(
    product.options ? product.options.values[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  const isFavorited = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOption);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto z-10 border border-neutral-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Gallery Column */}
          <div className="flex flex-col gap-3">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === img
                        ? 'border-indigo-600 scale-102 ring-2 ring-indigo-200'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Column */}
          <div className="flex flex-col">
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              {product.categoryName || product.category}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug mb-2">
              {product.name}
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="md" />
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                In Stock ({product.stock})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-extrabold text-neutral-900">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-sm text-neutral-600 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded">
                  Save {product.discount}%
                </span>
              )}
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed mb-5 line-clamp-3">
              {product.description}
            </p>

            {/* Options Selector */}
            {product.options && (
              <div className="mb-5">
                <div className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                  {product.options.type}: <span className="text-indigo-600 font-normal">{selectedOption}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.options.values.map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedOption(val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedOption === val
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-neutral-100">
              <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-neutral-600 hover:bg-white transition-colors"
                >
                  -
                </button>
                <span className="w-9 text-center text-sm font-bold text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-neutral-600 hover:bg-white transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-5 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* View full details link */}
            <div className="mt-4 pt-3 text-center border-t border-neutral-100">
              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                View full product specifications <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && product && (
        <QuickViewContent key={product.id} product={product} onClose={onClose} />
      )}
    </AnimatePresence>
  );
};
