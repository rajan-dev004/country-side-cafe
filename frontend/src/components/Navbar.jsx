import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSun, FiMoon, FiLogOut, FiClipboard } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar({ onCartToggle }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setProfileDropdown(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full transition-colors duration-300 border-b border-[var(--border-color)] glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold font-serif tracking-wide text-primary dark:text-primary-light transition-transform duration-300 group-hover:scale-105">
              Country Side <span className="text-secondary">Cafe</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className={`font-medium transition-colors duration-200 ${
                isActive('/') ? 'text-primary dark:text-accent font-semibold' : 'text-[var(--text-muted)] hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`font-medium transition-colors duration-200 ${
                isActive('/menu') ? 'text-primary dark:text-accent font-semibold' : 'text-[var(--text-muted)] hover:text-primary'
              }`}
            >
              Menu
            </Link>
            <Link
              to="/wishlist"
              className={`font-medium transition-colors duration-200 ${
                isActive('/wishlist') ? 'text-primary dark:text-accent font-semibold' : 'text-[var(--text-muted)] hover:text-primary'
              }`}
            >
              Wishlist
            </Link>
            {isAuthenticated && (
              <Link
                to="/orders"
                className={`font-medium transition-colors duration-200 ${
                  isActive('/orders') ? 'text-primary dark:text-accent font-semibold' : 'text-[var(--text-muted)] hover:text-primary'
                }`}
              >
                My Orders
              </Link>
            )}
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-[var(--border-color)] text-[var(--text-main)] transition-all duration-300"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <FiSun className="w-5 h-5 text-secondary" /> : <FiMoon className="w-5 h-5 text-primary" />}
            </button>

            {/* Wishlist Link Badge */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full hover:bg-[var(--border-color)] text-[var(--text-main)] transition-all duration-300"
              aria-label="Wishlist"
            >
              <FiHeart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-primary dark:bg-accent rounded-full animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart trigger badge */}
            <button
              onClick={onCartToggle}
              className="relative p-2.5 rounded-full hover:bg-[var(--border-color)] text-[var(--text-main)] transition-all duration-300"
              aria-label="Cart"
            >
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-secondary rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center space-x-2 p-2.5 rounded-full hover:bg-[var(--border-color)] text-[var(--text-main)] transition-all duration-300"
                  >
                    <FiUser className="w-5 h-5 text-primary dark:text-accent" />
                    <span className="text-sm font-medium hidden lg:inline max-w-[80px] truncate">{user.username}</span>
                  </button>
                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl border border-[var(--border-color)] bg-[var(--bg-surface)] py-1 ring-1 ring-black ring-opacity-5 transition-all duration-200">
                      <div className="px-4 py-2 border-b border-[var(--border-color)]">
                        <p className="text-xs text-[var(--text-muted)]">Signed in as</p>
                        <p className="text-sm font-semibold truncate text-[var(--text-main)]">{user.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setProfileDropdown(false)}
                        className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-[var(--border-color)] text-[var(--text-main)] transition-colors duration-150"
                      >
                        <FiClipboard className="w-4 h-4 text-primary dark:text-accent" />
                        <span>My Orders</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-[var(--border-color)] text-red-500 transition-colors duration-150"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-5 py-2.5 bg-primary dark:bg-primary-dark text-white rounded-full font-medium hover:bg-primary-dark dark:hover:bg-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[var(--text-main)] hover:bg-[var(--border-color)]"
            >
              {isDarkMode ? <FiSun className="w-5 h-5 text-secondary" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <button
              onClick={onCartToggle}
              className="relative p-2 rounded-full text-[var(--text-main)] hover:bg-[var(--border-color)]"
            >
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-secondary rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-[var(--text-main)] hover:bg-[var(--border-color)]"
              aria-label="Main menu"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden transition-all duration-300 bg-[var(--bg-surface)] border-t border-[var(--border-color)] py-4 px-6 space-y-3">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`block py-2 text-lg font-medium ${
              isActive('/') ? 'text-primary' : 'text-[var(--text-muted)]'
            }`}
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setIsOpen(false)}
            className={`block py-2 text-lg font-medium ${
              isActive('/menu') ? 'text-primary' : 'text-[var(--text-muted)]'
            }`}
          >
            Menu
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setIsOpen(false)}
            className={`block py-2 text-lg font-medium ${
              isActive('/wishlist') ? 'text-primary' : 'text-[var(--text-muted)]'
            }`}
          >
            Wishlist
          </Link>
          {isAuthenticated && (
            <Link
              to="/orders"
              onClick={() => setIsOpen(false)}
              className={`block py-2 text-lg font-medium ${
                isActive('/orders') ? 'text-primary' : 'text-[var(--text-muted)]'
              }`}
            >
              My Orders
            </Link>
          )}
          <div className="border-t border-[var(--border-color)] pt-4 mt-2">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 py-1">
                  <FiUser className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-full border border-red-500 text-red-500 hover:bg-red-50"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-primary text-white rounded-full font-medium"
              >
                <FiUser className="w-4 h-4" />
                <span>Login / Register</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
