'use server';

import {
  MostValueCollectionsResponse,
  MostValueItemsResponse,
  OlderItemsReponse,
} from '@/lib/types/dashboard/dahsboard.types';
import { createClient } from '@/lib/utils/supabase/server';

export async function GetMostValueCollections(): Promise<
  MostValueCollectionsResponse[]
> {
  const supabase = await createClient();

  const { data: collectionsData, error } = await supabase
    .from('collections')
    .select('id, name, value, image_url, description')
    .order('value', { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message, { cause: error.cause });
  }

  return collectionsData;
}

export async function GetMostValueItems(): Promise<MostValueItemsResponse[]> {
  const supabase = await createClient();

  const { data: itemsData, error } = await supabase
    .from('items')
    .select('id, name, price, year_made, total_price, quantity, image_url')
    .order('price', { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(error.message, { cause: error.cause });
  }

  return itemsData;
}

export async function GetOlderItems(): Promise<OlderItemsReponse[]> {
  const supabase = await createClient();

  const { data: oldestItemsData, error } = await supabase
    .from('items')
    .select('id, name, price, year_made, total_price, quantity, image_url')
    .order('year_made', { ascending: true })
    .limit(5);

  if (error) {
    throw new Error(error.message, { cause: error.cause });
  }

  return oldestItemsData;
}
