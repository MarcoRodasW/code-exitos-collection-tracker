import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { GetUser } from '@/lib/services/auth/auth.service';
import NavbarUserMenu from './navbar-user-menu';

export default async function Navbar() {
  const { user } = await GetUser();
  return (
    <header className='flex h-16 shrink-0 flex-row items-center justify-between gap-2 border-b px-4'>
      <div className='flex w-full flex-row items-center gap-2'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className='hidden md:block'>
              <BreadcrumbLink href='#'>
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className='hidden md:block' />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='flex w-full flex-row justify-end'>
        <NavbarUserMenu user={user} />
      </div>
    </header>
  );
}
