'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { Clock, Star, MapPin, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ChefStatus = 'available' | 'busy' | 'closed' | 'offline';

interface Chef {
  id: string;
  name: string;
  image?: string;
  coverImage?: string;
  specialty?: string;
  location?: string;
  bio?: string;
  experienceYears?: number;
  dishCount: number;
  averageRating: number;
  status?: {
    type: ChefStatus;
    id: string;
    createdAt: string;
  };
  availabilityStatus?: ChefStatus;
}

interface ChefCardProps {
  chef: Chef;
}

export function ChefCard({ chef }: ChefCardProps) {
  const t = useTranslations('home');

  const statusMap = {
    available: { 
      className: 'bg-green-100 text-green-800 border-green-200', 
      icon: <CheckCircle className="w-4 h-4 mr-1" /> 
    },
    busy: { 
      className: 'bg-amber-100 text-amber-800 border-amber-200', 
      icon: <Clock className="w-4 h-4 mr-1" /> 
    },
    closed: { 
      className: 'bg-red-100 text-red-800 border-red-200', 
      icon: <Clock className="w-4 h-4 mr-1" /> 
    },
    offline: {
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: <Clock className="w-4 h-4 mr-1" />
    }
  } as const;

  const statusType = chef.status?.type || chef.availabilityStatus || 'offline';
  const status = statusMap[statusType];
  const initials = chef.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 rounded-xl bg-white">
      {/* Cover Image */}
      <div className="h-32 bg-gray-100 overflow-hidden">
        {chef.coverImage ? (
          <img 
            src={chef.coverImage} 
            alt={`${chef.name}'s cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300" />
        )}
      </div>

      {/* Chef Image with Status */}
      <div className="relative -mt-12 px-4">
        <div className="flex items-end">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage 
                src={chef.image || ''} 
                alt={chef.name} 
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Status Badge */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <Badge 
                variant="outline" 
                className={cn(
                  'flex items-center px-2 py-1 text-xs font-medium rounded-full border shadow-sm',
                  status.className
                )}
              >
                {status.icon}
                <span>{statusType.charAt(0).toUpperCase() + statusType.slice(1)}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Chef Info */}
      <CardContent className="p-4 pt-2 flex-grow">
        <div className="text-center mb-3">
          <Link href={`/chefs/${chef.id}`} className="hover:text-primary transition-colors">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary">{chef.name}</h3>
            {chef.specialty && (
              <p className="text-sm text-primary font-medium">{chef.specialty}</p>
            )}
          </Link>
          
          {chef.location && (
            <div className="flex items-center justify-center mt-1 text-sm text-gray-500">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span>{chef.location}</span>
            </div>
          )}
        </div>

        {chef.bio && (
          <p className="text-sm text-gray-600 mb-4 text-center line-clamp-2">{chef.bio}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500">Experience</div>
            <div className="text-lg font-bold text-gray-900">
              {chef.experienceYears ? `${chef.experienceYears}+` : 'N/A'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500">Dishes</div>
            <div className="text-lg font-bold text-gray-900">{chef.dishCount || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-500">Rating</div>
            <div className="flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="font-bold">
                {chef.averageRating > 0 ? chef.averageRating.toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <Link 
          href={`/chefs/${chef.id}`}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          View Profile
        </Link>
      </CardFooter>
    </Card>
  );
}
