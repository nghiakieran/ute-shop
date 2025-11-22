import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Tag,
  Percent,
  Settings,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Sản phẩm', url: '/admin/products', icon: Package },
  { title: 'Đơn hàng', url: '/admin/orders', icon: ShoppingCart },
  { title: 'Người dùng', url: '/admin/users', icon: Users },
  { title: 'Thương hiệu & Danh mục', url: '/admin/brands-categories', icon: Tag },
  { title: 'Khuyến mãi', url: '/admin/promotions', icon: Percent },
];

export function AdminSidebar() {
  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <div className="px-6 py-5 border-b border-border">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Quản lý cửa hàng</p>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-2">Quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="flex items-center gap-3 px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium border-l-4 border-sidebar-primary"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
