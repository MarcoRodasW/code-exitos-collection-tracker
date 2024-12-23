'use server';

import { CollectionData } from '@/lib/types/collections/collections.types';
import { GetUser } from '../auth/auth.service';

export async function GetCollections(
  searchQuery: string = ''
): Promise<CollectionData[]> {
  const { user, supabase } = await GetUser();
  let query = supabase.from('collections').select('*').eq('user_id', user.id);

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`);
  }

  const { data: collections, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return collections;
}
