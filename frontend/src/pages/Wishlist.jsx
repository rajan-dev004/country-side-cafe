import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--text-main)]">
          My Royal Favorites
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-light">
          Your saved dishes ready for your next culinary feast.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[32px] space-y-5">
          <div className="w-16 h-16 rounded-full bg-primary-light/30 text-primary dark:text-accent flex items-center justify-center">
            <FiHeart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-main)]">Your wishlist is empty</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-[280px] leading-relaxed mx-auto">
              Tap the heart icon on any dish card to save it here for later ordering!
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center space-x-2 bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary-dark transition-all duration-300"
          >
            <FiShoppingCart className="w-4 h-4" />
            <span>Browse the Menu</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
