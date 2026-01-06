import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Ticket, TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type {
  Voucher,
  CreateVoucherPayload,
  UpdateVoucherPayload,
  VoucherFilterParams,
  VoucherStatistics,
  VoucherType,
  VoucherStatus,
} from '@/types/voucher';
import {
  createVoucher,
  getVouchers,
  getVoucherStatistics,
  updateVoucher,
  deleteVoucher,
  updateVoucherStatus,
  updateExpiredVouchers,
} from '@/utils/voucher.api';
import { searchUsers, type AdminUser } from '@/utils/user.api';
import { useDebounce } from '@/hooks/useDebounce';

export default function VoucherManagement() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [statistics, setStatistics] = useState<VoucherStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VoucherStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<VoucherType | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [formData, setFormData] = useState<CreateVoucherPayload>({
    code: '',
    type: 'PERCENTAGE',
    value: 0,
    maxDiscount: undefined,
    minOrderValue: undefined,
    expiryDate: '',
    description: '',
  });

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const debouncedSearchQuery = useDebounce(userSearchQuery, 500);

  useEffect(() => {
    loadVouchers();
    loadStatistics();
  }, [currentPage, statusFilter, typeFilter]);

  useEffect(() => {
    const handleUserSearch = async () => {
      if (debouncedSearchQuery.trim().length > 0) {
        try {
          const response = await searchUsers(debouncedSearchQuery);
          setSearchResults(response.data || []);
          setShowUserDropdown(true);
        } catch (error) {
          console.error('Error searching users:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setShowUserDropdown(false);
      }
    };
    handleUserSearch();
  }, [debouncedSearchQuery]);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const params: VoucherFilterParams = {
        page: currentPage,
        limit,
      };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (typeFilter !== 'ALL') params.type = typeFilter;

      const response = await getVouchers(params);
      setVouchers((response as any).data.vouchers || []);
      const total = (response as any).data.total || 0;
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getVoucherStatistics();
      setStatistics((stats as any).data.statistics);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleCreateVoucher = async () => {
    try {
      await createVoucher(formData);
      toast.success('Tạo voucher thành công!');
      setShowCreateDialog(false);
      resetForm();
      loadVouchers();
      loadStatistics();
    } catch (error: any) {
      toast.error(error.message || 'Không thể tạo voucher');
    }
  };

  const handleUpdateVoucher = async () => {
    if (!selectedVoucher) return;
    try {
      const payload: UpdateVoucherPayload = {
        id: selectedVoucher.id,
        ...formData,
      };
      await updateVoucher(payload);
      toast.success('Cập nhật voucher thành công!');
      setShowEditDialog(false);
      resetForm();
      loadVouchers();
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật voucher');
    }
  };

  const handleDeleteVoucher = async () => {
    if (!selectedVoucher) return;
    try {
      await deleteVoucher(selectedVoucher.id);
      toast.success('Xóa voucher thành công!');
      setShowDeleteDialog(false);
      setSelectedVoucher(null);
      loadVouchers();
      loadStatistics();
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa voucher');
    }
  };

  const handleUpdateStatus = async (voucher: Voucher, newStatus: VoucherStatus) => {
    try {
      await updateVoucherStatus(voucher.id, newStatus);
      toast.success('Cập nhật trạng thái thành công!');
      loadVouchers();
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật trạng thái');
    }
  };

  const handleUpdateExpired = async () => {
    try {
      await updateExpiredVouchers();
      toast.success('Đã cập nhật các voucher hết hạn!');
      loadVouchers();
      loadStatistics();
    } catch (error: any) {
      toast.error(error.message || 'Không thể cập nhật');
    }
  };

  const openEditDialog = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setFormData({
      code: voucher.code,
      type: voucher.type,
      value: voucher.value,
      maxDiscount: voucher.maxDiscount,
      minOrderValue: voucher.minOrderValue,
      expiryDate: voucher.expiryDate.split('T')[0],
      description: voucher.description,
      userId: voucher.userId,
    });
    // Set selected user if voucher has user info
    if (voucher.user) {
      setSelectedUser({
        id: String(voucher.user.id),
        email: voucher.user.email,
        fullName: voucher.user.fullName,
        phone: voucher.user.phone,
        avatar: voucher.user.avatar,
        role: voucher.user.role as 'admin' | 'moderator' | 'user',
        createdAt: '',
        updatedAt: '',
      });
    }
    setShowEditDialog(true);
  };

  const openDeleteDialog = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setShowDeleteDialog(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'PERCENTAGE',
      value: 0,
      maxDiscount: undefined,
      minOrderValue: undefined,
      expiryDate: '',
      description: '',
    });
    setSelectedVoucher(null);
    setSelectedUser(null);
    setUserSearchQuery('');
    setSearchResults([]);
    setShowUserDropdown(false);
  };

  const getStatusBadge = (status: VoucherStatus) => {
    const statusMap: Record<VoucherStatus, { label: string; className: string }> = {
      ACTIVE: { label: 'Hoạt động', className: 'bg-green-100 text-green-800' },
      EXPIRED: { label: 'Hết hạn', className: 'bg-red-100 text-red-800' },
      USED: { label: 'Đã dùng', className: 'bg-blue-100 text-blue-800' },
      INACTIVE: { label: 'Không hoạt động', className: 'bg-gray-100 text-gray-800' },
    };
    const info = statusMap[status];
    return <Badge className={info.className}>{info.label}</Badge>;
  };

  const getTypeBadge = (type: VoucherType) => {
    const typeLabel = type === 'PERCENTAGE' ? 'Phần trăm' : 'Số tiền cố định';
    return <Badge variant="outline">{typeLabel}</Badge>;
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Voucher</h1>
          <p className="text-muted-foreground mt-1">Quản lý mã giảm giá và khuyến mãi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleUpdateExpired} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Cập nhật hết hạn
          </Button>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2 gradient-primary">
            <Plus className="h-4 w-4" />
            Tạo voucher mới
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng voucher</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statistics.active}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đã sử dụng</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statistics.used}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hết hạn</CardTitle>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{statistics.expired}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã voucher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as VoucherStatus | 'ALL')}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="EXPIRED">Hết hạn</SelectItem>
                <SelectItem value="USED">Đã dùng</SelectItem>
                <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value as VoucherType | 'ALL')}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả loại</SelectItem>
                <SelectItem value="PERCENTAGE">Phần trăm</SelectItem>
                <SelectItem value="FIXED_AMOUNT">Số tiền cố định</SelectItem>
                <SelectItem value="FIXED">Số tiền cố định (FIXED)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vouchers Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Danh sách Voucher</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã voucher</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Giá trị</TableHead>
                    <TableHead>Đơn tối thiểu</TableHead>
                    <TableHead>Ngày hết hạn</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVouchers.map((voucher) => (
                    <TableRow key={voucher.id}>
                      <TableCell className="font-mono font-bold">{voucher.code}</TableCell>
                      <TableCell>{getTypeBadge(voucher.type)}</TableCell>
                      <TableCell>
                        {voucher.type === 'PERCENTAGE'
                          ? `${voucher.value}%`
                          : `${voucher.value.toLocaleString('vi-VN')}₫`}
                        {voucher.maxDiscount && (
                          <span className="text-xs text-muted-foreground block">
                            Tối đa: {voucher.maxDiscount.toLocaleString('vi-VN')}₫
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {voucher.minOrderValue
                          ? `${voucher.minOrderValue.toLocaleString('vi-VN')}₫`
                          : 'Không'}
                      </TableCell>
                      <TableCell>
                        {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>{getStatusBadge(voucher.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(voucher)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(voucher)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Trang {currentPage} / {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={showCreateDialog || showEditDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setShowEditDialog(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>{showEditDialog ? 'Cập nhật voucher' : 'Tạo voucher mới'}</DialogTitle>
            <DialogDescription>
              {showEditDialog ? 'Chỉnh sửa thông tin voucher' : 'Nhập thông tin để tạo voucher mới'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã voucher *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="VD: SUMMER2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Loại giảm giá *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as VoucherType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                  <SelectItem value="FIXED_AMOUNT">Số tiền cố định (₫)</SelectItem>
                  <SelectItem value="FIXED">Số tiền (₫)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Giá trị *</Label>
              <Input
                id="value"
                type="text"
                value={
                  formData.type === 'PERCENTAGE'
                    ? formData.value
                    : formData.value
                    ? formData.value.toLocaleString('vi-VN')
                    : ''
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, value: rawValue ? Number(rawValue) : 0 });
                }}
                placeholder={formData.type === 'PERCENTAGE' ? '10' : '50,000'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Giảm tối đa (₫)</Label>
              <Input
                id="maxDiscount"
                type="text"
                value={formData.maxDiscount ? formData.maxDiscount.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  setFormData({
                    ...formData,
                    maxDiscount: rawValue ? Number(rawValue) : undefined,
                  });
                }}
                placeholder="100,000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minOrderValue">Đơn hàng tối thiểu (₫)</Label>
              <Input
                id="minOrderValue"
                type="text"
                value={formData.minOrderValue ? formData.minOrderValue.toLocaleString('vi-VN') : ''}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  setFormData({
                    ...formData,
                    minOrderValue: rawValue ? Number(rawValue) : undefined,
                  });
                }}
                placeholder="500,000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="userSearch">Người dùng</Label>
              {selectedUser ? (
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{selectedUser.fullName}</p>
                    <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(null);
                      setFormData({ ...formData, userId: undefined });
                      setUserSearchQuery('');
                    }}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <>
                  <Input
                    id="userSearch"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm người dùng..."
                    onFocus={() => userSearchQuery && setShowUserDropdown(true)}
                  />
                  {showUserDropdown && searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                          onClick={() => {
                            setSelectedUser(user);
                            setFormData({ ...formData, userId: Number(user.id) });
                            setShowUserDropdown(false);
                            setUserSearchQuery('');
                          }}
                        >
                          <p className="font-medium text-sm">{user.fullName}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về voucher"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setShowEditDialog(false);
                resetForm();
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={showEditDialog ? handleUpdateVoucher : handleCreateVoucher}
              className="gradient-primary"
            >
              {showEditDialog ? 'Cập nhật' : 'Tạo voucher'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa voucher</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa voucher <strong>{selectedVoucher?.code}</strong>? Hành động
              này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVoucher} className="bg-destructive">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
