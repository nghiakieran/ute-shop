import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useFavourite } from '@/hooks/useFavourite';
import { cn } from '@/lib/utils';

interface FavouriteButtonProps {
    productId: number;
    variant?: 'default' | 'icon';
    className?: string;
}

export const FavouriteButton = ({ productId, variant = 'icon', className }: FavouriteButtonProps) => {
    const { isFavourite, isLoading, toggleFavourite } = useFavourite(productId);

    if (variant === 'icon') {
        return (
            <button
                type="button"
                className={cn(
                    'inline-flex items-center justify-center rounded-full p-2',
                    'hover:bg-gray-100 transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',
                    className
                )}
                onClick={(e) => {
                    console.log('FavouriteButton onClick triggered!');
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Calling toggleFavourite...');
                    toggleFavourite();
                }}
                disabled={isLoading}
            >
                <Heart
                    className={cn(
                        'h-5 w-5 transition-all',
                        isFavourite ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'
                    )}
                />
            </button>
        );
    }

    return (
        <Button
            variant={isFavourite ? 'default' : 'outline'}
            className={className}
            onClick={toggleFavourite}
            disabled={isLoading}
        >
            <Heart className={cn('h-4 w-4 mr-2', isFavourite && 'fill-current')} />
            {isFavourite ? 'Đã yêu thích' : 'Yêu thích'}
        </Button>
    );
};
