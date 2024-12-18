import { CollectionData } from '@/lib/types/collections/collections.types';
import { AuthService } from '../auth/auth.service';

/* eslint-disable @typescript-eslint/no-namespace */
export namespace CollectionService {
  export async function GetCollections(): Promise<CollectionData[]> {
    const { user, supabase } = await AuthService.GetUser();
    const { data: collections, error } = await supabase
      .from('collections')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      throw new Error(error.message);
    }

    return collections;
  }
}
