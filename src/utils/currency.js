import { getStorageItem } from './storage';

export const formatPrice = (price) => {
  const settings = getStorageItem('novacart_cms_settings', null);
  const currency = settings?.currency || 'USD';
  const symbol = settings?.currencySymbol || '$';

  try {
    if (symbol && symbol !== '$') {
      const num = Number(price || 0);
      return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price || 0);
  } catch {
    const num = Number(price || 0);
    return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

export const calculateDiscount = (original, discounted) => {
  if (!original || !discounted || original <= discounted) return 0;
  return Math.round(((original - discounted) / original) * 100);
};
