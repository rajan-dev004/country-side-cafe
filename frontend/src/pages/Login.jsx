import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forms
  const [fields, setFields] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    // Django username: only letters, numbers, @/./+/-/_ allowed — NO spaces
    if (name === 'username') {
      value = value.replace(/\s+/g, '_'); // replace spaces with underscore
    }
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (isRegister) {
      if (fields.password !== fields.confirmPassword) {
        setErrorMsg('Passwords do not match');
        setLoading(false);
        return;
      }
      const res = await register(fields.username, fields.email, fields.password);
      if (res.success) {
        navigate('/');
      } else {
        setErrorMsg(res.error || 'Registration failed');
      }
    } else {
      const res = await login(fields.username || fields.email, fields.password);
      if (res.success) {
        navigate('/');
      } else {
        setErrorMsg(res.error || 'Invalid username or password');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden bg-gradient-to-tr from-primary-light/20 via-[var(--bg-main)] to-secondary-light/10">
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-60 h-60 rounded-full bg-primary-light/40 dark:bg-primary-dark/20 filter blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-secondary-light/30 dark:bg-secondary/10 filter blur-3xl -z-10" />

      {/* Card */}
      <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[32px] p-8 sm:p-10 shadow-xl relative z-10 glass">
        
        {/* Logo Style Header */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold font-serif text-primary dark:text-accent">
            {isRegister ? 'Join the Royal Family' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-light">
            {isRegister 
              ? 'Register to track orders and save your favorite dishes.' 
              : 'Sign in to access your saved favorites & basket checkout.'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-500 border border-red-200 dark:border-red-900/50 p-3.5 rounded-2xl text-xs font-semibold text-left mb-6 whitespace-pre-line">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Username (Register or Login) */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              {isRegister ? 'Choose Username' : 'Username or Email'}
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
              <input
                type="text"
                required
                name="username"
                value={fields.username}
                onChange={handleChange}
                placeholder={isRegister ? 'e.g. pratap_singh' : 'e.g. pratap@jaipur.com'}
                className="w-full pl-11 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm placeholder-[var(--text-muted)]"
              />
            </div>
            {isRegister && (
              <p className="text-[10px] text-[var(--text-muted)] mt-1 pl-1">
                Only letters, numbers, and <code>_ . - @</code> allowed. No spaces.
              </p>
            )}
          </div>

          {/* Email (Register only) */}
          {isRegister && (
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                <input
                  type="email"
                  required
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
                  placeholder="e.g. pratap@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm placeholder-[var(--text-muted)]"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Password</label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => alert('Demo Feature: In a production app, this would send a reset link to your registered email.')}
                  className="text-[10px] font-bold text-primary dark:text-accent hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
              <input
                type="password"
                required
                name="password"
                value={fields.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Confirm Password (Register only) */}
          {isRegister && (
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  value={fields.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-sm"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-1.5 py-3.5 bg-primary dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary text-white font-semibold rounded-2xl shadow-md transition-all active:scale-95 mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Google Sign-In */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-color)]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[var(--bg-surface)] text-[var(--text-muted)] font-medium uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                setErrorMsg('');
                const res = await loginWithGoogle(credentialResponse.credential);
                if (res.success) {
                  navigate('/');
                } else {
                  setErrorMsg(res.error || 'Google Sign-In failed');
                }
              }}
              onError={() => {
                setErrorMsg('Google Sign-In was unsuccessful. Try again later.');
              }}
              theme="outline"
              size="large"
              shape="pill"
              text={isRegister ? "signup_with" : "signin_with"}
              width="300"
            />
          </div>
        </div>

        {/* Toggle Footer */}
        <div className="mt-8 border-t border-[var(--border-color)] pt-6 text-center text-xs text-[var(--text-muted)]">
          {isRegister ? (
            <p>
              Already have a royal profile?{' '}
              <button
                onClick={() => {
                  setIsRegister(false);
                  setErrorMsg('');
                }}
                className="font-bold text-primary dark:text-accent hover:underline focus:outline-none"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to Country Side Cafe?{' '}
              <button
                onClick={() => {
                  setIsRegister(true);
                  setErrorMsg('');
                }}
                className="font-bold text-primary dark:text-accent hover:underline focus:outline-none"
              >
                Create Account
              </button>
            </p>
          )}
        </div>

      </div>

    </div>
  );
}
