import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Lock, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useCms } from '../hooks/useCms';
import { useToast } from '../hooks/useToast';
import { formatPrice } from '../utils/currency';

export const Checkout = () => {
  const navigate = useNavigate();
  const { cart, subtotal, discountAmount, coupon, shipping, estimatedTax, clearCart } = useCart();
  const { user, addOrder: authAddOrder } = useAuth();
  const { addOrder: cmsAddOrder } = useCms();
  const { addToast } = useToast();


  // Form State with user defaults
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || {};
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: defaultAddress.street || '',
    city: defaultAddress.city || '',
    state: defaultAddress.state || '',
    postalCode: defaultAddress.postalCode || '',
    country: defaultAddress.country || 'United States'
  });

  // Sync formData if user signs in or profile loads
  useEffect(() => {
    if (user) {
      const addr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || {};
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || addr.street || '',
        city: prev.city || addr.city || '',
        state: prev.state || addr.state || '',
        postalCode: prev.postalCode || addr.postalCode || '',
        country: prev.country || addr.country || 'United States'
      }));
    }
  }, [user]);

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Payment card state
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardholderName: user?.name || '',
    expiry: '',
    cvc: ''
  });

  // Calculate adjusted shipping based on method
  const shippingFee =
    shippingMethod === 'express' ? 15 : shippingMethod === 'overnight' ? 25 : shipping;
  const grandTotal = subtotal - discountAmount + shippingFee + estimatedTax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    return newErrors;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      addToast('Your cart is empty. Add products before checking out.', 'error');
      navigate('/shop');
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast('Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(async () => {
      // Trigger festive celebration
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti optional
      }

      // Build complete order payload
      const orderPayload = {
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          selectedOption: i.selectedOption,
          image: i.image
        })),
        shippingAddress: { ...formData },
        shippingMethod:
          shippingMethod === 'express'
            ? 'Express Air (1-2 days)'
            : shippingMethod === 'overnight'
            ? 'Priority Overnight'
            : 'Standard Courier (3-5 days)',
        paymentMethod:
          paymentMethod === 'credit-card'
            ? 'Visa Card ending in 4242'
            : paymentMethod === 'paypal'
            ? 'PayPal Account'
            : 'Cash on Delivery',
        subtotal,
        shipping: shippingFee,
        discount: discountAmount,
        tax: estimatedTax,
        total: grandTotal,
        userId: user?.id || null,
        userEmail: user?.email || formData.email
      };

      // Record Order in CMS Context (updates CMS orders, customers, metrics, Supabase & localStorage)
      let newOrder = null;
      if (cmsAddOrder) {
        newOrder = await cmsAddOrder(orderPayload);
      }

      // Record Order in AuthContext
      if (authAddOrder) {
        await authAddOrder(newOrder || orderPayload);
      }

      const orderRefId = newOrder?.id || `NC-${Math.floor(10000 + Math.random() * 90000)}`;

      // Clear shopping bag
      clearCart();
      setIsSubmitting(false);

      addToast(`Order #${orderRefId} confirmed! Thank you for choosing NovaCart.`, 'success', 5000);
      navigate('/orders');
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">No Items to Checkout</h2>
        <p className="text-xs text-neutral-500 mb-6">
          Your cart is currently empty. Please select products from our catalogue.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Trust Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900">
              Secure Checkout
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Please enter your shipping address and select preferred dispatch options.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Transaction</span>
          </div>
        </div>

        {/* Form and Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Checkout Steps Form (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-8">
              
              {/* Guest Sign-in Hint */}
              {!user && (
                <div className="p-4 bg-indigo-50/80 border border-indigo-100 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-950">
                  <div>
                    <span className="font-bold block text-sm text-indigo-900">Checking out as guest?</span>
                    <span className="text-indigo-700">Have an account? Sign in to use saved addresses and earn VIP perks.</span>
                  </div>
                  <Link
                    to="/login"
                    state={{ from: { pathname: '/checkout' } }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shrink-0"
                  >
                    Sign In Now
                  </Link>
                </div>
              )}

              {/* Section 1: Customer Contact & Shipping Information */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
                  <span className="w-7 h-7 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-base font-bold text-neutral-900">
                    Shipping Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Alex Morgan"
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border ${
                        errors.fullName ? 'border-rose-500' : 'border-neutral-200'
                      } focus:bg-white focus:outline-hidden focus:border-indigo-500`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border ${
                        errors.email ? 'border-rose-500' : 'border-neutral-200'
                      } focus:bg-white focus:outline-hidden focus:border-indigo-500`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border ${
                        errors.phone ? 'border-rose-500' : 'border-neutral-200'
                      } focus:bg-white focus:outline-hidden focus:border-indigo-500`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border ${
                        errors.address ? 'border-rose-500' : 'border-neutral-200'
                      } focus:bg-white focus:outline-hidden focus:border-indigo-500`}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. San Francisco"
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border ${
                        errors.city ? 'border-rose-500' : 'border-neutral-200'
                      } focus:bg-white focus:outline-hidden focus:border-indigo-500`}
                    />
                    {errors.city && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Postal / ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="e.g. 94107"
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 rounded-xl text-xs sm:text-sm border ${
                        errors.postalCode ? 'border-rose-500' : 'border-neutral-200'
                      } focus:bg-white focus:outline-hidden focus:border-indigo-500`}
                    />
                    {errors.postalCode && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
                  <span className="w-7 h-7 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-base font-bold text-neutral-900">
                    Delivery Speed
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'standard',
                      name: 'Standard Secure Courier',
                      time: '3–5 Business Days',
                      price: shipping === 0 ? 'FREE' : formatPrice(shipping)
                    },
                    {
                      id: 'express',
                      name: 'Express Air Priority',
                      time: '1–2 Business Days',
                      price: '$15.00'
                    },
                    {
                      id: 'overnight',
                      name: 'White-Glove Overnight VIP',
                      time: 'Next Morning Guarantee',
                      price: '$25.00'
                    }
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        shippingMethod === method.id
                          ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-100'
                          : 'border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === method.id}
                          onChange={() => setShippingMethod(method.id)}
                          className="accent-indigo-600 w-4 h-4"
                        />
                        <div>
                          <p className="text-xs font-bold text-neutral-900">{method.name}</p>
                          <p className="text-[11px] text-neutral-500">{method.time}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-neutral-900">
                        {method.price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 3: Payment Method (Mockup) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-100">
                  <span className="w-7 h-7 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-base font-bold text-neutral-900">
                    Payment Method
                  </h2>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'credit-card', label: 'Credit Card' },
                    { id: 'paypal', label: 'PayPal' },
                    { id: 'cod', label: 'Cash on Delivery' }
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPaymentMethod(p.id)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-colors ${
                        paymentMethod === p.id
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Credit Card Details */}
                {paymentMethod === 'credit-card' && (
                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                        placeholder="•••• •••• •••• ••••"
                        maxLength={19}
                        className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-xs font-mono focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.expiry}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                          placeholder="MM / YY"
                          maxLength={5}
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-xs font-mono focus:outline-hidden focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                          Security Code (CVC)
                        </label>
                        <input
                          type="password"
                          value={paymentDetails.cvc}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, cvc: e.target.value })}
                          placeholder="CVC"
                          maxLength={4}
                          className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-neutral-200 text-xs font-mono focus:outline-hidden focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-xs text-neutral-600">
                    You will be securely redirected to PayPal sandbox to authorize payment upon clicking &ldquo;Place Order&rdquo;.
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-xs text-neutral-600">
                    Pay with cash or card upon delivery to the courier agent.
                  </div>
                )}
              </div>

            </form>
          </div>

          {/* Order Summary Sidebar (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                Order Review ({cart.length} items)
              </h2>

              {/* Items List Mini */}
              <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 pr-1">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Qty: {item.quantity} {item.selectedOption ? `• ${item.selectedOption}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-neutral-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-100 text-xs">
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
                  <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatPrice(shippingFee)}</span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Estimated Tax</span>
                  <span>{formatPrice(estimatedTax)}</span>
                </div>

                <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-neutral-900">Total</span>
                  <span className="text-2xl font-black text-neutral-900">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <span>Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/cart"
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Modify bag items
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
