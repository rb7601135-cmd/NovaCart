export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price || 0);
};

export const calculateDiscount = (original, discounted) => {
  if (!original || !discounted || original <= discounted) return 0;
  return Math.round(((original - discounted) / original) * 100);
};
