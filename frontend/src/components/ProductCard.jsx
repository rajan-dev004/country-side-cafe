import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiClock } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFav = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to detail page when clicking add to cart
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <div className="group relative rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Product Image Section */}
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all duration-300 ${
            isFav
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/70 hover:bg-white text-gray-700 dark:bg-black/60 dark:hover:bg-black/80 dark:text-gray-200'
          }`}
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Prep Time Tag */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-white bg-black/60 backdrop-blur-sm rounded-full">
          <FiClock className="w-3.5 h-3.5 text-secondary" />
          <span>{product.prepTime}</span>
        </div>
      </Link>

      {/* Content Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          {/* Category Tag */}
          <span className="text-[10px] font-bold tracking-wider text-primary dark:text-accent uppercase bg-primary-light/30 dark:bg-primary/20 px-2.5 py-1 rounded-full">
            {product.category}
          </span>
          {/* Rating */}
          <div className="flex items-center space-x-1 text-xs text-[var(--text-main)] bg-secondary-light/60 dark:bg-secondary/10 px-2 py-0.5 rounded-full">
            <FiStar className="w-3 h-3 text-secondary fill-current" />
            <span className="font-semibold text-xs text-yellow-600 dark:text-secondary">{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors mb-2 block">
          <h3 className="text-lg font-bold font-serif leading-snug text-[var(--text-main)] line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4 font-light leading-relaxed">
          {product.description}
        </p>

        {/* Pricing and Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-color)]">
          <span className="text-xl font-bold text-primary dark:text-primary-light font-serif">
            ₹{product.price}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="flex items-center space-x-1.5 bg-secondary hover:bg-yellow-600 text-white font-medium text-sm py-2.5 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            <FiShoppingCart className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
