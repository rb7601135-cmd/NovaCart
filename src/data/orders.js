export const initialOrders = [
  {
    id: 'NC-98421',
    date: 'Oct 04, 2026',
    status: 'Delivered',
    statusStep: 4,
    trackingNumber: 'TRK-981273948US',
    carrier: 'FedEx Express Air',
    estimatedDelivery: 'Oct 06, 2026',
    paymentMethod: 'Visa ending in 4242',
    shippingAddress: {
      fullName: 'Alex Morgan',
      address: '742 Evergreen Terrace, Suite 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States'
    },
    items: [
      {
        id: 'prod-1',
        name: 'Aether Pro Wireless Noise-Cancelling Headphones',
        price: 299.99,
        quantity: 1,
        selectedOption: 'Midnight Obsidian',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'prod-22',
        name: 'Luxe Minimalist Cardholder Slim RFID Wallet',
        price: 49.00,
        quantity: 1,
        selectedOption: 'Cognac Tan',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 348.99,
    shipping: 0,
    discount: 34.90,
    tax: 25.13,
    total: 339.22
  },
  {
    id: 'NC-91204',
    date: 'Sep 21, 2026',
    status: 'In Transit',
    statusStep: 3,
    trackingNumber: 'TRK-449102847US',
    carrier: 'DHL Express',
    estimatedDelivery: 'Oct 11, 2026',
    paymentMethod: 'Mastercard ending in 8819',
    shippingAddress: {
      fullName: 'Alex Morgan',
      address: '742 Evergreen Terrace, Suite 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States'
    },
    items: [
      {
        id: 'prod-3',
        name: 'Velocity Aero X1 Ergonomic Running Shoes',
        price: 159.99,
        quantity: 1,
        selectedOption: 'US 10',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 159.99,
    shipping: 10.00,
    discount: 0,
    tax: 13.60,
    total: 183.59
  },
  {
    id: 'NC-87630',
    date: 'Aug 14, 2026',
    status: 'Delivered',
    statusStep: 4,
    trackingNumber: 'TRK-109284726US',
    carrier: 'UPS Ground',
    estimatedDelivery: 'Aug 17, 2026',
    paymentMethod: 'PayPal (alex.morgan@example.com)',
    shippingAddress: {
      fullName: 'Alex Morgan',
      address: '742 Evergreen Terrace, Suite 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States'
    },
    items: [
      {
        id: 'prod-10',
        name: 'Nordic Artisan Hand-Blown Ceramic Pour-Over Set',
        price: 84.00,
        quantity: 1,
        selectedOption: 'Nordic White Matte',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 84.00,
    shipping: 10.00,
    discount: 0,
    tax: 7.52,
    total: 101.52
  }
];
