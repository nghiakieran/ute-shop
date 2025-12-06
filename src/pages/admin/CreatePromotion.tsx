import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Thêm useParams
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Search, Package, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/utils';

const API_URL = 'http://localhost:3009/ute-shop/api/admin/';

export default function CreatePromotion() {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL (nếu có)
  const { toast } = useToast();

  // Xác định chế độ Edit dựa vào việc có ID hay không
  const isEditMode = Boolean(id);

  // State
  const [products, setProducts] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false); // Loading khi lấy detail

  const [searchProduct, setSearchProduct] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  // Helper: Format date từ ISO sang YYYY-MM-DD cho input date
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Effect: Load Products & Campaign Detail (nếu là Edit)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingProducts(true);
      try {
        // 1. Luôn load danh sách sản phẩm trước
        const productRes = await apiClient.get(`${API_URL}products`);
        setProducts(productRes.data.data.data || productRes.data);

        // 2. Nếu là Edit Mode, load thông tin chiến dịch
        if (isEditMode) {
          setIsLoadingDetail(true);
          const detailRes = await apiClient.get(`${API_URL}discounts/${id}`);
          const data = detailRes.data.data; // Tùy cấu trúc BE trả về

          // Map dữ liệu vào form
          setFormData({
            name: data.name,
            description: data.description || '',
            discount: data.percentage.toString(),
            startDate: formatDateForInput(data.startDate),
            endDate: formatDateForInput(data.endDate),
            isActive: data.active,
          });

          // Map sản phẩm đã chọn (Lấy mảng ID từ mảng object products)
          if (data.products && Array.isArray(data.products)) {
            setSelectedProducts(data.products.map((p: any) => p.id));
          }
        }
      } catch (error) {
        console.error('Failed to load data', error);
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu.',
        });
        // Nếu lỗi khi load detail, quay về trang danh sách
        if (isEditMode) navigate('/promotions');
      } finally {
        setIsLoadingProducts(false);
        setIsLoadingDetail(false);
      }
    };

    fetchData();
  }, [id, isEditMode, toast, navigate]);

  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.id.toString().toLowerCase().includes(searchProduct.toLowerCase())
  );

  const handleProductToggle = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        active: formData.isActive,
        startDate: formData.startDate,
        endDate: formData.endDate,
        percentage: Number(formData.discount),
        productIDs: selectedProducts,
      };

      if (isEditMode) {
        // --- LOGIC UPDATE ---
        // Dùng PUT hoặc PATCH tùy BE quy định
        await apiClient.put(`${API_URL}discounts/${id}`, payload);
        toast({
          title: 'Cập nhật thành công',
          description: 'Thông tin chương trình khuyến mãi đã được lưu.',
        });
      } else {
        // --- LOGIC CREATE ---
        await apiClient.post(`${API_URL}discounts`, payload);
        toast({
          title: 'Tạo mới thành công',
          description: 'Đã tạo chương trình khuyến mãi mới.',
        });
      }

      navigate('/promotions');
    } catch (error: any) {
      console.error('Error saving promotion:', error);
      toast({
        variant: 'destructive',
        title: 'Thất bại',
        description: error.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingDetail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/promotions')}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditMode ? 'Cập nhật khuyến mãi' : 'Tạo khuyến mãi mới'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditMode
              ? `Chỉnh sửa thông tin chương trình #${id}`
              : 'Thiết lập chương trình khuyến mãi cho sản phẩm'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form thông tin khuyến mãi */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Thông tin khuyến mãi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên chiến dịch *</Label>
              <Input
                id="name"
                placeholder="Ví dụ: Black Friday Sale"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả chi tiết..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Phần trăm giảm giá *</Label>
              <div className="relative">
                <Input
                  id="discount"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Nhập % giảm giá"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor="active" className="font-medium">
                  Kích hoạt
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isEditMode
                    ? 'Trạng thái hoạt động của chiến dịch'
                    : 'Chiến dịch sẽ có hiệu lực ngay sau khi tạo'}
                </p>
              </div>
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Danh sách sản phẩm */}
        <Card className="shadow-card flex flex-col h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Chọn sản phẩm
              </span>
              <span className="text-sm font-normal text-muted-foreground">
                Đã chọn: {selectedProducts.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col min-h-0">
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc SKU..."
                className="pl-10"
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
              />
            </div>

            {/* Scrollable Product List */}
            <div className="overflow-y-auto flex-1 pr-2 space-y-2">
              {isLoadingProducts ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedProducts.includes(product.id)
                        ? 'bg-primary/5 border-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleProductToggle(product.id)}
                  >
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleProductToggle(product.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
                      {product.image || '📦'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {product.id || `SP-${product.id}`}
                      </p>
                    </div>
                    <p className="font-semibold text-primary">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(product.unitPrice)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Không tìm thấy sản phẩm nào
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="lg:col-span-2 flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/promotions')}
            disabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            className="gap-2 gradient-primary shadow-elegant"
            disabled={selectedProducts.length === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Đang xử lý...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {isEditMode ? 'Lưu thay đổi' : 'Tạo khuyến mãi'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
