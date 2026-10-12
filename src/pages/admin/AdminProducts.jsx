import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  RotateCcw
} from 'lucide-react';
import { useCms } from '../../hooks/useCms';
import { useToast } from '../../hooks/useToast';
import { ProductFormModal } from '../../components/admin/ProductFormModal';
import { categories } from '../../data/categories';

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct, formatMoney } = useCms();
  const { addToast } = useToast();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all, low, out, instock

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.id).toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      // Stock
      let matchesStock = true;
      if (stockFilter === 'low') {
        matchesStock = Number(p.stock) > 0 && Number(p.stock) <= 10;
      } else if (stockFilter === 'out') {
        matchesStock = Number(p.stock) === 0;
      } else if (stockFilter === 'instock') {
        matchesStock = Number(p.stock) > 10;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
      addToast(`Updated product "${formData.name}" successfully!`, 'success');
    } else {
      await addProduct(formData);
      addToast(`Published new product "${formData.name}"!`, 'success');
    }
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      addToast(`Removed product #${productToDelete.id} from catalog.`, 'info');
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <span>Product Catalog ({filteredProducts.length})</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage product titles, prices, stock levels, and badges in real-time.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/25 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, SKU, or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-neutral-50/50"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-semibold bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug || c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-semibold bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Stock Statuses</option>
            <option value="instock">In Stock (&gt; 10 units)</option>
            <option value="low">Low Stock (1 - 10)</option>
            <option value="out">Out of Stock (0)</option>
          </select>

          {(searchQuery || selectedCategory !== 'all' || stockFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setStockFilter('all');
              }}
              className="p-2 text-neutral-500 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 transition-colors"
              title="Reset filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-800">No products found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Try modifying your search or filter criteria, or add a new product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-200/80 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Inventory</th>
                  <th className="py-4 px-4">Badge</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((p) => {
                  const stockNum = Number(p.stock ?? 0);
                  const isLow = stockNum > 0 && stockNum <= 10;
                  const isOut = stockNum === 0;

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors group">
                      
                      {/* Thumbnail & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0 bg-neutral-100"
                          />
                          <div className="min-w-0">
                            <div className="font-extrabold text-neutral-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              SKU: {p.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 font-semibold text-[11px] capitalize">
                          {p.category || 'Accessories'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-neutral-900">
                          {formatMoney(p.price)}
                        </div>
                        {p.oldPrice && Number(p.oldPrice) > Number(p.price) && (
                          <div className="text-[10px] text-neutral-400 line-through">
                            {formatMoney(p.oldPrice)}
                          </div>
                        )}
                      </td>

                      {/* Inventory Stock */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            isOut
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                          {isOut ? 'Out of Stock' : `${stockNum} in stock`}
                        </span>
                      </td>

                      {/* Badges */}
                      <td className="py-4 px-4">
                        {p.badge ? (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold">
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 border border-neutral-200 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-900">
                Confirm Product Removal
              </h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Are you sure you want to delete <strong className="text-neutral-900 font-semibold">{productToDelete.name}</strong>? This action will remove the item from both the CMS and storefront.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
