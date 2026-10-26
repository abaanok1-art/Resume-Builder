import React, { useState } from 'react';
import './AuthModal.css';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your name');
        if (!email.trim()) throw new Error('Please enter your email');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');

        await signup(name, email, password);
      } else {
        if (!email.trim()) throw new Error('Please enter your email');
        if (!password) throw new Error('Please enter your password');

        await login(email, password);
      }

      // Success
      setName('');
      setEmail('');
      setPassword('');
      if (onAuthSuccess) onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="auth-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="auth-header">
          <div className="auth-badge">
            <Sparkles size={12} className="cyan-sparkle" />
            <span>RESUME BUILDER CLOUD</span>
          </div>
          <h2 className="auth-title">
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'signup' 
              ? 'Save your resumes safely to your cloud account and access them anytime.'
              : 'Sign in to access and sync your saved resumes.'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="auth-tab-switch">
          <button 
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-error-banner">
            <AlertCircle size={16} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Sign Up Name Field */}
          {mode === 'signup' && (
            <div className="auth-input-group">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrap">
                <User size={17} className="auth-input-icon" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  required
                  className="auth-input"
                />
              </div>
            </div>
          )}

          {/* Email Field (Both) */}
          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={17} className="auth-input-icon" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="auth-input"
              />
            </div>
          </div>

          {/* Password Field (Both) */}
          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <Lock size={17} className="auth-input-icon" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                required
                className="auth-input"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="auth-submit-btn" 
            disabled={loading}
          >
            {loading ? (
              <span className="auth-spinner">Processing...</span>
            ) : (
              <>
                <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Footer switch text */}
        <div className="auth-footer-prompt">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('login')} className="auth-link-btn">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button type="button" onClick={() => switchMode('signup')} className="auth-link-btn">
                Create one now
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
