import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { initialOrders } from '../data/orders';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const USER_KEY = 'novacart_user';
const ORDERS_KEY = 'novacart_orders';

const DEFAULT_USER = {
  id: 'usr-1',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 392-8472',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  tier: 'Diamond VIP',
  joinDate: 'March 2024',
  addresses: [
    {
      id: 'addr-1',
      title: 'Home (Default)',
      fullName: 'Alex Morgan',
      street: '742 Evergreen Terrace, Suite 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'Studio / Office',
      fullName: 'Alex Morgan',
      street: '100 Montgomery St, Floor 18',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94104',
      country: 'United States',
      isDefault: false
    }
  ]
};

const formatSupabaseUser = (sbUser) => {
  if (!sbUser) return null;
  const meta = sbUser.user_metadata || {};
  return {
    id: sbUser.id,
    name: meta.name || meta.full_name || sbUser.email?.split('@')[0] || 'Valued Customer',
    email: sbUser.email,
    phone: meta.phone || sbUser.phone || '+1 (555) 392-8472',
    avatar:
      meta.avatar_url ||
      meta.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    tier: meta.tier || 'Diamond VIP',
    joinDate: sbUser.created_at
      ? new Date(sbUser.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'March 2024',
    addresses: meta.addresses || DEFAULT_USER.addresses
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStorageItem(USER_KEY, DEFAULT_USER));
  const [orders, setOrders] = useState(() => getStorageItem(ORDERS_KEY, initialOrders));
  const [authLoading, setAuthLoading] = useState(true);
  const { addToast } = useToast();

  // Listen to Supabase auth state changes and initial session
  useEffect(() => {
    let subscription = null;

    async function initAuth() {
      if (!supabase) {
        setAuthLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(formatSupabaseUser(session.user));
        }

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setUser(formatSupabaseUser(session.user));
          }
        });
        subscription = authListener?.subscription;
      } catch (err) {
        console.warn('Supabase auth initialization:', err);
      } finally {
        setAuthLoading(false);
      }
    }

    initAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Sync user state to local storage
  useEffect(() => {
    setStorageItem(USER_KEY, user);
  }, [user]);

  // Sync orders state to local storage
  useEffect(() => {
    setStorageItem(ORDERS_KEY, orders);
  }, [orders]);

  // Sync orders from Supabase if table exists and user is signed in
  useEffect(() => {
    async function fetchSupabaseOrders() {
      if (!supabase || !user?.email) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_email', user.email)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((o) => ({
            id: o.id,
            date: new Date(o.created_at || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            }),
            status: o.status || 'Processing',
            statusStep: 1,
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
            paymentMethod: o.payment_method || 'Visa Card',
            subtotal: Number(o.subtotal || 0),
            shipping: Number(o.shipping || 0),
            discount: Number(o.discount || 0),
            tax: Number(o.tax || 0),
            total: Number(o.total || 0)
          }));
          setOrders(mapped);
        }
      } catch (err) {
        console.warn('Orders fetch error from Supabase:', err);
      }
    }

    fetchSupabaseOrders();
  }, [user]);

  // Sign In with email & password (or demo account)
  const login = async (email, password, isDemo = false) => {
    if (isDemo || !supabase) {
      const loggedInUser = {
        ...DEFAULT_USER,
        email: email || DEFAULT_USER.email,
        name: email ? email.split('@')[0].replace(/[._]/g, ' ') : DEFAULT_USER.name
      };
      setUser(loggedInUser);
      addToast(`Welcome back, ${loggedInUser.name}!`, 'success');
      return { success: true, user: loggedInUser };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        addToast(error.message, 'error');
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const formatted = formatSupabaseUser(data.user);
        setUser(formatted);
        addToast(`Welcome back, ${formatted.name}!`, 'success');
        return { success: true, user: formatted };
      }

      return { success: true };
    } catch (err) {
      const message = err.message || 'An error occurred during sign in.';
      addToast(message, 'error');
      return { success: false, error: message };
    }
  };

  // Sign In with OAuth (Google, GitHub, etc.)
  const loginWithOAuth = async (provider = 'google') => {
    if (!supabase) {
      addToast('Supabase is not configured for OAuth.', 'error');
      return { success: false, error: 'Supabase is not configured' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/account`
        }
      });

      if (error) {
        addToast(error.message, 'error');
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      const message = err.message || 'OAuth sign in failed';
      addToast(message, 'error');
      return { success: false, error: message };
    }
  };

  // Sign Up / Registration
  const register = async ({ name, email, password }) => {
    if (!supabase) {
      const newUser = {
        ...DEFAULT_USER,
        id: `usr-${Date.now()}`,
        name: name || 'Valued Customer',
        email,
        joinDate: 'Just now'
      };
      setUser(newUser);
      addToast('Account created successfully! Welcome to NovaCart.', 'success');
      return { success: true, user: newUser };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || 'Valued Customer',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            tier: 'Silver Member'
          }
        }
      });

      if (error) {
        addToast(error.message, 'error');
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const formatted = formatSupabaseUser(data.user);
        setUser(formatted);
        addToast('Account created successfully! Welcome to NovaCart.', 'success');
        return { success: true, user: formatted };
      }

      addToast('Confirmation email sent! Please check your inbox.', 'info');
      return { success: true, message: 'Check confirmation email' };
    } catch (err) {
      const message = err.message || 'Registration failed.';
      addToast(message, 'error');
      return { success: false, error: message };
    }
  };

  // Sign Out
  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    setUser(null);
    addToast('Signed out of NovaCart', 'info');
  };

  // Update profile
  const updateProfile = async (updatedDetails) => {
    if (supabase && user?.id) {
      try {
        await supabase.auth.updateUser({
          data: updatedDetails
        });
      } catch (err) {
        console.warn('Supabase update user error:', err);
      }
    }

    setUser((prev) => ({
      ...prev,
      ...updatedDetails
    }));
    addToast('Profile updated successfully', 'success');
  };

  // Record an order locally and attempt to persist into Supabase orders table
  const addOrder = async (orderData) => {
    const newOrder = {
      id: `NC-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Processing',
      statusStep: 1,
      trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}US`,
      carrier: 'NovaCart Express',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }),
      ...orderData
    };

    // Store in state immediately
    setOrders((prev) => [newOrder, ...prev]);

    // Insert into Supabase orders table if available
    if (supabase) {
      try {
        const { error } = await supabase.from('orders').insert({
          id: newOrder.id,
          user_id: user?.id && !user.id.startsWith('usr-') ? user.id : null,
          user_email: user?.email || orderData.shippingAddress?.email || null,
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

        if (error) {
          console.warn('Note: Could not insert into Supabase orders table (table might not exist yet):', error.message);
        } else {
          console.log('Order saved to Supabase successfully:', newOrder.id);
        }
      } catch (err) {
        console.warn('Supabase orders insert exception:', err);
      }
    }

    return newOrder;
  };

  const getOrderById = (id) => {
    return orders.find((o) => o.id === id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authLoading,
        orders,
        login,
        loginWithOAuth,
        register,
        logout,
        updateProfile,
        addOrder,
        getOrderById
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
