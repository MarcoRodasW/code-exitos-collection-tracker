'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
          {Intl.NumberFormat('en-US', {
            currency: 'USD',
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
