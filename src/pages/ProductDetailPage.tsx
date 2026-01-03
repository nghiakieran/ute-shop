/**
 * Product Detail Page
 * Show detailed product information with image gallery and add to cart
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ChevronLeft, Star, Truck, Shield, Package } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Zoom } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addToCart } from '@/redux/slices/cart.slice';
import { fetchProductReviews, selectReviews, selectReviewStats } from '@/redux/slices/review.slice';
import {
  fetchProductComments,
  submitComment,
  editComment,
  removeComment,
  selectComments,
  selectCommentLoading,
  selectCommentPagination,
} from '@/redux/slices/comment.slice';
import { Button, Loading, ReviewCard, SimilarProducts, CommentList } from '@/components';
import { useAuth } from '@/hooks';
import { MainLayout } from '@/layouts';
import { getProductDetail } from '@/utils/product.api';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const reviews = useAppSelector(selectReviews);
  const reviewStats = useAppSelector(selectReviewStats);
  const comments = useAppSelector(selectComments);
  const commentsLoading = useAppSelector(selectCommentLoading);
  const commentsPagination = useAppSelector(selectCommentPagination);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (slug) {
      loadProduct(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (product?.id) {
      dispatch(fetchProductReviews(product.id));
      dispatch(fetchProductComments({ productId: product.id, page: 1, limit: 5 }));
    }
  }, [product?.id, dispatch]);

  const loadProduct = async (slug: string) => {
    setLoading(true);
    try {
      const data = await getProductDetail(slug);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      // Save current location to redirect back after login
      const currentPath = window.location.pathname;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Check if product is out of stock
    if (product.quantityStock === 0) {
      toast.error('Sản phẩm này hiện đang hết hàng');
      return;
    }

    // Check if requested quantity exceeds available stock
    if (quantity > product.quantityStock) {
      toast.error(`Chỉ còn ${product.quantityStock} sản phẩm`);
      return;
    }

    console.log('Adding to cart, product:', product);
    if (!product.id) {
      toast.error(`Product ID missing! Keys: ${Object.keys(product).join(', ')}`);
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: product.id,
          quantity,
        })
      ).unwrap();

      // Custom toast with product image and details
      toast.success(
        () => (
          <div className="flex items-center gap-3">
            <img
              src={product.images?.[0]?.url || 'https://via.placeholder.com/48'}
              alt={product.productName}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{product.productName}</p>
              <p className="text-xs text-muted-foreground">x{quantity}</p>
            </div>
          </div>
        ),
        {
          duration: 3000,
          position: 'bottom-right',
        }
      );
    } catch (error: any) {
      toast.error(error || 'Failed to add to cart. Please try again later', {
        duration: 4000,
        position: 'bottom-right',
      });
    }
  };

  const handleBuyNow = async () => {
    if (!product) {
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mua hàng');
      // Save current location to redirect back after login
      const currentPath = window.location.pathname;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Check if product is out of stock
    if (product.quantityStock === 0) {
      toast.error('Sản phẩm này hiện đang hết hàng');
      return;
    }

    // Check if requested quantity exceeds available stock
    if (quantity > product.quantityStock) {
      toast.error(`Chỉ còn ${product.quantityStock} sản phẩm`);
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: product.id,
          quantity,
        })
      ).unwrap();

      toast.success('Đang chuyển đến giỏ hàng...');

      navigate('/cart');
    } catch (error: any) {
      toast.error(error || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại sau', {
        duration: 4000,
        position: 'bottom-right',
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container-custom py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
          <Button onClick={() => navigate('/products')}>Xem sản phẩm</Button>
        </div>
      </MainLayout>
    );
  }

  const hasDiscount = product.discountCampaign && product.discountCampaign.percentage > 0;
  const discountPercentage = product.discountCampaign?.percentage || 0;
  const finalPrice = product.unitPrice;
  const originalPrice = product.originalPrice;
  const isOutOfStock = product.quantityStock === 0 || product.productStatus === 'OUT_OF_STOCK';

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="container-custom py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-foreground transition-colors">
              Sản phẩm
            </Link>
            <span>/</span>
            <Link
              to={`/products?category=${product.category?.id}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category?.categoryName || 'Danh mục'}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.productName}</span>
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Quay lại
          </button>
        </div>

        {/* Product Detail */}
        <div className="container-custom pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery with Swiper */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Swiper */}
              <Swiper
                style={
                  {
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                  } as any
                }
                loop={true}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs, Zoom]}
                zoom={true}
                className="aspect-[3/4] bg-muted rounded-lg overflow-hidden"
              >
                {product.images && product.images.length > 0 ? (
                  product.images.map((image: any, index: number) => (
                    <SwiperSlide key={index}>
                      <div className="swiper-zoom-container">
                        <img
                          src={image.url}
                          alt={`${product.productName} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <img
                      src="https://via.placeholder.com/400"
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                )}
              </Swiper>

              {/* Thumbnail Swiper */}
              {product.images && product.images.length > 1 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  loop={true}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="thumbs-swiper"
                >
                  {product.images.map((image: any, index: number) => (
                    <SwiperSlide key={index}>
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors cursor-pointer">
                        <img
                          src={image.url}
                          alt={`${product.productName} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                {hasDiscount && (
                  <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
                    Sale -{discountPercentage}%
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  {product.category?.categoryName}
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{product.brand?.brandName}</span>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                  {product.productName}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.ratingAvg || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.ratingAvg?.toFixed(1) || '0.0'} ({product.views || 0} views)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">
                  {finalPrice?.toLocaleString('vi-VN')}₫
                </span>
                {hasDiscount && originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {originalPrice?.toLocaleString('vi-VN')}₫
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm font-medium ${
                    !isOutOfStock ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {!isOutOfStock ? `Còn hàng (${product.quantityStock} có sẵn)` : 'Hết hàng'}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Mô tả</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Quantity */}
              {!isOutOfStock && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Số lượng</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-md border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.quantityStock, quantity + 1))}
                      className="w-10 h-10 rounded-md border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= product.quantityStock}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1"
                  disabled={isOutOfStock}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
                </Button>
                <Button onClick={handleBuyNow} className="flex-1" disabled={isOutOfStock}>
                  {isOutOfStock ? 'Hết hàng' : 'Mua ngay'}
                </Button>
                <Button variant="outline" size="default" className="px-4">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Miễn phí vận chuyển</p>
                    <p className="text-sm text-muted-foreground">Đơn hàng trên 1.000.000₫</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Thanh toán an toàn</p>
                    <p className="text-sm text-muted-foreground">100% secure payment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Easy Returns</p>
                    <p className="text-sm text-muted-foreground">30-day return policy</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Reviews Section */}
          <div className="container-custom py-12">
            <div className="bg-card rounded-lg border border-border p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Đánh giá sản phẩm</h2>

              {/* Rating Summary */}
              {reviewStats && reviewStats.totalReviews > 0 && (
                <div className="mb-8 p-6 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">
                        {reviewStats.averageRating.toFixed(1)}
                      </div>
                      <div className="flex gap-1 mb-2 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.round(reviewStats.averageRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {reviewStats.totalReviews} đánh giá
                      </p>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3 mb-2">
                          <span className="text-sm w-12">{rating} sao</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${
                                  (reviewStats.ratingDistribution[
                                    rating as keyof typeof reviewStats.ratingDistribution
                                  ] /
                                    reviewStats.totalReviews) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12">
                            {
                              reviewStats.ratingDistribution[
                                rating as keyof typeof reviewStats.ratingDistribution
                              ]
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              {!reviews || reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="container-custom py-12">
            <div className="bg-card rounded-lg border border-border p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Bình luận</h2>
              <CommentList
                comments={comments}
                loading={commentsLoading}
                pagination={commentsPagination}
                onSubmitComment={async (description, parentId) => {
                  if (!product?.id) return;
                  try {
                    await dispatch(
                      submitComment({
                        productId: product.id,
                        description,
                        parentId,
                      })
                    ).unwrap();
                    toast.success('Bình luận đã được gửi');
                  } catch (error: any) {
                    toast.error(error || 'Không thể gửi bình luận');
                  }
                }}
                onEditComment={async (id, description) => {
                  try {
                    await dispatch(editComment({ id, data: { description } })).unwrap();
                    toast.success('Bình luận đã được cập nhật');
                  } catch (error: any) {
                    toast.error(error || 'Không thể cập nhật bình luận');
                  }
                }}
                onDeleteComment={async (id) => {
                  try {
                    await dispatch(removeComment(id)).unwrap();
                    toast.success('Bình luận đã được xóa');
                  } catch (error: any) {
                    toast.error(error || 'Không thể xóa bình luận');
                  }
                }}
                onLoadMore={async () => {
                  if (!product?.id || !commentsPagination) return;
                  const nextPage = commentsPagination.page + 1;
                  await dispatch(
                    fetchProductComments({ productId: product.id, page: nextPage, limit: 5 })
                  ).unwrap();
                }}
                productId={product?.id || 0}
              />
            </div>
          </div>
          {/* Similar Products Section */}
          {product?.id && (
            <div className="container-custom py-12">
              <SimilarProducts productId={product.id} limit={6} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
