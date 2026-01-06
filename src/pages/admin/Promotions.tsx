import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Percent, Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { apiClient } from '@/utils';
import { Badge } from '@/components/ui/badge';
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
import toast from 'react-hot-toast';
interface Product {
  id: number;
  productName: string;
}

interface DiscountCampaign {
  id: number;
  name: string;
  description: string;
  percentage: number;
  active: boolean;
  startDate: string;
  endDate: string;
  productIDs: number[];
}

export default function Promotions() {
  const navigate = useNavigate();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [promotions, setPromotions] = useState<DiscountCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Hàm gọi API lấy danh sách
  const fetchPromotions = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get('/ute-shop/api/admin/discounts', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearchTerm || undefined,
        },
      });

      const responseData = response.data.data;

      if (responseData.data && Array.isArray(responseData.data)) {
        setPromotions(responseData.data);
        setPagination((prev) => ({
          ...prev,
          total: responseData.meta.total,
        }));
      } else {
        setPromotions(responseData);
      }
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
      toast.error('Không thể tải danh sách khuyến mãi');
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [pagination.page, debouncedSearchTerm]);

  const handleDelete = async (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await apiClient.delete(`/ute-shop/api/admin/discounts/${deleteId}`);
      fetchPromotions();
      toast.success('Đã xóa thành công. Chương trình khuyến mãi đã được xóa khỏi hệ thống.');
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Có lỗi xảy ra khi xóa dữ liệu.');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const getStatusBadge = (promo: DiscountCampaign) => {
    const now = new Date();
    const end = new Date(promo.endDate);

    if (now > end) {
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-none shadow-none">
          Đã kết thúc
        </Badge>
      );
    }

    if (!promo.active) {
      return <Badge className="bg-muted text-muted-foreground">Đã kết thúc</Badge>;
    }

    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">
        Đang chạy
      </Badge>
    );
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý khuyến mãi</h1>
          <p className="text-muted-foreground mt-1">Tạo và quản lý các chương trình khuyến mãi</p>
        </div>
        <Button
          className="gap-2 gradient-primary shadow-elegant"
          onClick={() => navigate('/admin/promotions/create')}
        >
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
        <CardContent className="space-y-6">
          <div className="relative">
            <Input
              placeholder="Tìm kiếm khuyến mãi..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên chương trình</TableHead>
                <TableHead>Giảm giá</TableHead>
                <TableHead>Sản phẩm áp dụng</TableHead>
                <TableHead>Bắt đầu</TableHead>
                <TableHead>Kết thúc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex justify-center items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Đang tải dữ liệu...
                    </div>
                  </TableCell>
                </TableRow>
              ) : promotions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    Chưa có chương trình khuyến mãi nào.
                  </TableCell>
                </TableRow>
              ) : (
                promotions.map((promo) => (
                  <TableRow key={promo.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">#{promo.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{promo.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {promo.description}
                      </div>
                    </TableCell>

                    {/* Hiển thị phần trăm */}
                    <TableCell className="font-semibold text-success">
                      {promo.percentage}%
                    </TableCell>

                    {/* Đếm số lượng sản phẩm từ mảng products */}
                    <TableCell>{promo.productIDs?.length || 0} sản phẩm</TableCell>

                    {/* Format ngày tháng */}
                    <TableCell>{format(new Date(promo.startDate), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{format(new Date(promo.endDate), 'dd/MM/yyyy')}</TableCell>

                    <TableCell>{getStatusBadge(promo)}</TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => navigate(`/admin/promotions/edit/${promo.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(promo.id)}
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
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="sm:max-w-[550px] bg-white border border-slate-200 shadow-xl z-50 p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Chương trình khuyến mãi này sẽ bị xóa vĩnh viễn khỏi
              hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy bỏ</AlertDialogCancel>

            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xóa...
                </>
              ) : (
                'Xóa ngay'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
