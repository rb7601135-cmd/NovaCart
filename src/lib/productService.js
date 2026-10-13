import { supabase } from './supabaseClient';
import { products as localProducts, getProductById as getLocalProductById } from '../data/products';
import { getStorageItem } from '../utils/storage';

const CMS_PRODUCTS_KEY = 'novacart_cms_products';

// Default placeholder images for products without images
const DEFAULT_PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
];

/**
 * Normalizes a Supabase products row into the complete NovaCart Product model
 */
export const mapSupabaseProduct = (p) => {
  const image =
    p.image ||
    (p.images && p.images[0]) ||
    DEFAULT_PRODUCT_IMAGES[0];

  const images =
    p.images && Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : [image, DEFAULT_PRODUCT_IMAGES[1], DEFAULT_PRODUCT_IMAGES[2]];

  return {
    ...p,
    id: String(p.id),
    name: p.name || 'Untitled Product',
    category: p.category || 'accessories',
    categoryName: p.category_name || (p.category ? p.category.toUpperCase() : 'Luxury Accessories'),
    price: Number(p.price || 0),
    oldPrice: p.old_price ? Number(p.old_price) : Number(p.price || 0) * 1.25,
    discount: p.discount ? Number(p.discount) : 20,
    rating: Number(p.rating ?? 4.8),
    reviewsCount: Number(p.reviews_count ?? 18),
    isFeatured: p.is_featured ?? true,
    isNew: p.is_new ?? true,
    isBestSeller: p.is_bestseller ?? false,
    stock: Number(p.stock ?? 25),
    badge: p.badge || (p.is_new ? 'New' : 'Featured'),
    image,
    images,
    description:
      p.description ||
      'Carefully crafted with uncompromising dedication to quality, materials, and finish.',
    features: p.features || [
      'High-grade premium materials',
      'Designed for enduring luxury and everyday utility',
      'Quality guaranteed with 1-year NovaCart warranty'
    ],
    specifications: p.specifications || {
      'Condition': 'Brand New',
      'Warranty': '1 Year Global',
      'Packaging': 'Original Luxury Presentation Box'
    },
    options: p.options || {
      type: 'Edition',
      values: ['Standard Edition', 'Collector Edition']
    },
    tags: p.tags && Array.isArray(p.tags) ? p.tags : ['luxury', 'curated', 'popular']
  };
};

/**
 * Fetches all products from CMS storage merged with Supabase and local fallback catalog
 */
export const fetchAllProducts = async () => {
  const storedCms = getStorageItem(CMS_PRODUCTS_KEY, null);
  const baseProducts = storedCms && storedCms.length > 0 ? storedCms : localProducts;

  if (!supabase) {
    return baseProducts;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, fallback to CMS/local products:', error.message);
      return baseProducts;
    }

    if (data && data.length > 0) {
      const mapped = data.map(mapSupabaseProduct);
      // Prepend any new Supabase products not already present in baseProducts
      const uniqueBase = baseProducts.filter(
        (bp) => !mapped.some((mp) => String(mp.id) === String(bp.id))
      );
      return [...mapped, ...uniqueBase];
    }

    return baseProducts;
  } catch (err) {
    console.warn('Error connecting to Supabase products:', err);
    return baseProducts;
  }
};

/**
 * Fetches a single product by ID (CMS first, then Supabase, then local fallback)
 */
export const fetchProductById = async (id) => {
  if (!id) return null;

  // 1. Check CMS products in storage first (reflecting latest admin edits)
  const storedCms = getStorageItem(CMS_PRODUCTS_KEY, null);
  if (storedCms && storedCms.length > 0) {
    const foundCms = storedCms.find((p) => String(p.id) === String(id));
    if (foundCms) return foundCms;
  }

  // 2. Check Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return mapSupabaseProduct(data);
      }
    } catch (err) {
      console.warn('Error fetching product from Supabase:', err);
    }
  }

  // 3. Fallback to local catalog
  return getLocalProductById(id) || null;
};
