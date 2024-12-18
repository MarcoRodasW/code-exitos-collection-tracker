import { z } from 'zod';
import { Tables } from '../supabase/supabase.types';

export type CollectionData = Tables<'collections'>;

export const createCollectionSchema = z.object({
  description: z.string().max(10, 'Must be under 10 characteres').nullable(),
  image_url: z.string().nullable(),
  name: z.string(),
});

export type createCollection = z.infer<typeof createCollectionSchema>;
