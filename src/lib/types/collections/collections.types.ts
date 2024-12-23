import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '../shared/common';
import { Tables } from '../supabase/supabase.types';

export type CollectionData = Tables<'collections'>;

export const createCollectionSchema = z.object({
  description: z.string().max(70, 'Must be under 70 characters'),
  image_url: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
  name: z.string().min(1, 'Is required to entar a name'),
});

export type createCollection = z.infer<typeof createCollectionSchema>;

export const updateCollectionSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  value: z.number().min(0, {
    message: 'Value must be a positive number.',
  }),
});

export type updateCollection = z.infer<typeof updateCollectionSchema>;

export const updateCollectionImageSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
});

export type updateCollectionImage = z.infer<typeof updateCollectionImageSchema>;
