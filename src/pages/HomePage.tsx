import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart } from 'lucide-react'; // Import ShoppingCart
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchCategories,
  selectCategories,
  fetchNewestProducts,
  fetchBestSellingProducts,
  fetchMostViewedProducts,
  fetchTopDiscountProducts,
  selectNewestProducts,
  selectBestSellingProducts,
  selectMostViewedProducts,
  selectTopDiscountProducts,
} from '@/redux/slices/product.slice';
import { addToCart } from '@/redux/slices/cart.slice';
import { Button, ProductCard } from '@/components';
import { useToast } from '@/hooks';
import { MainLayout } from '@/layouts';

// ==================================================================
// 1. ĐỊNH NGHĨA KIỂU TỪ API (Giống như trong ProductCard.tsx)
// (Lý tưởng nhất, bạn nên chuyển nó vào file types.ts)
// ==================================================================
interface ProductApi {
  id: number;
  productName: string;
  displayStatus: boolean;
  ratingAvg: number;
  originalPrice: number;
  unitPrice: number;
  productStatus: 'ACTIVE' | 'OUT_OF_STOCK';
  brand: { brandName: string };
  discountCampaign: { percentage: number };
  category: { categoryName: string };
  images: { url: string }[];
  newArrival?: boolean;
}

type ProductCategory = any;

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const categories = useAppSelector(selectCategories);

  const newest = useAppSelector(selectNewestProducts);
  const bestSelling = useAppSelector(selectBestSellingProducts);
  const mostViewed = useAppSelector(selectMostViewedProducts);
  const topDiscount = useAppSelector(selectTopDiscountProducts);

  useEffect(() => {
    dispatch(fetchNewestProducts());
    dispatch(fetchBestSellingProducts());
    dispatch(fetchMostViewedProducts());
    dispatch(fetchTopDiscountProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddToCart = (product: ProductApi) => {
    // 🚨 QUAN TRỌNG: API danh sách sản phẩm không trả về `sizes` và `colors`.
    // Logic "Quick Add" (thêm nhanh) không thể thực hiện được.
    // Chúng ta phải yêu cầu người dùng xem chi tiết.

    // const defaultSize =
    //   product.sizes.find((s: ProductSize) => s.available) || product.sizes[0];
    // const defaultColor =
    //   product.colors.find((c: ProductColor) => c.available) ||
    //   product.colors[0];

    // if (!defaultSize || !defaultColor) { ... }

    // Logic cũ đã bị xóa vì `product.sizes` không tồn tại.
    // Thay vào đó, chúng ta hiển thị một thông báo:
    toast({
      variant: 'default',
      title: 'Vui lòng chọn Size & Màu sắc',
      description: `Nhấn vào sản phẩm "${product.productName}" để xem chi tiết.`,
      // Bạn có thể thêm một nút action để điều hướng
      // action: <ToastAction altText="View" onClick={() => navigate(...)}>View</ToastAction>,
    });

    // Code dispatch (thêm vào giỏ hàng) cũ đã bị xóa.
    // dispatch(
    //   addToCart({ ... })
    // );
  };

  const handleAddToWishlist = (product: ProductApi) => {
    // Sửa kiểu: Product -> ProductApi
    toast({
      title: 'Đã thêm vào danh sách yêu thích',
      description: `${product.productName} đã được thêm vào danh sách yêu thích của bạn`, // Sửa: name -> productName
    });
  };

  return (
    <MainLayout>
      {/* Hero Section (Giữ nguyên) */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Thời trang Châu Âu vượt thời gian
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/90 mb-10 font-light"
          >
            Khám phá sự thanh lịch tối giản với bộ sưu tập tinh té của chúng tôi
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/products">
              <Button size="lg" className="text-lg px-8">
                Xem bộ sưu tập
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section (Giữ nguyên - giả sử category có 'id', 'slug', 'image', 'name') */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Mua sắm theo danh mục
            </h2>
            <p className="text-muted-foreground text-lg">
              Khám phá các bộ sưu tập tinh té của chúng tôi
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map(
              (
                category: any,
                index: number // Dùng 'any' nếu chưa có kiểu
              ) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/products?category=${category.slug}`} // Mock data có 'slug', API thật có thể không
                    className="group block relative aspect-[3/4] rounded-lg overflow-hidden"
                  >
                    <img
                      src={category.image} // Mock data có 'image'
                      alt={category.name} // Mock data có 'name'
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white text-xl font-serif font-bold mb-1">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-sm flex items-center">
                        Mua ngay
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Best Selling Products (Hiển thị 4) */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Sản phẩm bán chạy</h2>
            <p className="text-muted-foreground text-lg">Sản phẩm yêu thích nhất của khách hàng</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSelling.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>

          {bestSelling.length > 4 && (
            <div className="text-center mt-12">
              <Link to="/products">
                <Button variant="outline" size="lg">
                  Xem tất cả sản phẩm
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* 4. SỬA HIỂN THỊ (slice 8 SẢN PHẨM) */}
      {/* ================================================================== */}
      {newest.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Sản phẩm mới nhất</h2>
              <p className="text-muted-foreground text-lg">
                Những lựa chọn mới, dành riêng cho bạn
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* SỬA TẠI ĐÂY: slice(0, 8) để hiển thị 8 sản phẩm */}
              {newest.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Most Viewed Products (Hiển thị 4) */}
      {mostViewed.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Sản phẩm xem nhiều</h2>
              <p className="text-muted-foreground text-lg">Những sản phẩm mọi người đang xem</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mostViewed.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Top Discount Products (Hiển thị 4) */}
      {topDiscount.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                Sản phẩm giảm giá hấp dẫn
              </h2>
              <p className="text-muted-foreground text-lg">
                Nhanh tay! Những ưu đãi tốt nhất cho bạn
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topDiscount.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section (Giữ nguyên) */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
              Tham gia cộng đồng thời trang của chúng tôi
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Nhận quyền truy cập đặc biệt vào hàng mới về, ưu đãi đặc biệt và cảm hứng thời trang
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="px-6 py-3 rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-w-[300px]"
              />
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                Đăng ký
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
