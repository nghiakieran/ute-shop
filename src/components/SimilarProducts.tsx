import { useEffect, useState } from 'react';
import { getSimilarProducts } from '@/utils';
import { ProductCard } from './ProductCard';
import { Skeleton } from './ui/skeleton';

interface SimilarProductsProps {
    productId: number;
    limit?: number;
}

export const SimilarProducts = ({ productId, limit = 6 }: SimilarProductsProps) => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSimilar = async () => {
            try {
                setLoading(true);
                const data = await getSimilarProducts(productId, limit);
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch similar products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSimilar();
    }, [productId, limit]);

    if (loading) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Sản phẩm tương tự</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Array.from({ length: limit }).map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Sản phẩm tương tự</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};
