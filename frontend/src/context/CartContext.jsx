import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { fetchCart, addCartItem, updateCartItem, removeCartItem, clearCartItems } from '../utils/api';

const CartContext = createContext();

// Helper: normalise a backend cart response into a flat array of cart items
// Backend cart format: { id, user, items: [{ id, product: {...}, quantity }] }
// Frontend cart format: [{ ...productFields, quantity }]
function normaliseServerCart(serverCart) {
  if (!serverCart || !serverCart.items) return [];
  return serverCart.items.map((item) => ({
    ...item.product,
    quantity: item.quantity,
  }));
}

export const CartProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();

  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // ─── Load cart from backend whenever auth state changes ──────────────────
  useEffect(() => {
    if (isAuthenticated && token) {
      loadCart();
    } else {
      // User logged out — clear local cart
      setCart([]);
    }
  }, [isAuthenticated, token]);

  const loadCart = useCallback(async () => {
    if (!token) return;
    setCartLoading(true);
    try {
      const serverCart = await fetchCart(token);
      setCart(normaliseServerCart(serverCart));
    } catch (error) {
      console.error('Failed to load cart:', error.message);
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  // ─── Add to Cart ──────────────────────────────────────────────────────────
  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated || !token) {
      alert('Please log in to add items to your cart.');
      return;
    }

    // Optimistic UI update
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    try {
      const serverCart = await addCartItem(product.id, quantity, token);
      setCart(normaliseServerCart(serverCart));
    } catch (error) {
      console.error('Failed to add item to cart:', error.message);
      // Revert optimistic update by reloading from server
      loadCart();
    }
  };

  // ─── Remove from Cart ────────────────────────────────────────────────────
  const removeFromCart = async (productId) => {
    if (!isAuthenticated || !token) return;

    // Optimistic UI update
    setCart((prev) => prev.filter((item) => item.id !== productId));

    try {
      const serverCart = await removeCartItem(productId, token);
      setCart(normaliseServerCart(serverCart));
    } catch (error) {
      console.error('Failed to remove item:', error.message);
      loadCart();
    }
  };

  // ─── Update Quantity ─────────────────────────────────────────────────────
  const updateQuantity = async (productId, newQuantity) => {
    if (!isAuthenticated || !token) return;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Optimistic UI update
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      const serverCart = await updateCartItem(productId, newQuantity, token);
      setCart(normaliseServerCart(serverCart));
    } catch (error) {
      console.error('Failed to update quantity:', error.message);
      loadCart();
    }
  };

  // ─── Clear Cart ───────────────────────────────────────────────────────────
  const clearCart = async () => {
    if (!isAuthenticated || !token) {
      setCart([]);
      return;
    }

    // Optimistic UI update
    setCart([]);

    try {
      await clearCartItems(token);
    } catch (error) {
      console.error('Failed to clear cart:', error.message);
      loadCart();
    }
  };

  // ─── Derived values ───────────────────────────────────────────────────────
  const cartTotal = cart.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
