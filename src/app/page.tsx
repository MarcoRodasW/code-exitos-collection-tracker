import { UserAuthForm } from '@/components/pages/login/user-auth-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
};

export default function AuthenticationPage() {
  return (
    <div className='grid h-screen w-full place-content-center bg-slate-900'>
      <div className='flex w-[350px] flex-col justify-center space-y-6'>
        <UserAuthForm />
      </div>
    </div>
  );
}
