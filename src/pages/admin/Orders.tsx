import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
  selectAdminOrders,
  selectAdminOrderLoading,
  selectAdminOrderPagination,
} from '@/redux/slices/admin/orderManage.slice';
import { formatCurrency, formatDate } from '@/utils/format.utils';
import { toast } from 'sonner';

export default function Orders() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const orders = useAppSelector(selectAdminOrders);
  const loading = useAppSelector(selectAdminOrderLoading);
  const pagination = useAppSelector(selectAdminOrderPagination);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const statusParam = activeTab === 'all' ? undefined : activeTab.toUpperCase();

    const timeoutId = setTimeout(() => {
      dispatch(
        fetchAdminOrders({
          page: 1,
          limit: 10,
          status: statusParam,
          search: searchTerm || undefined,
        })
      );
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [activeTab, searchTerm, dispatch]);

  const handlePageChange = (newPage: number) => {
    const statusParam = activeTab === 'all' ? undefined : activeTab.toUpperCase();
    dispatch(
      fetchAdminOrders({
        page: newPage,
        limit: 10,
        status: statusParam,
        search: searchTerm || undefined,
      })
    );
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await dispatch(updateAdminOrderStatus({ id: orderId, status: newStatus })).unwrap();
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      toast.error('Cập nhật thất bại: ' + error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PENDING: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800' },
      CONFIRMED: { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-800' },
      SHIPPING: { label: 'Đang giao', className: 'bg-purple-100 text-purple-800' },
      COMPLETED: { label: 'Hoàn thành', className: 'bg-green-200 text-green-900' },
      CANCELLED: { label: 'Đã hủy', className: 'bg-red-100 text-red-800' },
    };
    const statusInfo = statusMap[status] || { label: status, className: '' };
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  const getPaymentStatusBadge = (payment: any) => {
    if (!payment) {
      return <Badge className="bg-gray-100 text-gray-800">Chưa thanh toán</Badge>;
    }
    switch (payment.paymentStatus) {
      case 'SUCCESS':
        return <Badge className="bg-green-100 text-green-800">Đã thanh toán</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ thanh toán</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-100 text-red-800">Thanh toán thất bại</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Chưa thanh toán</Badge>;
    }
  };

  const orderStatuses = [
    { value: 'PENDING', label: 'Chờ xử lý' },
    { value: 'CONFIRMED', label: 'Đã xác nhận' },
    { value: 'SHIPPING', label: 'Đang giao hàng' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Hủy đơn' },
  ];

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground mt-1">Theo dõi và xử lý đơn hàng</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
          <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
          <TabsTrigger value="shipping">Đang giao</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        <Card className="shadow-card">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã đơn hoặc tên khách..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái hiện tại</TableHead>
                  <TableHead>Trạng thái thanh toán</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  if (loading) {
                    return (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        </TableCell>
                      </TableRow>
                    );
                  } else if (orders.length === 0) {
                    return (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Không tìm thấy đơn hàng nào
                        </TableCell>
                      </TableRow>
                    );
                  } else {
                    return orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell
                          className="font-medium cursor-pointer"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          #{order.billCode}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{order.receiverName}</span>
                            <span className="text-xs text-muted-foreground">
                              {order.customer?.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(order.total)}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{getPaymentStatusBadge(order.payment)}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={order.status}
                            onValueChange={(value) => handleStatusChange(order.id, value)}
                          >
                            <SelectTrigger className="w-[140px] h-8">
                              <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {orderStatuses.map((st) => (
                                <SelectItem key={st.value} value={st.value}>
                                  {st.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ));
                  }
                })()}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-end items-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Trước
                </Button>
                <span className="text-sm">
                  Trang {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Sau
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
