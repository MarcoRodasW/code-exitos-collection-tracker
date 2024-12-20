'use server';

import { ApiResponse } from '@/lib/types/shared/api-response';
import { Database } from '@/lib/types/supabase/supabase.types';
import { SupabaseClient, User } from '@supabase/supabase-js';

interface UploadImageToBucketProps {
  supabaseInstance: SupabaseClient<Database>;
  bucketName: string;
  folder: string;
  user: User;
  file?: File;
}
export async function UploadImageToBucket({
  bucketName,
  folder,
  supabaseInstance,
  file,
}: UploadImageToBucketProps): Promise<ApiResponse<string>> {
  if (!file) {
    return {
      data: null,
      succeed: false,
      error: null,
      message: 'No image provided!',
    };
  }

  const { error: errorImageUpload } = await supabaseInstance.storage
    .from(bucketName)
    .upload(folder, file, {
      upsert: true,
    });

  if (errorImageUpload) {
    return {
      error: errorImageUpload.name,
      message: errorImageUpload.message,
      succeed: false,
      data: null,
    };
  }

  const {
    data: { publicUrl },
  } = supabaseInstance.storage.from(bucketName).getPublicUrl(folder);

  return {
    data: publicUrl,
    succeed: true,
    error: null,
    message: 'Image uploaded succesfuly!',
  };
}
