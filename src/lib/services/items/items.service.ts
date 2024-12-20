'use server';
import { ItemsData } from '@/lib/types/items/items.types';
import { ApiResponse } from '@/lib/types/shared/api-response';
import { GetUser } from '../auth/auth.service';

export async function GetCollectionItems(
  collectionId: string
): Promise<ApiResponse<ItemsData[]>> {
  const { user, supabase } = await GetUser();

  const { data: itemsData, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', user.id)
    .eq('collection_id', collectionId);

  if (error) {
    return {
      data: null,
      error: error.name,
      message: error.message,
      succeed: false,
    };
  }

  return {
    data: itemsData,
    error: null,
    message: 'Retrieve items succesfully!`',
    succeed: true,
  };
}
