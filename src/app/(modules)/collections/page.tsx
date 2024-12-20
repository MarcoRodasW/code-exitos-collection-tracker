import { CollectionCard } from '@/components/pages/collections/collections-card';
import CreateCollectionsModal from '@/components/pages/collections/modals/create-collections-modal';
import { Input } from '@/components/ui/input';
import { GetCollections } from '@/lib/services/collections/collections.sevice';

export default async function CollectionPage() {
  const collections = await GetCollections();
  return (
    <section className='flex h-full w-full flex-col gap-6'>
      <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <div className='w-full sm:w-[300px]'>
          <Input placeholder='Search collections...' />
        </div>
        <CreateCollectionsModal />
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}
