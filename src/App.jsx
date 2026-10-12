import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { CmsProvider } from './context/CmsContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';

// Storefront Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Categories } from './pages/Categories';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Account } from './pages/Account';
import { Orders } from './pages/Orders';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

// CMS Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminSettings } from './pages/admin/AdminSettings';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CmsProvider>
          <AdminAuthProvider>
            <WishlistProvider>
              <CartProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Public Storefront Routes */}
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<Home />} />
                      <Route path="shop" element={<Shop />} />
                      <Route path="product/:id" element={<ProductDetails />} />
                      <Route path="categories" element={<Categories />} />
                      <Route path="cart" element={<Cart />} />
                      <Route path="checkout" element={<Checkout />} />
                      <Route path="login" element={<Login />} />
                      <Route path="register" element={<Register />} />
                      <Route path="account" element={<Account />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="about" element={<About />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* Dedicated Public Admin Login Route */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Protected CMS Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <AdminProtectedRoute>
                          <AdminLayout />
                        </AdminProtectedRoute>
                      }
                    >
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </CartProvider>
            </WishlistProvider>
          </AdminAuthProvider>
        </CmsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
