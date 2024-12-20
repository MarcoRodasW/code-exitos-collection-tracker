'use server';

import { AuthService } from '@/lib/services/auth/auth.service';
import {
  CollectionData,
  createCollectionSchema,
} from '@/lib/types/collections/collections.types';
import { ApiResponse } from '@/lib/types/shared/api-response';
import { revalidatePath } from 'next/cache';
import { UploadImageToBucket } from '../shared/actions';

export async function CreateCollection(
  payload: FormData
): Promise<ApiResponse<CollectionData[]>> {
  const { user, supabase } = await AuthService.GetUser();

  const validatedFields = createCollectionSchema.safeParse({
    name: payload.get('name'),
    description: payload.get('description'),
    image_url: payload.get('image_url') as File,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.name,
      message: validatedFields.error.message,
      succeed: false,
      data: null,
    };
  }

  const { description, image_url, name } = validatedFields.data;

  try {
    const imageResponse = await UploadImageToBucket({
      bucketName: 'collection_images',
      file: image_url,
      folder: `${user.id}/${image_url?.name}-${name}`,
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
      .from('collections')
      .insert({
        name: name,
        description: description,
        image_url: imageResponse.data,
        user_id: user.id,
      })
      .select('*');

    console.log(error);

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
      message: 'Collection created succesfully!',
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
