'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CollectionData } from '@/lib/types/collections/collections.types';
import Image from 'next/image';

interface CollectionsTableProps {
  data: CollectionData[];
}

export default function CollectionsTable({ data }: CollectionsTableProps) {
  return (
    <div className='grid h-full w-full grid-cols-4 gap-5'>
      {data.map((item) => (
        <Card key={item.id} className='h-[400px]'>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {item.image_url && (
              <Image
                crossOrigin='anonymous'
                alt={item.name}
                src={item.image_url}
                height={300}
                width={300}
              />
            )}
            <p>{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
