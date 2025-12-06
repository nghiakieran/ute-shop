import { useEffect, useState } from 'react';
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
import { Plus, Edit, Trash2, Percent, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { apiClient } from '@/utils';
import { Badge } from '@/components/ui/badge';
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

  // State quản lý dữ liệu và trạng thái loading
  const [promotions, setPromotions] = useState<DiscountCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Hàm gọi API lấy danh sách
  const fetchPromotions = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(`http://localhost:3009/ute-shop/api/admin/discounts`, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [pagination.page]);

  // Hàm xóa khuyến mãi
  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chương trình này?')) return;

    try {
      await apiClient.delete(`http://localhost:3009/ute-shop/api/admin/discounts/${id}`);
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
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

    if (now > end) {
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
        <CardContent>
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
    </div>
  );
}
