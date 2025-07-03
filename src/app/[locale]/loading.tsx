'use client';

import { usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  const pathname = usePathname();
  const isRTL = pathname?.startsWith('/ar') || false;

  return (
    <div 
      className={`flex min-h-screen flex-col items-center justify-center bg-white px-4 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-4xl space-y-8">
        {/* Hero Section Skeleton */}
        <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gray-100 md:h-80">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Features Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 rounded-lg border bg-white p-6 shadow-sm">
              <Skeleton className="mx-auto h-12 w-12 rounded-full" />
              <Skeleton className="mx-auto h-6 w-3/4" />
              <Skeleton className="mx-auto h-4 w-full" />
              <Skeleton className="mx-auto h-4 w-5/6" />
            </div>
          ))}
        </div>

        {/* Categories Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Popular Dishes Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3 rounded-lg border bg-white p-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
