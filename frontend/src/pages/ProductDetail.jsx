import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiClock, FiCheck, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchProductById, fetchProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Fetch product from backend ───────────────────────────────────────────
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);
      setRelatedProducts([]);
      setQuantity(1);

      try {
        const data = await fetchProductById(id);
        setProduct(data);

        // Fetch related products by same category
        const relatedData = await fetchProducts({ category: data.category });
        const allRelated = relatedData.results || relatedData;
        setRelatedProducts(
          allRelated.filter((p) => p.id !== data.id).slice(0, 3)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]); // re-run when route param changes

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (product) addToCart(product, quantity);
  };

  const handleWishlist = () => {
    if (product) toggleWishlist(product);
  };

  // ─── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="rounded-[32px] aspect-[4/3] bg-[var(--border-color)]" />
          <div className="space-y-5 pt-4">
            <div className="h-5 bg-[var(--border-color)] rounded-full w-1/4" />
            <div className="h-10 bg-[var(--border-color)] rounded-full w-3/4" />
            <div className="h-6 bg-[var(--border-color)] rounded-full w-1/3" />
            <div className="h-20 bg-[var(--border-color)] rounded-2xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Error / Not Found state ──────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-main)] font-serif">Dish Not Found</h2>
        <p className="text-[var(--text-muted)]">
          {error || "The dish you're searching for might have returned to the royal archive."}
        </p>
        <Link to="/menu" className="inline-flex items-center space-x-2 bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors">
          <FiArrowLeft />
          <span>Back to Menu</span>
        </Link>
      </div>
    );
  }

  const isFav = isInWishlist(product.id);
  const tags = Array.isArray(product.tags) ? product.tags : [];
  const ingredients = Array.isArray(product.ingredients) ? product.ingredients : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Back Link */}
      <div className="text-left">
        <Link to="/menu" className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary dark:text-accent hover:underline">
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </Link>
      </div>

      {/* Main product columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left column: Image showcase */}
        <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] shadow-lg border border-[var(--border-color)]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {tags.includes('Best Seller') && (
            <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
              Best Seller
            </div>
          )}
        </div>

        {/* Right column: Product Details */}
        <div className="space-y-6 text-left">
          
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-primary dark:text-accent uppercase">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--text-main)] leading-snug">
              {product.name}
            </h1>
            
            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 text-sm text-[var(--text-main)] bg-secondary-light/60 dark:bg-secondary/15 px-3 py-1 rounded-full">
                <FiStar className="w-4 h-4 text-secondary fill-current" />
                <span className="font-bold text-yellow-700 dark:text-secondary">{product.rating}</span>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-light">
                ({product.reviewsCount} verified royal reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="text-3xl font-extrabold font-serif text-primary dark:text-primary-light">
            ₹{parseFloat(product.price).toFixed(0)}
          </div>

          <p className="text-base text-[var(--text-muted)] font-light leading-relaxed">
            {product.description}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 border-y border-[var(--border-color)] py-4 my-2">
            <div className="flex items-center space-x-2.5">
              <FiClock className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">Prep Time</p>
                <p className="text-sm font-bold text-[var(--text-main)]">{product.prepTime}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2.5">
              <FiCheck className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">Availability</p>
                <p className="text-sm font-bold text-[var(--text-main)]">Freshly Prepared</p>
              </div>
            </div>
          </div>

          {/* Actions: Quantities & Add Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
            
            {/* Quantity Controls */}
            <div className="flex items-center justify-between border border-[var(--border-color)] rounded-2xl overflow-hidden bg-[var(--bg-main)] p-1.5 sm:w-36">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-[var(--border-color)] text-[var(--text-main)] transition-colors rounded-xl"
              >
                <FiMinus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm text-[var(--text-main)] px-4">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2.5 hover:bg-[var(--border-color)] text-[var(--text-main)] transition-colors rounded-xl"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              className="flex-grow flex items-center justify-center space-x-2 bg-primary dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>Add {quantity} to Basket • ₹{(parseFloat(product.price) * quantity).toFixed(0)}</span>
            </button>

            {/* Favorite button */}
            <button
              onClick={handleWishlist}
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                isFav
                  ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20'
                  : 'border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--border-color)] bg-[var(--bg-surface)]'
              }`}
            >
              <FiHeart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
            </button>

          </div>

        </div>

      </div>

      {/* Tabs section */}
      <section className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[32px] overflow-hidden shadow-sm text-left">
        <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-main)]">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-8 py-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'description'
                ? 'border-primary text-primary dark:border-accent dark:text-accent bg-[var(--bg-surface)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-primary'
            }`}
          >
            Culinary Description
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`px-8 py-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'ingredients'
                ? 'border-primary text-primary dark:border-accent dark:text-accent bg-[var(--bg-surface)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-primary'
            }`}
          >
            Sourced Ingredients
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'description' && (
            <div className="space-y-4 font-light text-[var(--text-muted)] leading-relaxed">
              <p>
                Our chefs carefully curate each plate to offer an exploration of taste. The {product.name} brings together spices and fragrances that respect historical traditions while embracing modern plate presentation.
              </p>
              <p>
                Best paired with crisp beverages or light dessert starters to elevate the subtle undercurrents of local organic saffron and ground whole seeds.
              </p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider mb-2">Primary Components:</p>
              <div className="flex flex-wrap gap-2.5">
                {ingredients.map((ing, idx) => (
                  <span key={idx} className="flex items-center space-x-1.5 bg-[var(--bg-main)] border border-[var(--border-color)] px-4 py-2 rounded-xl text-sm text-[var(--text-main)] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>{ing}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 text-left">
          <h2 className="text-2xl font-bold font-serif text-[var(--text-main)]">
            Explore Related Royal Dishes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
