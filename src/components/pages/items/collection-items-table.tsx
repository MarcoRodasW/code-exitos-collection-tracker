'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GetCollectionItems } from '@/lib/services/items/items.service';
import { CollectionData } from '@/lib/types/collections/collections.types';
import { ItemsData } from '@/lib/types/items/items.types';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DeleteItemModal from './modals/delete-item-modal';

interface CollectionItemsTableProps {
  collection: CollectionData;
}

export default function CollectionItemsTable({
  collection,
}: CollectionItemsTableProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [collectionItems, setCollectionItems] = useState<ItemsData[] | null>(
    []
  );

  useEffect(() => {
    let ignore = false;
    const fetchCollectionItems = async () => {
      const { data } = await GetCollectionItems(collection.id);
      if (!ignore) {
        setCollectionItems(data);
        setIsLoading(false);
      }
    };
    fetchCollectionItems();
    return () => {
      ignore = true;
    };
  }, [collection]);

  return (
    <div className='overflow-hidden rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Year Made</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead hidden>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className='h-10 w-10' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-5 w-full' />
                  </TableCell>
                </TableRow>
              ))
            : null}
          {!isLoading && collectionItems && collectionItems?.length > 0
            ? collectionItems?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className='relative h-10 w-10'>
                      <Image
                        src={
                          item.image_url ?? 'https://fakeimg.pl/600x400?text=@'
                        }
                        alt={item.name}
                        fill
                        className='rounded-sm object-cover'
                      />
                    </div>
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.year_made || 'N/A'}</TableCell>
                  <TableCell>
                    {Intl.NumberFormat('es-HN', {
                      currency: 'LPS',
                      currencyDisplay: 'symbol',
                      style: 'currency',
                    }).format(item.price)}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {Intl.NumberFormat('es-HN', {
                      currency: 'LPS',
                      currencyDisplay: 'symbol',
                      style: 'currency',
                    }).format(item.total_price ?? 0)}
                  </TableCell>
                  <TableCell className='flex flex-row gap-1'>
                    <Button size={'icon'} variant={'ghost'}>
                      <Pencil size={16} />
                    </Button>
                    <DeleteItemModal itemData={item} />
                  </TableCell>
                </TableRow>
              ))
            : null}
          {!isLoading && collectionItems && collectionItems?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}
