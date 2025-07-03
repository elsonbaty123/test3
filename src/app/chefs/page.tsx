'use client';

import { ChefShowcase } from '@/components/chef-showcase';
import { getChefs } from '@/lib/actions/chef.actions';
import { User, StatusObject } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// Define the chef type with additional properties
interface ChefWithStats extends User {
  dishCount: number;
  averageRating: number;
  experienceYears: number;
  bio?: string;
  coverImage?: string;
  status?: StatusObject;
  location?: string; // Add location property to match the chef card
}

// Helper function for default translations
const defaultTranslations = (key: string, defaultValue: string = '') => {
  try {
    const { default: translations } = require('@/messages/en.json');
    const keys = key.split('.');
    let result = translations;
    
    for (const k of keys) {
      result = result?.[k];
      if (!result) break;
    }
    
    return result || defaultValue || key;
  } catch (e) {
    return defaultValue || key;
  }
};

// Client component that uses translations
export default function ChefsPage() {
  const t = useTranslations('home');
  const [chefs, setChefs] = useState<ChefWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const chefsData = await getChefs();
        // Process and validate chef data
        const processedChefs = (chefsData as ChefWithStats[]).map(chef => ({
          ...chef,
          location: chef.location || t('location_not_specified', { defaultValue: 'Location not specified' }),
          bio: chef.bio || t('default_bio', { defaultValue: 'Passionate chef creating delicious meals' }),
          experienceYears: chef.experienceYears || 0,
          dishCount: chef.dishCount || 0,
          averageRating: chef.averageRating || 0,
        }));
        
        setChefs(processedChefs);
        setError(null);
      } catch (error) {
        console.error('Error loading chefs:', error);
        setError('Failed to load chefs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChefs();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!chefs || chefs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {t('top_chefs', { defaultValue: 'Our Top Chefs' })}
        </h1>
        <p className="text-muted-foreground">
          {t('no_chefs_available', { defaultValue: 'No chefs available at the moment.' })}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-4">
        {t('top_chefs', { defaultValue: 'Our Top Chefs' })}
      </h1>
      <p className="text-muted-foreground text-center mb-12">
        {t('meet_our_chefs', { defaultValue: 'Meet our talented chefs' })}
      </p>
      
      <ChefShowcase 
        chefs={chefs} 
        title={t('top_chefs', { defaultValue: 'Top Chefs' })}
        subtitle={t('meet_our_chefs', { defaultValue: 'Meet our chefs' })}
        showViewAll={false}
      />
    </div>
  );
}


