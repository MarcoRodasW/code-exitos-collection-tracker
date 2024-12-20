'use server';
import { CollectionData } from '@/lib/types/collections/collections.types';
import { GetUser } from '../auth/auth.service';

export async function GetCollections(): Promise<CollectionData[]> {
  const { user, supabase } = await GetUser();
  const { data: collections, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  return collections;
}
