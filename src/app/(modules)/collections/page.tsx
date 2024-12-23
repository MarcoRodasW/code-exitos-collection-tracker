'use client';

import {
  CollectionCard,
  SkeletonCard,
} from '@/components/pages/collections/collections-card';
import CreateCollectionsModal from '@/components/pages/collections/modals/create-collections-modal';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { GetCollections } from '@/lib/services/collections/collections.sevice';
import { CollectionData } from '@/lib/types/collections/collections.types';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function CollectionGrid({ collections }: { collections: CollectionData[] }) {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {[...Array(4)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export default function CollectionPage() {
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true);
      const fetchedCollections = await GetCollections(debouncedSearchQuery);
      setCollections(fetchedCollections);
      setIsLoading(false);
    };

    fetchCollections();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.push(`/collections?${params.toString()}`, { scroll: false });
  };

  return (
    <section className='flex h-full w-full flex-col gap-6'>
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

      <Suspense fallback={<LoadingGrid />}>
        {isLoading ? (
          <LoadingGrid />
        ) : (
          <CollectionGrid collections={collections} />
        )}
      </Suspense>
    </section>
  );
}
