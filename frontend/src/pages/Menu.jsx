import React, { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiSliders, FiStar, FiX, FiLoader } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories } from '../utils/api';

export default function Menu() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState(600);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // API data state
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Specialties' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── Fetch categories and products from backend on mount ─────────────────
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setAllProducts(productsData.results || productsData); // handle paginated or list response
        // Prepend "All" category
        setCategories([{ id: 'all', name: 'All Specialties' }, ...categoriesData]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ─── Client-side Filter and Sort using useMemo ───────────────────────────
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    result = result.filter((p) => parseFloat(p.price) <= priceRange);

    if (sortBy === 'price-low') {
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [allProducts, search, activeCategory, sortBy, minRating, priceRange]);

  const clearAllFilters = () => {
    setSearch('');
    setActiveCategory('all');
    setSortBy('popular');
    setMinRating(0);
    setPriceRange(600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 space-y-8">

      {/* Page Header */}
      <div className="text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--text-main)]">
          The Royal Bistro Menu
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-light max-w-xl">
          Browse through our modern Rajasthani specialties. Customize filters to discover savory, sweet, and soothing selections.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-5 py-4 rounded-2xl text-sm font-medium">
          ⚠️ Could not connect to backend: {error}. Make sure the Django server is running.
        </div>
      )}

      {/* Main Search and Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 rounded-3xl shadow-sm">

        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes, ingredients, secrets..."
            className="w-full pl-12 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-2xl text-sm placeholder-[var(--text-muted)] transition-colors"
          />
        </div>

        {/* Quick controls */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFiltersMobile(true)}
            className="md:hidden flex items-center space-x-1.5 px-4 py-3 border border-[var(--border-color)] rounded-2xl hover:bg-[var(--border-color)] text-[var(--text-main)] text-sm font-semibold transition-colors"
          >
            <FiSliders className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="relative inline-flex items-center space-x-2 bg-[var(--bg-main)] border border-[var(--border-color)] px-4 py-3 rounded-2xl text-sm text-[var(--text-main)] font-semibold">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none font-bold text-primary dark:text-accent cursor-pointer pr-1"
            >
              <option value="popular">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

        </div>
      </div>

      {/* Categories Horizontal Pills */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeCategory === cat.id
                ? 'bg-primary dark:bg-primary-dark text-white shadow-md'
                : 'bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:border-primary'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Left Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6 text-left">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-3xl space-y-6 shadow-sm">

            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
              <h3 className="font-bold text-lg text-[var(--text-main)]">Filter By</h3>
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-primary dark:text-accent hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-[var(--text-main)]">
                <span>Max Budget</span>
                <span className="text-primary dark:text-accent">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="100"
                max="600"
                step="20"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-1.5 bg-[var(--bg-main)] rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-semibold">
                <span>₹100</span>
                <span>₹600</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-[var(--text-main)]">Rating</h4>
              <div className="space-y-1.5">
                {[0, 4.8, 4.7, 4.5].map((val) => (
                  <label key={val} className="flex items-center space-x-2.5 cursor-pointer text-sm font-light text-[var(--text-muted)]">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === val}
                      onChange={() => setMinRating(val)}
                      className="accent-primary"
                    />
                    <span className="flex items-center space-x-1">
                      {val === 0 ? (
                        <span>Show All Ratings</span>
                      ) : (
                        <>
                          <span className="font-semibold">{val}+</span>
                          <FiStar className="w-3.5 h-3.5 fill-current text-secondary" />
                        </>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Right Product Grid */}
        <main className="md:col-span-3">
          {loading ? (
            /* Loading Skeleton */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-[var(--border-color)]" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-[var(--border-color)] rounded-full w-3/4" />
                    <div className="h-3 bg-[var(--border-color)] rounded-full w-full" />
                    <div className="h-3 bg-[var(--border-color)] rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-12 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center text-2xl font-serif">
                !
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)]">No Delicacies Found</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1 max-w-sm">
                  We couldn't find matches. Try adjusting your price slider or searching for something else!
                </p>
              </div>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>

      {/* Mobile Sidebar Overlay Modal */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFiltersMobile(false)} />
          <div className="relative ml-0 mr-auto flex h-full w-full max-w-xs flex-col bg-[var(--bg-surface)] py-4 pb-12 shadow-xl border-r border-[var(--border-color)] text-left">

            <div className="flex items-center justify-between px-4 pb-3 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-bold text-[var(--text-main)]">Filters</h2>
              <button onClick={() => setShowFiltersMobile(false)} className="p-1 rounded-full hover:bg-[var(--border-color)]">
                <FiX className="w-5 h-5 text-[var(--text-main)]" />
              </button>
            </div>

            <div className="overflow-y-auto px-4 py-6 space-y-6">
              <button
                onClick={() => { clearAllFilters(); setShowFiltersMobile(false); }}
                className="w-full py-2 bg-[var(--border-color)] text-[var(--text-main)] font-semibold rounded-xl text-sm text-center"
              >
                Reset All Filters
              </button>

              {/* Price Filter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-[var(--text-main)]">
                  <span>Max Budget</span>
                  <span className="text-primary dark:text-accent">₹{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="600"
                  step="20"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-[var(--bg-main)] rounded-lg appearance-none"
                />
              </div>

              {/* Rating Filter */}
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-[var(--text-main)]">Rating</h4>
                <div className="space-y-2">
                  {[0, 4.8, 4.7, 4.5].map((val) => (
                    <label key={val} className="flex items-center space-x-2.5 cursor-pointer text-sm font-light text-[var(--text-muted)]">
                      <input
                        type="radio"
                        name="rating-mobile"
                        checked={minRating === val}
                        onChange={() => { setMinRating(val); setShowFiltersMobile(false); }}
                        className="accent-primary"
                      />
                      <span className="flex items-center space-x-1">
                        {val === 0 ? <span>Show All Ratings</span> : <><span className="font-semibold">{val}+</span><FiStar className="w-3.5 h-3.5 fill-current text-secondary" /></>}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
