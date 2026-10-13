import React, { createContext, useState, useEffect, useMemo } from 'react';
import { products as initialLocalProducts } from '../data/products';
import { initialOrders } from '../data/orders';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { supabase } from '../lib/supabaseClient';
import { mapSupabaseProduct } from '../lib/productService';

const CMS_PRODUCTS_KEY = 'novacart_cms_products';
const ORDERS_KEY = 'novacart_orders';
const CMS_SETTINGS_KEY = 'novacart_cms_settings';
const CMS_CUSTOMERS_KEY = 'novacart_cms_customers';

const DEFAULT_SETTINGS = {
  storeName: 'NovaCart',
  storeTagline: 'Luxury Essentials & Curated Lifestyle',
  storeLogo: '', // Empty means using the default gradient badge
  announcementText: 'Use code NOVA20 for 20% off all orders',
  announcementBadge: 'Autumn Season Release:',
  isAnnouncementActive: true,
  supportEmail: 'concierge@novacart.store',
  supportPhone: '+1 (555) 392-8472',
  address: '742 Evergreen Terrace, Suite 4B, San Francisco, CA 94107',
  currency: 'USD',
  currencySymbol: '$',
  taxRate: 8.5,
  freeShippingThreshold: 100,
  emailTemplates: {
    orderConfirmation: {
      subject: 'Order Confirmation - #{{order_id}}',
      body: 'Hi {{customer_name}},\n\nThank you for shopping with {{store_name}}! We have received your order #{{order_id}} totaling {{total_price}}.\n\nOur team is currently preparing your package. We will notify you as soon as it ships.\n\nWarm regards,\nThe {{store_name}} Team'
    },
    orderShipped: {
      subject: 'Your Order #{{order_id}} Is On The Way!',
      body: 'Hi {{customer_name}},\n\nGreat news! Your package for order #{{order_id}} has been dispatched via {{carrier}}.\n\nTracking Number: {{tracking_number}}\nEstimated Delivery: 2-3 business days.\n\nThank you for choosing {{store_name}}!'
    },
    welcomeEmail: {
      subject: 'Welcome to {{store_name}} - Your Exclusive 20% Off',
      body: 'Hi {{customer_name}},\n\nWelcome to {{store_name}}! We are thrilled to have you in our community.\n\nAs a welcome gift, use promo code NOVA20 at checkout for 20% off your first luxury purchase.\n\nHappy exploring!'
    }
  },
  smtp: {
    host: 'smtp.sendgrid.net',
    port: '587',
    username: 'apikey',
    password: '••••••••••••••••',
    senderEmail: 'notifications@novacart.store',
    senderName: 'NovaCart Concierge',
    encryption: 'TLS'
  }
};

const DEFAULT_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 392-8472',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    city: 'San Francisco',
    country: 'United States',
    joinDate: 'Mar 15, 2024',
    tier: 'Diamond VIP',
    status: 'Active',
    ordersCount: 4,
    totalSpent: 1248.50
  },
  {
    id: 'cust-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+44 20 7946 0912',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    city: 'London',
    country: 'United Kingdom',
    joinDate: 'Jun 02, 2024',
    tier: 'Gold VIP',
    status: 'Active',
    ordersCount: 2,
    totalSpent: 689.00
  },
  {
    id: 'cust-3',
    name: 'Marcus Vance',
    email: 'marcus.v@example.com',
    phone: '+1 (555) 829-1049',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    city: 'New York',
    country: 'United States',
    joinDate: 'Aug 19, 2024',
    tier: 'Regular',
    status: 'Active',
    ordersCount: 1,
    totalSpent: 189.99
  },
  {
    id: 'cust-4',
    name: 'Sophia Chen',
    email: 'sophia.chen@example.com',
    phone: '+65 6712 3456',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    city: 'Singapore',
    country: 'Singapore',
    joinDate: 'Sep 10, 2024',
    tier: 'Gold VIP',
    status: 'Active',
    ordersCount: 3,
    totalSpent: 920.40
  }
];

export const CmsContext = createContext(null);

export const CmsProvider = ({ children }) => {
  // 1. Products State
  const [products, setProducts] = useState(() =>
    getStorageItem(CMS_PRODUCTS_KEY, initialLocalProducts)
  );

  // 2. Orders State (Shared with storefront & synced with Supabase)
  const [orders, setOrders] = useState(() =>
    getStorageItem(ORDERS_KEY, initialOrders)
  );

  // 3. Customers State
  const [customers, setCustomers] = useState(() =>
    getStorageItem(CMS_CUSTOMERS_KEY, DEFAULT_CUSTOMERS)
  );

  // 4. Settings State
  const [settings, setSettings] = useState(() =>
    getStorageItem(CMS_SETTINGS_KEY, DEFAULT_SETTINGS)
  );

  // Sync to localStorage
  useEffect(() => {
    setStorageItem(CMS_PRODUCTS_KEY, products);
  }, [products]);

  useEffect(() => {
    setStorageItem(ORDERS_KEY, orders);
  }, [orders]);

  useEffect(() => {
    setStorageItem(CMS_CUSTOMERS_KEY, customers);
  }, [customers]);

  useEffect(() => {
    setStorageItem(CMS_SETTINGS_KEY, settings);
  }, [settings]);

  // Load latest products from Supabase without overwriting local CMS edits
  useEffect(() => {
    async function loadSupabaseProducts() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          const mappedRemote = data.map(mapSupabaseProduct);
          setProducts((prev) => {
            const currentMap = new Map(prev.map((p) => [String(p.id), p]));
            // Add any remote product from Supabase that isn't already present in current catalog
            mappedRemote.forEach((rp) => {
              if (!currentMap.has(String(rp.id))) {
                currentMap.set(String(rp.id), rp);
              }
            });
            return Array.from(currentMap.values());
          });
        }
      } catch (err) {
        console.warn('CmsProvider: Supabase products sync warning:', err);
      }
    }
    loadSupabaseProducts();
  }, []);

  // Load all latest orders from Supabase (including orders placed after sign-in)
  useEffect(() => {
    async function loadSupabaseOrders() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mappedRemoteOrders = data.map((o) => ({
            id: o.id,
            date: new Date(o.created_at || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            }),
            status: o.status || 'Processing',
            statusStep: o.status === 'Delivered' ? 4 : o.status === 'Shipped' ? 3 : o.status === 'Processing' ? 2 : 1,
            trackingNumber: o.tracking_number || `TRK-${Math.floor(100000000 + Math.random() * 900000000)}US`,
            carrier: o.carrier || 'NovaCart Express',
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            }),
            items: o.items || [],
            shippingAddress: o.shipping_address || {},
            shippingMethod: o.shipping_method || 'Standard Courier',
            paymentMethod: o.payment_method || 'Credit Card',
            subtotal: Number(o.subtotal || 0),
            shipping: Number(o.shipping || 0),
            discount: Number(o.discount || 0),
            tax: Number(o.tax || 0),
            total: Number(o.total || 0),
            userId: o.user_id,
            userEmail: o.user_email
          }));

          setOrders((prev) => {
            const combined = [...prev];
            mappedRemoteOrders.forEach((ro) => {
              const existingIdx = combined.findIndex((co) => co.id === ro.id);
              if (existingIdx === -1) {
                combined.unshift(ro);
              } else {
                combined[existingIdx] = { ...ro, ...combined[existingIdx] };
              }
            });
            return combined;
          });

          // Also populate customer analytics from remote orders
          setCustomers((prev) => {
            const customerMap = new Map(prev.map((c) => [c.email?.toLowerCase(), c]));
            mappedRemoteOrders.forEach((o) => {
              const email = (o.userEmail || o.shippingAddress?.email || '').toLowerCase();
              if (email) {
                if (customerMap.has(email)) {
                  const existing = customerMap.get(email);
                  customerMap.set(email, {
                    ...existing,
                    ordersCount: Math.max(existing.ordersCount || 1, 1),
                    totalSpent: Math.max(existing.totalSpent || 0, Number(o.total || 0))
                  });
                } else {
                  const name = o.shippingAddress?.fullName || email.split('@')[0];
                  customerMap.set(email, {
                    id: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    name,
                    email,
                    phone: o.shippingAddress?.phone || '',
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=ffffff&bold=true&rounded=true`,
                    city: o.shippingAddress?.city || 'San Francisco',
                    country: o.shippingAddress?.country || 'United States',
                    joinDate: o.date || 'Recently',
                    tier: Number(o.total || 0) > 500 ? 'Gold VIP' : 'Regular',
                    status: 'Active',
                    ordersCount: 1,
                    totalSpent: Number(o.total || 0)
                  });
                }
              }
            });
            return Array.from(customerMap.values());
          });
        }
      } catch (err) {
        console.warn('CmsProvider: Supabase orders sync warning:', err);
      }
    }
    loadSupabaseOrders();
  }, []);

  // Listen for real-time events across windows & components
  useEffect(() => {
    const handleOrderCreated = (e) => {
      if (e.detail) {
        setOrders((prev) => {
          if (prev.some((o) => o.id === e.detail.id)) return prev;
          return [e.detail, ...prev];
        });
      }
    };
    window.addEventListener('novacart:order_created', handleOrderCreated);
    return () => window.removeEventListener('novacart:order_created', handleOrderCreated);
  }, []);

  // --- PRODUCT ACTIONS ---
  const addProduct = async (productData) => {
    const newId = productData.id || `prod-${Date.now()}`;
    const newProduct = {
      ...productData,
      id: String(newId),
      stock: Number(productData.stock ?? 20),
      price: Number(productData.price ?? 0),
      oldPrice: productData.oldPrice ? Number(productData.oldPrice) : Number(productData.price ?? 0) * 1.25,
      rating: productData.rating ? Number(productData.rating) : 5.0,
      reviewsCount: productData.reviewsCount ? Number(productData.reviewsCount) : 0,
      images: productData.images && productData.images.length > 0 ? productData.images : [productData.image],
      status: productData.status || 'Active'
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Resilient Supabase insert
    if (supabase) {
      try {
        await supabase.from('products').insert([
          {
            name: newProduct.name,
            price: newProduct.price,
            description: newProduct.description
          }
        ]);
      } catch (err) {
        console.warn('Supabase product insert error:', err);
      }
    }

    try {
      window.dispatchEvent(new CustomEvent('novacart:cms_products_updated', { detail: newProduct }));
    } catch {}

    return newProduct;
  };

  const updateProduct = async (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? { ...p, ...updatedFields } : p))
    );

    // Resilient Supabase update
    if (supabase) {
      try {
        await supabase
          .from('products')
          .update({
            name: updatedFields.name,
            price: updatedFields.price,
            description: updatedFields.description
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase product update error:', err);
      }
    }

    try {
      window.dispatchEvent(new CustomEvent('novacart:cms_products_updated', { detail: { id, updatedFields } }));
    } catch {}
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));

    if (supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase product delete error:', err);
      }
    }

    try {
      window.dispatchEvent(new CustomEvent('novacart:cms_products_updated', { detail: { id, deleted: true } }));
    } catch {}
  };

  // --- ORDER ACTIONS ---
  const addOrder = async (orderData) => {
    const orderId = orderData.id || `NC-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: orderData.status || 'Processing',
      statusStep: 1,
      trackingNumber: orderData.trackingNumber || `TRK-${Math.floor(100000000 + Math.random() * 900000000)}US`,
      carrier: orderData.carrier || 'NovaCart Express',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }),
      ...orderData
    };

    // 1. Prepend to CMS state
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);

    // 2. Persist to shared storage immediately
    const existingStoredOrders = getStorageItem(ORDERS_KEY, []);
    const updatedStored = [newOrder, ...existingStoredOrders.filter((o) => o.id !== newOrder.id)];
    setStorageItem(ORDERS_KEY, updatedStored);

    // 3. Update customer list in CMS
    const customerEmail = newOrder.shippingAddress?.email || newOrder.userEmail;
    const customerName = newOrder.shippingAddress?.fullName || 'Valued Customer';
    if (customerEmail) {
      setCustomers((prev) => {
        const existingIdx = prev.findIndex((c) => c.email?.toLowerCase() === customerEmail.toLowerCase());
        if (existingIdx > -1) {
          const updatedList = [...prev];
          const curr = updatedList[existingIdx];
          updatedList[existingIdx] = {
            ...curr,
            ordersCount: (curr.ordersCount || 0) + 1,
            totalSpent: (curr.totalSpent || 0) + Number(newOrder.total || 0)
          };
          return updatedList;
        } else {
          const newCust = {
            id: `cust-${Date.now()}`,
            name: customerName,
            email: customerEmail,
            phone: newOrder.shippingAddress?.phone || '',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=4f46e5&color=ffffff&bold=true&rounded=true`,
            city: newOrder.shippingAddress?.city || 'San Francisco',
            country: newOrder.shippingAddress?.country || 'United States',
            joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            tier: Number(newOrder.total) > 500 ? 'Gold VIP' : 'Regular',
            status: 'Active',
            ordersCount: 1,
            totalSpent: Number(newOrder.total || 0)
          };
          return [newCust, ...prev];
        }
      });
    }

    // 4. Save to Supabase orders table
    if (supabase) {
      try {
        await supabase.from('orders').upsert({
          id: newOrder.id,
          user_id: newOrder.userId || null,
          user_email: customerEmail || null,
          items: newOrder.items,
          shipping_address: newOrder.shippingAddress,
          shipping_method: newOrder.shippingMethod,
          payment_method: newOrder.paymentMethod,
          subtotal: newOrder.subtotal,
          shipping: newOrder.shipping,
          discount: newOrder.discount,
          tax: newOrder.tax,
          total: newOrder.total,
          status: newOrder.status,
          created_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase orders upsert note:', err);
      }
    }

    // 5. Broadcast order created event
    try {
      window.dispatchEvent(new CustomEvent('novacart:order_created', { detail: newOrder }));
    } catch {}

    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus, extraDetails = {}) => {
    const stepMap = {
      Pending: 1,
      Processing: 2,
      Shipped: 3,
      Delivered: 4,
      Cancelled: 0
    };

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            statusStep: stepMap[newStatus] ?? o.statusStep,
            ...extraDetails
          };
        }
        return o;
      })
    );

    // Sync any user-specific local storage entries
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('novacart_orders_')) {
          const userOrders = getStorageItem(k, []);
          const updated = userOrders.map((uo) =>
            uo.id === orderId
              ? { ...uo, status: newStatus, statusStep: stepMap[newStatus] ?? uo.statusStep, ...extraDetails }
              : uo
          );
          setStorageItem(k, updated);
        }
      }
    } catch {}

    // Update in Supabase
    if (supabase) {
      try {
        await supabase
          .from('orders')
          .update({
            status: newStatus
          })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase update order status error:', err);
      }
    }

    try {
      window.dispatchEvent(
        new CustomEvent('novacart:order_updated', {
          detail: { orderId, newStatus, extraDetails }
        })
      );
    } catch {}
  };

  const deleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    if (supabase) {
      try {
        await supabase.from('orders').delete().eq('id', orderId);
      } catch (err) {
        console.warn('Supabase delete order error:', err);
      }
    }
  };

  // --- CUSTOMER ACTIONS ---
  const updateCustomer = (id, updatedFields) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCustomer = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // --- SETTINGS ACTIONS ---
  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      setStorageItem(CMS_SETTINGS_KEY, merged);
      return merged;
    });

    try {
      window.dispatchEvent(new CustomEvent('novacart:cms_settings_updated', { detail: newSettings }));
    } catch {}
  };

  // Format currency helper aware of CMS settings
  const formatMoney = (amount) => {
    const val = Number(amount || 0);
    const symbol = settings.currencySymbol || '$';
    return `${symbol}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Aggregated analytics
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const totalOrdersCount = orders.length;
    const lowStockCount = products.filter((p) => Number(p.stock) <= 10).length;
    const totalCustomersCount = customers.length;
    const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;

    return {
      totalRevenue,
      totalOrdersCount,
      lowStockCount,
      totalCustomersCount,
      pendingOrdersCount
    };
  }, [orders, products, customers]);

  return (
    <CmsContext.Provider
      value={{
        products,
        orders,
        customers,
        settings,
        metrics,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        updateCustomer,
        deleteCustomer,
        updateSettings,
        formatMoney
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

