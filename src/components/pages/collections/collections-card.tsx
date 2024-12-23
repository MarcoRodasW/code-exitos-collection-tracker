'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CollectionData } from '@/lib/types/collections/collections.types';
import Image from 'next/image';
import { useState } from 'react';
import CreateCollectionItemModal from './modals/create-collection-item-modal';
import DeleteCollectionModal from './modals/delete-collection-modal';

interface CollectionCardProps {
  collection: CollectionData;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className='group relative overflow-hidden'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && <DeleteCollectionModal collection={collection} />}

      <div className='relative aspect-[4/3]'>
        <Image
          src={collection.image_url ?? 'https://fakeimg.pl/600x400?text=@'}
          alt={collection.name}
          fill
          className='object-cover'
        />
      </div>

      <CardHeader>
        <CardTitle>{collection.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className='line-clamp-2 text-base text-foreground'>
          {Intl.NumberFormat('es-HN', {
            currency: 'LPS',
            currencyDisplay: 'symbol',
            style: 'currency',
          }).format(collection.value)}
        </p>
        <p className='line-clamp-2 text-sm text-muted-foreground'>
          {collection.description}
        </p>
      </CardContent>

      <CardFooter>
        <CreateCollectionItemModal collection={collection} />
      </CardFooter>
    </Card>
  );
}

export function SkeletonCard() {
  return (
    <Card className='overflow-hidden'>
      <div className='relative aspect-[4/3]'>
        <Skeleton className='h-full w-full' />
      </div>
      <CardHeader>
        <Skeleton className='h-6 w-3/4' />
      </CardHeader>
      <CardContent>
        <Skeleton className='mb-2 h-4 w-1/2' />
        <Skeleton className='h-4 w-full' />
      </CardContent>
      <CardFooter>
        <Skeleton className='h-9 w-full' />
      </CardFooter>
    </Card>
  );
}
