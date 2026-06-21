import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiPlus, FiMinus, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  // Prevent background scrolling when cart sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md transform transition-all duration-300 slide-in-right">
          <div className="h-full flex flex-col bg-[var(--bg-surface)] shadow-2xl border-l border-[var(--border-color)]">
            
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
              <h2 className="text-xl font-bold font-serif text-[var(--text-main)] flex items-center">
                Your Basket 
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-light text-primary dark:bg-primary/20 dark:text-accent">
                  {cartCount} items
                </span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-[var(--border-color)] text-[var(--text-main)] transition-colors"
                aria-label="Close cart"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 divide-y divide-[var(--border-color)]">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary-light/30 flex items-center justify-center text-primary dark:text-accent">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-main)]">Your cart is empty</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1 max-w-[240px]">
                      Add some of our Rajasthan royal delicacies to get started!
                    </p>
                  </div>
                  <Link
                    to="/menu"
                    onClick={onClose}
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-all duration-300"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="py-5 flex space-x-4">
                    {/* Item Image */}
                    <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--border-color)]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-bold text-[var(--text-main)] line-clamp-1">{item.name}</h4>
                        <span className="text-sm font-bold text-primary dark:text-primary-light">₹{item.price * item.quantity}</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">₹{item.price} each</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-[var(--border-color)] rounded-lg overflow-hidden bg-[var(--bg-main)]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-[var(--border-color)] text-[var(--text-main)] transition-colors"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-[var(--text-main)]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-[var(--border-color)] text-[var(--text-main)] transition-colors"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          aria-label="Remove item"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="border-t border-[var(--border-color)] p-6 space-y-4 bg-[var(--bg-main)]">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-muted)]">Subtotal</span>
                  <span className="text-lg font-bold text-[var(--text-main)]">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-muted)]">Est. CGST & SGST (5%)</span>
                  <span className="text-sm font-semibold text-[var(--text-main)]">₹{Math.round(cartTotal * 0.05)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]">
                  <span className="font-bold text-[var(--text-main)]">Total Amount</span>
                  <span className="text-xl font-bold text-primary dark:text-accent font-serif">₹{Math.round(cartTotal * 1.05)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="w-full flex items-center justify-center py-3 border border-[var(--border-color)] text-[var(--text-main)] font-semibold rounded-2xl hover:bg-[var(--border-color)] transition-all duration-300"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="w-full flex items-center justify-center space-x-1.5 py-3 bg-secondary hover:bg-yellow-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                  >
                    <span>Checkout</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
