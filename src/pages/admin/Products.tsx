import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const products = [
  {
    id: 1,
    name: 'Áo thun basic trắng',
    category: 'Áo',
    brand: 'Fashion Pro',
    price: '299,000',
    stock: 45,
    status: 'in_stock',
  },
  {
    id: 2,
    name: 'Quần jean skinny',
    category: 'Quần',
    brand: 'Denim Co',
    price: '599,000',
    stock: 12,
    status: 'low_stock',
  },
  {
    id: 3,
    name: 'Váy hoa midi',
    category: 'Váy',
    brand: 'Elegant',
    price: '450,000',
    stock: 0,
    status: 'out_of_stock',
  },
  {
    id: 4,
    name: 'Áo hoodie xám',
    category: 'Áo',
    brand: 'Street Style',
    price: '550,000',
    stock: 67,
    status: 'in_stock',
  },
  {
    id: 5,
    name: 'Áo khoác da',
    category: 'Áo khoác',
    brand: 'Luxury Line',
    price: '1,200,000',
    stock: 3,
    status: 'low_stock',
  },
];

export default function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-success text-success-foreground">Còn hàng</Badge>;
      case 'low_stock':
        return <Badge className="bg-warning text-warning-foreground">Sắp hết</Badge>;
      case 'out_of_stock':
        return <Badge className="bg-destructive text-destructive-foreground">Hết hàng</Badge>;
      default:
        return <Badge>Ngừng bán</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground mt-1">Quản lý danh sách sản phẩm</p>
        </div>
        <Button className="gap-2 gradient-primary shadow-elegant">
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="in_stock">Còn hàng</SelectItem>
                <SelectItem value="low_stock">Sắp hết</SelectItem>
                <SelectItem value="out_of_stock">Hết hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Thương hiệu</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">#{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell className="font-semibold">{product.price} đ</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-primary/10 hover:text-primary"
                        onClick={() => navigate(`/admin/products/${product.id}`)}
                      >
                        <Eye className="h-4 w-4" />
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
