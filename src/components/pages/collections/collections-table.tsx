'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CollectionData } from '@/lib/types/collections/collections.types';

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
            <p>{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
