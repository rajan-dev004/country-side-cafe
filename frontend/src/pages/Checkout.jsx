import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCreditCard, FiTruck, FiArrowLeft, FiShoppingBag, FiCheckCircle, FiLock } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../utils/api';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { token, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Form states — fields match the Django Order model
  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    phone: '',
    streetAddress: '',
    city: 'Jaipur',
    postalCode: '',
    state: 'Rajasthan',
    deliveryMethod: 'delivery',
    paymentMethod: 'Mock Payment',
  });

  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [paymentMode, setPaymentMode] = useState('card'); // UI-only selector

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderError, setOrderError] = useState('');

  // ─── Redirect if not logged in ────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center mx-auto">
          <FiLock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-main)] font-serif">Login Required</h2>
        <p className="text-[var(--text-muted)]">Please log in to place your order.</p>
        <Link to="/login" className="inline-flex items-center space-x-2 bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors">
          <span>Go to Login</span>
        </Link>
      </div>
    );
  }

  if (cart.length === 0 && !isCompleted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-main)] font-serif">Checkout Empty</h2>
        <p className="text-[var(--text-muted)]">You don't have any items to checkout. Visit the menu to choose dishes.</p>
        <Link to="/menu" className="inline-flex items-center space-x-2 bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors">
          <FiArrowLeft />
          <span>Go to Menu</span>
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setOrderError('');

    // Build the payload matching Django's Order model fields
    const orderPayload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      streetAddress: formData.deliveryMethod === 'delivery' ? formData.streetAddress : 'Dine-In / Pickup',
      city: formData.city,
      postalCode: formData.postalCode || '000000',
      state: formData.state,
      paymentMethod:
        paymentMode === 'card' ? 'Card Payment' : paymentMode === 'upi' ? 'UPI Payment' : 'Cash on Delivery',
    };

    try {
      const order = await createOrder(orderPayload, token);
      setOrderId(`CSC-${order.id}`);
      setIsCompleted(true);
      clearCart(); // clear local cart state (server cart was already cleared by backend)
    } catch (err) {
      setOrderError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const gst = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + gst;

  // ─── Order Success Screen ─────────────────────────────────────────────────
  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-8 animate-fade-in">
        <div className="flex justify-center">
          <FiCheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold font-serif text-[var(--text-main)]">Order Placed Successfully!</h1>
          <p className="text-sm text-[var(--text-muted)] font-light leading-relaxed">
            Thank you for dining with Country Side Cafe. Your order has been registered in the royal kitchen.
          </p>
          <div className="bg-primary/5 dark:bg-primary/10 border border-[var(--border-color)] p-4 rounded-2xl inline-block">
            <span className="text-xs text-[var(--text-muted)] font-semibold uppercase block">Order ID</span>
            <span className="font-bold text-lg text-primary dark:text-accent font-mono">{orderId}</span>
          </div>
        </div>

        <div className="border-t border-[var(--border-color)] pt-6 text-left space-y-3">
          <h4 className="font-bold text-sm text-[var(--text-main)]">Delivery Information</h4>
          <p className="text-xs font-light text-[var(--text-muted)]">
            <strong>Customer:</strong> {formData.fullName} <br />
            <strong>Contact:</strong> {formData.phone} <br />
            <strong>Mode:</strong> {formData.deliveryMethod === 'delivery' ? 'Home Delivery (30–40 mins)' : 'Dine-In / Table Pickup'} <br />
            {formData.deliveryMethod === 'delivery' && (
              <><strong>Address:</strong> {formData.streetAddress}, {formData.city}</>
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/orders"
            className="flex-1 inline-flex items-center justify-center bg-primary text-white font-semibold py-3.5 px-6 rounded-2xl hover:bg-primary-dark transition-colors shadow-md"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center border border-[var(--border-color)] text-[var(--text-main)] font-semibold py-3.5 px-6 rounded-2xl hover:bg-[var(--border-color)] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ─── Checkout Form ────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--text-main)]">
          Royal Checkout
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-light">
          Fill in details to place your custom bistro order.
        </p>
      </div>

      {/* Error alert */}
      {orderError && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-5 py-4 rounded-2xl text-sm font-medium">
          ⚠️ {orderError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left items-start">
        
        {/* Left Column: Input Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Customer Details */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-8 rounded-3xl shadow-sm space-y-5">
            <h3 className="font-bold text-lg text-[var(--text-main)] border-b border-[var(--border-color)] pb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center text-xs font-bold">1</span>
              <span>Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-[var(--text-muted)]">Full Name</label>
                <input
                  type="text" required name="fullName"
                  value={formData.fullName} onChange={handleInputChange}
                  placeholder="e.g. Maharana Pratap"
                  className="px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm transition-colors"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-[var(--text-muted)]">Phone Number</label>
                <input
                  type="tel" required name="phone"
                  value={formData.phone} onChange={handleInputChange}
                  placeholder="e.g. +91 9999999999"
                  className="px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-[var(--text-muted)]">Email Address</label>
                <input
                  type="email" required name="email"
                  value={formData.email} onChange={handleInputChange}
                  placeholder="e.g. royal@jaipur.com"
                  className="px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm transition-colors"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-[var(--text-muted)]">State</label>
                <input
                  type="text" required name="state"
                  value={formData.state} onChange={handleInputChange}
                  placeholder="e.g. Rajasthan"
                  className="px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Details */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-8 rounded-3xl shadow-sm space-y-5">
            <h3 className="font-bold text-lg text-[var(--text-main)] border-b border-[var(--border-color)] pb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center text-xs font-bold">2</span>
              <span>Delivery Preferences</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, deliveryMethod: 'delivery' }))}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                  formData.deliveryMethod === 'delivery'
                    ? 'border-primary bg-primary/5 dark:bg-primary/15 text-primary dark:text-accent font-semibold shadow-sm'
                    : 'border-[var(--border-color)] hover:border-primary text-[var(--text-muted)]'
                }`}
              >
                <FiTruck className="w-6 h-6 mb-2" />
                <span className="text-sm">Home Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, deliveryMethod: 'pickup' }))}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                  formData.deliveryMethod === 'pickup'
                    ? 'border-primary bg-primary/5 dark:bg-primary/15 text-primary dark:text-accent font-semibold shadow-sm'
                    : 'border-[var(--border-color)] hover:border-primary text-[var(--text-muted)]'
                }`}
              >
                <FiShoppingBag className="w-6 h-6 mb-2" />
                <span className="text-sm">Dine-in / Pickup</span>
              </button>
            </div>

            {formData.deliveryMethod === 'delivery' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="sm:col-span-2 flex flex-col space-y-1">
                  <label className="text-xs font-bold text-[var(--text-muted)]">Street Address</label>
                  <input
                    type="text" required name="streetAddress"
                    value={formData.streetAddress} onChange={handleInputChange}
                    placeholder="e.g. 102 Royal Palace Road, C-Scheme"
                    className="px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:col-span-1">
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-[var(--text-muted)]">City</label>
                    <input
                      type="text" required name="city"
                      value={formData.city} onChange={handleInputChange}
                      placeholder="Jaipur"
                      className="px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-[var(--text-muted)]">PIN Code</label>
                    <input
                      type="text" required name="postalCode"
                      value={formData.postalCode} onChange={handleInputChange}
                      placeholder="302001"
                      className="px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Payment */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-8 rounded-3xl shadow-sm space-y-5">
            <h3 className="font-bold text-lg text-[var(--text-main)] border-b border-[var(--border-color)] pb-3 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center text-xs font-bold">3</span>
              <span>Mock Payment Options</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {['card', 'upi', 'cod'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  className={`py-3 px-2 rounded-xl border text-xs font-semibold text-center transition-all uppercase ${
                    paymentMode === mode
                      ? 'border-primary bg-primary/5 dark:bg-primary/15 text-primary dark:text-accent'
                      : 'border-[var(--border-color)] text-[var(--text-muted)]'
                  }`}
                >
                  {mode === 'card' ? 'Debit/Credit' : mode === 'upi' ? 'UPI Pay' : 'Cash On Del.'}
                </button>
              ))}
            </div>

            {paymentMode === 'card' && (
              <div className="space-y-4 pt-2 bg-[var(--bg-main)] p-4 rounded-2xl border border-[var(--border-color)]">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)]">Card Number</label>
                  <input
                    type="text" required name="number"
                    value={cardDetails.number} onChange={handleCardChange}
                    placeholder="4111 2222 3333 4444"
                    className="px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-[var(--text-muted)]">Expiry Date</label>
                    <input
                      type="text" required name="expiry"
                      value={cardDetails.expiry} onChange={handleCardChange}
                      placeholder="MM/YY"
                      className="px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold text-[var(--text-muted)]">CVV</label>
                    <input
                      type="password" required maxLength="3" name="cvv"
                      value={cardDetails.cvv} onChange={handleCardChange}
                      placeholder="***"
                      className="px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMode === 'upi' && (
              <div className="space-y-3 pt-2 bg-[var(--bg-main)] p-4 rounded-2xl border border-[var(--border-color)]">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)]">Virtual Payment Address (UPI ID)</label>
                  <input
                    type="text" required value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. jaipur@paytm"
                    className="px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm"
                  />
                </div>
              </div>
            )}

            {paymentMode === 'cod' && (
              <div className="pt-2 text-xs text-[var(--text-muted)] font-light leading-relaxed">
                You have opted for Cash/Pay on Delivery. Please pay the delivery agent or cafe billing desk directly.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Invoice Review */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-bold text-base text-[var(--text-main)] border-b border-[var(--border-color)] pb-3 font-serif">
              Order Details
            </h3>

            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm font-light">
                  <div className="max-w-[70%]">
                    <span className="font-bold text-primary dark:text-accent mr-1">x{item.quantity}</span>
                    <span className="text-[var(--text-main)]">{item.name}</span>
                  </div>
                  <span className="font-semibold text-[var(--text-main)]">₹{(parseFloat(item.price) * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3.5 border-t border-[var(--border-color)] pt-4 text-xs font-light text-[var(--text-muted)]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[var(--text-main)]">₹{cartTotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST & Services (5%)</span>
                <span className="font-semibold text-[var(--text-main)]">₹{gst}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-500 font-semibold uppercase">Free</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-[var(--border-color)] pt-3">
                <span className="font-bold text-[var(--text-main)]">Grand Total</span>
                <span className="text-lg font-bold text-primary dark:text-accent font-serif">₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-secondary hover:bg-yellow-600'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <FiCreditCard className="w-5 h-5" />
                  <span>Pay & Order Now</span>
                </>
              )}
            </button>

          </div>
        </div>

      </form>

    </div>
  );
}
