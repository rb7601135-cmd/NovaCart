import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Check } from 'lucide-react';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/currency';

export const CartDrawer = () => {
  const {
    cart,
    totalItems,
    subtotal,
    shipping,
    total,
    freeShippingThreshold,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart
  } = useCart();

  const progress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-neutral-900">
                    Your Shopping Bag ({totalItems})
                  </h2>
                </div>
                <button
                  onClick={closeCartDrawer}
                  className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="px-5 py-3.5 bg-indigo-50/60 border-b border-indigo-100 text-xs">
                {subtotal >= freeShippingThreshold ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    You unlocked <span className="underline">FREE Express Delivery</span>!
                  </div>
                ) : (
                  <div className="text-neutral-700">
                    Add{' '}
                    <span className="font-bold text-indigo-700">
                      {formatPrice(remainingForFreeShipping)}
                    </span>{' '}
                    more to qualify for <span className="font-semibold text-neutral-900">FREE shipping</span>
                  </div>
                )}
                <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-base font-semibold text-neutral-800 mb-1">
                      Your bag is empty
                    </p>
                    <p className="text-xs text-neutral-500 max-w-xs mb-6">
                      Explore our curated collections of luxury goods and tech essentials.
                    </p>
                    <Link
                      to="/shop"
                      onClick={closeCartDrawer}
                      className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-indigo-600 transition-colors"
                    >
                      Explore Products
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartItemId} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                      {/* Thumbnail */}
                      <Link
                        to={`/product/${item.id}`}
                        onClick={closeCartDrawer}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/80"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </Link>

                      {/* Info & Controls */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/product/${item.id}`}
                              onClick={closeCartDrawer}
                              className="text-xs font-bold text-neutral-900 hover:text-indigo-600 transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              className="text-neutral-400 hover:text-rose-600 p-1 rounded transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {item.selectedOption && (
                            <div className="text-[11px] text-neutral-500 mt-0.5">
                              Option: {item.selectedOption}
                            </div>
                          )}

                          <div className="text-xs font-bold text-neutral-900 mt-1">
                            {formatPrice(item.price)}
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-white rounded transition-colors"
                            >
                              -
                            </button>
                            <span className="w-7 text-center text-xs font-semibold text-neutral-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-white rounded transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-xs font-bold text-neutral-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer / Summary */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 space-y-3">
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : formatPrice(shipping)}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-neutral-900">Estimated Total</span>
                    <span className="text-lg font-extrabold text-neutral-900">{formatPrice(total)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      to="/cart"
                      onClick={closeCartDrawer}
                      className="py-3 px-4 rounded-xl border border-neutral-300 text-center text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition-colors"
                    >
                      View Cart
                    </Link>
                    <Link
                      to="/checkout"
                      onClick={closeCartDrawer}
                      className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-center text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 transition-colors"
                    >
                      Checkout <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
