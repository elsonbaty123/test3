'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Clock, Shield, Truck, ChevronRight } from 'lucide-react';

// Sample hero images
const heroImages = [
  'https://images.unsplash.com/photo-1504674900247-087703934869?q=80&w=2070',
  'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069',
  'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=1998',
];

// Sample categories
const categories = [
  { id: 1, name: 'Italian', image: 'https://images.unsplash.com/photo-1533777324565-a040eb52a7f8?q=80&w=2071' },
  { id: 2, name: 'Japanese', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=2025' },
  { id: 3, name: 'Mexican', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070' },
  { id: 4, name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704c?q=80&w=1964' },
];

export default function HomePage() {
  const t = useTranslations('home');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] max-h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <Image
                src={heroImages[currentHeroIndex]}
                alt="Delicious food"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center text-white">
          <div className="max-w-4xl">
            <motion.h1 
              className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {t('welcome')}
            </motion.h1>
            
            <motion.p 
              className="mb-8 text-lg sm:text-xl md:text-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t('description')}
            </motion.p>
            
            <motion.form 
              onSubmit={handleSearch}
              className="mx-auto flex max-w-2xl gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="h-14 w-full rounded-full border-none bg-white/90 pl-10 text-base text-gray-900 placeholder-gray-500 shadow-lg focus:ring-2 focus:ring-amber-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="h-14 rounded-full bg-amber-500 px-8 text-base font-semibold hover:bg-amber-600"
              >
                {t('search')}
              </Button>
            </motion.form>
          </div>
        </div>

        {/* Hero Indicators */}
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${currentHeroIndex === index ? 'w-6 bg-amber-500' : 'w-2 bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <Clock className="h-8 w-8" />,
                title: t('features.fastDelivery'),
                description: t('features.fastDeliveryDesc')
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: t('features.foodSafety'),
                description: t('features.foodSafetyDesc')
              },
              {
                icon: <Truck className="h-8 w-8" />,
                title: t('features.easyOrdering'),
                description: t('features.easyOrderingDesc')
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="rounded-xl bg-gray-50 p-6 text-center shadow-sm transition-all hover:shadow-md"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold">{t('exploreCategories')}</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              {t('exploreCategoriesDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl shadow-md transition-all hover:shadow-xl"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <div className="mt-1 flex items-center text-sm text-amber-300">
                      <span>{t('explore')}</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Button variant="outline" className="rounded-full px-8">
              {t('viewAllCategories')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
