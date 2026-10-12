import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Printer,
  Package,
  Truck,
  X,
  Save
} from 'lucide-react';
import { useCms } from '../../hooks/useCms';
import { useToast } from '../../hooks/useToast';
import { InvoiceModal } from '../../components/admin/InvoiceModal';

export const AdminOrders = () => {
  const { orders, updateOrderStatus, formatMoney } = useCms();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Inspection Drawer & Invoice Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Fulfillment edit state inside drawer
  const [carrierInput, setCarrierInput] = useState('');
  const [trackingInput, setTrackingInput] = useState('');

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = { all: orders.length, Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) counts[o.status]++;
    });
    return counts;
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !searchQuery.trim() ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || o.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatus]);

  const handleOpenDrawer = (order) => {
    setSelectedOrder(order);
    setCarrierInput(order.carrier || 'FedEx Express Air');
    setTrackingInput(order.trackingNumber || '');
  };

  const handleSaveFulfillment = () => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, selectedOrder.status, {
      carrier: carrierInput,
      trackingNumber: trackingInput
    });
    setSelectedOrder((prev) => ({
      ...prev,
      carrier: carrierInput,
      trackingNumber: trackingInput
    }));
    addToast(`Fulfillment details updated for Order #${selectedOrder.id}!`, 'success');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'In Transit':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <span>Orders & Shipments ({filteredOrders.length})</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage customer fulfillment workflows, assign tracking numbers, and issue invoices.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, customer, tracking..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Status Pipeline Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { label: 'All Orders', value: 'all', count: statusCounts.all },
          { label: 'Pending', value: 'Pending', count: statusCounts.Pending },
          { label: 'Processing', value: 'Processing', count: statusCounts.Processing },
          { label: 'Shipped', value: 'Shipped', count: statusCounts.Shipped },
          { label: 'Delivered', value: 'Delivered', count: statusCounts.Delivered },
          { label: 'Cancelled', value: 'Cancelled', count: statusCounts.Cancelled }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedStatus === tab.value
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 border border-neutral-200/80'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                selectedStatus === tab.value
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-800">No orders found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              No orders matched the selected filter or search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-200/80 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Items</th>
                  <th className="py-4 px-4">Status & Pipeline</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4 text-right">Total</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/60 transition-colors group">
                    
                    {/* Order ID & Date */}
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-neutral-900 font-mono">
                        #{o.id}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {o.date || 'Recent'}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-neutral-900">
                        {o.shippingAddress?.fullName || 'Alex Morgan'}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {o.shippingAddress?.city || 'San Francisco'}, {o.shippingAddress?.country || 'US'}
                      </div>
                    </td>

                    {/* Items Thumbnails */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        {o.items?.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8 rounded-lg object-cover border border-neutral-200 bg-neutral-100"
                            title={item.name}
                          />
                        ))}
                        {o.items?.length > 3 && (
                          <span className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-600 text-[10px] font-bold flex items-center justify-center border border-neutral-200">
                            +{o.items.length - 3}
                          </span>
                        )}
                        <span className="text-[11px] text-neutral-500 font-medium ml-1">
                          ({o.items?.length || 1})
                        </span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={o.status}
                        onChange={(e) => {
                          updateOrderStatus(o.id, e.target.value);
                          addToast(`Order #${o.id} status changed to ${e.target.value}`, 'info');
                        }}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer bg-white ${getStatusBadgeClass(
                          o.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-4">
                      <span className="text-neutral-700 font-medium">
                        {o.paymentMethod ? o.paymentMethod.replace('ending in', '••') : 'Card'}
                      </span>
                    </td>

                    {/* Total Price */}
                    <td className="py-4 px-4 text-right font-black text-neutral-900">
                      {formatMoney(o.total)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setInvoiceOrder(o)}
                          className="p-2 text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                          title="Print Tax Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDrawer(o)}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-[11px] font-bold transition-colors"
                        >
                          Inspect
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Inspection Detail Modal/Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-neutral-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-neutral-900">
                    Order Details #{selectedOrder.id}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Placed on {selectedOrder.date} • {selectedOrder.items?.length || 1} line item(s)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Order Status & Invoice Button */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">
                    Current Fulfillment Status
                  </span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      updateOrderStatus(selectedOrder.id, e.target.value);
                      setSelectedOrder((prev) => ({ ...prev, status: e.target.value }));
                      addToast(`Status updated to ${e.target.value}`, 'success');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer bg-white ${getStatusBadgeClass(
                      selectedOrder.status
                    )}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setInvoiceOrder(selectedOrder);
                  }}
                  className="px-4 py-2 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
              </div>

              {/* Carrier & Tracking Manager */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Shipping & Tracking Assignment</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-500 font-medium mb-1">
                      Carrier Name
                    </label>
                    <input
                      type="text"
                      value={carrierInput}
                      onChange={(e) => setCarrierInput(e.target.value)}
                      placeholder="e.g. FedEx Express Air, DHL, UPS"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-500 font-medium mb-1">
                      Tracking Code
                    </label>
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="TRK-981273948US"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveFulfillment}
                  className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold border border-indigo-200 flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Tracking Info</span>
                </button>
              </div>

              {/* Line items list */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
                  Purchased Items
                </h4>
                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0 bg-neutral-100"
                        />
                        <div>
                          <div className="font-extrabold text-xs text-neutral-900">
                            {item.name}
                          </div>
                          {item.selectedOption && (
                            <div className="text-[11px] text-neutral-500">
                              Option: {item.selectedOption}
                            </div>
                          )}
                          <div className="text-[11px] text-neutral-400 font-medium">
                            Qty: {item.quantity} × {formatMoney(item.price)}
                          </div>
                        </div>
                      </div>
                      <div className="font-black text-xs text-neutral-900 text-right">
                        {formatMoney(Number(item.price) * Number(item.quantity))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address & Customer Info */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
                <h4 className="font-bold text-neutral-700 uppercase tracking-wider text-[11px]">
                  Shipping Address
                </h4>
                <div className="font-bold text-neutral-900">
                  {selectedOrder.shippingAddress?.fullName}
                </div>
                <div className="text-neutral-600">
                  {selectedOrder.shippingAddress?.address}
                  <br />
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}{' '}
                  {selectedOrder.shippingAddress?.postalCode}
                  <br />
                  {selectedOrder.shippingAddress?.country || 'United States'}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="pt-2 border-t border-neutral-100 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span>{formatMoney(selectedOrder.subtotal || selectedOrder.total)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>-{formatMoney(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping:</span>
                  <span>{selectedOrder.shipping === 0 ? 'FREE' : formatMoney(selectedOrder.shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Grand Total:</span>
                  <span>{formatMoney(selectedOrder.total)}</span>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={Boolean(invoiceOrder)}
        order={invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />

    </div>
  );
};
