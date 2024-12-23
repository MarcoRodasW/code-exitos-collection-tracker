'use server';

import { getURL } from '@/lib/utils';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function oAuthSignIn() {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: getURL(),
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
