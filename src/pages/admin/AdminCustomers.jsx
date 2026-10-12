import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Mail,
  ExternalLink,
  Crown,
  X
} from 'lucide-react';
import { useCms } from '../../hooks/useCms';
import { InvoiceModal } from '../../components/admin/InvoiceModal';

export const AdminCustomers = () => {
  const { customers, orders, formatMoney } = useCms();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      return (
        !searchQuery.trim() ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [customers, searchQuery]);

  // Find customer's orders
  const getCustomerOrders = (customerEmail) => {
    return orders.filter(
      (o) =>
        o.shippingAddress?.email?.toLowerCase() === customerEmail?.toLowerCase() ||
        customerEmail?.toLowerCase() === 'alex.morgan@example.com' // Map default test user
    );
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Diamond VIP':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'Gold VIP':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Action Header */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Customer CRM Directory ({filteredCustomers.length})</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitor client lifetime spending (LTV), order frequency, and VIP tiers.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or city..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-800">No customers found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              No registered profiles match the search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-200/80 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">VIP Tier</th>
                  <th className="py-4 px-4 text-center">Orders</th>
                  <th className="py-4 px-4 text-right">Lifetime Spend</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/60 transition-colors group">
                    
                    {/* Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-10 h-10 rounded-full object-cover border border-neutral-200 bg-neutral-100 shrink-0"
                        />
                        <div>
                          <div className="font-extrabold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                            {c.name}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            Member since {c.joinDate}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4">
                      <div className="text-neutral-800 font-medium">{c.email}</div>
                      <div className="text-[11px] text-neutral-400">{c.phone}</div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4">
                      <span className="text-neutral-700 font-medium">
                        {c.city}, {c.country}
                      </span>
                    </td>

                    {/* Tier */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getTierBadge(
                          c.tier
                        )}`}
                      >
                        <Crown className="w-3 h-3" />
                        <span>{c.tier}</span>
                      </span>
                    </td>

                    {/* Orders count */}
                    <td className="py-4 px-4 text-center font-bold text-neutral-800">
                      {c.ordersCount}
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-4 px-4 text-right font-black text-neutral-900">
                      {formatMoney(c.totalSpent)}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-indigo-600 text-white rounded-xl text-[11px] font-bold transition-colors shadow-2xs"
                      >
                        Profile & History
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Profile & Purchase History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-neutral-50/70">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
                    <span>{selectedCustomer.name}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTierBadge(
                        selectedCustomer.tier
                      )}`}
                    >
                      {selectedCustomer.tier}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {selectedCustomer.email} • {selectedCustomer.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Financial Snapshot */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Total Spend</div>
                  <div className="text-lg font-black text-neutral-900 mt-1">
                    {formatMoney(selectedCustomer.totalSpent)}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Orders Placed</div>
                  <div className="text-lg font-black text-neutral-900 mt-1">
                    {selectedCustomer.ordersCount}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Avg Order Value</div>
                  <div className="text-lg font-black text-neutral-900 mt-1">
                    {formatMoney(selectedCustomer.totalSpent / (selectedCustomer.ordersCount || 1))}
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 flex items-center justify-between">
                  <span>Order History</span>
                  <span className="text-neutral-400 font-normal">
                    {getCustomerOrders(selectedCustomer.email).length} recorded
                  </span>
                </h4>

                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden">
                  {getCustomerOrders(selectedCustomer.email).length === 0 ? (
                    <div className="p-6 text-center text-xs text-neutral-400">
                      No order transactions found for this customer.
                    </div>
                  ) : (
                    getCustomerOrders(selectedCustomer.email).map((order) => (
                      <div
                        key={order.id}
                        className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-neutral-50/70 transition-colors"
                      >
                        <div>
                          <div className="font-extrabold text-xs text-neutral-900 font-mono">
                            #{order.id}
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            {order.date} • {order.items?.length || 1} item(s)
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {order.status}
                          </span>
                          <span className="font-black text-xs text-neutral-900">
                            {formatMoney(order.total)}
                          </span>
                          <button
                            onClick={() => setActiveInvoiceOrder(order)}
                            className="p-1.5 text-neutral-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                            title="View Invoice"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Direct email action */}
              <div className="pt-2">
                <a
                  href={`mailto:${selectedCustomer.email}`}
                  className="w-full py-2.5 rounded-xl border border-neutral-200 text-neutral-800 hover:bg-neutral-100 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>Send Direct Email to {selectedCustomer.name}</span>
                </a>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal for Customer Orders */}
      <InvoiceModal
        isOpen={Boolean(activeInvoiceOrder)}
        order={activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
      />

    </div>
  );
};
