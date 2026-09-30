import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, loginAsDemo } = useTrading();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'forgot') {
      if (!email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      setSuccessMsg(`Password reset link sent to ${email}. Check your inbox.`);
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      await register(name.trim(), email.trim(), password);
      onClose();
    } else {
      await login(email.trim(), password);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-dark-card border border-dark-border w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-dark-muted hover:text-white rounded-lg hover:bg-dark-surface"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-blue-600 text-white shadow-glow-green mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back to TradeKit' : mode === 'register' ? 'Create Trader Workspace' : 'Reset Password'}
          </h2>
          <p className="text-xs text-dark-muted">
            {mode === 'login'
              ? 'Enter your credentials to access your private trading ledger.'
              : mode === 'register'
              ? 'Your private data is isolated and protected.'
              : 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        {mode !== 'forgot' && (
          <div className="p-3.5 bg-gradient-to-r from-blue-900/30 to-emerald-900/30 border border-blue-500/30 rounded-2xl flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-white block">Want to explore instantly?</span>
              <span className="text-[11px] text-dark-muted">Pre-filled with realistic trades & metrics</span>
            </div>
            <button
              type="button"
              onClick={() => {
                loginAsDemo();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Login</span>
            </button>
          </div>
        )}

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div>
              <label className="text-dark-muted block mb-1 font-medium">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl pl-9 pr-3 py-2.5 text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-dark-muted block mb-1 font-medium">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                placeholder="trader@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark-surface border border-dark-border rounded-xl pl-9 pr-3 py-2.5 text-white"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-dark-muted font-medium">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-blue-400 hover:text-blue-300 text-[11px]"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-xl pl-9 pr-3 py-2.5 text-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5"
          >
            {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-dark-muted pt-2 border-t border-dark-border">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-blue-400 font-semibold hover:underline"
              >
                Sign up free
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-blue-400 font-semibold hover:underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
