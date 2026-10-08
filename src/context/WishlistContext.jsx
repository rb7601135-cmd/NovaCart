import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'novacart_wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => getStorageItem(STORAGE_KEY, []));
  const { addToast } = useToast();

  useEffect(() => {
    setStorageItem(STORAGE_KEY, wishlist);
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        addToast(`Removed "${product.name}" from wishlist`, 'info');
        return prev.filter((item) => item.id !== product.id);
      } else {
        addToast(`Added "${product.name}" to wishlist`, 'success');
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => {
      const item = prev.find((p) => p.id === productId);
      if (item) {
        addToast(`Removed "${item.name}" from wishlist`, 'info');
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
