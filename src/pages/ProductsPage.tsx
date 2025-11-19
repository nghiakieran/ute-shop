/**
 * Products Page
 * Display all products with filtering and sorting
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchCategories,
  selectCategories,
} from '@/redux/slices/product.slice';
import { addToCart } from '@/redux/slices/cart.slice';
import { ProductCard, Button, Loading } from '@/components';
import { useToast, useDebounce } from '@/hooks';
import { MainLayout } from '@/layouts';
import { filterProducts, FilterProductParams } from '@/utils/product.api';

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const categories = useAppSelector(selectCategories);

  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Debounce search query and price range with 500ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedPriceRange = useDebounce(priceRange, 500);

  // API state
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sortBy, debouncedPriceRange, pagination.page, debouncedSearchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: FilterProductParams = {
        page: pagination.page,
        limit: pagination.limit,
        minPrice: debouncedPriceRange[0],
        maxPrice: debouncedPriceRange[1],
      };

      if (debouncedSearchQuery) {
        params.search = debouncedSearchQuery;
      }

      if (selectedCategory) {
        params.categoryId = selectedCategory;
      }

      // Map sortBy to API format
      if (sortBy === 'price_asc') {
        params.sortBy = 'price';
        params.sortOrder = 'ASC';
      } else if (sortBy === 'price_desc') {
        params.sortBy = 'price';
        params.sortOrder = 'DESC';
      } else if (sortBy === 'rating') {
        params.sortBy = 'rating';
        params.sortOrder = 'DESC';
      } else if (sortBy === 'name') {
        params.sortBy = 'name';
        params.sortOrder = 'ASC';
      } else {
        params.sortBy = 'views';
        params.sortOrder = 'DESC';
      }

      const result = await filterProducts(params);
      setProducts(result.data);
      setPagination({
        page: result.meta.page,
        limit: result.meta.limit,
        total: result.meta.total,
        totalPages: result.meta.totalPages,
      });
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load products',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: any) => {
    dispatch(
      addToCart({
        product,
        quantity: 1,
      })
    );

    toast({
      title: 'Added to cart',
      description: `${product.productName} has been added to your cart`,
    });
  };

  const handleAddToWishlist = (product: any) => {
    toast({
      title: 'Added to wishlist',
      description: `${product.productName} has been added to your wishlist`,
    });
  };

  const handleClearFilters = () => {
    setSelectedCategory(undefined);
    setPriceRange([0, 50000000]);
    setSearchQuery('');
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-secondary py-12 md:py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Collection</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover timeless pieces crafted with European elegance and modern minimalism
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            {/* Filters Sidebar */}
            <motion.aside
              initial={false}
              animate={{ height: showFilters ? 'auto' : 0 }}
              className={`lg:w-64 lg:flex-shrink-0 overflow-hidden lg:overflow-visible ${showFilters ? 'block' : 'hidden lg:block'
                }`}
            >
              <div className="space-y-6 lg:sticky lg:top-24">
                {/* Search */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Search</h3>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPagination({ ...pagination, page: 1 });
                    }}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(undefined);
                        setPagination({ ...pagination, page: 1 });
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${!selectedCategory
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent'
                        }`}
                    >
                      All Products
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(Number(category.id));
                          setPagination({ ...pagination, page: 1 });
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === Number(category.id)
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent'
                          }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="50000000"
                      step="100000"
                      value={priceRange[1]}
                      onChange={(e) => {
                        setPriceRange([0, parseInt(e.target.value)]);
                        setPagination({ ...pagination, page: 1 });
                      }}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{priceRange[0].toLocaleString('vi-VN')}₫</span>
                      <span>{priceRange[1].toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedCategory || priceRange[1] !== 50000000 || searchQuery) && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </motion.aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort and Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {pagination.total} {pagination.total === 1 ? 'product' : 'products'}
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-muted-foreground">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPagination({ ...pagination, page: 1 });
                    }}
                    className="border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="newest">Most Viewed</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>

              {/* Loading State */}
              {loading && products.length === 0 ? (
                <Loading />
              ) : products.length > 0 ? (
                <>
                  {/* Products Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onAddToWishlist={handleAddToWishlist}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            // Show first page, last page, current page, and pages around current
                            return (
                              page === 1 ||
                              page === pagination.totalPages ||
                              Math.abs(page - pagination.page) <= 1
                            );
                          })
                          .map((page, index, array) => {
                            // Add ellipsis if there's a gap
                            const prevPage = array[index - 1];
                            const showEllipsis = prevPage && page - prevPage > 1;

                            return (
                              <div key={page} className="flex items-center gap-2">
                                {showEllipsis && <span className="text-muted-foreground">...</span>}
                                <Button
                                  variant={page === pagination.page ? 'default' : 'outline'}
                                  onClick={() => handlePageChange(page)}
                                  className="w-10 h-10"
                                >
                                  {page}
                                </Button>
                              </div>
                            );
                          })}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg mb-4">No products found</p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductsPage;

