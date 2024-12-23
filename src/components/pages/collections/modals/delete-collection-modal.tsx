'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DeleteCollection as DeleteCollectionAction } from '@/lib/actions/collections/actions';
import { CollectionData } from '@/lib/types/collections/collections.types';
import { Loader2, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

interface DeleteCollectionModalProps {
  collection: CollectionData;
}
export default function DeleteCollectionModal({
  collection,
}: DeleteCollectionModalProps) {
  const [isPending, startTransition] = useTransition();
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogTrigger asChild>
        <Button
          variant='destructive'
          size='icon'
          disabled={isPending}
          className='absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100'
        >
          <X className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-zinc-900'>
        <DialogHeader>Delete collection</DialogHeader>
        <p>Are you sure to delete {collection.name} collection?</p>
        <DialogFooter className='flex flex-row items-center gap-2'>
          <Button variant={'ghost'} onClick={() => setOpenDelete(false)}>
            Cancel
          </Button>
          <Button
            variant={'destructive'}
            disabled={isPending}
            onClick={() => {
              startTransition(async function () {
                const { message, error, succeed } =
                  await DeleteCollectionAction(collection);

                if (!succeed && error) {
                  toast.error(message);
                  return;
                }
                toast.success(message);
              });
            }}
          >
            {isPending ? <Loader2 className='animate-spin' /> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
