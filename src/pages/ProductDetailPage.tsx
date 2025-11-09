/**
 * Product Detail Page
 * Show detailed product information with image gallery and add to cart
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ChevronLeft, Star, Truck, Shield, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchProductById,
  selectCurrentProduct,
  selectProductLoading,
  clearCurrentProduct,
} from '@/redux/slices/product.slice';
import { addToCart } from '@/redux/slices/cart.slice';
import { Button, Loading } from '@/components';
import { useToast } from '@/hooks';
import { MainLayout } from '@/layouts';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const product = useAppSelector(selectCurrentProduct);
  const loading = useAppSelector(selectProductLoading);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductById(slug));
    }

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [slug, dispatch]);

  useEffect(() => {
    if (product) {
      // Auto-select first available size and color
      setSelectedSize(product.sizes.find(s => s.available) || product.sizes[0]);
      setSelectedColor(product.colors.find(c => c.available) || product.colors[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
      toast({
        variant: 'destructive',
        title: 'Selection required',
        description: 'Please select size and color',
      });
      return;
    }

    dispatch(
      addToCart({
        product,
        quantity,
        size: selectedSize,
        color: selectedColor,
      })
    );

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading || !product) {
    return <Loading />;
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = product.discount || 0;

  return (
    <MainLayout>
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container-custom py-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Product Detail */}
      <div className="container-custom pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
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
              {product.newArrival && (
                <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                  New Arrival
                </span>
              )}
              {hasDiscount && (
                <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
                  Sale -{discountPercentage}%
                </span>
              )}
              <span className="text-sm text-muted-foreground">{product.category.name}</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium mb-3">
                Color: <span className="text-muted-foreground">{selectedColor?.name}</span>
              </h3>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => color.available && setSelectedColor(color)}
                    disabled={!color.available}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor?.id === color.id
                        ? 'border-primary scale-110'
                        : 'border-border'
                    } ${!color.available ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-medium mb-3">
                Size: <span className="text-muted-foreground">{selectedSize?.name}</span>
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => size.available && setSelectedSize(size)}
                    disabled={!size.available}
                    className={`px-6 py-3 rounded-md border-2 transition-all ${
                      selectedSize?.id === size.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                    } ${!size.available ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                  >
                    {size.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-md border border-border hover:bg-accent transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-md border border-border hover:bg-accent transition-colors"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
                <span className="text-sm text-muted-foreground ml-2">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button onClick={handleBuyNow} className="flex-1" disabled={product.stock === 0}>
                Buy Now
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
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Secure Payment</p>
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
      </div>
    </div>
    </MainLayout>
  );
};

export default ProductDetailPage;

