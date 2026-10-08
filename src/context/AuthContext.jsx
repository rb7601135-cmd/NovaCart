import React, { createContext, useContext, useState, useEffect } from 'react';
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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStorageItem(USER_KEY, DEFAULT_USER));
  const [orders, setOrders] = useState(() => getStorageItem(ORDERS_KEY, initialOrders));
  const { addToast } = useToast();

  useEffect(() => {
    setStorageItem(USER_KEY, user);
  }, [user]);

  useEffect(() => {
    setStorageItem(ORDERS_KEY, orders);
  }, [orders]);

  const login = (email, password) => {
    const loggedInUser = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
      name: email ? email.split('@')[0].replace(/[._]/g, ' ') : DEFAULT_USER.name
    };
    setUser(loggedInUser);
    addToast(`Welcome back, ${loggedInUser.name}!`, 'success');
    return { success: true };
  };

  const register = ({ name, email, password }) => {
    const newUser = {
      ...DEFAULT_USER,
      id: `usr-${Date.now()}`,
      name: name || 'Valued Customer',
      email: email,
      joinDate: 'Just now'
    };
    setUser(newUser);
    addToast(`Account created successfully! Welcome to NovaCart.`, 'success');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    addToast('Signed out of NovaCart', 'info');
  };

  const updateProfile = (updatedDetails) => {
    setUser((prev) => ({
      ...prev,
      ...updatedDetails
    }));
    addToast('Profile updated successfully', 'success');
  };

  const addOrder = (orderData) => {
    const newOrder = {
      id: `NC-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Processing',
      statusStep: 1,
      trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}US`,
      carrier: 'NovaCart Express',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      ...orderData
    };

    setOrders((prev) => [newOrder, ...prev]);
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
        orders,
        login,
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
