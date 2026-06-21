import React, { useState, useEffect } from 'react';
import { FiX, FiSend } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../utils/api';

export default function MailPopup({ isOpen, onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    from: user?.email || '',
    subject: '',
    body: ''
  });
  const [status, setStatus] = useState('idle');

  // Keep the 'from' field synced if the user logs in/out after the component mounts
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, from: user.email }));
    } else {
      setFormData(prev => ({ ...prev, from: '' }));
    }
  }, [user?.email]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      await apiRequest('/auth/contact/', 'POST', formData);
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData(prev => ({...prev, subject: '', body: ''}));
      }, 2000);
    } catch (err) {
      alert(err.message || 'Failed to send message. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="absolute bottom-full left-0 mb-3 w-[280px] sm:w-[320px] bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 text-left glass animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Speech bubble pointer */}
      <div className="absolute -bottom-2 left-6 w-4 h-4 bg-[var(--bg-surface)] border-b border-r border-[var(--border-color)] transform rotate-45"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-color)] bg-primary/5 rounded-t-2xl">
        <h4 className="font-serif font-bold text-primary dark:text-accent">Drop a Message</h4>
        <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-primary transition-colors focus:outline-none">
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        {status === 'success' ? (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-2 animate-in fade-in zoom-in duration-300">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
              <FiSend className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-green-600 dark:text-green-400 font-semibold text-sm">Message Sent Successfully!</p>
            <p className="text-[10px] text-[var(--text-muted)]">We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">To</label>
              <input 
                type="text" 
                readOnly 
                value="rajankumawat123@gmail.com" 
                className="w-full px-3 py-2 bg-[var(--bg-main)] opacity-70 text-[var(--text-muted)] border border-[var(--border-color)] rounded-xl text-xs cursor-not-allowed" 
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">From</label>
              <input 
                type="email" 
                required 
                readOnly={!!user?.email}
                value={formData.from}
                onChange={e => setFormData({...formData, from: e.target.value})}
                placeholder="Your email address"
                className={`w-full px-3 py-2 border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-xs placeholder-[var(--text-muted)] transition-colors ${
                  user?.email ? 'bg-[var(--bg-main)] opacity-70 text-[var(--text-muted)] cursor-not-allowed' : 'bg-[var(--bg-main)]'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Subject</label>
              <input 
                type="text" 
                required
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                placeholder="What is this regarding?"
                className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-xs placeholder-[var(--text-muted)] transition-colors" 
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Message</label>
              <textarea 
                required
                rows={3}
                value={formData.body}
                onChange={e => setFormData({...formData, body: e.target.value})}
                placeholder="Write your message here..."
                className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] focus:border-primary focus:outline-none rounded-xl text-xs placeholder-[var(--text-muted)] resize-none transition-colors" 
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status === 'sending'}
              className="w-full mt-2 bg-secondary hover:bg-yellow-600 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:active:scale-100"
            >
              {status === 'sending' ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Mail</span>
                  <FiSend className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
