import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchWishlist, toggleWishlistItem } from '../utils/api';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();   // STEP 3a: Get the auth token

  const [wishlist, setWishlist] = useState([]);   // Stores the wishlist items from API
  const [loading, setLoading] = useState(false);  // True while fetching from backend

  // ─── STEP 3b: Load wishlist from the backend when user logs in ────────────
  // useEffect runs once when the component mounts, AND again whenever
  // `isAuthenticated` or `token` changes (e.g. after login/logout).
  useEffect(() => {
    if (isAuthenticated && token) {
      loadWishlist();
    } else {
      // If user is not logged in, clear the wishlist
      setWishlist([]);
    }
  }, [isAuthenticated, token]);

  // ─── STEP 3c: The function that actually calls the API ───────────────────
  const loadWishlist = async () => {
    setLoading(true);
    try {
      // fetchWishlist() calls GET /api/wishlist/wishlistdetail/ with the token
      // Django returns: [{ id, product: { id, name, price, image, ... } }, ...]
      const data = await fetchWishlist(token);

      // We only store the product objects (not the wishlist wrapper)
      const products = data.map((item) => item.product);
      setWishlist(products);
    } catch (error) {
      console.error('Failed to load wishlist:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── STEP 3d: Toggle add/remove — calls POST to backend, then refreshes ──
  const toggleWishlist = async (product) => {
    if (!isAuthenticated || !token) {
      alert('Please log in to save items to your wishlist.');
      return;
    }

    try {
      // toggleWishlistItem() calls POST /api/wishlist/wishlistdetail/
      // with { product_id: product.id } and the token
      const result = await toggleWishlistItem(product.id, token);

      // result.added = true means it was added, false means it was removed
      if (result.added) {
        // Optimistically add the product to local state (fast UI update)
        setWishlist((prev) => [...prev, product]);
      } else {
        // Remove it from local state
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error.message);
    }
  };

  // ─── STEP 3e: Helper to check if a product is in the wishlist ────────────
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
