/**
 * Wishlist Page
 * Display user's wishlist items
 */

import { Button } from '@/components';
import { MainLayout } from '@/layouts';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart } from '@/redux/slices/cart.slice';
import {
  clearWishlist,
  fetchFavourites,
  removeFromWishlistAsync,
  selectWishlistItems,
  selectWishlistLoading,
} from '@/redux/slices/wishlist.slice';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const loading = useAppSelector(selectWishlistLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    dispatch(fetchFavourites({ page: currentPage, limit }))
      .unwrap()
      .then((response) => {
        if (response.totalPages) {
          setTotalPages(response.totalPages);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch favourites:', error);
      });
  }, [dispatch, currentPage]);

  const handleRemove = async (id: number) => {
    try {
      await dispatch(removeFromWishlistAsync(id)).unwrap();
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      toast.error('Không thể xóa sản phẩm');
    }
  };

  const handleAddToCart = (product: any) => {
    // Simple add to cart - backend will handle defaults
    dispatch(
      addToCart({
        productId: product.id,
        quantity: 1,
      })
    );

    toast.success(`${product.productName} đã được thêm vào giỏ hàng`);
  };

  const handleClearAll = () => {
    dispatch(clearWishlist());
    toast.success('Đã xóa tất cả sản phẩm yêu thích');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-secondary py-12">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Danh sách yêu thích</h1>
                <p className="text-muted-foreground">
                  {items.length} sản phẩm
                </p>
              </div>
              {items.length > 0 && (
                <Button variant="outline" onClick={handleClearAll}>
                  Xóa tất cả
                </Button>
              )}
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden border border-border">
                  <div className="aspect-[3/4] bg-muted animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                    <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Save items you love to your wishlist
              </p>
              <Link to="/products">
                <Button>Start Shopping</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg overflow-hidden border border-border group"
                >
                  {/* Product Image */}
                  <Link
                    to={`/products/${product.slug}`}
                    className="block relative aspect-[3/4] overflow-hidden bg-muted"
                  >
                    <img
                      src={product.images?.[0]?.url || 'https://placehold.co/600x800/eeeeee/333333?text=No+Image'}
                      alt={product.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discountCampaign?.percentage && (
                      <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
                        -{product.discountCampaign.percentage}%
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(product.id);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link to={`/products/${product.slug}`}>
                      <p className="text-sm text-muted-foreground mb-1">
                        {product.category?.categoryName || 'Unknown'}
                      </p>
                      <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.productName}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.ratingAvg || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                              }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount || 0})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-foreground">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.unitPrice * (1 - (product.discountCampaign?.percentage || 0) / 100))}
                      </span>
                      {product.discountCampaign?.percentage && (
                        <span className="text-sm text-muted-foreground line-through">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.unitPrice)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full"
                      size="sm"
                      disabled={product.productStatus === 'OUT_OF_STOCK'}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.productStatus === 'OUT_OF_STOCK' ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && items.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trang trước
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Trang sau
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default WishlistPage;

