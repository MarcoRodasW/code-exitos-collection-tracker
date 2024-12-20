import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '../shared/common';
import { Tables } from '../supabase/supabase.types';

export type ItemsData = Tables<'items'>;

export const createCollectionItemSchema = z.object({
  image_url: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
  name: z.string(),
  price: z.number().min(1, {
    message: 'Required to enter a valid price',
  }),
  quantity: z.number().min(1, {
    message: 'Required to enter quantity of items',
  }),
  year_made: z.number(),
});

export type createCollectionItem = z.infer<typeof createCollectionItemSchema>;
