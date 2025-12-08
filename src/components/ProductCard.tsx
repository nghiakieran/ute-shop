import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from './Button';
import { useFavourite } from '@/hooks/useFavourite';
import { cn } from '@/lib/utils';

// Giả sử kiểu 'Product' của bạn trông giống như JSON bạn đã gửi
// (Bạn nên định nghĩa kiểu này ở một file .types.ts riêng)
interface ProductApi {
  id: number;
  slug: string;
  productName: string;
  displayStatus: boolean;
  ratingAvg: number;
  originalPrice: number;
  unitPrice: number;
  productStatus: 'ACTIVE' | 'OUT_OF_STOCK';
  productSold?: number;
  brand?: { brandName: string };
  discountCampaign?: { percentage: number };
  category?: { categoryName: string };
  images: { url: string }[];
  newArrival?: boolean;
}

interface ProductCardProps {
  product: ProductApi;
  onAddToCart?: (product: ProductApi) => void;
  onAddToWishlist?: (product: ProductApi) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { isFavourite, toggleFavourite } = useFavourite(product.id);
  const discountPercentage = product.discountCampaign?.percentage || 0;
  const hasDiscount = discountPercentage > 0;
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url
      : 'https://placehold.co/600x800/eeeeee/333333?text=No+Image';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <Link
        to={`/products/${product.slug || product.id}`}
        className="block relative aspect-[3/4] overflow-hidden bg-muted"
      >
        <img
          src={imageUrl}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) =>
            (e.currentTarget.src = 'https://placehold.co/600x800/eeeeee/333333?text=No+Image')
          }
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.newArrival && (
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavourite();
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-opacity hover:bg-background"
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-colors',
              isFavourite ? 'fill-red-500 stroke-red-500' : 'stroke-current'
            )}
          />
        </button>

        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.(product);
            }}
            disabled={product.productStatus === 'OUT_OF_STOCK'}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.productStatus === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Quick Add'}
          </Button>
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <p className="text-sm text-muted-foreground mb-1">
            {product.category?.categoryName || 'Unknown Category'}
          </p>
          <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.productName}
          </h3>
        </Link>

        {/* Rating & Sold Count */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Rating */}
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.ratingAvg)
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

          {/* Sold Count */}
          {product.productSold !== undefined && (
            <span className="text-xs text-muted-foreground">
              Đã bán {product.productSold}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(product.unitPrice * (1 - discountPercentage / 100))}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.unitPrice)}
            </span>
          )}
        </div>

        {product.productStatus === 'OUT_OF_STOCK' && (
          <p className="text-xs text-destructive mt-2">Out of stock</p>
        )}
      </div>
    </motion.div>
  );
};
