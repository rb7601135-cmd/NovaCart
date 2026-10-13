import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Star,
  ChevronRight,
  Share2
} from 'lucide-react';
import { getRelatedProducts } from '../data/products';
import { fetchProductById } from '../lib/productService';
import { formatPrice } from '../utils/currency';
import { RatingStars } from '../components/common/RatingStars';
import { ProductCard } from '../components/common/ProductCard';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useToast } from '../hooks/useToast';
import { useCms } from '../hooks/useCms';

const ProductDetailContent = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();
  const { products: allCmsProducts } = useCms();

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedOption, setSelectedOption] = useState(
    product.options ? product.options.values[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [mockReviewsList, setMockReviewsList] = useState([
    {
      id: 'rev-sub-1',
      author: 'David Harrison',
      rating: 5,
      date: '2 weeks ago',
      title: 'Remarkable attention to detail',
      comment: 'Exceeded every expectation. The build quality feels distinctly top-tier and the presentation was immaculate.',
      verified: true
    },
    {
      id: 'rev-sub-2',
      author: 'Claire V.',
      rating: 5,
      date: '1 month ago',
      title: 'Worth every cent',
      comment: 'Materials feel expensive and sturdy. Customer service was prompt when I asked about sizing advice.',
      verified: true
    }
  ]);

  const isFavorited = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const related = React.useMemo(() => {
    if (allCmsProducts && allCmsProducts.length > 0) {
      const sameCat = allCmsProducts.filter(
        (p) => p.category === product.category && String(p.id) !== String(product.id)
      );
      if (sameCat.length > 0) return sameCat.slice(0, 4);
      return allCmsProducts.filter((p) => String(p.id) !== String(product.id)).slice(0, 4);
    }
    return getRelatedProducts(product.id, product.category, 4);
  }, [allCmsProducts, product.id, product.category]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOption);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedOption);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Product URL copied to clipboard!', 'info');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      addToast('Please provide your name and review', 'error');
      return;
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      author: reviewName,
      rating: reviewRating,
      date: 'Just now',
      title: 'Verified Customer Review',
      comment: reviewComment,
      verified: true
    };

    setMockReviewsList([newRev, ...mockReviewsList]);
    addToast('Thank you! Your review was published.', 'success');
    setReviewName('');
    setReviewComment('');
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link to="/shop" className="hover:text-neutral-900 transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link to={`/shop?category=${product.category}`} className="hover:text-neutral-900 capitalize transition-colors">
            {product.categoryName || product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-neutral-900 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product View: Gallery + Action Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xs mb-16">
          
          {/* Gallery Column */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails Sidebar */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all bg-neutral-100 shrink-0 ${
                    selectedImage === img
                      ? 'border-indigo-600 ring-2 ring-indigo-200 scale-102'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Featured Image */}
            <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/70 group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Discount / Badge */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.discount > 0 && (
                  <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold uppercase rounded-lg shadow-sm">
                    -{product.discount}% OFF
                  </span>
                )}
                {product.badge && (
                  <span className="px-3 py-1 bg-neutral-900 text-white text-xs font-bold uppercase rounded-lg shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-neutral-600 hover:text-neutral-900 shadow-sm transition-colors"
                title="Share product link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Details & Purchase Action Column */}
          <div className="lg:col-span-5 flex flex-col">
            
            <div className="flex items-center justify-between mb-2">
              <Link
                to={`/shop?category=${product.category}`}
                className="text-xs font-bold uppercase tracking-wider text-indigo-600 hover:underline"
              >
                {product.categoryName || product.category}
              </Link>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                In Stock ({product.stock} units)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size="md" />
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs font-semibold text-neutral-600">
                100% Genuine Certified
              </span>
            </div>

            <div className="flex items-baseline gap-3 pb-6 border-b border-neutral-100 mb-6">
              <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-lg text-neutral-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  Save {formatPrice(product.oldPrice - product.price)}
                </span>
              )}
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {product.options && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Select {product.options.type}:
                  </span>
                  <span className="text-xs font-semibold text-indigo-600">
                    {selectedOption}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.options.values.map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedOption(val)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedOption === val
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-300'
                          : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-2 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-neutral-200 rounded-2xl bg-neutral-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-neutral-700 hover:bg-white transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-neutral-700 hover:bg-white transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isFavorited
                      ? 'bg-rose-50 text-rose-600 border-rose-300 shadow-xs'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-98"
              >
                <Zap className="w-4 h-4 fill-white" />
                Buy Now
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-center text-xs">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="font-semibold text-neutral-800">Free Express</span>
                <span className="text-[10px] text-neutral-600">Over $100</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="font-semibold text-neutral-800">30-Day Return</span>
                <span className="text-[10px] text-neutral-600">Prepaid shipping</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="font-semibold text-neutral-800">2-Yr Warranty</span>
                <span className="text-[10px] text-neutral-600">Full replacement</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Product Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xs mb-16">
          <div className="flex border-b border-neutral-200 gap-6 sm:gap-10 overflow-x-auto pb-px mb-8">
            {[
              { id: 'description', label: 'Full Description' },
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'reviews', label: `Reviews (${mockReviewsList.length})` },
              { id: 'shipping', label: 'Shipping & White-Glove Care' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="space-y-6 max-w-3xl">
              <p className="text-sm text-neutral-700 leading-relaxed">
                {product.description}
              </p>
              {product.features && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                    Key Highlights & Engineering
                  </h4>
                  <ul className="space-y-2.5">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              {product.specifications ? (
                <div className="divide-y divide-neutral-100">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="py-3 flex justify-between text-xs">
                      <span className="font-semibold text-neutral-500">{key}</span>
                      <span className="font-bold text-neutral-900">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-500">Standard specifications apply.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-4">
                  {mockReviewsList.map((rev) => (
                    <div key={rev.id} className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/70">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-neutral-900">{rev.author}</span>
                        <span className="text-[11px] text-neutral-400">{rev.date}</span>
                      </div>
                      <RatingStars rating={rev.rating} size="sm" showScore={false} />
                      <h5 className="text-xs font-bold text-neutral-900 mt-2">{rev.title}</h5>
                      <p className="text-xs text-neutral-600 mt-1">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 bg-neutral-50 p-6 rounded-2xl border border-neutral-200/80">
                <h4 className="text-sm font-bold text-neutral-900 mb-2">Write a Review</h4>
                <p className="text-xs text-neutral-500 mb-4">
                  Share your experience with fellow NovaCart shoppers.
                </p>
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Michael Thorne"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-neutral-200 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Rating</label>
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Your Review</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="What did you think of the craft and materials?"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-neutral-200 text-xs resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
                  >
                    Post Verified Review
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-2xl space-y-4 text-xs text-neutral-600 leading-relaxed">
              <p>
                All orders are dispatched within 24 business hours from our temperature-controlled logistic centers in New York and Frankfurt.
              </p>
              <p>
                Standard complimentary shipping arrives within 2-4 business days. Priority Overnight and White-Glove hand deliveries are available during checkout.
              </p>
              <p>
                If you are not completely enchanted with your purchase, we provide 30-day effortless returns with prepaid digital labels.
              </p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 block mb-1">
                  You May Also Like
                </span>
                <h3 className="text-2xl font-extrabold text-neutral-900">
                  Related Products
                </h3>
              </div>
              <Link
                to="/shop"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                View Collection &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export const ProductDetails = () => {
  const { id } = useParams();
  const { products: cmsProducts } = useCms();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      setLoading(true);
      let prod = cmsProducts?.find((p) => String(p.id) === String(id)) || null;
      if (!prod) {
        prod = await fetchProductById(id);
      }
      if (isMounted) {
        setProduct(prod);
        setLoading(false);
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id, cmsProducts]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-neutral-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Product Not Found</h2>
        <Link to="/shop" className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-semibold">
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return <ProductDetailContent key={product.id} product={product} />;
};
