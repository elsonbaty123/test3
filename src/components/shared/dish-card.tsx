

'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Dish, User } from '@/lib/types';
import Link from 'next/link';
import { Clock, ChefHat, Star, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/auth-context';

interface DishCardProps {
  dish: Dish;
  chefName: string;
  chefStatus?: User['availabilityStatus'];
}

export function DishCard({ dish, chefName, chefStatus = 'available' }: DishCardProps) {
  const { t } = useTranslation();
  const { user, toggleFavoriteDish, loading: authLoading } = useAuth();

  const getDisplayPrice = (dish: Dish): { finalPrice: number, originalPrice?: number } => {
      const now = new Date();
      if (dish.discountPercentage && dish.discountPercentage > 0 && dish.discountEndDate && new Date(dish.discountEndDate) > now) {
          return {
              finalPrice: dish.price * (1 - dish.discountPercentage / 100),
              originalPrice: dish.price
          };
      }
      return { finalPrice: dish.price };
  }
  const { finalPrice, originalPrice } = getDisplayPrice(dish);

  const isDishAvailable = dish.status === 'available';
  const canOrder = isDishAvailable && chefStatus !== 'closed';

  const getButtonText = () => {
    if (!isDishAvailable) return t('currently_unavailable');
    if (chefStatus === 'closed') return t('chef_closed');
    if (chefStatus === 'busy') return t('order_chef_busy');
    return t('order_now');
  };
  
  const ratingsCount = dish.ratings?.length || 0;
  const averageRating = ratingsCount > 0
    ? dish.ratings?.reduce((sum, r) => sum + r.rating, 0) / ratingsCount
    : 0;
    
  const isFavorited = user?.favoriteDishIds?.includes(dish.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!authLoading && user) {
          toggleFavoriteDish(dish.id);
      }
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Link href={`/dishes/${dish.id}`}>
          <Image
            alt={dish.name}
            className="aspect-video w-full rounded-t-lg object-cover"
            height="225"
            src={dish.imageUrl}
            data-ai-hint="plated food"
            width="400"
          />
        </Link>
        {user && user.role === 'customer' && (
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 end-2 h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white"
                onClick={handleFavoriteClick}
                aria-label={isFavorited ? t('remove_from_favorites') : t('add_to_favorites')}
            >
                <Heart className={cn("h-5 w-5 transition-all", isFavorited && "fill-red-500 text-red-500")} />
            </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className='flex justify-between items-start'>
            <Badge variant="secondary">{dish.category}</Badge>
            <Link href={`/dishes/${dish.id}`} className="hover:text-primary transition-colors text-start">
                <CardTitle className="font-headline text-xl">{dish.name}</CardTitle>
            </Link>
        </div>
        <div className="flex items-center gap-2 mt-2 justify-start">
            <ChefHat className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t('by_chef', { name: chefName })}</span>
        </div>
        <CardDescription className="mt-2 text-sm text-muted-foreground min-h-[40px]">{dish.description}</CardDescription>
        
        <div className="flex items-center justify-between mt-2">
            {ratingsCount > 0 && (
                 <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-sm">{averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">({ratingsCount})</span>
                </div>
            )}
            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>~{dish.prepTime} {t('prep_time_unit')}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between bg-muted/50 mt-auto">
        <Button asChild className={cn("bg-accent hover:bg-accent/90 text-accent-foreground", !canOrder && "bg-muted text-muted-foreground hover:bg-muted")} disabled={!canOrder}>
          <Link href={`/order?dishId=${dish.id}`}>{getButtonText()}</Link>
        </Button>
        {originalPrice ? (
            <div className="flex items-baseline gap-2">
                <p className="text-lg font-bold text-primary">{finalPrice.toFixed(2)}</p>
                <p className="text-sm font-medium text-muted-foreground line-through">{originalPrice.toFixed(2)}</p>
                <p className="sr-only">{t('currency_egp')}</p>
            </div>
        ) : (
            <p className="text-lg font-bold text-primary">{finalPrice.toFixed(2)} {t('currency_egp')}</p>
        )}
      </CardFooter>
    </Card>
  );
}
