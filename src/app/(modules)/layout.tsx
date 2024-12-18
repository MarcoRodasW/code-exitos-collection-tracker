import Navbar from '@/components/shared/sidebar/navbar';
import AppSidebar from '@/components/shared/sidebar/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <div className='flex h-full w-full flex-col px-10 py-10 sm:container sm:mx-auto sm:px-0'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
