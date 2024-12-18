import CollectionsTable from '@/components/pages/collections/collections-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CollectionService } from '@/lib/services/collections/collections.sevice';
import { Plus } from 'lucide-react';

export default async function CollectionPage() {
  const data = await CollectionService.GetCollections();
  return (
    <div className='flex h-full w-full flex-col gap-5'>
      <div className='flex w-full flex-row items-center justify-between'>
        <Input className='max-w-lg' />
        <Button>
          <Plus />
          Add new collection
        </Button>
      </div>
      <CollectionsTable data={data ?? []} />
    </div>
  );
}
