import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingBag } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400 animate-ping opacity-25" />
        </div>
        <p className="text-sm font-semibold text-neutral-700">Verifying your session...</p>
        <p className="text-xs text-neutral-400 mt-1">Please wait a moment</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
