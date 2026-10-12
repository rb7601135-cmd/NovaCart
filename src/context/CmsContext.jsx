import React, { createContext, useState, useEffect, useMemo } from 'react';
import { products as initialLocalProducts } from '../data/products';
import { initialOrders } from '../data/orders';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { supabase } from '../lib/supabaseClient';
import { fetchAllProducts } from '../lib/productService';

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

  // 2. Orders State (Shared with storefront)
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

  // Load latest from Supabase if connected
  useEffect(() => {
    async function loadSupabaseData() {
      if (!supabase) return;
      try {
        const remoteProducts = await fetchAllProducts();
        if (remoteProducts && remoteProducts.length > 0) {
          setProducts((prev) => {
            // merge with any local edits
            const merged = [...remoteProducts];
            prev.forEach((localP) => {
              if (!merged.some((m) => m.id === localP.id)) {
                merged.push(localP);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.warn('CmsProvider: Supabase sync warning:', err);
      }
    }
    loadSupabaseData();
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

    // Try Supabase insert if available
    if (supabase) {
      try {
        await supabase.from('products').insert([
          {
            name: newProduct.name,
            category: newProduct.category,
            price: newProduct.price,
            old_price: newProduct.oldPrice,
            stock: newProduct.stock,
            image: newProduct.image,
            description: newProduct.description,
            is_featured: newProduct.isFeatured ?? true,
            is_new: newProduct.isNew ?? true,
            is_bestseller: newProduct.isBestSeller ?? false,
            badge: newProduct.badge || 'New'
          }
        ]);
      } catch (err) {
        console.warn('Supabase product insert error:', err);
      }
    }

    return newProduct;
  };

  const updateProduct = async (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? { ...p, ...updatedFields } : p))
    );

    // Try Supabase update if available
    if (supabase) {
      try {
        await supabase
          .from('products')
          .update({
            name: updatedFields.name,
            category: updatedFields.category,
            price: updatedFields.price,
            stock: updatedFields.stock,
            image: updatedFields.image,
            description: updatedFields.description,
            is_featured: updatedFields.isFeatured,
            is_new: updatedFields.isNew,
            is_bestseller: updatedFields.isBestSeller
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase product update error:', err);
      }
    }
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
  };

  // --- ORDER ACTIONS ---
  const updateOrderStatus = (orderId, newStatus, extraDetails = {}) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const stepMap = {
            Pending: 1,
            Processing: 2,
            Shipped: 3,
            Delivered: 4,
            Cancelled: 0
          };
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
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
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
    setSettings((prev) => ({
      ...prev,
      ...newSettings
    }));
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

