'use server';

import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function oAuthSignIn() {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo:
        'https://code-exitos-collection-tracker.vercel.app/auth/callback',
    },
  });

  if (data.url) {
    redirect(data.url);
  }
}

export async function oAuthSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
