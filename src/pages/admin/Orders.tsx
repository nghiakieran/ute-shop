import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const orders = [
  {
    id: 'ORD001',
    customer: 'Nguyễn Văn A',
    total: '1,250,000',
    status: 'pending',
    date: '2024-01-20',
  },
  {
    id: 'ORD002',
    customer: 'Trần Thị B',
    total: '850,000',
    status: 'confirmed',
    date: '2024-01-20',
  },
  {
    id: 'ORD003',
    customer: 'Lê Văn C',
    total: '2,100,000',
    status: 'shipping',
    date: '2024-01-19',
  },
  {
    id: 'ORD004',
    customer: 'Phạm Thị D',
    total: '650,000',
    status: 'delivered',
    date: '2024-01-19',
  },
  {
    id: 'ORD005',
    customer: 'Hoàng Văn E',
    total: '1,500,000',
    status: 'pending_payment',
    date: '2024-01-18',
  },
];

const statusCounts = {
  all: 125,
  pending: 23,
  confirmed: 18,
  shipping: 32,
  delivered: 45,
  pending_payment: 7,
};

export default function Orders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      pending: { label: 'Chờ xử lý', className: 'bg-warning/10 text-warning' },
      confirmed: { label: 'Đã xác nhận', className: 'bg-primary/10 text-primary' },
      shipping: { label: 'Đang giao', className: 'bg-accent/10 text-accent' },
      delivered: { label: 'Đã giao', className: 'bg-success/10 text-success' },
      pending_payment: { label: 'Chờ thanh toán', className: 'bg-destructive/10 text-destructive' },
    };

    const statusInfo = statusMap[status] || { label: status, className: '' };
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground mt-1">Theo dõi và xử lý đơn hàng</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="all">Tất cả ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Chờ xử lý ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="confirmed">Đã xác nhận ({statusCounts.confirmed})</TabsTrigger>
          <TabsTrigger value="shipping">Đang giao ({statusCounts.shipping})</TabsTrigger>
          <TabsTrigger value="delivered">Đã giao ({statusCounts.delivered})</TabsTrigger>
          <TabsTrigger value="pending_payment">
            Chờ thanh toán ({statusCounts.pending_payment})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm đơn hàng..."
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
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="font-semibold">{order.total} đ</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
