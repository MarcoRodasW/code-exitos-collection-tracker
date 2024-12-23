/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { GetUser } from '@/lib/services/auth/auth.service';
import {
  CollectionData,
  createCollectionSchema,
  updateCollection,
  updateCollectionImageSchema,
  updateCollectionSchema,
} from '@/lib/types/collections/collections.types';
import { ApiResponse } from '@/lib/types/shared/api-response';
import { getFileName } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { UploadImageToBucket } from '../shared/actions';

export async function CreateCollection(
  payload: FormData
): Promise<ApiResponse<CollectionData[]>> {
  const { user, supabase } = await GetUser();

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
      .from('collections')
      .insert({
        name: name,
        description: description,
        image_url: imageResponse.data,
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

export async function DeleteCollection(
  collection: CollectionData
): Promise<ApiResponse<null>> {
  const { supabase, user } = await GetUser();

  try {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('user_id', user.id)
      .eq('id', collection.id);

    if (error) {
      return {
        message: error.message,
        succeed: false,
        error: error.name,
        data: null,
      };
    }
    revalidatePath('/collections');

    return {
      data: null,
      error: null,
      message: 'Collection deleted succesfully!',
      succeed: true,
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

export async function UpdateCollection(
  collectionId: string,
  payload: updateCollection
): Promise<ApiResponse<CollectionData>> {
  const { user, supabase } = await GetUser();
  const validatedFields = updateCollectionSchema.safeParse(payload);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.name,
      message: validatedFields.error.message,
      succeed: false,
      data: null,
    };
  }

  const { name, description } = validatedFields.data;

  try {
    const { data: updateData, error: updateError } = await supabase
      .from('collections')
      .update({ name: name, description: description })
      .eq('user_id', user.id)
      .eq('id', collectionId)
      .select();

    if (updateError) {
      return {
        error: updateError.name,
        message: updateError.message,
        succeed: false,
        data: null,
      };
    }
    const updatedValue = updateData[0];
    revalidatePath('/collections');
    return {
      error: null,
      message: `Collection ${updatedValue.name} updated succesfully!`,
      succeed: true,
      data: updatedValue,
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

export async function UpdateImageCollection(
  payload: FormData,
  collection: CollectionData
): Promise<ApiResponse<CollectionData>> {
  const { user, supabase } = await GetUser();
  const validatedFields = updateCollectionImageSchema.safeParse({
    image: payload.get('image') as File,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.name,
      message: validatedFields.error.message,
      succeed: false,
      data: null,
    };
  }

  const { image } = validatedFields.data;
  const fileName = collection.image_url
    ? getFileName(collection.image_url)
    : image.name;
  try {
    const imageResponse = await UploadImageToBucket({
      bucketName: 'collection_images',
      file: image,
      folder: `${user.id}/${fileName}`,
      supabaseInstance: supabase,
      user: user,
    });

    console.log(imageResponse);

    if (!imageResponse.succeed) {
      return {
        ...imageResponse,
        data: null,
      };
    }

    const { data: updateData, error: updateError } = await supabase
      .from('collections')
      .update({ image_url: imageResponse.data })
      .eq('user_id', user.id)
      .eq('id', collection.id)
      .select();

    console.log(updateData);

    if (updateError) {
      return {
        error: updateError.name,
        message: updateError.message,
        succeed: false,
        data: null,
      };
    }
    const updatedValue = updateData[0];
    revalidatePath('/collections');
    return {
      error: null,
      message: `Collection ${updatedValue.name} image updated succesfully!`,
      succeed: true,
      data: updatedValue,
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
