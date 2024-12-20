import { z } from 'zod';
import { Tables } from '../supabase/supabase.types';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export type CollectionData = Tables<'collections'>;

export const createCollectionSchema = z.object({
  description: z.string().max(70, 'Must be under 70 characters'),
  image_url: z.union([
    z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        '.jpg, .jpeg, .png and .webp files are accepted.'
      ),
    z.undefined(), // Permite que sea opcional
  ]),
  name: z.string().min(1, 'Is required to entar a name'),
});

export type createCollection = z.infer<typeof createCollectionSchema>;
