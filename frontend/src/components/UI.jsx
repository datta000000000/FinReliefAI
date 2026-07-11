import React from 'react';
import { Loader2, Inbox, AlertTriangle } from 'lucide-react';

// === Card Component ===
export const Card = ({ children, className = '', title, headerAction }) => {
  return (
    <div className={`glass-card rounded-3xl p-6 shadow-xl transition-all duration-300 hover:shadow-glow-gold/[0.03] animate-fade-in ${className}`}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.05]">
          {title && <h3 className="font-display font-bold text-base text-white tracking-tight">{title}</h3>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

// === Button Component ===
export const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = ''
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-brand-accent to-brand-accentLight text-black hover:opacity-90 hover:shadow-lg hover:shadow-brand-accent/20 focus:ring-brand-accent border-none',
    secondary: 'bg-[#1A1D24] hover:bg-[#2E333F] text-slate-200 border border-white/[0.04] focus:ring-slate-500',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white hover:shadow-lg hover:shadow-red-500/20 focus:ring-red-500 border-none',
    outline: 'bg-transparent border border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10 focus:ring-brand-accent',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// === Loading Spinner ===
export const Spinner = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center p-6 ${className}`}>
      <Loader2 className={`${sizes[size]} text-brand-accent animate-spin`} />
    </div>
  );
};

// === Skeleton Loader ===
export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx} 
          className={`h-4 bg-[#232D42] rounded-lg animate-pulse w-full ${className}`}
        />
      ))}
    </div>
  );
};

// === Empty State ===
export const EmptyState = ({ title = 'No data available', description = 'Try adding a new entry to get started.' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-white/[0.06] bg-[#1A1D24]/20 max-w-md mx-auto animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-[#232D42] flex items-center justify-center mb-4">
        <Inbox className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-bold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-xs">{description}</p>
    </div>
  );
};

// === Error State ===
export const ErrorState = ({ message = 'An error occurred while loading data.', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-red-950/10 border border-red-900/30 max-w-md mx-auto animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      <h3 className="text-sm font-bold text-red-200 mb-1">Execution Failed</h3>
      <p className="text-xs text-red-400/80 mb-5 max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

// === Form Helpers ===
export const FormField = ({ label, error, children, className = '' }) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>}
      {children}
      {error && <span className="block text-[10px] font-semibold text-red-400 mt-1">{error}</span>}
    </div>
  );
};

export const Input = React.forwardRef(({ type = 'text', className = '', ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`w-full px-4 py-3.5 rounded-xl bg-[#0F1115]/60 border border-white/[0.04] text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:bg-[#0F1115]/90 transition-all duration-200 ${className}`}
      {...props}
    />
  );
});

export const Select = React.forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`w-full px-4 py-3.5 rounded-xl bg-[#0F1115]/60 border border-white/[0.04] text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:bg-[#0F1115]/90 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

export const Textarea = React.forwardRef(({ className = '', rows = 4, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`w-full px-4 py-3.5 rounded-xl bg-[#0F1115]/60 border border-white/[0.04] text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:bg-[#0F1115]/90 transition-all duration-200 ${className}`}
      {...props}
    />
  );
});
