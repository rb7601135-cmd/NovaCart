import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Tag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';

import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/currency';

export const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    totalItems,
    subtotal,
    discountAmount,
    coupon,
    shipping,
    estimatedTax,
    total,
    freeShippingThreshold,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [promoCodeInput, setPromoCodeInput] = useState('');

  const progress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (promoCodeInput.trim()) {
      applyCoupon(promoCodeInput.trim());
      setPromoCodeInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-neutral-50 min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 text-center border border-neutral-200/80 shadow-xs">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-neutral-900 mb-2">Your Bag is Empty</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mb-8 leading-relaxed">
            Your shopping cart currently contains no items. Discover our seasonal collections and handcrafted essentials.
          </p>
          <Link
            to="/shop"
            className="w-full py-4 px-6 bg-neutral-900 hover:bg-indigo-600 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-colors inline-flex items-center justify-center gap-2"
          >
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-neutral-500 hover:text-rose-600 self-start sm:self-auto transition-colors"
          >
            Clear All Items
          </button>
        </div>

        {/* Free Shipping Milestone Alert */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs mb-8">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            {subtotal >= freeShippingThreshold ? (
              <span className="text-emerald-700 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Congratulations! You qualified for FREE Express Shipping
              </span>
            ) : (
              <span className="text-neutral-700">
                Add <strong className="text-indigo-600">{formatPrice(remainingForFreeShipping)}</strong> more to get free express delivery
              </span>
            )}
            <span className="text-neutral-500">{progress}%</span>
          </div>
          <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Grid: Items Table + Summary Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Cart Items Table / Cards (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs divide-y divide-neutral-100 overflow-hidden">
              {cart.map((item) => (
                <div key={item.cartItemId} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${item.id}`}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/70"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      {item.categoryName || item.category}
                    </span>
                    <Link
                      to={`/product/${item.id}`}
                      className="text-sm sm:text-base font-bold text-neutral-900 hover:text-indigo-600 transition-colors block mt-0.5 line-clamp-1"
                    >
                      {item.name}
                    </Link>

                    {item.selectedOption && (
                      <p className="text-xs text-neutral-500 mt-1">
                        Option: <span className="font-semibold text-neutral-800">{item.selectedOption}</span>
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-bold text-neutral-900">
                        {formatPrice(item.price)}
                      </span>
                      {item.oldPrice && item.oldPrice > item.price && (
                        <span className="text-xs text-neutral-400 line-through">
                          {formatPrice(item.oldPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Controls & Subtotal */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-1">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-neutral-600 hover:bg-white transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-neutral-600 hover:bg-white transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Total for item & remove */}
                    <div className="flex items-center gap-3">
                      <span className="text-base font-extrabold text-neutral-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100 transition-colors"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Back to Shop Link */}
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Card (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-5">
              <h2 className="text-lg font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                Order Summary
              </h2>

              {/* Promo Code Form */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-2">
                  Have a Promo Code?
                </label>
                {coupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-800">
                        {coupon.code} ({coupon.discountPercent}% OFF)
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. NOVA20"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-neutral-50 uppercase text-xs font-semibold rounded-xl border border-neutral-200 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3 pt-3 border-t border-neutral-100 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatPrice(subtotal)}</span>
                </div>

                {coupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({coupon.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <strong className="text-emerald-600 font-bold uppercase">Free</strong>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Estimated Tax (8%)</span>
                  <span>{formatPrice(estimatedTax)}</span>
                </div>

                <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-neutral-900">Total</span>
                  <span className="text-2xl font-black text-neutral-900">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Icons */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-around text-neutral-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure SSL
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-indigo-500" /> Fast Courier
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-500" /> 30-Day Return
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
