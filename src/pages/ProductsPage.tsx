/**
 * Products Page
 * Display all products with filtering and sorting
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { addToCart } from '@/redux/slices/cart.slice';
import { ProductCard, Button, Loading } from '@/components';
import { MainLayout } from '@/layouts';
import { API_ENDPOINTS } from '@/constants';
import { apiClient } from '@/utils';
import { filterProducts, FilterProductParams } from '@/utils/product.api';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  type CategoryOption = {
    id: number;
    name: string;
  };

  const [categories, setCategories] = useState<CategoryOption[]>([]);

  // Local state for inputs (not yet applied)
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get('search') || '');
  const [localCategory, setLocalCategory] = useState<number | undefined>(
    searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined
  );
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || 50000000,
  ]);
  const [localSortBy, setLocalSortBy] = useState(searchParams.get('sortBy') || 'newest');

  // API state
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Sync local state with URL when URL changes (e.g. back button)
  useEffect(() => {
    setLocalSearchQuery(searchParams.get('search') || '');
    setLocalCategory(
      searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined
    );
    setLocalPriceRange([
      Number(searchParams.get('minPrice')) || 0,
      Number(searchParams.get('maxPrice')) || 50000000,
    ]);
    setLocalSortBy(searchParams.get('sortBy') || 'newest');
    // We don't update pagination state here directly, it's updated after fetch
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.GET_CATEGORIES);
        const raw = response.data?.data?.categories ?? [];

        const formattedCategories = Array.isArray(raw)
          ? raw
            .map((item: any) => ({
              id: Number(item.categoryId ?? item.id),
              name: item.categoryName ?? item.name ?? 'Danh mục',
            }))
            .filter((item) => Number.isFinite(item.id))
          : [];

        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Không thể tải danh mục');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const page = Number(searchParams.get('page')) || 1;
      const limit = 12;
      const minPrice = Number(searchParams.get('minPrice')) || 0;
      const maxPrice = Number(searchParams.get('maxPrice')) || 50000000;
      const search = searchParams.get('search');
      const categoryId = searchParams.get('categoryId')
        ? Number(searchParams.get('categoryId'))
        : undefined;
      const sort = searchParams.get('sortBy') || 'newest';

      const params: FilterProductParams = {
        page,
        limit,
        minPrice,
        maxPrice,
      };

      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;

      // Map sortBy to API format
      if (sort === 'price_asc') {
        params.sortBy = 'price';
        params.sortOrder = 'ASC';
      } else if (sort === 'price_desc') {
        params.sortBy = 'price';
        params.sortOrder = 'DESC';
      } else if (sort === 'rating') {
        params.sortBy = 'rating';
        params.sortOrder = 'DESC';
      } else if (sort === 'name') {
        params.sortBy = 'name';
        params.sortOrder = 'ASC';
      } else {
        params.sortBy = 'views';
        params.sortOrder = 'DESC';
      }

      const result = await filterProducts(params);
      setProducts(result.data);
      setPagination({
        page: Number(result.meta.page),
        limit: Number(result.meta.limit),
        total: Number(result.meta.total),
        totalPages: Number(result.meta.totalPages),
      });
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    const params: any = {};

    // Always reset to page 1 when filtering
    params.page = '1';

    if (localSearchQuery) params.search = localSearchQuery;
    if (localCategory) params.categoryId = localCategory.toString();
    if (localPriceRange[0] > 0) params.minPrice = localPriceRange[0].toString();
    if (localPriceRange[1] < 50000000) params.maxPrice = localPriceRange[1].toString();
    if (localSortBy !== 'newest') params.sortBy = localSortBy;

    setSearchParams(params);
    // Scroll to top to see results
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // On mobile, close sidebar
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setLocalCategory(undefined);
    setLocalPriceRange([0, 50000000]);
    setLocalSearchQuery('');
    setLocalSortBy('newest');
    setSearchParams({}); // Clear all params, reloading defaults
  };

  const handlePageChange = (newPage: number) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort: string) => {
    setLocalSortBy(newSort);
    // For sort, we might want to apply immediately or wait for "Filter" button.
    // User requested "chỗ lọc thì thêm 1 button lọc, khi click thì mới filter".
    // Usually sort is immediate, but let's keep it strictly manual if it's considered a filter,
    // OR we can make sort immediate. Sticking to manual for consistency with "chỗ lọc",
    // BUT usually sort is separate from "Filter sidebar".
    // Looking at the UI, sort is on top of the grid. It's better UX to be immediate there.
    // However, if we want to support "click filter to apply", maybe we should include sort there?
    // Let's make the sort dropdown apply immediately as it's outside the filter sidebar.

    // Actually, let's keep it immediate for the top dropdown to avoid confusion.
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, sortBy: newSort, page: '1' });
  };

  const handleAddToCart = async (product: any) => {
    try {
      await dispatch(
        addToCart({
          productId: product.id,
          quantity: 1,
        })
      ).unwrap();

      toast.success(
        (_t: any) => (
          <div className="flex items-center gap-3">
            <img
              src={product.images?.[0]?.url || 'https://via.placeholder.com/48'}
              alt={product.productName}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{product.productName}</p>
              <p className="text-xs text-muted-foreground">x1</p>
            </div>
          </div>
        ),
        {
          duration: 3000,
          position: 'bottom-right',
        }
      );
    } catch (error: any) {
      toast.error(error || 'Không thể thêm vào giỏ hàng');
    }
  };

  const handleAddToWishlist = (product: any) => {
    toast.success(`Đã thêm ${product.productName} vào danh sách yêu thích`);
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
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                Bộ sưu tập của chúng tôi
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Khám phá những sản phẩm vượt thời gian được chế tác với phong cách Châu Âu thanh
                lịch và tối giản hiện đại
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
                {showFilters ? 'Ẩn bộ lọc' : 'Hiển bộ lọc'}
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
                  <h3 className="text-lg font-medium mb-4">Tìm kiếm</h3>
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Danh mục</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setLocalCategory(undefined)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${!localCategory ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                        }`}
                    >
                      Tất cả sản phẩm
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setLocalCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${localCategory === category.id
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
                  <h3 className="text-lg font-medium mb-4">Khoảng giá</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="50000000"
                      step="100000"
                      value={localPriceRange[1]}
                      onChange={(e) =>
                        setLocalPriceRange([localPriceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{localPriceRange[0].toLocaleString('vi-VN')}₫</span>
                      <span>{localPriceRange[1].toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t">
                  <Button onClick={handleApplyFilters} className="w-full">
                    Lọc sản phẩm
                  </Button>

                  <Button variant="outline" onClick={handleClearFilters} className="w-full">
                    <X className="w-4 h-4 mr-2" />
                    Xóa bộ lọc
                  </Button>
                </div>
              </div>
            </motion.aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort and Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {pagination.total} {pagination.total === 1 ? 'sản phẩm' : 'sản phẩm'}
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-muted-foreground">
                    Sắp xếp:
                  </label>
                  <select
                    id="sort"
                    value={localSortBy} // Show local value
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="newest">Xem nhiều nhất</option>
                    <option value="price_asc">Giá: Thấp đến cao</option>
                    <option value="price_desc">Giá: Cao đến thấp</option>
                    <option value="rating">Đánh giá cao nhất</option>
                    <option value="name">Tên A-Z</option>
                  </select>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loading />
                </div>
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
                        disabled={pagination.page <= 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Trang trước
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
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        Trang sau
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg mb-4">Không tìm thấy sản phẩm</p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Xóa bộ lọc
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
