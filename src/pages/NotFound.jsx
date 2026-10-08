import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Home } from 'lucide-react';


export const NotFound = () => {
  return (
    <div className="bg-neutral-50 min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 text-center border border-neutral-200/80 shadow-xs">
        <span className="text-6xl font-black text-indigo-600 tracking-tight block mb-2">404</span>
        <h1 className="text-xl font-bold text-neutral-900 mb-2">Page Not Found</h1>
        <p className="text-xs text-neutral-500 mb-8 leading-relaxed">
          The requested page could not be located in our catalogue directory.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Home Page
          </Link>
          <Link
            to="/shop"
            className="px-5 py-3 border border-neutral-300 text-neutral-800 hover:bg-neutral-100 rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
};
