import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowRight, FiPercent } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0); // in Rupees
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });

  const applyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'PADHARO') {
      const discAmt = Math.round(cartTotal * 0.15); // 15% discount
      setDiscount(discAmt);
      setCouponMsg({ type: 'success', text: `Royal coupon applied! You saved ₹${discAmt} (15% Off).` });
    } else {
      setDiscount(0);
      setCouponMsg({ type: 'error', text: 'Invalid coupon. Try the royal code "PADHARO".' });
    }
  };

  const gst = Math.round((cartTotal - discount) * 0.05); // 5% GST
  const grandTotal = cartTotal - discount + gst;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--text-main)]">
          Your Culinary Selection
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-light">
          Review your items before checking out.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[32px] space-y-5">
          <div className="w-16 h-16 rounded-full bg-primary-light/30 text-primary dark:text-accent flex items-center justify-center">
            <FiShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-main)]">Your cart is empty</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-[280px] leading-relaxed mx-auto">
              You haven't selected any dishes yet. Head back to the menu to explore!
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center space-x-2 bg-primary text-white font-semibold py-3.5 px-8 rounded-2xl hover:bg-primary-dark transition-all duration-300"
          >
            <span>Browse Royal Menu</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left">
          
          {/* Items Table / List */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Action panel */}
            <div className="flex justify-between items-center bg-[var(--bg-surface)] border border-[var(--border-color)] px-6 py-4 rounded-2xl">
              <span className="font-semibold text-sm text-[var(--text-main)]">Selected Items ({cart.length})</span>
              <button
                onClick={clearCart}
                className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Cart Card Grid */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl overflow-hidden divide-y divide-[var(--border-color)] shadow-sm">
              {cart.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[var(--border-color)] flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Detail */}
                  <div className="flex-grow space-y-1">
                    <h3 className="font-bold text-base text-[var(--text-main)] font-serif leading-snug">{item.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] font-light">Category: {item.category}</p>
                    <p className="text-sm font-semibold text-primary dark:text-primary-light">₹{item.price}</p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-main)] p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-[var(--border-color)] text-[var(--text-main)] rounded-lg transition-colors"
                      >
                        <FiMinus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-sm font-bold text-[var(--text-main)]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-[var(--border-color)] text-[var(--text-main)] rounded-lg transition-colors"
                      >
                        <FiPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-base text-[var(--text-main)] w-16 text-right">
                        ₹{item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        aria-label="Remove item"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>

          {/* Checkout Summary panel */}
          <div className="space-y-6">
            
            {/* Promo Code box */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-[var(--text-main)] flex items-center space-x-1.5">
                <FiPercent className="text-secondary w-4 h-4" />
                <span>Promo / Coupon Code</span>
              </h3>
              <form onSubmit={applyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code (e.g. PADHARO)"
                  className="flex-grow px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-primary uppercase font-bold"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </form>
              {couponMsg.text && (
                <p className={`text-xs text-left font-medium ${couponMsg.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Receipt invoice summary */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="font-bold text-base text-[var(--text-main)] border-b border-[var(--border-color)] pb-3 font-serif">
                Bill Details
              </h3>
              <div className="space-y-3.5 text-sm font-light text-[var(--text-muted)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--text-main)]">₹{cartTotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500 font-medium">
                    <span>Royal Discount (15%)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST & Restaurant Charges (5%)</span>
                  <span className="font-semibold text-[var(--text-main)]">₹{gst}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-500 font-semibold uppercase">Free</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[var(--border-color)] text-base">
                  <span className="font-bold text-[var(--text-main)]">To Pay</span>
                  <span className="text-xl font-bold text-primary dark:text-accent font-serif">₹{grandTotal}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center space-x-1.5 py-4 bg-secondary hover:bg-yellow-600 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <FiArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
