import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n-config';

// This page will redirect to the default locale
// The actual home page is at /[locale]/home/page.tsx
export default function RootPage() {
  // Redirect to the default locale home page
  redirect(`/${defaultLocale}/home`);
}

export const dynamic = 'force-dynamic'; // Ensure this page is always dynamic

interface DiscountedDish {
  dish: Dish;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
}

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dishes = [], orders = [], coupons = [], loading: dishesLoading } = useOrders();
  const { chefs = [], loading: authLoading } = useAuth();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const loading = dishesLoading || authLoading;
  const noData = !loading && (!dishes.length || !chefs.length);
  
  // Handle search form submission
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  }, [searchQuery, router]);
  
  // Scroll to section helper
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Get popular dishes (most ordered in the last week)
  const popularDishes = useMemo(() => {
    if (!orders?.length || !dishes?.length) return [];
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const dishOrderCounts = new Map<string, number>();
    
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if (orderDate < oneWeekAgo) return;
      
      // Since Order type has a single dish, we'll use that instead of items array
      if (order.dish?.id) {
        dishOrderCounts.set(
          order.dish.id, 
          (dishOrderCounts.get(order.dish.id) || 0) + (order.quantity || 1)
        );
      }
    });
    
    return Array.from(dishOrderCounts.entries())
      .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
      .slice(0, 10)
      .map(([dishId]: [string, number]) => dishes.find(d => d.id === dishId))
      .filter((dish): dish is Dish => dish !== undefined);
  }, [dishes, orders]);
  

  
  // Get discounted dishes with their discount information
  const discountedDishes = useMemo(() => {
    if (!dishes?.length || !coupons?.length) return [];
    
    const now = new Date();
    return dishes
      .map((dish: Dish) => {
        // Find the best applicable coupon for this dish
        const bestCoupon = coupons
          .filter((coupon: Coupon) => {
            if (!coupon.endDate || !coupon.isActive) return false;
            if (new Date(coupon.endDate) <= now) return false;
            return coupon.appliesTo === 'all' || 
                   (coupon.applicableDishIds && coupon.applicableDishIds.includes(dish.id));
          })
          .sort((a: Coupon, b: Coupon) => b.discountValue - a.discountValue)[0];
        
        if (!bestCoupon) return null;
        
        const discountPercentage = bestCoupon.discountType === 'percentage' 
          ? bestCoupon.discountValue 
          : (bestCoupon.discountValue / dish.price) * 100;
        
        const discountedPrice = bestCoupon.discountType === 'percentage'
          ? dish.price * (1 - bestCoupon.discountValue / 100)
          : Math.max(0, dish.price - bestCoupon.discountValue);
        
        return {
          dish,
          originalPrice: dish.price,
          discountedPrice: parseFloat(discountedPrice.toFixed(2)),
          discountPercentage: parseFloat(discountPercentage.toFixed(1))
        };
      })
      .filter((item): item is DiscountedDish => item !== null)
      .sort((a: DiscountedDish, b: DiscountedDish) => b.discountPercentage - a.discountPercentage);
  }, [dishes, coupons]);
  

  
  // Get chefs with their stats
  const chefsWithStats = useMemo<ChefWithStats[]>(() => {
    return chefs
      .filter((chef): chef is User => chef !== null)
      .map((chef: User) => {
        const chefDishes = dishes.filter(dish => dish.chefId === chef.id);
        const allRatings = chefDishes.flatMap(dish => dish.ratings || []);
        
        const averageRating = allRatings.length > 0 
          ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length 
          : 0;
        
        return {
          ...chef,
          dishCount: chefDishes.length,
          averageRating,
        };
      })
      .filter(chef => chef.dishCount > 0) // Only show chefs with dishes
      .sort((a, b) => b.averageRating - a.averageRating); // Sort by rating
  }, [chefs, dishes]);
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // No data state
  if (noData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">
            {t('no_data_available', 'No data available')}
          </h1>
          <p className="text-muted-foreground">
            {t('check_back_later', 'Please check back later')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroImages[currentImageIndex]})`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container mx-auto px-4 z-10 text-center text-white">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {t('home.hero.title', 'Delicious Food Delivered To Your Door')}
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('home.hero.subtitle', 'Order from the best restaurants in town and enjoy your meal at home')}
          </motion.p>
          
          <motion.div
            className="max-w-2xl mx-auto relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={t('search.placeholder', 'Search for dishes, cuisines, or restaurants')}
                className="w-full py-6 px-6 pr-16 rounded-full text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full"
                size="icon"
                disabled={isSearching}
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
            onClick={() => scrollToSection('featured')}
            initial={{ y: 0 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="h-8 w-8 text-white" />
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <FeatureHighlights />
        </div>
      </section>

      {/* Popular Dishes */}
      <section id="popular-dishes" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t('home.popular_dishes', 'Popular Dishes')}
          </h2>
          {popularDishes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularDishes.map((dish) => (
                <motion.div
                  key={dish.id}
                  className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${dish.imageUrl})` }} />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{dish.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="font-bold">${dish.price.toFixed(2)}</span>
                      <Button size="sm">
                        {t('common.add_to_cart', 'Add to Cart')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t('home.no_popular_dishes', 'No popular dishes available at the moment')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Top Chefs */}
      <ChefShowcase 
        chefs={chefsWithStats.slice(0, 4).map(chef => ({
          ...chef,
          dishCount: chef.dishCount,
          averageRating: chef.averageRating,
          experienceYears: chef.experienceYears || 0
        }))}
        title="home.top_chefs"
        subtitle="home.meet_our_chefs"
      />

      {/* Special Offers */}
      {discountedDishes.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {t('home.special_offers', 'Special Offers')}
            </h2>
            <DiscountedDishesCarousel dishes={discountedDishes} />
          </div>
        </section>
      )}
    </div>
  );
}
