import { useState, useEffect, useMemo } from 'react'; // THÊM useEffect
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

import { fetchAdminProducts } from '@/redux/slices/admin/productManage.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function Products() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { products, meta, loading } = useAppSelector((state) => state.productManage);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = meta?.limit || 10;

  useEffect(() => {
    const filters: { [key: string]: any } = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (searchTerm) {
      filters.search = searchTerm;
    }

    if (statusFilter === 'active') {
      filters.displayStatus = true;
    } else if (statusFilter === 'inactive') {
      filters.displayStatus = false;
    }

    dispatch(fetchAdminProducts(filters));
  }, [dispatch, currentPage, searchTerm, statusFilter, itemsPerPage]);

  const getStatusBadge = (displayStatus: boolean, quantityStock: number) => {
    if (displayStatus === false) {
      return <Badge variant="secondary">Ngừng bán</Badge>;
    }
    if (quantityStock > 20) {
      return <Badge className="bg-green-500 hover:bg-green-500/80 text-white">Còn hàng</Badge>;
    }
    if (quantityStock > 0 && quantityStock <= 20) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-500/80 text-black">Sắp hết</Badge>;
    }
    return <Badge className="bg-red-500 hover:bg-red-500/80 text-white">Hết hàng</Badge>;
  };

  const totalPages = meta?.totalPages || 1;
  const totalItems = meta?.total || 0;

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderTableBody = () => {
    if (loading === 'pending') {
      return (
        <TableRow>
          <TableCell colSpan={9} className="text-center py-6 text-primary">
            Đang tải dữ liệu sản phẩm...
          </TableCell>
        </TableRow>
      );
    }

    if (loading === 'failed' || products.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
            Không tìm thấy sản phẩm nào.
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium">#{product.id}</TableCell>
            <TableCell>
              <Avatar className="h-10 w-10 border">
                <AvatarImage
                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                  alt={product.productName}
                />
                <AvatarFallback>{product.productName.charAt(0)}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell>{product.productName}</TableCell>
            <TableCell>{product.category?.categoryName}</TableCell>
            <TableCell>{product.brand?.brandName}</TableCell>
            {/* Định dạng giá tiền */}
            <TableCell className="font-semibold">
              {product.unitPrice.toLocaleString('vi-VN')} đ
            </TableCell>
            <TableCell>{product.quantityStock}</TableCell>
            <TableCell>{getStatusBadge(product.displayStatus, product.quantityStock)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-blue-500/10 hover:text-blue-600"
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
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
    );
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách sản phẩm ({totalItems} sản phẩm)
          </p>
        </div>
        <Button
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => navigate('/admin/products/create')}
        >
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset trang khi tìm kiếm
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1); // Reset trang khi lọc
              }}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang bán</SelectItem>
                <SelectItem value="inactive">Ngừng bán</SelectItem>
                {/* Bạn có thể thêm filter theo tồn kho nếu API hỗ trợ */}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="w-[80px]">Hình ảnh</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Thương hiệu</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            {renderTableBody()}
          </Table>

          {/* --- Component Phân trang --- */}
          {totalPages > 1 && (
            <div className="flex justify-end pt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      isActive={currentPage > 1}
                    />
                  </PaginationItem>
                  {/* Hiển thị số trang */}
                  <PaginationItem className="px-3 text-sm font-medium text-gray-700">
                    Trang {currentPage} / {totalPages}
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      isActive={currentPage < totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          {/* --------------------------- */}
        </CardContent>
      </Card>
    </div>
  );
}
