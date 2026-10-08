import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const STORAGE_KEY = 'novacart_items';
const COUPON_KEY = 'novacart_coupon';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => getStorageItem(STORAGE_KEY, []));
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [coupon, setCoupon] = useState(() => getStorageItem(COUPON_KEY, null));
  const { addToast } = useToast();

  useEffect(() => {
    setStorageItem(STORAGE_KEY, cart);
  }, [cart]);

  useEffect(() => {
    setStorageItem(COUPON_KEY, coupon);
  }, [coupon]);

  const addToCart = (product, quantity = 1, selectedOption = null) => {
    const option = selectedOption || (product.options ? product.options.values[0] : null);
    const cartItemId = `${product.id}-${option || 'default'}`;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingItemIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingItemIndex].quantity + quantity;
        const finalQty = product.stock ? Math.min(newQty, product.stock) : newQty;
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: finalQty
        };
        return updated;
      } else {
        const newItem = {
          cartItemId,
          id: product.id,
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice,
          image: product.image,
          category: product.category,
          categoryName: product.categoryName,
          selectedOption: option,
          stock: product.stock,
          quantity: Math.min(quantity, product.stock || quantity)
        };
        return [...prevCart, newItem];
      }
    });

    addToast(`Added "${product.name}" to cart`, 'success');
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const clampedQty = item.stock ? Math.min(newQuantity, item.stock) : newQuantity;
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((i) => i.cartItemId === cartItemId);
      if (itemToRemove) {
        addToast(`Removed "${itemToRemove.name}" from cart`, 'info');
      }
      return prevCart.filter((item) => item.cartItemId !== cartItemId);
    });
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'NOVA20') {
      setCoupon({ code: 'NOVA20', discountPercent: 20 });
      addToast('Promo code NOVA20 applied! 20% discount granted.', 'success');
      return { success: true, message: '20% off applied!' };
    } else if (cleanCode === 'WELCOME10') {
      setCoupon({ code: 'WELCOME10', discountPercent: 10 });
      addToast('Promo code WELCOME10 applied! 10% discount granted.', 'success');
      return { success: true, message: '10% off applied!' };
    } else {
      addToast('Invalid promo code. Try "NOVA20" or "WELCOME10"', 'error');
      return { success: false, message: 'Invalid promo code' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast('Promo code removed', 'info');
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);
  const toggleCartDrawer = () => setIsCartDrawerOpen((prev) => !prev);

  // Computed values
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const discountAmount = coupon ? (subtotal * coupon.discountPercent) / 100 : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  
  // Free shipping threshold: $100
  const freeShippingThreshold = 100;
  const shipping = subtotal === 0 || discountedSubtotal >= freeShippingThreshold ? 0 : 12;
  const estimatedTax = discountedSubtotal * 0.08;
  const total = discountedSubtotal > 0 ? discountedSubtotal + shipping + estimatedTax : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        subtotal,
        discountAmount,
        coupon,
        shipping,
        estimatedTax,
        total,
        freeShippingThreshold,
        isCartDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        openCartDrawer,
        closeCartDrawer,
        toggleCartDrawer
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
