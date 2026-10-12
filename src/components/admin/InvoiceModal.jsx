import React from 'react';
import { X, Printer, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCms } from '../../hooks/useCms';

export const InvoiceModal = ({ order, isOpen, onClose }) => {
  const { settings, formatMoney } = useCms();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.id.replace('NC-', '')}`;
  const invoiceDate = order.date || 'Oct 12, 2026';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
      {/* Container */}
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-b border-neutral-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Tax Invoice Preview
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Paid & Verified
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document */}
        <div className="p-8 sm:p-12 text-neutral-800 bg-white" id="printable-invoice">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {settings.storeLogo ? (
                  <img
                    src={settings.storeLogo}
                    alt={settings.storeName}
                    className="w-10 h-10 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                )}
                <span className="text-2xl font-black tracking-tight text-neutral-900">
                  {settings.storeName}
                </span>
              </div>
              <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                {settings.address}
                <br />
                Email: {settings.supportEmail}
                <br />
                Phone: {settings.supportPhone}
              </p>
            </div>

            <div className="sm:text-right">
              <h2 className="text-2xl font-extrabold text-neutral-900 uppercase tracking-tight">
                Invoice
              </h2>
              <div className="text-xs text-neutral-500 mt-1 space-y-1">
                <div>
                  <span className="font-semibold text-neutral-700">Invoice #: </span>
                  {invoiceNumber}
                </div>
                <div>
                  <span className="font-semibold text-neutral-700">Order ID: </span>
                  #{order.id}
                </div>
                <div>
                  <span className="font-semibold text-neutral-700">Date: </span>
                  {invoiceDate}
                </div>
                <div>
                  <span className="font-semibold text-neutral-700">Payment: </span>
                  {order.paymentMethod || 'Credit Card (Processed)'}
                </div>
              </div>
            </div>
          </div>

          {/* Billing & Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-neutral-200 text-xs">
            <div>
              <h3 className="font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Billed To
              </h3>
              <p className="font-bold text-neutral-900 text-sm">
                {order.shippingAddress?.fullName || 'Valued Customer'}
              </p>
              <p className="text-neutral-600 mt-1">
                {order.shippingAddress?.address || '742 Evergreen Terrace'}
                <br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                {order.shippingAddress?.postalCode}
                <br />
                {order.shippingAddress?.country || 'United States'}
              </p>
            </div>

            <div>
              <h3 className="font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Fulfillment Details
              </h3>
              <p className="font-semibold text-neutral-800">
                Carrier: <span className="font-normal">{order.carrier || 'Standard Express'}</span>
              </p>
              <p className="font-semibold text-neutral-800 mt-1">
                Tracking: <span className="font-mono text-neutral-700">{order.trackingNumber || 'Pending'}</span>
              </p>
              <p className="font-semibold text-neutral-800 mt-1">
                Status: <span className="text-emerald-600 font-bold">{order.status || 'Delivered'}</span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-8">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-neutral-900 text-neutral-900 font-bold uppercase tracking-wider">
                  <th className="pb-3">Item & Description</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Unit Price</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {order.items &&
                  order.items.map((item, idx) => (
                    <tr key={idx} className="text-neutral-700">
                      <td className="py-4">
                        <div className="font-bold text-neutral-900">{item.name}</div>
                        {item.selectedOption && (
                          <div className="text-[11px] text-neutral-500">
                            Option: {item.selectedOption}
                          </div>
                        )}
                      </td>
                      <td className="py-4 text-center font-semibold">{item.quantity}</td>
                      <td className="py-4 text-right">{formatMoney(item.price)}</td>
                      <td className="py-4 text-right font-bold text-neutral-900">
                        {formatMoney(Number(item.price) * Number(item.quantity))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end pt-4 border-t border-neutral-200">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatMoney(order.subtotal || order.total)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span className="font-semibold">-{formatMoney(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping:</span>
                <span className="font-semibold">
                  {order.shipping === 0 ? 'FREE' : formatMoney(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Tax:</span>
                <span className="font-semibold">{formatMoney(order.tax || 0)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-3 border-t-2 border-neutral-900">
                <span>Total Due:</span>
                <span>{formatMoney(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-12 pt-6 border-t border-neutral-100 text-center text-[11px] text-neutral-400">
            Thank you for shopping with {settings.storeName}! If you have any inquiries, please contact{' '}
            {settings.supportEmail}.
          </div>
        </div>
      </div>
    </div>
  );
};
