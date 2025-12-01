/**
 * Wishlist Page
 * Display user's wishlist items
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectWishlistItems,
  removeFromWishlist,
  clearWishlist,
} from '@/redux/slices/wishlist.slice';
import { addToCart } from '@/redux/slices/cart.slice';
import { Button } from '@/components';
import { useToast } from '@/hooks';
import { MainLayout } from '@/layouts';
import { ProductColor, ProductSize } from '@/types/product';
import { Product } from '@/types/order';

const WishlistPage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const items = useAppSelector(selectWishlistItems);

  const handleRemove = (id: string) => {
    dispatch(removeFromWishlist(id));
    toast({
      title: 'Removed from wishlist',
      description: 'Item has been removed from your wishlist',
    });
  };

  const handleAddToCart = (product: Product) => {
    const defaultSize = product.sizes.find((s: ProductSize) => s.available) || product.sizes[0];
    const defaultColor = product.colors.find((c: ProductColor) => c.available) || product.colors[0];

    if (!defaultSize || !defaultColor) {
      toast({
        variant: 'destructive',
        title: 'Cannot add to cart',
        description: 'This product is currently unavailable',
      });
      return;
    }

    dispatch(
      addToCart({
        productId: product.id,
        quantity: 1,
      })
    );

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleClearAll = () => {
    dispatch(clearWishlist());
    toast({
      title: 'Wishlist cleared',
      description: 'All items have been removed from your wishlist',
    });
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
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">My Wishlist</h1>
                <p className="text-muted-foreground">
                  {items.length} {items.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
              {items.length > 0 && (
                <Button variant="outline" onClick={handleClearAll}>
                  Clear All
                </Button>
              )}
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-12">
          {items.length === 0 ? (
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
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discount && (
                      <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
                        -{product.discount}%
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
                        {product.category.name}
                      </p>
                      <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating)
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
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-foreground">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full"
                      size="sm"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default WishlistPage;

