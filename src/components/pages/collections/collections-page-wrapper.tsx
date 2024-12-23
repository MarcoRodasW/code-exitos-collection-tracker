'use client';

import { Input } from '@/components/ui/input';
import { CollectionData } from '@/lib/types/collections/collections.types';
import { useRouter, useSearchParams } from 'next/navigation';
import { use, useState } from 'react';
import { CollectionCard, SkeletonCard } from './collections-card';
import CreateCollectionsModal from './modals/create-collections-modal';

function CollectionGrid({ collections }: { collections: CollectionData[] }) {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}

export function LoadingGrid() {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {[...Array(4)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

interface CollectionPageWrapperProps {
  collectionPromise: Promise<CollectionData[]>;
}

export default function CollectionsPageWrapper({
  collectionPromise,
}: CollectionPageWrapperProps) {
  const collections = use(collectionPromise);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.push(`/collections?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <div className='w-full sm:w-[300px]'>
          <Input
            placeholder='Search collections...'
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <CreateCollectionsModal />
      </div>

      <CollectionGrid collections={collections} />
    </>
  );
}
