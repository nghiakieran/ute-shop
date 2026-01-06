import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useDebounce } from '@/hooks/useDebounce';
import {
  fetchAdminReviews,
  deleteAdminReview,
} from '@/redux/slices/admin/reviewManage.slice';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Star, Search, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useToast } from '@/hooks/useToast';
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

export default function AdminReviews() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { reviews, meta, loading } = useAppSelector((state) => state.reviewsManage);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [rewardFilter, setRewardFilter] = useState<'all' | 'rewarded' | 'not_rewarded'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = meta?.limit || 10;

  useEffect(() => {
    const params: Record<string, any> = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (debouncedSearchTerm) {
      params.search = debouncedSearchTerm;
    }

    if (ratingFilter !== 'all') {
      params.rating = Number(ratingFilter);
    }

    if (rewardFilter === 'rewarded') {
      params.hasRewardGiven = true;
    } else if (rewardFilter === 'not_rewarded') {
      params.hasRewardGiven = false;
    }

    dispatch(fetchAdminReviews(params));
  }, [dispatch, currentPage, debouncedSearchTerm, ratingFilter, rewardFilter, itemsPerPage]);

  const totalPages = meta?.totalPages || 1;
  const totalItems = meta?.total || 0;

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteReviewId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteReviewId) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteAdminReview(deleteReviewId)).unwrap();

      toast({
        title: 'Thành công',
        description: 'Xóa đánh giá thành công',
        variant: 'success',
      });

      // Refresh danh sách sau khi xóa
      const params: Record<string, any> = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      if (ratingFilter !== 'all') {
        params.rating = Number(ratingFilter);
      }

      if (rewardFilter === 'rewarded') {
        params.hasRewardGiven = true;
      } else if (rewardFilter === 'not_rewarded') {
        params.hasRewardGiven = false;
      }

      dispatch(fetchAdminReviews(params));
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error?.message || 'Không thể xóa đánh giá',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDeleteReviewId(null);
    }
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderTableBody = () => {
    if (loading === 'pending') {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-6 text-primary">
            Đang tải dữ liệu đánh giá...
          </TableCell>
        </TableRow>
      );
    }

    if (loading === 'failed' || !reviews || reviews.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
            Không tìm thấy đánh giá nào.
          </TableCell>
        </TableRow>
      );
    }

    return (
      <TableBody>
        {(reviews || []).map((review) => (
          <TableRow key={review.id} className="hover:bg-muted/50 transition-colors">
            <TableCell className="font-medium">#{review.id}</TableCell>
            <TableCell className="max-w-[220px]">
              <div className="flex flex-col">
                <span className="font-semibold text-sm line-clamp-2">
                  {review.product?.productName || `Sản phẩm #${review.productId}`}
                </span>
                <span className="text-xs text-muted-foreground">
                  Mã sản phẩm: {review.productId}
                </span>
              </div>
            </TableCell>
            <TableCell className="max-w-[180px]">
              <div className="flex flex-col">
                <span className="font-medium text-sm line-clamp-1">
                  {review.user?.username || `User #${review.userId}`}
                </span>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {review.user?.email}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                {renderRatingStars(review.rating)}
                <span className="text-xs text-muted-foreground">{review.rating}/5</span>
              </div>
            </TableCell>
            <TableCell className="max-w-[260px]">
              <p className="text-sm line-clamp-3">{review.description}</p>
            </TableCell>
            <TableCell>
              <div className="flex flex-col text-xs text-muted-foreground">
                <span>{format(new Date(review.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
              </div>
            </TableCell>
            <TableCell>
              {review.hasRewardGiven ? (
                <Badge className="bg-green-500/10 text-green-700 border border-green-300">
                  Đã thưởng
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-700 border border-gray-300">
                  Chưa thưởng
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <button
                onClick={() => handleDeleteClick(review.id)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Quản lý đánh giá</h1>
        <p className="text-muted-foreground mt-1">
          Xem và quản lý các đánh giá sản phẩm từ khách hàng ({totalItems} đánh giá)
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold mb-4">Bộ lọc</CardTitle>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo sản phẩm, người dùng, nội dung..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={ratingFilter}
              onValueChange={(value) => {
                setRatingFilter(value as any);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Lọc theo số sao" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả sao</SelectItem>
                <SelectItem value="5">5 sao</SelectItem>
                <SelectItem value="4">4 sao</SelectItem>
                <SelectItem value="3">3 sao</SelectItem>
                <SelectItem value="2">2 sao</SelectItem>
                <SelectItem value="1">1 sao</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={rewardFilter}
              onValueChange={(value) => {
                setRewardFilter(value as any);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Thưởng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="rewarded">Đã thưởng</SelectItem>
                <SelectItem value="not_rewarded">Chưa thưởng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Số sao</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Thưởng</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            {renderTableBody()}
          </Table>

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
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border-2 border-destructive">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa đánh giá</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2 border-destructive" disabled={isDeleting}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="border-2 border-destructive hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}





