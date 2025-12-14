import { AdminSidebar } from '@/components/AdminSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="admin-theme min-h-screen flex w-full">
        <AdminSidebar collapsible />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
