'use server';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';

/* eslint-disable @typescript-eslint/no-namespace */
export async function GetUser() {
  'use server';
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/');
  }

  return { user, supabase };
}
