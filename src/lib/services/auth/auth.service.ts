import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';

/* eslint-disable @typescript-eslint/no-namespace */
export namespace AuthService {
  export async function GetUser() {
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
}
