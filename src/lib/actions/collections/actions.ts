'use server';

import { AuthService } from '@/lib/services/auth/auth.service';
import {
  createCollectionSchema,
  type createCollection,
} from '@/lib/types/collections/collections.types';
import { revalidatePath } from 'next/cache';

export async function CreateCollection(payload: createCollection) {
  const { user, supabase } = await AuthService.GetUser();
  const validatedFields = createCollectionSchema.safeParse(payload);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { description, image_url, name } = validatedFields.data;

  try {
    const { data: insertedData, error } = await supabase
      .from('collections')
      .insert({
        name: name,
        description: description,
        image_url: image_url,
        user_id: user.id,
      })
      .select('*');

    if (error) {
      throw new Error(error.message, { cause: error.cause });
    }
    revalidatePath('/inventory');

    return { success: true, data: insertedData };
  } catch (error) {
    console.error('Error inserting inventory item:', error);
  }
}
