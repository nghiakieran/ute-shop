import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Tag, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addBrand,
  addCategory,
  fetchBrands,
  fetchCategories,
  updateBrand,
  updateCategory,
} from '@/redux/slices/admin/brandCategoryManage.slice';
import { useToast } from '@/hooks';

export default function BrandsCategories() {
  const dispatch = useAppDispatch();
  const { brands, categories } = useAppSelector((state) => state.brandsCategoriesManage);
  const { toast } = useToast();
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<any>(null);
  const [brandFormData, setBrandFormData] = useState({ brandName: '', active: true });

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [categoryFormData, setCategoryFormData] = useState({ categoryName: '', active: true });

  useEffect(() => {
    dispatch(fetchBrands(null));
    dispatch(fetchCategories(null));
  }, [dispatch]);

  const handleOpenBrandDialog = (brand: any = null) => {
    if (brand) {
      setCurrentBrand(brand);
      setBrandFormData({
        brandName: brand.brandName,
        active: brand.active ?? true,
      });
    } else {
      setCurrentBrand(null);
      setBrandFormData({ brandName: '', active: true });
    }
    setIsBrandDialogOpen(true);
  };

  const handleSaveBrand = async () => {
    try {
      if (currentBrand) {
        await dispatch(
          updateBrand({
            brandName: brandFormData.brandName,
            brandId: currentBrand.id,
          })
        ).unwrap();

        toast({ title: 'Thành công', description: 'Đã cập nhật thương hiệu' });
      } else {
        await dispatch(
          addBrand({
            brandName: brandFormData.brandName,
            brandId: 0,
          })
        ).unwrap();

        toast({ title: 'Thành công', description: 'Đã thêm thương hiệu mới' });
      }
      setIsBrandDialogOpen(false);
      setBrandFormData({ brandName: '', active: true });
      dispatch(fetchBrands(null));
    } catch (error: any) {
      console.error('Lỗi:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message || 'Không thể thêm mới',
      });
    }
  };
  const handleOpenCategoryDialog = (category: any = null) => {
    if (category) {
      setCurrentCategory(category);
      setCategoryFormData({
        categoryName: category.categoryName,
        active: category.active ?? true,
      });
    } else {
      setCurrentCategory(null);
      setCategoryFormData({ categoryName: '', active: true });
    }
    setIsCategoryDialogOpen(true);
  };
  const handleSaveCategory = async () => {
    try {
      if (currentCategory) {
        await dispatch(
          updateCategory({
            categoryId: currentCategory.id,
            categoryName: categoryFormData.categoryName,
            // status: categoryFormData.active,
          })
        ).unwrap();
        toast({ title: 'Thành công', description: 'Đã cập nhật danh mục' });
      } else {
        await dispatch(
          addCategory({
            categoryName: categoryFormData.categoryName,
            // categoryId: 0,
            // status: categoryFormData.active,
          })
        ).unwrap();
        toast({ title: 'Thành công', description: 'Đã thêm danh mục mới' });
      }

      setIsCategoryDialogOpen(false);
      setCategoryFormData({ categoryName: '', active: true });
      dispatch(fetchCategories(null));
    } catch (error: any) {
      console.error('Lỗi:', error);
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: error.message || 'Thao tác thất bại',
      });
    }
  };

  // Helper để render badge trạng thái
  const renderStatusBadge = (isActive: boolean) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          isActive
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 '
            : 'bg-slate-50 text-slate-600 border-slate-200 '
        }`}
      >
        {isActive ? 'Hoạt động' : 'Đã ẩn'}
      </span>
    );
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Thương hiệu & Danh mục</h1>
        <p className="text-muted-foreground mt-1">Quản lý thương hiệu và danh mục sản phẩm</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ==================== BRANDS SECTION ==================== */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Thương hiệu
              </CardTitle>
              <Button
                size="sm"
                className="gap-2 gradient-primary"
                onClick={() => handleOpenBrandDialog()}
              >
                <Plus className="h-4 w-4" />
                Thêm
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead className="text-center">Sản phẩm</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead> {/* Cột Mới */}
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((brand: any) => (
                  <TableRow key={brand.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{brand.brandName}</TableCell>
                    <TableCell className="text-center">{brand.quantityProduct}</TableCell>
                    <TableCell className="text-center">
                      {renderStatusBadge(brand.active ?? true)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleOpenBrandDialog(brand)}
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

        {/* ==================== CATEGORIES SECTION ==================== */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-success" />
                Danh mục
              </CardTitle>
              <Button
                size="sm"
                className="gap-2 gradient-primary"
                onClick={() => handleOpenCategoryDialog()}
              >
                <Plus className="h-4 w-4" />
                Thêm
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead className="text-center">Sản phẩm</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead> {/* Cột Mới */}
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category: any) => (
                  <TableRow key={category.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{category.categoryName}</TableCell>
                    <TableCell className="text-center">{category.quantityProduct}</TableCell>
                    <TableCell className="text-center">
                      {renderStatusBadge(category.active ?? true)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleOpenCategoryDialog(category)}
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

      {/* ==================== DIALOGS ==================== */}

      {/* Brand Dialog */}
      <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
        <DialogContent className="sm:max-w-[550px] bg-white border border-slate-200 shadow-xl z-50 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {currentBrand ? 'Cập nhật thương hiệu' : 'Thêm thương hiệu mới'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {currentBrand
                ? 'Chỉnh sửa thông tin chi tiết bên dưới.'
                : 'Điền thông tin để tạo một thương hiệu mới vào hệ thống.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Input Tên */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brandName" className="text-right font-medium text-slate-700 ">
                Tên thương hiệu
              </Label>
              <Input
                id="brandName"
                value={brandFormData.brandName}
                onChange={(e) => setBrandFormData({ ...brandFormData, brandName: e.target.value })}
                className="col-span-3 focus-visible:ring-primary"
                placeholder="Nhập tên thương hiệu..."
                autoFocus
              />
            </div>

            {/* Switch Active - Phần Mới Thêm */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brandActive" className="text-right font-medium text-slate-700">
                Trạng thái
              </Label>
              <div className="flex items-center space-x-3 col-span-3">
                <Switch
                  id="brandActive"
                  checked={brandFormData.active}
                  onCheckedChange={(checked) =>
                    setBrandFormData({ ...brandFormData, active: checked })
                  }
                  className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-slate-300"
                />
                <Label
                  htmlFor="brandActive"
                  className={`font-medium cursor-pointer transition-colors ${
                    brandFormData.active ? 'text-green-700' : 'text-slate-400 italic'
                  }`}
                >
                  {brandFormData.active ? 'Đang hoạt động' : 'Tạm ẩn'}
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBrandDialogOpen(false)}
              className="border-slate-300"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSaveBrand}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              {currentBrand ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[550px] bg-white border border-slate-200 shadow-xl z-50 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {currentCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {currentCategory
                ? 'Chỉnh sửa thông tin danh mục bên dưới.'
                : 'Điền thông tin để tạo một danh mục mới vào hệ thống.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Input Tên */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right font-medium text-slate-700 ">
                Tên danh mục
              </Label>
              <Input
                id="categoryName"
                value={categoryFormData.categoryName}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, categoryName: e.target.value })
                }
                className="col-span-3 focus-visible:ring-primary"
                placeholder="Nhập tên danh mục..."
                autoFocus
              />
            </div>

            {/* Switch Active - Phần Mới Thêm */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryActive" className="text-right font-medium text-slate-700 ">
                Trạng thái
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="categoryActive"
                  checked={categoryFormData.active}
                  onCheckedChange={(checked) =>
                    setCategoryFormData({ ...categoryFormData, active: checked })
                  }
                />
                <Label htmlFor="categoryActive" className="font-normal cursor-pointer">
                  {categoryFormData.active ? 'Đang hoạt động' : 'Tạm ẩn'}
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCategoryDialogOpen(false)}
              className="border-slate-300"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSaveCategory}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4" />
              {currentCategory ? 'Lưu thay đổi' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
