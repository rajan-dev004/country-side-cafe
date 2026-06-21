import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiAward, FiCoffee, FiHeart, FiShield } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { TESTIMONIALS } from '../utils/mockData';
import { fetchProducts } from '../utils/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await fetchProducts({ featured: true });
        const products = data.results || data;
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error('Failed to load featured products:', error.message);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-light/40 via-[var(--bg-main)] to-secondary-light/30 dark:from-primary-dark/20 dark:to-black/30 rounded-b-[40px] px-6 py-20 md:py-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary dark:text-accent">
              <FiCoffee className="w-3.5 h-3.5" />
              <span>Rajasthan's Culinary Heritage</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-serif leading-tight tracking-tight text-[var(--text-main)]">
              Where Desert Warmth <br />
              Meets Modern <br />
              <span className="text-primary dark:text-accent">Lavender Bistro</span>
            </h1>
            
            <p className="text-base sm:text-lg text-[var(--text-muted)] font-light max-w-lg leading-relaxed">
              Indulge in a royal culinary oasis. Experience traditional Rajasthani ingredients prepared using fine Italian techniques and infused with calming lavender tones.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center space-x-2 bg-primary dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary text-white font-semibold py-3.5 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-primary/30 active:scale-95"
              >
                <span>Explore Menu</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center justify-center border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--border-color)] text-[var(--text-main)] font-semibold py-3.5 px-8 rounded-2xl transition-all duration-300"
              >
                Book a Table
              </Link>
            </div>
          </div>

          {/* Graphical Element / Image Showcase */}
          <div className="relative flex justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-secondary-light/40 dark:bg-secondary/10 filter blur-3xl -z-10" />
            <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-primary-light/40 dark:bg-primary/10 filter blur-2xl -z-10 animate-pulse" />

            <div className="relative animate-float max-w-md w-full aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl border-4 border-white dark:border-[var(--bg-surface)]">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
                alt="Royal Rajasthan Dessert Fusion"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. Brand Story / Heritage Storytelling */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-xl border border-[var(--border-color)]">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80" 
              alt="Cozy Cafe Ambiance"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--text-main)] leading-snug">
              A Love Affair with <span className="text-primary dark:text-accent">Rajasthan</span> & Lavender
            </h2>
            <p className="text-[var(--text-muted)] font-light leading-relaxed">
              Nestled at the base of the historic Aravali hills, **Country Side Cafe** is a tribute to heritage and modernity. We hand-source local dessert ingredients like Ker, Sangri, and Mathania red chillies directly from local farms.
            </p>
            <p className="text-[var(--text-muted)] font-light leading-relaxed">
              We complement these earthy, spiced flavors with the soothing fragrance of lavender. Our pastel themed lavender lounges offer a calming respite from the desert sun, creating a dining environment that is visually stunning and sensory-rich.
            </p>
            
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="space-y-1">
                <FiAward className="w-8 h-8 text-secondary" />
                <h4 className="font-bold text-sm text-[var(--text-main)]">Royal Quality</h4>
                <p className="text-xs text-[var(--text-muted)] font-light">Direct source farm spices</p>
              </div>
              <div className="space-y-1">
                <FiCoffee className="w-8 h-8 text-primary dark:text-accent" />
                <h4 className="font-bold text-sm text-[var(--text-main)]">Modern Vibe</h4>
                <p className="text-xs text-[var(--text-muted)] font-light">Glassmorphic lounges</p>
              </div>
              <div className="space-y-1">
                <FiShield className="w-8 h-8 text-green-500" />
                <h4 className="font-bold text-sm text-[var(--text-main)]">Eco-Minded</h4>
                <p className="text-xs text-[var(--text-muted)] font-light">Zero plastic initiative</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Featured Specialties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--text-main)]">
            Royal Featured Culinary Art
          </h2>
          <p className="text-[var(--text-muted)] font-light">
            Indulge in our absolute chef recommendations. Blending historical flavors with modern visual flair.
          </p>
        </div>

        {loading ? (
          /* Loading skeleton for featured products */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-[var(--border-color)]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-[var(--border-color)] rounded-full w-3/4" />
                  <div className="h-3 bg-[var(--border-color)] rounded-full w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            to="/menu"
            className="inline-flex items-center space-x-2 bg-secondary hover:bg-yellow-600 text-white font-bold py-3.5 px-8 rounded-2xl transition-all duration-300 shadow-md"
          >
            <span>See Full Royal Menu</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. Customer Testimonials */}
      <section className="bg-primary/5 dark:bg-primary-dark/10 py-20 px-6 rounded-[40px] max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--text-main)]">
              Patron Testimonials
            </h2>
            <p className="text-[var(--text-muted)] font-light">
              Hear what our global travelers and local critics are saying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {TESTIMONIALS.map((test) => (
              <div key={test.id} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
                <p className="text-sm text-[var(--text-main)] italic font-light leading-relaxed">
                  "{test.comment}"
                </p>
                <div className="flex items-center space-x-3.5 pt-2 border-t border-[var(--border-color)]">
                  <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-[var(--text-main)]">{test.name}</h4>
                    <p className="text-[10px] text-[var(--text-muted)]">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
