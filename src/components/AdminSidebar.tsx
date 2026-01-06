import { useLocation, useNavigate } from 'react-router-dom';
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
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  MessageCircle,
  Package,
  Percent,
  ShoppingCart,
  Tag,
  Users,
  ChevronRight,
  CalendarClock,
  LogOut,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutUser, selectUser } from '@/redux/slices/auth.slice';
import { useToast } from '@/hooks/useToast';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Sản phẩm', url: '/admin/products', icon: Package },
  { title: 'Đơn hàng', url: '/admin/orders', icon: ShoppingCart },
  { title: 'Người dùng', url: '/admin/users', icon: Users },
  { title: 'Thương hiệu & Danh mục', url: '/admin/brands-categories', icon: Tag },
  { title: 'Khuyến mãi', url: '/admin/promotions', icon: Percent },
  { title: 'Voucher', url: '/admin/vouchers', icon: Tag },
  { title: 'Tin nhắn', url: '/admin/messages', icon: MessageCircle },
  { title: 'Sự kiện', url: '/admin/events', icon: CalendarClock },
];

function SidebarHeaderContent({ collapsible }: { collapsible?: boolean }) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="flex items-center justify-between px-2 py-2">
      <div className="flex items-center gap-2 min-w-0">
        {collapsible && !isCollapsed && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">A</span>
          </div>
        )}

        <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
          <span className="text-sm font-semibold truncate">Admin Panel</span>
          <span className="text-xs text-muted-foreground truncate">Quản lý cửa hàng</span>
        </div>
      </div>
      <SidebarTrigger className="ml-auto shrink-0" />
    </div>
  );
}

export function AdminSidebar({ collapsible }: { collapsible?: boolean }) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAppSelector(selectUser);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast({
        variant: 'success',
        title: 'Đăng xuất thành công',
        description: 'Hẹn gặp lại bạn!',
      });
      navigate('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể đăng xuất. Vui lòng thử lại.',
      });
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader>
        <SidebarHeaderContent collapsible={collapsible} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2">Quản lý</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive =
                  item.url === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                      <NavLink
                        to={item.url}
                        end={item.url === '/admin'}
                        className="flex items-center gap-2 relative"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                        {isActive && <ChevronRight className="h-4 w-4 text-primary" />}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Đăng xuất"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <div className="flex flex-col items-start flex-1">
                <span className="font-medium">{user?.fullName || 'Admin'}</span>
                <span className="text-xs text-muted-foreground">Đăng xuất</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
