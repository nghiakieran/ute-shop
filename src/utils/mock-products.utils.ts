/**
 * Mock Products Data
 * Fashion e-commerce mock data
 */

// Mock Categories
export const MOCK_CATEGORIES: ProductCategory[] = [
  {
    id: '1',
    name: 'Women',
    slug: 'women',
    description: 'Women\'s Fashion Collection',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
  },
  {
    id: '2',
    name: 'Men',
    slug: 'men',
    description: 'Men\'s Fashion Collection',
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800',
  },
  {
    id: '3',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Fashion Accessories',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800',
  },
  {
    id: '4',
    name: 'Shoes',
    slug: 'shoes',
    description: 'Footwear Collection',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
  },
];

// Mock Products
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic White Shirt',
    slug: 'classic-white-shirt',
    description: 'Timeless white cotton shirt with elegant minimalist design. Perfect for any occasion, crafted from premium quality cotton.',
    price: 89.99,
    originalPrice: 120.00,
    discount: 25,
    category: MOCK_CATEGORIES[1],
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
    ],
    sizes: [
      { id: 's1', name: 'Small', value: 'S', available: true },
      { id: 's2', name: 'Medium', value: 'M', available: true },
      { id: 's3', name: 'Large', value: 'L', available: true },
      { id: 's4', name: 'X-Large', value: 'XL', available: false },
    ],
    colors: [
      { id: 'c1', name: 'White', hex: '#FFFFFF', available: true },
      { id: 'c2', name: 'Light Blue', hex: '#E3F2FD', available: true },
      { id: 'c3', name: 'Black', hex: '#000000', available: false },
    ],
    stock: 45,
    featured: true,
    newArrival: false,
    rating: 4.8,
    reviewCount: 124,
    tags: ['shirt', 'casual', 'essential'],
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Elegant Black Dress',
    slug: 'elegant-black-dress',
    description: 'Sophisticated black dress with timeless European elegance. Perfect for evening events and special occasions.',
    price: 159.99,
    originalPrice: 199.99,
    discount: 20,
    category: MOCK_CATEGORIES[0],
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800',
    ],
    sizes: [
      { id: 's1', name: 'Small', value: 'S', available: true },
      { id: 's2', name: 'Medium', value: 'M', available: true },
      { id: 's3', name: 'Large', value: 'L', available: true },
    ],
    colors: [
      { id: 'c1', name: 'Black', hex: '#000000', available: true },
      { id: 'c2', name: 'Navy', hex: '#1A237E', available: true },
    ],
    stock: 28,
    featured: true,
    newArrival: true,
    rating: 4.9,
    reviewCount: 89,
    tags: ['dress', 'formal', 'evening'],
    createdAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Minimalist Leather Bag',
    slug: 'minimalist-leather-bag',
    description: 'Handcrafted genuine leather bag with minimalist design. Spacious interior with multiple compartments.',
    price: 199.99,
    category: MOCK_CATEGORIES[2],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
      'https://images.unsplash.com/photo-1564422170194-896b89110ef8?w=800',
    ],
    sizes: [
      { id: 's1', name: 'One Size', value: 'OS', available: true },
    ],
    colors: [
      { id: 'c1', name: 'Tan', hex: '#D2B48C', available: true },
      { id: 'c2', name: 'Black', hex: '#000000', available: true },
      { id: 'c3', name: 'Brown', hex: '#8B4513', available: true },
    ],
    stock: 15,
    featured: true,
    newArrival: true,
    rating: 4.7,
    reviewCount: 56,
    tags: ['bag', 'leather', 'accessory'],
    createdAt: new Date('2024-03-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Premium Wool Coat',
    slug: 'premium-wool-coat',
    description: 'Luxurious wool coat with classic European tailoring. Warm, elegant, and perfect for winter.',
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    category: MOCK_CATEGORIES[0],
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800',
    ],
    sizes: [
      { id: 's1', name: 'Small', value: 'S', available: true },
      { id: 's2', name: 'Medium', value: 'M', available: true },
      { id: 's3', name: 'Large', value: 'L', available: false },
    ],
    colors: [
      { id: 'c1', name: 'Camel', hex: '#C19A6B', available: true },
      { id: 'c2', name: 'Grey', hex: '#808080', available: true },
      { id: 'c3', name: 'Navy', hex: '#000080', available: false },
    ],
    stock: 12,
    featured: false,
    newArrival: false,
    rating: 4.9,
    reviewCount: 42,
    tags: ['coat', 'winter', 'wool'],
    createdAt: new Date('2023-11-10').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Slim Fit Jeans',
    slug: 'slim-fit-jeans',
    description: 'Modern slim fit jeans with stretch comfort. Classic design that pairs well with any style.',
    price: 79.99,
    category: MOCK_CATEGORIES[1],
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800',
    ],
    sizes: [
      { id: 's1', name: '30', value: '30', available: true },
      { id: 's2', name: '32', value: '32', available: true },
      { id: 's3', name: '34', value: '34', available: true },
      { id: 's4', name: '36', value: '36', available: true },
    ],
    colors: [
      { id: 'c1', name: 'Dark Blue', hex: '#191970', available: true },
      { id: 'c2', name: 'Black', hex: '#000000', available: true },
      { id: 'c3', name: 'Light Blue', hex: '#4682B4', available: true },
    ],
    stock: 67,
    featured: false,
    newArrival: false,
    rating: 4.6,
    reviewCount: 213,
    tags: ['jeans', 'denim', 'casual'],
    createdAt: new Date('2023-10-05').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Silk Scarf',
    slug: 'silk-scarf',
    description: 'Elegant silk scarf with European-inspired patterns. Adds a touch of sophistication to any outfit.',
    price: 49.99,
    category: MOCK_CATEGORIES[2],
    images: [
      'https://images.unsplash.com/photo-1601924357840-3e4fb95fd127?w=800',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
    ],
    sizes: [
      { id: 's1', name: 'One Size', value: 'OS', available: true },
    ],
    colors: [
      { id: 'c1', name: 'Floral Blue', hex: '#6495ED', available: true },
      { id: 'c2', name: 'Floral Red', hex: '#DC143C', available: true },
      { id: 'c3', name: 'Floral Beige', hex: '#F5DEB3', available: true },
    ],
    stock: 34,
    featured: false,
    newArrival: true,
    rating: 4.8,
    reviewCount: 78,
    tags: ['scarf', 'silk', 'accessory'],
    createdAt: new Date('2024-02-28').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Chelsea Boots',
    slug: 'chelsea-boots',
    description: 'Classic Chelsea boots in premium leather. Versatile and stylish for any season.',
    price: 189.99,
    category: MOCK_CATEGORIES[3],
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
    ],
    sizes: [
      { id: 's1', name: 'EU 40', value: '40', available: true },
      { id: 's2', name: 'EU 41', value: '41', available: true },
      { id: 's3', name: 'EU 42', value: '42', available: true },
      { id: 's4', name: 'EU 43', value: '43', available: false },
    ],
    colors: [
      { id: 'c1', name: 'Brown', hex: '#8B4513', available: true },
      { id: 'c2', name: 'Black', hex: '#000000', available: true },
    ],
    stock: 23,
    featured: true,
    newArrival: false,
    rating: 4.7,
    reviewCount: 91,
    tags: ['boots', 'leather', 'shoes'],
    createdAt: new Date('2023-12-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Cashmere Sweater',
    slug: 'cashmere-sweater',
    description: 'Ultra-soft 100% cashmere sweater. Luxurious comfort with timeless elegance.',
    price: 229.99,
    originalPrice: 299.99,
    discount: 23,
    category: MOCK_CATEGORIES[0],
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
    ],
    sizes: [
      { id: 's1', name: 'Small', value: 'S', available: true },
      { id: 's2', name: 'Medium', value: 'M', available: true },
      { id: 's3', name: 'Large', value: 'L', available: true },
    ],
    colors: [
      { id: 'c1', name: 'Beige', hex: '#F5F5DC', available: true },
      { id: 'c2', name: 'Grey', hex: '#808080', available: true },
      { id: 'c3', name: 'Navy', hex: '#000080', available: true },
    ],
    stock: 18,
    featured: true,
    newArrival: true,
    rating: 5.0,
    reviewCount: 34,
    tags: ['sweater', 'cashmere', 'luxury'],
    createdAt: new Date('2024-03-10').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockProductsUtils = {
  /**
   * Get all products with optional filtering
   */
  getProducts: async (filter?: {
    category?: string;
    featured?: boolean;
    newArrival?: boolean;
    search?: string;
  }): Promise<Product[]> => {
    await delay(500);

    let products = [...MOCK_PRODUCTS];

    if (filter?.category) {
      products = products.filter(p => p.category.slug === filter.category);
    }

    if (filter?.featured) {
      products = products.filter(p => p.featured);
    }

    if (filter?.newArrival) {
      products = products.filter(p => p.newArrival);
    }

    if (filter?.search) {
      const search = filter.search.toLowerCase();
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    return products;
  },

  /**
   * Get product by ID or slug
   */
  getProduct: async (idOrSlug: string): Promise<Product | null> => {
    await delay(300);

    const product = MOCK_PRODUCTS.find(
      p => p.id === idOrSlug || p.slug === idOrSlug
    );

    return product || null;
  },

  /**
   * Get categories
   */
  getCategories: async (): Promise<ProductCategory[]> => {
    await delay(200);
    return MOCK_CATEGORIES;
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (): Promise<Product[]> => {
    await delay(400);
    return MOCK_PRODUCTS.filter(p => p.featured);
  },

  /**
   * Get new arrivals
   */
  getNewArrivals: async (): Promise<Product[]> => {
    await delay(400);
    return MOCK_PRODUCTS.filter(p => p.newArrival);
  },
};

// Log for easy reference
console.log('🛍️ Mock Products Ready:', MOCK_PRODUCTS.length, 'products');
console.log('📂 Categories:', MOCK_CATEGORIES.map(c => c.name).join(', '));

