/* eslint-disable @typescript-eslint/no-unused-vars */
import CollectionsPageWrapper, {
  LoadingGrid,
} from '@/components/pages/collections/collections-page-wrapper';
import { GetCollections } from '@/lib/services/collections/collections.sevice';
import { Suspense } from 'react';
export const dynamic = 'force-dynamic';
export default function CollectionPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | undefined };
}) {
  const query = searchParams?.q || '';
  const fetchedCollections = GetCollections(query);
  return (
    <section className='flex h-full w-full flex-col gap-6'>
      <Suspense fallback={<LoadingGrid />}>
        <CollectionsPageWrapper collectionPromise={fetchedCollections} />
      </Suspense>
    </section>
  );
}
