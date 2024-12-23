/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { GetUser } from '@/lib/services/auth/auth.service';
import {
  createCollectionItemSchema,
  ItemsData,
  updateCollectionItem,
  updateColletionItemSchema,
  updateImageCollectionItemSchema,
} from '@/lib/types/items/items.types';
import { ApiResponse } from '@/lib/types/shared/api-response';
import { getFileName } from '@/lib/utils';
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

    console.log(imageResponse);

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

export async function DeleteCollectionItem(
  payload: ItemsData
): Promise<ApiResponse<null>> {
  const { supabase, user } = await GetUser();

  try {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('user_id', user.id)
      .eq('collection_id', payload.collection_id)
      .eq('id', payload.id);

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
      message: 'Collection Item deleted succesfully!',
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

export async function UpdateCollectionItem(
  itemId: string,
  payload: updateCollectionItem
): Promise<ApiResponse<ItemsData>> {
  const { user, supabase } = await GetUser();

  const validatedFields = updateColletionItemSchema.safeParse(payload);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.name,
      message: validatedFields.error.message,
      succeed: false,
      data: null,
    };
  }

  try {
    const { data: updateData, error: updateError } = await supabase
      .from('items')
      .update({ ...validatedFields.data })
      .eq('user_id', user.id)
      .eq('id', itemId)
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

export async function UpdateImageCollectionItem(
  payload: FormData,
  item: ItemsData
): Promise<ApiResponse<ItemsData>> {
  const { user, supabase } = await GetUser();
  const validatedFields = updateImageCollectionItemSchema.safeParse({
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
  const fileName = item.image_url ? getFileName(item.image_url) : image.name;
  try {
    const imageResponse = await UploadImageToBucket({
      bucketName: 'item_images',
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
      .from('items')
      .update({ image_url: imageResponse.data })
      .eq('user_id', user.id)
      .eq('id', item.id)
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
      message: `Collection item ${updatedValue.name} image updated succesfully!`,
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
