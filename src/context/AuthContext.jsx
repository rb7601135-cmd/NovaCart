import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const getInitialsAvatar = (name) => {
  const safeName = name ? encodeURIComponent(name.trim()) : 'Customer';
  return `https://ui-avatars.com/api/?name=${safeName}&background=4f46e5&color=ffffff&bold=true&rounded=true`;
};

const formatSupabaseUser = (sbUser, profile = {}) => {
  if (!sbUser) return null;
  const meta = sbUser.user_metadata || {};
  const name =
    profile?.name ||
    meta.name ||
    meta.full_name ||
    sbUser.email?.split('@')[0] ||
    'Valued Customer';

  // Sanitize any legacy girl photos
  const rawAvatar = profile?.avatar_url || profile?.avatar || meta.avatar_url || meta.avatar;
  const avatar =
    rawAvatar && !rawAvatar.includes('photo-1534528741775-53994a69daeb')
      ? rawAvatar
      : getInitialsAvatar(name);

  return {
    id: sbUser.id,
    name,
    email: sbUser.email,
    phone: profile?.phone || meta.phone || sbUser.phone || '',
    avatar,
    tier: profile?.tier || meta.tier || 'Member',
    joinDate: sbUser.created_at
      ? new Date(sbUser.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'Recently',
    addresses: profile?.addresses || meta.addresses || []
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const { addToast } = useToast();

  // Load orders for a specific user ID / email
  const fetchUserOrders = useCallback(async (currentUserId, currentUserEmail) => {
    if (!currentUserId && !currentUserEmail) {
      setOrders([]);
      return;
    }

    // 1. Check user-scoped local cache
    const cachedOrders = currentUserId ? getStorageItem(`novacart_orders_${currentUserId}`, []) : [];

    // 2. Also check global orders matching this user ID or email
    const allStoredOrders = getStorageItem('novacart_orders', []);
    const matchingShared = allStoredOrders.filter(
      (o) =>
        (currentUserId && (o.userId === currentUserId || o.user_id === currentUserId)) ||
        (currentUserEmail && (o.userEmail === currentUserEmail || o.shippingAddress?.email?.toLowerCase() === currentUserEmail.toLowerCase()))
    );

    // Merge cached with shared
    const initialMerged = [...cachedOrders];
    matchingShared.forEach((so) => {
      if (!initialMerged.some((co) => co.id === so.id)) {
        initialMerged.push(so);
      }
    });

    if (initialMerged.length > 0) {
      setOrders(initialMerged);
    }

    if (!supabase) return;

    try {
      let query = supabase.from('orders').select('*');
      if (currentUserId && !currentUserId.startsWith('usr-')) {
        query = query.or(`user_id.eq.${currentUserId},user_email.eq.${currentUserEmail}`);
      } else if (currentUserEmail) {
        query = query.eq('user_email', currentUserEmail);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map((o) => ({
          id: o.id,
          date: new Date(o.created_at || Date.now()).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
          }),
          status: o.status || 'Processing',
          statusStep: o.status === 'Delivered' ? 3 : o.status === 'Shipped' || o.status === 'In Transit' ? 2 : 1,
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
          total: Number(o.total || 0)
        }));

        setOrders(mapped);
        if (currentUserId) {
          setStorageItem(`novacart_orders_${currentUserId}`, mapped);
        }
      }
    } catch (err) {
      console.warn('Orders fetch note:', err);
    }
  }, []);

  // Real-time synchronization of order changes made from CMS
  useEffect(() => {
    const handleOrderUpdate = (e) => {
      if (e.detail?.orderId) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === e.detail.orderId
              ? {
                  ...o,
                  status: e.detail.newStatus,
                  statusStep:
                    e.detail.newStatus === 'Delivered'
                      ? 3
                      : e.detail.newStatus === 'Shipped' || e.detail.newStatus === 'In Transit'
                      ? 2
                      : 1,
                  ...e.detail.extraDetails
                }
              : o
          )
        );
      }
    };
    window.addEventListener('novacart:order_updated', handleOrderUpdate);
    return () => window.removeEventListener('novacart:order_updated', handleOrderUpdate);
  }, []);

  // Fetch optional profile table data from Supabase
  const fetchProfile = useCallback(async (userId) => {
    if (!supabase || !userId) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch {
      // profiles table optional
    }
    return null;
  }, []);

  // Sync session on mount & listen to Supabase auth events
  useEffect(() => {
    let subscription = null;

    async function initAuth() {
      // Clean up legacy shared user cache if present
      const legacyUser = window.localStorage.getItem('novacart_user');
      if (legacyUser && legacyUser.includes('alex.morgan@example.com')) {
        removeStorageItem('novacart_user');
      }

      if (!supabase) {
        setAuthLoading(false);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase getSession:', error.message);
        }

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          const formatted = formatSupabaseUser(session.user, profile);
          setUser(formatted);
          await fetchUserOrders(session.user.id, session.user.email);
        } else {
          setUser(null);
          setOrders([]);
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (currentSession?.user) {
              const profile = await fetchProfile(currentSession.user.id);
              const formatted = formatSupabaseUser(currentSession.user, profile);
              setUser(formatted);
              fetchUserOrders(currentSession.user.id, currentSession.user.email);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setOrders([]);
            }
          }
        );
        subscription = authListener?.subscription;
      } catch (err) {
        console.warn('Supabase auth initialization error:', err);
      } finally {
        setAuthLoading(false);
      }
    }

    initAuth();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [fetchProfile, fetchUserOrders]);

  // Sign In with email & password
  const login = async (email, password) => {
    if (!email || !password) {
      addToast('Please enter both email and password.', 'error');
      return { success: false, error: 'Email and password are required' };
    }

    if (!supabase) {
      addToast('Backend authentication service is unavailable.', 'error');
      return { success: false, error: 'Authentication service is unavailable' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        let msg = error.message;
        if (error.message.includes('Invalid login credentials')) {
          msg = 'Invalid email or password. Please verify your details.';
        } else if (error.message.includes('Email not confirmed')) {
          msg = 'Please confirm your email address before signing in.';
        }
        addToast(msg, 'error');
        return { success: false, error: msg };
      }

      if (data?.user) {
        const profile = await fetchProfile(data.user.id);
        const formatted = formatSupabaseUser(data.user, profile);
        setUser(formatted);
        await fetchUserOrders(data.user.id, data.user.email);
        addToast(`Welcome back, ${formatted.name}!`, 'success');
        return { success: true, user: formatted };
      }

      return { success: true };
    } catch (err) {
      const message = err.message || 'An error occurred during sign in.';
      addToast(message, 'error');
      return { success: false, error: message };
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign Up / Registration
  const register = async ({ name, email, password }) => {
    if (!email || !password) {
      addToast('Please provide an email and password.', 'error');
      return { success: false, error: 'Missing required credentials' };
    }

    if (!supabase) {
      addToast('Backend authentication service is unavailable.', 'error');
      return { success: false, error: 'Authentication service is unavailable' };
    }

    try {
      const trimmedEmail = email.trim();
      const trimmedName = name?.trim() || trimmedEmail.split('@')[0];
      const initialAvatar = getInitialsAvatar(trimmedName);

      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            name: trimmedName,
            avatar_url: initialAvatar,
            tier: 'Member'
          }
        }
      });

      if (error) {
        let msg = error.message;
        if (error.message.toLowerCase().includes('rate limit')) {
          msg = 'Email rate limit exceeded by Supabase. Turn off "Confirm email" in Supabase Auth settings to sign up instantly without email limits.';
        }
        addToast(msg, 'error');
        return { success: false, error: msg };
      }

      if (data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: trimmedEmail,
            name: trimmedName,
            avatar_url: initialAvatar,
            tier: 'Member',
            created_at: new Date().toISOString()
          });
        } catch {
          // optional
        }

        const formatted = formatSupabaseUser(data.user, { name: trimmedName, avatar_url: initialAvatar });
        setUser(formatted);

        if (data.session) {
          addToast('Account created successfully! Welcome to NovaCart.', 'success');
          return { success: true, user: formatted };
        } else {
          addToast('Account registered! If confirmation is required, please check your inbox.', 'info');
          return { success: true, user: formatted, needsConfirmation: true };
        }
      }

      addToast('Registration complete. Please check your email.', 'info');
      return { success: true, message: 'Check confirmation email' };
    } catch (err) {
      const message = err.message || 'Registration failed.';
      addToast(message, 'error');
      return { success: false, error: message };
    }
  };

  // Sign In with OAuth (Google, GitHub, etc.)
  const loginWithOAuth = async (provider = 'google') => {
    if (!supabase) {
      addToast('OAuth is not configured.', 'error');
      return { success: false, error: 'OAuth is not configured' };
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

  // Reset Password Request (send email link)
  const resetPassword = async (email) => {
    if (!email) {
      addToast('Please enter your email address.', 'error');
      return { success: false, error: 'Email is required' };
    }

    if (!supabase) {
      addToast('Authentication service is unavailable.', 'error');
      return { success: false, error: 'Authentication service unavailable' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        let msg = error.message;
        if (error.message.toLowerCase().includes('rate limit')) {
          msg = 'Email rate limit exceeded. Please wait a few minutes before requesting another reset email.';
        }
        addToast(msg, 'error');
        return { success: false, error: msg };
      }

      addToast('Password reset email sent! Please check your inbox.', 'success');
      return { success: true };
    } catch (err) {
      const message = err.message || 'Failed to send reset link.';
      addToast(message, 'error');
      return { success: false, error: message };
    }
  };

  // Update Password (when authenticated or via recovery link)
  const updatePassword = async (newPassword) => {
    if (!newPassword || newPassword.length < 8) {
      addToast('Password must be at least 8 characters long.', 'error');
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    if (!supabase) {
      addToast('Authentication service is unavailable.', 'error');
      return { success: false, error: 'Authentication service unavailable' };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        addToast(error.message, 'error');
        return { success: false, error: error.message };
      }

      addToast('Password updated successfully!', 'success');
      return { success: true };
    } catch (err) {
      const message = err.message || 'Failed to update password.';
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
    setOrders([]);
    removeStorageItem('novacart_user');
    addToast('Signed out of NovaCart', 'info');
  };

  // Update profile
  const updateProfile = async (updatedDetails) => {
    if (supabase && user?.id) {
      try {
        await supabase.auth.updateUser({
          data: updatedDetails
        });

        await supabase.from('profiles').upsert({
          id: user.id,
          ...updatedDetails,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase update profile error:', err);
      }
    }

    setUser((prev) => (prev ? { ...prev, ...updatedDetails } : null));
    return true;
  };

  // Update avatar photo (custom image upload)
  const updateAvatar = async (avatarUrl) => {
    await updateProfile({ avatar: avatarUrl, avatar_url: avatarUrl });
    addToast('Profile picture updated!', 'success');
  };

  // Add new shipping address
  const addAddress = async (newAddress) => {
    const addressWithId = {
      id: `addr-${Date.now()}`,
      title: newAddress.title || 'Delivery Address',
      fullName: newAddress.fullName || user?.name || '',
      street: newAddress.street || '',
      city: newAddress.city || '',
      state: newAddress.state || '',
      postalCode: newAddress.postalCode || '',
      country: newAddress.country || 'United States',
      isDefault: (user?.addresses?.length || 0) === 0 ? true : !!newAddress.isDefault
    };

    let updatedList = [...(user?.addresses || [])];
    if (addressWithId.isDefault) {
      updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
    }
    updatedList.push(addressWithId);

    await updateProfile({ addresses: updatedList });
    addToast('Delivery address saved!', 'success');
    return addressWithId;
  };

  // Remove shipping address
  const removeAddress = async (addressId) => {
    let updatedList = (user?.addresses || []).filter((a) => a.id !== addressId);
    if (updatedList.length > 0 && !updatedList.some((a) => a.isDefault)) {
      updatedList[0].isDefault = true;
    }
    await updateProfile({ addresses: updatedList });
    addToast('Address removed', 'info');
  };

  // Set default shipping address
  const setDefaultAddress = async (addressId) => {
    const updatedList = (user?.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addressId
    }));
    await updateProfile({ addresses: updatedList });
    addToast('Default address updated', 'success');
  };

  // Add order for current user
  const addOrder = async (orderData) => {
    const orderId = orderData.id || `NC-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: orderId,
      date: orderData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: orderData.status || 'Processing',
      statusStep: orderData.statusStep || 1,
      trackingNumber: orderData.trackingNumber || `TRK-${Math.floor(100000000 + Math.random() * 900000000)}US`,
      carrier: orderData.carrier || 'NovaCart Express',
      estimatedDelivery: orderData.estimatedDelivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }),
      ...orderData
    };

    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);

    // Always sync to shared novacart_orders for CMS visibility
    const allStored = getStorageItem('novacart_orders', []);
    if (!allStored.some((o) => o.id === newOrder.id)) {
      setStorageItem('novacart_orders', [newOrder, ...allStored]);
    }

    if (user?.id) {
      const userOrders = getStorageItem(`novacart_orders_${user.id}`, []);
      const updatedUserOrders = [newOrder, ...userOrders.filter((o) => o.id !== newOrder.id)];
      setStorageItem(`novacart_orders_${user.id}`, updatedUserOrders);
    }

    if (supabase) {
      try {
        const { error } = await supabase.from('orders').upsert({
          id: newOrder.id,
          user_id: user?.id || null,
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
          console.warn('Supabase orders table note:', error.message);
        }
      } catch (err) {
        console.warn('Supabase orders insert note:', err);
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
        resetPassword,
        updatePassword,
        logout,
        updateProfile,
        updateAvatar,
        addAddress,
        removeAddress,
        setDefaultAddress,
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
