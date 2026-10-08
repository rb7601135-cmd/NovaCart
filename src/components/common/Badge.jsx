import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    sale: 'bg-rose-50 text-rose-700 border-rose-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    dark: 'bg-neutral-900 text-white border-neutral-900',
    outline: 'bg-white/80 backdrop-blur-sm text-neutral-800 border-neutral-200 shadow-xs'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border ${
        variants[variant] || variants.primary
      } ${className}`}
    >
      {children}
    </span>
  );
};
