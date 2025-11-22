import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Percent } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const promotions = [
  {
    id: 1,
    name: 'Giảm giá mùa hè',
    type: 'campaign',
    discount: '20%',
    products: 45,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'active',
  },
  {
    id: 2,
    name: 'Flash sale cuối tuần',
    type: 'campaign',
    discount: '30%',
    products: 12,
    startDate: '2024-01-20',
    endDate: '2024-01-21',
    status: 'active',
  },
  {
    id: 3,
    name: 'Khuyến mãi sản phẩm mới',
    type: 'product',
    discount: '15%',
    products: 8,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: 'active',
  },
];

export default function Promotions() {
  const getTypeBadge = (type: string) => {
    return type === 'campaign' ? (
      <Badge className="bg-primary/10 text-primary">Chiến dịch</Badge>
    ) : (
      <Badge className="bg-success/10 text-success">Sản phẩm</Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-success/10 text-success">Đang chạy</Badge>
    ) : (
      <Badge className="bg-muted text-muted-foreground">Đã kết thúc</Badge>
    );
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý khuyến mãi</h1>
          <p className="text-muted-foreground mt-1">Tạo và quản lý các chương trình khuyến mãi</p>
        </div>
        <Button className="gap-2 gradient-primary shadow-elegant">
          <Plus className="h-4 w-4" />
          Tạo khuyến mãi
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            Danh sách khuyến mãi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên chương trình</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Giảm giá</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Bắt đầu</TableHead>
                <TableHead>Kết thúc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => (
                <TableRow key={promo.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">#{promo.id}</TableCell>
                  <TableCell>{promo.name}</TableCell>
                  <TableCell>{getTypeBadge(promo.type)}</TableCell>
                  <TableCell className="font-semibold text-success">{promo.discount}</TableCell>
                  <TableCell>{promo.products} sản phẩm</TableCell>
                  <TableCell>{promo.startDate}</TableCell>
                  <TableCell>{promo.endDate}</TableCell>
                  <TableCell>{getStatusBadge(promo.status)}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
