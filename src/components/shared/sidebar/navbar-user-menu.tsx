'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { oAuthSignOut as SignOutAction } from '@/lib/actions/auth/actions';
import { User } from '@supabase/supabase-js';
import { Loader2, LogOut } from 'lucide-react';
import { useTransition } from 'react';

interface NavbarUserMenuProps {
  user: User;
}
export default function NavbarUserMenu({ user }: NavbarUserMenuProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <div className='flex flex-row gap-5'>
      <div className='flex flex-row items-center gap-2'>
        <Avatar className='h-8 w-8 rounded-lg'>
          <AvatarImage
            src={user?.user_metadata?.avatar_url}
            alt={user?.user_metadata?.full_name}
          />
        </Avatar>
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>
            {user?.user_metadata?.full_name}
          </span>
          <span className='truncate text-xs'>{user.email}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          startTransition(() => {
            SignOutAction();
          });
        }}
        disabled={isPending}
      >
        {isPending ? <Loader2 className='animate-spin' /> : <LogOut />}
        Log out
      </Button>
    </div>
  );
}
