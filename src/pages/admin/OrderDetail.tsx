import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { ArrowLeft, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - would come from API/database
  const [orderData, setOrderData] = useState({
    id: id || 'ORD001',
    customer: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    status: 'pending',
    paymentStatus: 'pending_payment',
    date: '2024-01-20',
    total: '1,250,000',
    items: [
      { id: 1, name: 'Áo thun basic trắng', quantity: 2, price: '299,000', total: '598,000' },
      { id: 2, name: 'Quần jean skinny', quantity: 1, price: '599,000', total: '599,000' },
    ],
  });

  const handleSave = () => {
    toast.success('Đã cập nhật đơn hàng thành công!');
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: 'Chờ xử lý', className: 'bg-warning/10 text-warning' },
      confirmed: { label: 'Đã xác nhận', className: 'bg-primary/10 text-primary' },
      shipping: { label: 'Đang giao', className: 'bg-accent/10 text-accent' },
      delivered: { label: 'Đã giao', className: 'bg-success/10 text-success' },
      cancelled: { label: 'Đã hủy', className: 'bg-destructive/10 text-destructive' },
    };

    const statusInfo = statusMap[status] || { label: status, className: '' };
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Chi tiết đơn hàng #{orderData.id}</h1>
          <p className="text-muted-foreground mt-1">Xem và chỉnh sửa thông tin đơn hàng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin khách hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên khách hàng</Label>
                <Input
                  value={orderData.customer}
                  onChange={(e) => setOrderData({ ...orderData, customer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={orderData.email}
                  onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input
                value={orderData.phone}
                onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Địa chỉ giao hàng</Label>
              <Input
                value={orderData.address}
                onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Trạng thái đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Trạng thái giao hàng</Label>
              <Select
                value={orderData.status}
                onValueChange={(value) => setOrderData({ ...orderData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="shipping">Đang giao</SelectItem>
                  <SelectItem value="delivered">Đã giao</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trạng thái thanh toán</Label>
              <Select
                value={orderData.paymentStatus}
                onValueChange={(value) => setOrderData({ ...orderData, paymentStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending_payment">Chờ thanh toán</SelectItem>
                  <SelectItem value="paid">Đã thanh toán</SelectItem>
                  <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ngày đặt:</span>
                <span className="font-medium">{orderData.date}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng tiền:</span>
                <span className="text-primary">{orderData.total} đ</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Sản phẩm trong đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderData.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price} đ</TableCell>
                  <TableCell className="font-semibold">{item.total} đ</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/orders')}>
          Hủy
        </Button>
        <Button className="gap-2 gradient-primary shadow-elegant" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
