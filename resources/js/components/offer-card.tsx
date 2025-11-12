import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInitials } from '@/hooks/use-initials';
import { formatDistanceToNow } from 'date-fns';
import { Link } from '@inertiajs/react';

interface OfferCardProps {
  offer: {
    id: number;
    title: string;
    description: string;
    image_url?: string;
    offer_category_id?: number;
    category?: {
      id: number;
      name: string;
      slug?: string;
    };
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      name: string;
      email: string;
      avatar?: string;
    };
  };
}

export function OfferCard({ offer }: OfferCardProps) {
  const getInitials = useInitials();
  
  return (
    <Link href={`/offers/${offer.id}`} className="w-full h-full">
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 w-full h-full flex flex-col">
      {offer.image_url && (
        <div className="relative w-full pt-[200px]">
          <img 
            src={offer.image_url} 
            alt={offer.title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {offer.category?.name && (
            <span className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow-md border border-white/20 backdrop-blur-sm">
              {offer.category.name}
            </span>
          )}
        </div>
      )}
      
      <CardHeader className="pb-0">
        <CardTitle className="text-lg mb-2">{offer.title}</CardTitle>
        {!offer.image_url && offer.category?.name && (
          <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full mb-2">
            {offer.category.name}
          </span>
        )}
      </CardHeader>
      
      <CardContent className="pt-5 flex-grow">
 
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{offer.description}</p>
      </CardContent>
      
      <CardFooter className="border-t text-xs text-muted-foreground mt-auto">
      <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={offer.user?.avatar} alt={offer.user?.name} />
              <AvatarFallback className="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                {getInitials(offer.user?.name || '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{offer.user?.name || 'Unknown'}</p>
              <CardDescription>
                {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
              </CardDescription>
            </div>
          </div>

        </div>
      </CardFooter>
    </Card>
    </Link>
  );
}
