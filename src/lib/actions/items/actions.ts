/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { GetUser } from '@/lib/services/auth/auth.service';
import { createCollectionItemSchema } from '@/lib/types/items/items.types';
import { revalidatePath } from 'next/cache';
import { UploadImageToBucket } from '../shared/actions';

export async function CreateCollectionItem(
  payload: FormData,
  collectionId: string
) {
  const { user, supabase } = await GetUser();

  const validatedFields = createCollectionItemSchema.safeParse({
    name: payload.get('name'),
    image_url: payload.get('image_url') as File,
    price: Number(payload.get('price')),
    quantity: Number(payload.get('quantity')),
    year_made: Number(payload.get('year_made')),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.name,
      message: validatedFields.error.message,
      succeed: false,
      data: null,
    };
  }

  const { image_url, name, price, quantity, year_made } = validatedFields.data;

  try {
    const imageResponse = await UploadImageToBucket({
      bucketName: 'item_images',
      file: image_url,
      folder: `${user.id}/${image_url?.name}`,
      supabaseInstance: supabase,
      user: user,
    });

    if (imageResponse.error && !imageResponse.succeed) {
      return {
        ...imageResponse,
        data: null,
      };
    }

    const { data: insertedData, error } = await supabase
      .from('items')
      .insert({
        name: name,
        price: price,
        quantity,
        year_made: year_made,
        image_url: imageResponse.data,
        collection_id: collectionId,
        user_id: user.id,
      })
      .select('*');

    if (error) {
      return {
        error: error.name,
        message: error.message,
        succeed: false,
        data: null,
      };
    }
    revalidatePath('/collections');

    return {
      error: null,
      message: 'Item created succesfully!',
      succeed: true,
      data: insertedData,
    };
  } catch (error: any) {
    console.error('Error inserting inventory item:', error);
    return {
      error: error.name || 'unknown_error',
      message: error.message || 'An unknown error occurred.',
      succeed: false,
      data: null,
    };
  }
}
