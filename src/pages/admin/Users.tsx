import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllUsers, searchUsers, AdminUser } from '@/utils/user.api';
import { useToast } from '@/hooks/useToast';
import { Loading } from '@/components';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/utils/format.utils';

const users = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    role: 'admin',
    status: 'active',
    joinDate: '2023-01-15',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    role: 'customer',
    status: 'active',
    joinDate: '2023-03-20',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    role: 'customer',
    status: 'inactive',
    joinDate: '2023-05-10',
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@email.com',
    role: 'moderator',
    status: 'active',
    joinDate: '2023-07-22',
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    email: 'hoangvane@email.com',
    role: 'customer',
    status: 'active',
    joinDate: '2023-09-05',
  },
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;
  const { toast } = useToast();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers(currentPage, limit);
      setUsers(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalItems(response.pagination?.totalItems || 0);
    } catch (error: any) {
      setUsers([]);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error?.message || 'Không thể tải danh sách người dùng',
      });
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const handleSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      fetchUsers();
      return;
    }

    setLoading(true);
    try {
      const response = await searchUsers(keyword);
      setUsers(response.data || []);
      setTotalPages(1);
      setTotalItems(response.data?.length || 0);
    } catch (error: any) {
      setUsers([]);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error?.message || 'Không thể tìm kiếm người dùng',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // Search when debounced term changes
  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Filter by role (client-side)
  const filteredUsers =
    roleFilter === 'all' ? users : users.filter((user) => user.role === roleFilter);

  const getRoleBadge = (role: string) => {
    const roleMap: Record<string, { label: string; className: string }> = {
      admin: { label: 'Admin', className: 'bg-destructive/10 text-destructive' },
      moderator: { label: 'Moderator', className: 'bg-warning/10 text-warning' },
      user: { label: 'Khách hàng', className: 'bg-primary/10 text-primary' },
    };

    const roleInfo = roleMap[role] || { label: role, className: '' };
    return <Badge className={roleInfo.className}>{roleInfo.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-success/10 text-success">Hoạt động</Badge>
    ) : (
      <Badge className="bg-muted text-muted-foreground">Không hoạt động</Badge>
    );
  };

  if (loading && users.length === 0) {
    return <Loading />;
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <p className="text-muted-foreground mt-1">Quản lý thông tin người dùng và quyền</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">Khách hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loading />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Ngày tham gia</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Không tìm thấy người dùng nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">#{user.id}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {!debouncedSearchTerm && totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {(currentPage - 1) * limit + 1} -{' '}
                    {Math.min(currentPage * limit, totalItems)} trong tổng số {totalItems} người
                    dùng
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </Button>
                    <div className="text-sm">
                      Trang {currentPage} / {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
