import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  X,
  FileText
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { formatPrice } from '../utils/currency';

export const Orders = () => {
  const { orders } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState(null);

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item, item.quantity, item.selectedOption);
    });
    addToast(`Added all items from order #${order.id} back to your bag!`, 'success');
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>Fulfilment History</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
              Orders & Shipments
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Track shipments in real-time, print receipts, and manage reorders.
            </p>
          </div>
          <Link
            to="/shop"
            className="px-5 py-2.5 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 shadow-xs">
            <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-neutral-900 mb-1">No Orders Found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
              You haven&apos;t placed any orders with NovaCart yet.
            </p>
            <Link
              to="/shop"
              className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-neutral-50/70 p-5 sm:p-6 border-b border-neutral-200/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
                    <div>
                      <span className="text-neutral-400 block font-medium">Order Number</span>
                      <span className="font-extrabold text-neutral-900 text-sm">#{order.id}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block font-medium">Date Placed</span>
                      <span className="font-bold text-neutral-800">{order.date}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block font-medium">Total Amount</span>
                      <span className="font-extrabold text-neutral-900">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* Status Badge & Receipt */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : order.status === 'In Transit'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {order.status === 'Delivered' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : order.status === 'In Transit' ? (
                        <Truck className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>{order.status}</span>
                    </span>

                    <button
                      onClick={() => setActiveReceiptOrder(order)}
                      className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-xl transition-colors"
                      title="View Receipt"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-5 sm:p-6 divide-y divide-neutral-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-2xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                        />
                        <div>
                          <Link
                            to={`/product/${item.id}`}
                            className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-indigo-600 transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            Qty: {item.quantity} {item.selectedOption ? `• Option: ${item.selectedOption}` : ''}
                          </p>
                          <p className="text-xs font-semibold text-neutral-700 mt-1">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-extrabold text-neutral-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Controls: Live Tracking & Reorder */}
                <div className="p-5 sm:p-6 bg-neutral-50/40 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-neutral-500 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-indigo-600" />
                    <span>
                      Carrier: <strong className="text-neutral-800">{order.carrier}</strong> ({order.trackingNumber})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-800 hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reorder All
                    </button>

                    <button
                      onClick={() => setActiveTrackingOrder(order)}
                      className="px-4 py-2 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" /> Track Package
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Tracking Modal Timeline */}
      <AnimatePresence>
        {activeTrackingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTrackingOrder(null)}
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 z-10 border border-neutral-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Package Tracking #{activeTrackingOrder.id}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Carrier: {activeTrackingOrder.carrier} • {activeTrackingOrder.trackingNumber}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTrackingOrder(null)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Milestones */}
              <div className="py-6 space-y-6">
                {[
                  { title: 'Order Verified & Authorized', desc: 'Payment confirmed & inventory reserved', done: true },
                  { title: 'Artisanal Packaging & Inspection', desc: 'Carefully wrapped with luxury seal', done: true },
                  { title: 'Dispatched with Courier', desc: 'Departed regional distribution hub', done: activeTrackingOrder.status !== 'Processing' },
                  { title: 'Delivered to Recipient', desc: activeTrackingOrder.estimatedDelivery, done: activeTrackingOrder.status === 'Delivered' }
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        step.done
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${step.done ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        {step.title}
                      </p>
                      <p className="text-[11px] text-neutral-500">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs text-neutral-600">
                <span className="font-bold text-neutral-900">Destination: </span>
                {activeTrackingOrder.shippingAddress?.address}, {activeTrackingOrder.shippingAddress?.city}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice Receipt Modal */}
      <AnimatePresence>
        {activeReceiptOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveReceiptOrder(null)}
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 z-10 border border-neutral-200"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Order Receipt</h3>
                  <p className="text-xs text-neutral-500">Invoice #{activeReceiptOrder.id}</p>
                </div>
                <button
                  onClick={() => setActiveReceiptOrder(null)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900">{formatPrice(activeReceiptOrder.subtotal)}</span>
                </div>
                {activeReceiptOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-bold">-{formatPrice(activeReceiptOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className="font-bold text-neutral-900">{formatPrice(activeReceiptOrder.shipping)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tax</span>
                  <span className="font-bold text-neutral-900">{formatPrice(activeReceiptOrder.tax)}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between font-extrabold text-sm text-neutral-900">
                  <span>Total Paid</span>
                  <span>{formatPrice(activeReceiptOrder.total)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  addToast('Printing invoice dialog initiated.', 'info');
                  window.print();
                }}
                className="w-full mt-4 py-3 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Print / Download PDF Receipt
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
