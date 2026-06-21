import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiClock, FiCheck, FiTruck, FiX, FiArrowRight, FiLock, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { fetchOrders } from '../utils/api';

const STATUS_CONFIG = {
  Pending:          { color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800', icon: FiClock },
  Preparing:        { color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', icon: FiPackage },
  'Out for Delivery': { color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800', icon: FiTruck },
  Delivered:        { color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', icon: FiCheck },
  Cancelled:        { color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', icon: FiX },
};

function OrderStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      <span>{status}</span>
    </span>
  );
}

export default function Orders() {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders(token);
      setOrders(data.results || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      loadOrders();
    }
  }, [isAuthenticated, token]);

  // ─── Not logged in ────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center mx-auto">
          <FiLock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-main)] font-serif">Login Required</h2>
        <p className="text-[var(--text-muted)]">Please log in to view your order history.</p>
        <Link to="/login" className="inline-flex items-center space-x-2 bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors">
          <span>Go to Login</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="text-left space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--text-main)]">
            My Orders
          </h1>
          <p className="text-sm text-[var(--text-muted)] font-light">
            Track all your past and current orders from the royal kitchen.
          </p>
        </div>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="flex items-center space-x-1.5 text-xs font-semibold text-primary dark:text-accent hover:underline disabled:opacity-50 pt-2"
        >
          <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-5 py-4 rounded-2xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="h-5 bg-[var(--border-color)] rounded-full w-1/4" />
                <div className="h-5 bg-[var(--border-color)] rounded-full w-20" />
              </div>
              <div className="h-3 bg-[var(--border-color)] rounded-full w-1/2" />
              <div className="h-3 bg-[var(--border-color)] rounded-full w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* No orders yet */}
      {!loading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[32px] space-y-5">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary dark:text-accent flex items-center justify-center">
            <FiPackage className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-main)]">No orders yet</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-[280px] leading-relaxed mx-auto">
              You haven't placed any orders yet. Explore our royal menu and place your first order!
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center space-x-2 bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary-dark transition-all duration-300"
          >
            <span>Browse the Menu</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Orders List */}
      {!loading && orders.length > 0 && (
        <div className="space-y-5">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const orderDate = new Date(order.orderDate).toLocaleString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            });

            return (
              <div
                key={order.id}
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Order Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold font-mono text-primary dark:text-accent text-sm">
                          CSC-{order.id}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-[var(--text-muted)] font-light">
                        Placed on {orderDate}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] font-light">
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''} •{' '}
                        <span className="font-semibold text-[var(--text-main)]">
                          ₹{parseFloat(order.totalAmount).toFixed(0)}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {order.paymentStatus}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-light hidden sm:inline">
                        {order.paymentMethod}
                      </span>
                      <FiArrowRight
                        className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {isExpanded && (
                  <div className="border-t border-[var(--border-color)] px-6 pb-6 pt-5 space-y-5 bg-[var(--bg-main)]">

                    {/* Order items */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Items Ordered</h4>
                      <div className="divide-y divide-[var(--border-color)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                        {(order.items || []).map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 p-4 bg-[var(--bg-surface)]">
                            {item.product?.image && (
                              <img
                                src={item.product.image}
                                alt={item.product?.name}
                                className="w-14 h-14 rounded-xl object-cover border border-[var(--border-color)] flex-shrink-0"
                              />
                            )}
                            <div className="flex-grow">
                              <p className="font-semibold text-sm text-[var(--text-main)]">
                                {item.product?.name || 'Product'}
                              </p>
                              <p className="text-xs text-[var(--text-muted)] font-light">
                                ₹{parseFloat(item.price).toFixed(0)} × {item.quantity}
                              </p>
                            </div>
                            <span className="font-bold text-sm text-[var(--text-main)]">
                              ₹{(parseFloat(item.price) * item.quantity).toFixed(0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 text-left">
                        <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Delivery Info</h4>
                        <p className="text-sm text-[var(--text-main)] font-medium">{order.fullName}</p>
                        <p className="text-xs text-[var(--text-muted)] font-light">{order.phone}</p>
                        <p className="text-xs text-[var(--text-muted)] font-light">
                          {order.streetAddress}, {order.city} — {order.postalCode}, {order.state}
                        </p>
                      </div>
                      <div className="space-y-3.5 text-right text-sm border-l border-[var(--border-color)] pl-4">
                        <div className="flex justify-between text-xs text-[var(--text-muted)]">
                          <span>Subtotal</span>
                          <span className="font-semibold text-[var(--text-main)]">
                            ₹{(parseFloat(order.totalAmount) / 1.05).toFixed(0)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-[var(--text-muted)]">
                          <span>GST (5%)</span>
                          <span className="font-semibold text-[var(--text-main)]">
                            ₹{(parseFloat(order.totalAmount) - parseFloat(order.totalAmount) / 1.05).toFixed(0)}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-[var(--text-main)] border-t border-[var(--border-color)] pt-2">
                          <span>Total Paid</span>
                          <span className="text-primary dark:text-accent font-serif">
                            ₹{parseFloat(order.totalAmount).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
