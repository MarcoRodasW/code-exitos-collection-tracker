import MostValueCollectionsChart from '@/components/pages/dashboard/most-value-collections-chart';
import { MostValueItemsChart } from '@/components/pages/dashboard/most-value-items-chart';
import {
  GetMostValueCollections,
  GetMostValueItems,
} from '@/lib/services/dashboard/dashboard.service';
import { Suspense } from 'react';

export default async function DashboardPage() {
  const mostValueCollections = await GetMostValueCollections();
  const mostValueItems = await GetMostValueItems();
  return (
    <section className='grid h-full w-full grid-cols-1 gap-5 md:grid-cols-4'>
      <div className='col-span-1 min-h-[350px] w-full md:col-span-2'>
        <Suspense fallback={<div>Loading most valuable collections...</div>}>
          <MostValueItemsChart data={mostValueItems} />
        </Suspense>
      </div>
      <div className='col-span-1 min-h-[350px] w-full md:col-span-2'>
        <Suspense fallback={<div>Loading most valuable collections...</div>}>
          <MostValueCollectionsChart data={mostValueCollections} />
        </Suspense>
      </div>
    </section>
  );
}
