import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    fetchRecentlyViewed,
    selectRecentlyViewedItems,
    selectRecentlyViewedLoading,
} from '@/redux/slices/recently-viewed.slice';
import { ProductCard } from './ProductCard';
import { Skeleton } from './ui/skeleton';
import { ChevronRight } from 'lucide-react';

interface RecentlyViewedProps {
    limit?: number;
}

export const RecentlyViewed = ({ limit = 10 }: RecentlyViewedProps) => {
    const dispatch = useAppDispatch();
    const products = useAppSelector(selectRecentlyViewedItems);
    const loading = useAppSelector(selectRecentlyViewedLoading);

    useEffect(() => {
        dispatch(fetchRecentlyViewed(limit));
    }, [dispatch, limit]);

    if (loading) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Đã xem gần đây</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-64 w-48 flex-shrink-0" />
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
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Đã xem gần đây</h2>
                <button className="flex items-center text-sm text-blue-600 hover:underline">
                    Xem tất cả
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {products.map((product: any) => (
                    <div key={product.id} className="flex-shrink-0 w-48">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};
