'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { oAuthSignIn as SignInAction } from '@/lib/actions/auth/actions';
import GitHubIcon from '@/lib/icons/github';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';

export function UserAuthForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-center text-2xl'>Iniciar sesion</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          variant={'outline'}
          onClick={() => {
            startTransition(() => {
              SignInAction();
            });
          }}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 size={16} className='animate-spin' />
          ) : (
            <GitHubIcon className='mr-2 h-4 w-4' />
          )}
          Iniciar sesion con Github
        </Button>
      </CardContent>
    </Card>
  );
}
