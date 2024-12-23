'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { DeleteCollectionItem } from '@/lib/actions/items/actions';
import { ItemsData } from '@/lib/types/items/items.types';
import { useState, useTransition } from 'react';

interface DeleteItemModalProps {
  itemData: ItemsData;
}
export default function DeleteItemModal({ itemData }: DeleteItemModalProps) {
  const [isPending, startTransition] = useTransition();
  const [openDelete, setOpenDelete] = useState(false);
  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogTrigger asChild>
        <Button size={'icon'} variant={'ghost'} className='text-destructive'>
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className='bg-zinc-900'>
        <DialogHeader>Delete collection</DialogHeader>
        <p>Are you sure to delete {itemData.name}?</p>
        <DialogFooter className='flex flex-row items-center gap-2'>
          <Button variant={'ghost'} onClick={() => setOpenDelete(false)}>
            Cancel
          </Button>
          <Button
            variant={'destructive'}
            disabled={isPending}
            onClick={() => {
              startTransition(async function () {
                const { message } = await DeleteCollectionItem(itemData);
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
