export const products = [
  {
    id: 'prod-1',
    name: 'Aether Pro Wireless Noise-Cancelling Headphones',
    category: 'audio',
    categoryName: 'Audio & Acoustics',
    price: 299.99,
    oldPrice: 379.99,
    discount: 21,
    rating: 4.9,
    reviewsCount: 328,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    stock: 15,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Immerse yourself in concert-grade audio with the Aether Pro. Equipped with 45mm custom graphene acoustic drivers and adaptive Hybrid ANC that eliminates up to 98% of ambient noise. Enjoy up to 48 hours of uninterrupted playback on a single ultra-fast USB-C charge.',
    features: [
      'Adaptive Hybrid Active Noise Cancellation',
      'High-Resolution Audio certified with LDAC codec support',
      '48-hour battery life with 10-minute quick charge',
      'Plush memory foam earcups wrapped in supple vegan leather',
      'Built-in quadruple beamforming microphones for crystal-clear calls'
    ],
    specifications: {
      'Driver Size': '45mm Neodymium',
      'Battery Life': '48 hours (ANC off), 36 hours (ANC on)',
      'Connectivity': 'Bluetooth 5.3 + 3.5mm Aux',
      'Weight': '265g',
      'Warranty': '2 Years Global Warranty'
    },
    options: {
      type: 'Color',
      values: ['Midnight Obsidian', 'Frosted Silver', 'Desert Sand']
    },
    tags: ['wireless', 'noise-cancelling', 'headphones', 'premium audio']
  },
  {
    id: 'prod-2',
    name: 'Chronos Heritage Automatic Mechanical Watch',
    category: 'accessories',
    categoryName: 'Luxury Accessories',
    price: 449.00,
    oldPrice: 599.00,
    discount: 25,
    rating: 4.8,
    reviewsCount: 194,
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    stock: 8,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'An ode to horological craftsmanship. The Chronos Heritage features a self-winding Japanese mechanical movement visible through an exhibition sapphire caseback, housed in marine-grade 316L stainless steel.',
    features: [
      'Exhibition sapphire crystal caseback',
      '42-hour power reserve automatic movement',
      'Italian vegetable-tanned full-grain leather strap',
      'Water resistant up to 10 ATM (100 meters)',
      'Super-LumiNova dial markers'
    ],
    specifications: {
      'Case Diameter': '40mm',
      'Case Thickness': '11.5mm',
      'Glass': 'Anti-reflective Sapphire Crystal',
      'Strap Width': '20mm',
      'Movement': 'Miyota 9015 Automatic'
    },
    options: {
      type: 'Band',
      values: ['Cognac Brown Leather', 'Matte Black Leather', 'Mesh Steel Bracelet']
    },
    tags: ['luxury', 'watch', 'automatic', 'accessories']
  },
  {
    id: 'prod-3',
    name: 'Velocity Aero X1 Ergonomic Running Shoes',
    category: 'footwear',
    categoryName: 'Footwear & Sneakers',
    price: 159.99,
    oldPrice: 199.99,
    discount: 20,
    rating: 4.7,
    reviewsCount: 412,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    stock: 22,
    badge: 'Hot Deal',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Engineered for athletes and urban explorers. The Velocity Aero X1 delivers reactive nitrogen-infused cushioning, ultra-breathable knit weave, and a high-traction continental grip sole for effortless propulsion.',
    features: [
      'Nitrogen-infused dynamic rebound midsole',
      'Seamless 3D knit upper for glove-like adaptive fit',
      'High-traction dual-compound rubber outsole',
      'Reflective micro-elements for night visibility'
    ],
    specifications: {
      'Weight': '218g (Size US 9)',
      'Heel-to-Toe Drop': '8mm',
      'Upper Material': '100% Recycled AeroKnit',
      'Terrain': 'Road, Track, Treadmill'
    },
    options: {
      type: 'Size',
      values: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12']
    },
    tags: ['sneakers', 'running', 'footwear', 'athletic']
  },
  {
    id: 'prod-4',
    name: 'Atelier Cashmere Oversized Relaxed Coat',
    category: 'fashion',
    categoryName: 'Fashion & Apparel',
    price: 389.00,
    oldPrice: 495.00,
    discount: 21,
    rating: 4.9,
    reviewsCount: 86,
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    stock: 12,
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce667883?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce667883?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A contemporary masterwork woven from pure Mongolian double-faced cashmere and virgin wool blend. Styled with dropped shoulders, notched lapels, and tailored horn buttons for effortless elegance.',
    features: [
      '70% Mongolian Cashmere, 30% Fine Virgin Wool',
      'Double-faced handcrafted stitching',
      'Unstructured silhouette with deep side pockets',
      'Breathable Cupro lining in sleeve chambers'
    ],
    specifications: {
      'Care': 'Dry clean only',
      'Origin': 'Made in Italy',
      'Fit': 'Contemporary Oversized',
      'Length': 'Mid-Calf (115cm)'
    },
    options: {
      type: 'Size',
      values: ['Small (36)', 'Medium (38)', 'Large (40)', 'XL (42)']
    },
    tags: ['fashion', 'coat', 'cashmere', 'outerwear']
  },
  {
    id: 'prod-5',
    name: 'Lumina Studio Smart Ambient Table Lamp',
    category: 'home',
    categoryName: 'Home & Living',
    price: 129.50,
    oldPrice: 165.00,
    discount: 21,
    rating: 4.8,
    reviewsCount: 154,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    stock: 20,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sculptural lighting meets circadian smart technology. Casts a warm 2200K sunset glow or crisp 5000K daylight beam with capacitive touch dimming and seamless Apple Home & Google Assistant integration.',
    features: [
      'Smooth step-less capacitive touch dimming (1% - 100%)',
      'Circadian rhythm synchronization mode',
      'Machined aircraft aluminum base with frosted opal glass diffuser',
      'Qi wireless charging pad integrated into base'
    ],
    specifications: {
      'Luminous Flux': '800 Lumens',
      'Color Temperature': '2200K - 5500K Tunable White',
      'Connectivity': 'Matter / Apple Home / Google Home',
      'Power Consumption': '12W LED Max'
    },
    options: {
      type: 'Finish',
      values: ['Brushed Brass', 'Matte Space Grey', 'Ceramic White']
    },
    tags: ['smart home', 'lighting', 'decor', 'minimalist']
  },
  {
    id: 'prod-6',
    name: 'Quantum View 4K OLED Ultra-Thin Monitor 32"',
    category: 'electronics',
    categoryName: 'Electronics & Gadgets',
    price: 899.00,
    oldPrice: 1099.00,
    discount: 18,
    rating: 4.9,
    reviewsCount: 98,
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    stock: 6,
    badge: 'Flagship',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Designed for visionary creators and gamers alike. The Quantum View features self-lit OLED pixels delivering infinite contrast, 99.5% DCI-P3 color fidelity, 144Hz refresh rate, and 90W single-cable USB-C power delivery.',
    features: [
      '3840 x 2160 UHD Self-Lit OLED Panel with 0.1ms response time',
      '144Hz variable refresh rate with NVIDIA G-Sync support',
      'Factory color calibrated with Delta E < 1',
      'Full-motion ergonomic stand with height, tilt, swivel and pivot'
    ],
    specifications: {
      'Screen Size': '31.5 inches',
      'Peak Brightness': '1000 nits (HDR)',
      'Ports': 'Thunderbolt 4 (90W PD), 2x HDMI 2.1, DisplayPort 1.4',
      'Weight': '6.4kg with stand'
    },
    options: {
      type: 'Model',
      values: ['Standard Anti-Glare', 'Nano-Texture Glass (+ $100)']
    },
    tags: ['monitor', 'oled', '4k', 'creators', 'gaming']
  },
  {
    id: 'prod-7',
    name: 'Sovereign Full-Grain Leather Weekender Duffle',
    category: 'accessories',
    categoryName: 'Luxury Accessories',
    price: 249.99,
    oldPrice: 320.00,
    discount: 22,
    rating: 4.8,
    reviewsCount: 165,
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    stock: 14,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Handcrafted from vegetable-tanned Tuscan full-grain leather that patinas beautifully over decades. Meets international airline carry-on requirements, featuring a dedicated shoe compartment and padded laptop pocket.',
    features: [
      'Full-grain vegetable-tanned Italian leather exterior',
      'Heavy-duty YKK Excella brass zippers',
      'Separate ventilated sneaker/shoe compartment',
      'Detachable padded ergonomic shoulder strap'
    ],
    specifications: {
      'Capacity': '45 Litres',
      'Dimensions': '52 x 28 x 26 cm',
      'Weight': '1.85 kg',
      'Hardware': 'Solid antiqued brass'
    },
    options: {
      type: 'Color',
      values: ['Chestnut Tan', 'Rich Espresso', 'Onyx Black']
    },
    tags: ['travel', 'leather', 'bag', 'duffle', 'luggage']
  },
  {
    id: 'prod-8',
    name: 'Apex Mechanical Gaming Keyboard RGB',
    category: 'electronics',
    categoryName: 'Electronics & Gadgets',
    price: 179.99,
    oldPrice: 219.99,
    discount: 18,
    rating: 4.7,
    reviewsCount: 220,
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    stock: 19,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Precision typing engineered with hot-swappable tactile switches, sound-dampening silicon gasket mounting, and aircraft aluminum chassis for the ultimate keystroke feedback.',
    features: [
      'Hot-swappable 5-pin switches with pre-lubed stabilizers',
      'Multi-layer Poron acoustic dampening foam',
      'Tri-mode connectivity: 2.4GHz wireless, Bluetooth 5.2, USB-C',
      'South-facing per-key RGB backlighting with dynamic patterns'
    ],
    specifications: {
      'Layout': '75% Compact (82 Keys)',
      'Battery': '4000mAh (Up to 200 hours)',
      'Plate': 'Polycarbonate Flex-Cut',
      'Weight': '980g'
    },
    options: {
      type: 'Switches',
      values: ['Gateron Oil King (Linear)', 'Holy Panda (Tactile)', 'Silent Blue (Clicky)']
    },
    tags: ['keyboard', 'mechanical', 'gaming', 'tech']
  },
  {
    id: 'prod-9',
    name: 'Nomad Horizon Weatherproof Modular Backpack',
    category: 'accessories',
    categoryName: 'Luxury Accessories',
    price: 189.00,
    oldPrice: 239.00,
    discount: 21,
    rating: 4.8,
    reviewsCount: 310,
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    stock: 25,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Built with recycled Cordura ballistic fabric and weatherproof magnetic Fidlock buckles. Features a clamshell 180° opening, quick-access passport pocket, and suspended 16" laptop vault.',
    features: [
      '1000D Cordura ballistic nylon with hydrophobic coating',
      'Magnetic quick-snap Fidlock hardware',
      'Luggage pass-through strap for airport transit',
      'Hidden RFID-shielded passport & wallet compartment'
    ],
    specifications: {
      'Volume': '28 Litres Expandable to 34L',
      'Dimensions': '48 x 30 x 18 cm',
      'Laptop Sleeve': 'Fits up to 16" MacBook Pro',
      'Weight': '1.15 kg'
    },
    options: {
      type: 'Color',
      values: ['Stealth Charcoal', 'Alpine Olive', 'Deep Navy']
    },
    tags: ['backpack', 'commuter', 'tech bag', 'travel']
  },
  {
    id: 'prod-10',
    name: 'Nordic Artisan Hand-Blown Ceramic Pour-Over Set',
    category: 'home',
    categoryName: 'Home & Living',
    price: 84.00,
    oldPrice: 110.00,
    discount: 24,
    rating: 4.9,
    reviewsCount: 147,
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    stock: 18,
    badge: 'Artisan',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Elevate your morning ritual. Each ceramic dripper and borosilicate carafe is individually spun by master potters, optimizing heat retention and water extraction flow rate for unmatched coffee clarity.',
    features: [
      'Hand-thrown high-fire stoneware dripper with spiral interior ribs',
      'Heat-resistant borosilicate glass server with measurement markers',
      'Includes 100 unbleached Japanese cotton-blend filter cones',
      'Dishwasher safe and food-grade certified non-toxic glaze'
    ],
    specifications: {
      'Carafe Capacity': '600ml (2-4 Cups)',
      'Dripper Compatibility': 'V60 02 standard filters',
      'Material': 'Danish Stoneware & Borosilicate Glass'
    },
    options: {
      type: 'Glaze',
      values: ['Nordic White Matte', 'Basalt Stone Charcoal', 'Sage Speckle']
    },
    tags: ['coffee', 'kitchen', 'home', 'ceramic']
  },
  {
    id: 'prod-11',
    name: 'Aura SoundSphere 360° Spatial Audio Speaker',
    category: 'audio',
    categoryName: 'Audio & Acoustics',
    price: 219.00,
    oldPrice: 279.00,
    discount: 22,
    rating: 4.8,
    reviewsCount: 203,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    stock: 16,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Transform any room into a high-fidelity listening sanctuary. Features dual force-cancelling woofers, an omnidirectional acoustic deflector, and IP67 waterproof construction for outdoor freedom.',
    features: [
      'Omnidirectional 360-degree room acoustic dispersion',
      'Dual passive radiators for deep resonant bass down to 42Hz',
      'IP67 water and dust resistance rating',
      'PartyConnect mode syncs up to 50 speakers simultaneously'
    ],
    specifications: {
      'Battery Life': '24 Hours Playback',
      'Output Power': '60W RMS Peak',
      'Wireless Range': '30 Meters (Bluetooth 5.3)',
      'Dimensions': '14 x 14 x 19 cm'
    },
    options: {
      type: 'Color',
      values: ['Matte Slate', 'Arctic Snow', 'Midnight Cobalt']
    },
    tags: ['audio', 'speaker', 'bluetooth', 'waterproof']
  },
  {
    id: 'prod-12',
    name: 'Knitwear Studio Merino Wool Heavyweight Knit',
    category: 'fashion',
    categoryName: 'Fashion & Apparel',
    price: 145.00,
    oldPrice: 185.00,
    discount: 22,
    rating: 4.7,
    reviewsCount: 93,
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    stock: 15,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Spun from 100% extra-fine 19.5 micron Australian Merino wool. Naturally temperature-regulating, moisture-wicking, and hypoallergenic with a ribbed crew neckline and reinforced cuffs.',
    features: [
      '100% Ethical Certified Merino Wool (Woolmark standard)',
      '7-gauge chunky waffle fisherman knit pattern',
      'Natural odor resistance and thermal insulation',
      'Pre-washed and pre-shrunk for lasting fit'
    ],
    specifications: {
      'Material': '100% Extra-Fine Merino Wool',
      'Knit Gauge': '7 Gauge Heavyweight',
      'Care': 'Gentle wool cycle or hand wash cold'
    },
    options: {
      type: 'Size',
      values: ['Small', 'Medium', 'Large', 'Extra Large']
    },
    tags: ['knitwear', 'sweater', 'merino', 'apparel']
  },
  {
    id: 'prod-13',
    name: 'Vanguard Leather Chelsea Boots Vibram Sole',
    category: 'footwear',
    categoryName: 'Footwear & Sneakers',
    price: 260.00,
    oldPrice: 325.00,
    discount: 20,
    rating: 4.9,
    reviewsCount: 178,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    stock: 10,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Goodyear welted Chelsea boots built on rugged Vibram commando outsoles. Weatherproof oiled bovine leather shields your feet through winter streets and autumn trails with timeless panache.',
    features: [
      '360° Goodyear welt construction for easy resoling',
      'Italian weatherproof pull-up full-grain leather',
      'Custom Vibram Cristy Arctic Grip outsole',
      'Breathable calfskin lining with cushioned cork footbed'
    ],
    specifications: {
      'Construction': 'Goodyear Welted',
      'Outsole': 'Vibram Commando Lug',
      'Heel Height': '30mm',
      'Shaft Height': '15cm'
    },
    options: {
      type: 'Size',
      values: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12']
    },
    tags: ['boots', 'chelsea', 'leather', 'footwear']
  },
  {
    id: 'prod-14',
    name: 'AeroLens Polarized Titanium Sunglasses',
    category: 'accessories',
    categoryName: 'Luxury Accessories',
    price: 165.00,
    oldPrice: 210.00,
    discount: 21,
    rating: 4.7,
    reviewsCount: 114,
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    stock: 21,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Weighing a feather-light 16 grams, the AeroLens frames are forged from aerospace Japanese beta-titanium with 9-layer anti-reflective polarized crystal lenses for razor-sharp optical definition.',
    features: [
      'Ultra-light Japanese Beta-Titanium frame',
      'UV400 Category 3 polarized lenses with hydrophobic coating',
      'Custom hypoallergenic silicone nose pads',
      'Includes handcrafted leather travel case & microfiber pouch'
    ],
    specifications: {
      'Frame Width': '142mm',
      'Lens Width': '52mm',
      'Bridge': '20mm',
      'Weight': '16.2g'
    },
    options: {
      type: 'Lens Tint',
      values: ['Deep Smoke Grey', 'Emerald Amber Gradient', 'Mirror Chrome']
    },
    tags: ['sunglasses', 'titanium', 'eyewear', 'summer']
  },
  {
    id: 'prod-15',
    name: 'Zenith Minimalist Bamboo Ergonomic Standing Desk',
    category: 'home',
    categoryName: 'Home & Living',
    price: 549.00,
    oldPrice: 699.00,
    discount: 21,
    rating: 4.9,
    reviewsCount: 88,
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    stock: 7,
    badge: 'Staff Pick',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Power through your workday in posture-perfect health. Dual ultra-quiet German motors lift your workspace smoothly in seconds, paired with a solid 100% sustainable bamboo beveled desktop.',
    features: [
      'Dual silent motors with anti-collision gyroscope sensors',
      '4 programmable height presets with digital OLED LED display',
      'Integrated under-desk cable management channel & power bar',
      '100% sustainably harvested solid carbonized bamboo'
    ],
    specifications: {
      'Desktop Size': '140 x 70 x 2.5 cm',
      'Height Range': '62cm to 128cm',
      'Load Capacity': '125 kg (275 lbs)',
      'Motor Sound': '< 45 dB whisper quiet'
    },
    options: {
      type: 'Desktop Finish',
      values: ['Natural Bamboo', 'Smoked Walnut Bamboo', 'Matte Black Ash']
    },
    tags: ['desk', 'standing desk', 'home office', 'ergonomic']
  },
  {
    id: 'prod-16',
    name: 'Sony α7 IV Full-Frame Mirrorless Hybrid Camera',
    category: 'electronics',
    categoryName: 'Electronics & Gadgets',
    price: 2499.00,
    oldPrice: 2699.00,
    discount: 7,
    rating: 5.0,
    reviewsCount: 142,
    isFeatured: true,
    isNew: false,
    isBestSeller: false,
    stock: 5,
    badge: 'Pro Tier',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The benchmark hybrid creator camera. Powered by a 33MP Exmor R back-illuminated sensor, next-gen BIONZ XR processing, and real-time AI eye tracking for human, bird, and animal photography.',
    features: [
      '33MP Full-Frame Exmor R CMOS Sensor',
      '4K 60p 10-Bit 4:2:2 video with S-Cinetone profile',
      '759-point phase-detection autofocus with 94% coverage',
      '5.5-stop 5-axis in-body image stabilization'
    ],
    specifications: {
      'Sensor': '33 Megapixels Full Frame',
      'ISO Range': '100 - 51,200 (Exp 50-204,800)',
      'Storage': 'Dual Slot (CFexpress Type A / SD UHS-II)',
      'Weight': '658g'
    },
    options: {
      type: 'Kit Configuration',
      values: ['Body Only', 'With 28-70mm Zoom Lens (+ $300)']
    },
    tags: ['camera', 'mirrorless', 'photography', '4k']
  },
  {
    id: 'prod-17',
    name: 'Serena Organic Linen Minimalist Duvet Bundle',
    category: 'home',
    categoryName: 'Home & Living',
    price: 198.00,
    oldPrice: 245.00,
    discount: 19,
    rating: 4.8,
    reviewsCount: 120,
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    stock: 14,
    badge: 'Organic',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef9?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Woven from 100% French flax linen stone-washed for lived-in softness from day one. Breathable, thermo-regulating, and gentler on your skin with every consecutive wash.',
    features: [
      'OEKO-TEX Standard 100 certified non-toxic fibers',
      'Natural French flax stonewashed for signature texture',
      'Set includes 1 Duvet Cover, 1 Fitted Sheet, and 2 Pillowcases',
      'Interior corner ties to anchor duvet inserts firmly'
    ],
    specifications: {
      'Material': '100% French Flax Linen (170 GSM)',
      'Care': 'Machine wash cold on delicate cycle',
      'Closure': 'Natural coconut shell buttons'
    },
    options: {
      type: 'Bed Size',
      values: ['Full / Queen', 'King / Cal King']
    },
    tags: ['bedding', 'linen', 'bedroom', 'home']
  },
  {
    id: 'prod-18',
    name: 'Velocity Stride High-Rise Activewear Leggings',
    category: 'fashion',
    categoryName: 'Fashion & Apparel',
    price: 78.00,
    oldPrice: 98.00,
    discount: 20,
    rating: 4.9,
    reviewsCount: 389,
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    stock: 30,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Buttery-soft, four-way stretch leggings with zero transparency. Styled with a stay-put compression waistband, discreet smartphone pockets, and moisture-wicking quick-dry fabric.',
    features: [
      'Weightless CloudSculpt 4-way compression fabric',
      'Squat-proof opaque double-knit yarn',
      'Dual deep side pockets fit all smartphones',
      'Seamless flatlock stitching prevents chafing'
    ],
    specifications: {
      'Fabric': '75% Recycled Nylon, 25% Lycra Spandex',
      'Inseam': '25 inches (7/8 length)',
      'Rise': 'Super High Rise (11 inches)'
    },
    options: {
      type: 'Size',
      values: ['XS (0-2)', 'S (4-6)', 'M (8-10)', 'L (12-14)', 'XL (16)']
    },
    tags: ['activewear', 'leggings', 'fitness', 'yoga']
  },
  {
    id: 'prod-19',
    name: 'Pulse Pro ANC True Wireless Earbuds',
    category: 'audio',
    categoryName: 'Audio & Acoustics',
    price: 189.99,
    oldPrice: 229.99,
    discount: 17,
    rating: 4.8,
    reviewsCount: 260,
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    stock: 24,
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pocket-sized sonic powerhouse. Featuring customized 11mm dual dynamic drivers, personalized spatial audio with head tracking, and up to 32 hours total playback with wireless charging case.',
    features: [
      'Personalized Dynamic Head-Tracking Spatial Audio',
      'Active Noise Cancellation & Transparency HearThrough',
      'IPX5 sweat and water resistance',
      'Wireless Qi charging case with magnetic snap lid'
    ],
    specifications: {
      'Battery': '8 hours per charge, 32 hours with case',
      'Bluetooth': 'Version 5.3 Low Energy Audio',
      'Codecs': 'AAC, SBC, aptX Adaptive'
    },
    options: {
      type: 'Color',
      values: ['Pearl White', 'Matte Carbon', 'Sage Green']
    },
    tags: ['earbuds', 'wireless', 'audio', 'airpods']
  },
  {
    id: 'prod-20',
    name: 'Classic Oxford Goodyear Welted Dress Shoes',
    category: 'footwear',
    categoryName: 'Footwear & Sneakers',
    price: 279.00,
    oldPrice: 349.00,
    discount: 20,
    rating: 4.9,
    reviewsCount: 97,
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
    stock: 9,
    badge: 'Handcrafted',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Crafted in Spain by generational shoemakers. Cut from supple French calfskin leather with closed lacing, chisel toe, and vegetable-tanned leather soles with protective rubber heel taps.',
    features: [
      'Traditional closed-lacing Oxford silhouette',
      'Goodyear welted construction',
      'Full calfskin glove lining and cushioned leather insole',
      'Hand-burnished museum patina finish'
    ],
    specifications: {
      'Leather': 'French Boxcalf Leather',
      'Sole': 'Stitched Oak Bark Tanned Leather',
      'Fit': 'Standard D Width'
    },
    options: {
      type: 'Size',
      values: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12']
    },
    tags: ['dress shoes', 'oxford', 'menswear', 'footwear']
  },
  {
    id: 'prod-21',
    name: 'OmniCharge 140W GaN Ultra-Fast Travel Charger',
    category: 'electronics',
    categoryName: 'Electronics & Gadgets',
    price: 89.99,
    oldPrice: 119.99,
    discount: 25,
    rating: 4.8,
    reviewsCount: 231,
    isFeatured: false,
    isNew: true,
    isBestSeller: true,
    stock: 35,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1609592807664-846174a80277?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1609592807664-846174a80277?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Charge your laptop, tablet, and phone concurrently at lightning speed. Powered by Gallium Nitride (GaN III) architecture that runs 35% cooler and 50% more compact than traditional silicon bricks.',
    features: [
      '140W Power Delivery 3.1 single-port output (charges 16" MBP in 30 mins to 50%)',
      '3x USB-C ports + 1x USB-A port with smart dynamic power distribution',
      'Foldable prongs with interchangeable UK/EU/AU international travel plugs',
      'Comprehensive active safety temperature monitoring'
    ],
    specifications: {
      'Total Output': '140W Max',
      'Technology': 'GaN III Fast IC',
      'Dimensions': '7.2 x 6.5 x 3.1 cm',
      'Weight': '210g'
    },
    options: {
      type: 'Color',
      values: ['Space Grey', 'Arctic White']
    },
    tags: ['charger', 'gan', 'usb-c', 'travel']
  },
  {
    id: 'prod-22',
    name: 'Luxe Minimalist Cardholder Slim RFID Wallet',
    category: 'accessories',
    categoryName: 'Luxury Accessories',
    price: 49.00,
    oldPrice: 65.00,
    discount: 24,
    rating: 4.8,
    reviewsCount: 312,
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    stock: 40,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554415707-9e44667ff4a6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sleek, minimalist pocket luxury. Houses up to 8 cards plus cash while maintaining a razor-thin 0.5cm profile. Built with integrated aerospace Faraday RFID lining that prevents digital card skimming.',
    features: [
      'Top-grain vegetable-tanned nappa leather',
      'Anti-theft military-grade RFID/NFC signal blocking layer',
      'Central cash pocket and 6 card slots with thumb pull notch',
      'Hand-burnished waxed edge detailing'
    ],
    specifications: {
      'Thickness': '0.5 cm when empty',
      'Dimensions': '10.2 x 7.6 cm',
      'Capacity': 'Up to 8 cards + folded cash',
      'Weight': '28g'
    },
    options: {
      type: 'Color',
      values: ['Cognac Tan', 'Midnight Black', 'Forest Green']
    },
    tags: ['wallet', 'cardholder', 'leather', 'rfid']
  },
  {
    id: 'prod-23',
    name: 'Sculpted Ceramic Aroma Diffuser & Humidifier',
    category: 'home',
    categoryName: 'Home & Living',
    price: 68.00,
    oldPrice: 85.00,
    discount: 20,
    rating: 4.7,
    reviewsCount: 168,
    isFeatured: false,
    isNew: true,
    isBestSeller: false,
    stock: 22,
    badge: 'Wellness',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594824813579-24b5d27d9282?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512290900672-1f5be4cb48be?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Impart calming natural essential aromas and moisture into your home. Handcrafted from textured porcelain clay with ultrasonic whisper technology and warm candle-glow ambient LED night mode.',
    features: [
      'Handcrafted natural porcelain ceramic cover',
      'Ultrasonic vibrations preserve therapeutic oil properties without heat',
      'Continuous and intermittent mist modes (up to 12 hours run time)',
      'Auto-shutoff sensor activates when water reservoir depletes'
    ],
    specifications: {
      'Reservoir Capacity': '280ml',
      'Coverage Area': 'Up to 450 sq ft',
      'Noise Level': 'Under 20dB (whisper quiet)',
      'Dimensions': '18 x 12 cm'
    },
    options: {
      type: 'Ceramic Tone',
      values: ['Sandstone Beige', 'Terracotta Rose', 'Chalk White']
    },
    tags: ['diffuser', 'aromatherapy', 'home', 'wellness']
  },
  {
    id: 'prod-24',
    name: 'Monochrome Tailored Cotton Oxford Button-Down',
    category: 'fashion',
    categoryName: 'Fashion & Apparel',
    price: 92.00,
    oldPrice: 115.00,
    discount: 20,
    rating: 4.8,
    reviewsCount: 175,
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
    stock: 28,
    badge: 'Essential',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'The foundation of a refined wardrobe. Woven from 100% GOTS certified organic Egyptian long-staple cotton with mother-of-pearl buttons, a soft button-down collar roll, and tailored modern drape.',
    features: [
      '100% Long-Staple Organic Egyptian Cotton (2-ply yarn)',
      'Genuine mother-of-pearl cross-stitched buttons',
      'Tailored modern cut with box pleat for freedom of movement',
      'Wrinkle-resistant wash finish'
    ],
    specifications: {
      'Fabric Weave': 'Royal Oxford Cloth (140 GSM)',
      'Origin': 'Ethically woven in Portugal',
      'Care': 'Machine wash warm, hang dry or light steam'
    },
    options: {
      type: 'Size',
      values: ['Small (14.5)', 'Medium (15.5)', 'Large (16.5)', 'XL (17.5)']
    },
    tags: ['shirt', 'oxford', 'menswear', 'wardrobe']
  }
];

// Helper functions for easy filtering and access
export const getFeaturedProducts = () => products.filter(p => p.isFeatured);
export const getNewArrivals = () => products.filter(p => p.isNew);
export const getBestSellers = () => products.filter(p => p.isBestSeller);
export const getProductById = (id) => products.find(p => p.id === id);
export const getRelatedProducts = (id, category, limit = 4) => {
  return products
    .filter(p => p.id !== id && (p.category === category || p.isFeatured))
    .slice(0, limit);
};
