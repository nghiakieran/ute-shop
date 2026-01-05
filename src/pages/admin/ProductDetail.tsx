import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchProductDetailById,
  fetchBrands,
  fetchCategories,
  updateProduct,
  resetProduct,
  addProduct,
} from '@/redux/slices/admin/productManage.slice';
import { ProductPayload } from '@/types/product';

interface Attribute {
  name: string;
  values: any[];
}

interface LocalProductData {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: string;
  cost: string;
  stock: number;
  status: string;
  description: string;
  oldImages: string[];
  newImages: File[];
  newImagePreviews: string[];
  attributes: Attribute[];
}

const initialProductData: LocalProductData = {
  id: '',
  name: '',
  category: '',
  brand: '',
  price: '',
  cost: '',
  stock: 0,
  status: 'discontinued',
  description: '',
  oldImages: [],
  newImages: [],
  newImagePreviews: [],
  attributes: [],
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    product: productFromRedux,
    brands,
    categories,
  } = useAppSelector((state) => state.productManage);

  const [productData, setProductData] = useState<LocalProductData>(initialProductData);
  const [newAttribute, setNewAttribute] = useState({ name: '', value: '' });

  useEffect(() => {
    if (id && id !== 'create') {
      dispatch(fetchProductDetailById(id));
    } else {
      dispatch(resetProduct());
      console.log(productFromRedux);
    }
    dispatch(fetchBrands(null));
    dispatch(fetchCategories(null));
  }, [dispatch, id]);

  useEffect(() => {
    if (productFromRedux && id && id !== 'create') {
      setProductData({
        id: productFromRedux.id?.toString() || id || '',
        name: productFromRedux.productName || '',
        category: productFromRedux.category?.id?.toString() || '',
        brand: productFromRedux.brand?.id?.toString() || '',
        price: productFromRedux.unitPrice?.toString() || '',
        cost: productFromRedux.originalPrice?.toString() || '',
        stock: productFromRedux.quantityStock || 0,
        status: productFromRedux.productStatus || 'discontinued',
        description: productFromRedux.description || '',
        oldImages: productFromRedux.images?.map((img: any) => img.imageUrl || img.url) || [],
        newImages: [],
        newImagePreviews: [],
        attributes:
          productFromRedux.configurations?.map((conf: any) => ({
            name: conf.name,
            values: conf.otherConfigs || [],
          })) || [],
      });
    } else {
      setProductData(initialProductData);
    }
  }, [productFromRedux, id]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));

      setProductData((prev) => ({
        ...prev,
        newImages: [...prev.newImages, ...fileArray],
        newImagePreviews: [...prev.newImagePreviews, ...newPreviews],
      }));
    }
    if (event.target.value) event.target.value = '';
  };

  // 4. Kích hoạt input file ẩn
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // 5. Xóa ảnh mới chọn (chưa lưu)
  const removeNewImage = (index: number) => {
    setProductData((prev) => {
      const updatedFiles = prev.newImages.filter((_, i) => i !== index);
      const updatedPreviews = prev.newImagePreviews.filter((_, i) => i !== index);
      return {
        ...prev,
        newImages: updatedFiles,
        newImagePreviews: updatedPreviews,
      };
    });
  };

  const handleSave = () => {
    const payload: ProductPayload = {
      productName: productData.name,
      brandId: Number(productData.brand),
      categoryId: Number(productData.category),
      description: productData.description,
      originalPrice: Number(productData.cost),
      unitPrice: Number(productData.price),
      productStatus: productData.status,
      quantityStock: productData.stock,
      oldImages: productData.oldImages,
      configurations: productData.attributes.map((attr) => ({
        name: attr.name,
        detail: attr.values.map((v) => v.value),
      })),
    };
    console.log(payload);
    if (productData.id) {
      dispatch(updateProduct({ id: productData.id, payload, files: productData.newImages }))
        .unwrap()
        .then(() => {
          toast.success('Tạo sản phẩm thành công!');
          navigate('/admin/products');
        })
        .catch((err) => toast.error(err.message));
    } else {
      dispatch(
        addProduct({
          payload: payload,
          files: productData.newImages,
        })
      )
        .unwrap()
        .then(() => {
          toast.success('Tạo sản phẩm thành công!');
          navigate('/admin/products');
        })
        .catch((err) => toast.error(err.message));
    }
  };

  const generateTempId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

  const handleAddAttribute = () => {
    if (newAttribute.name && newAttribute.value) {
      const newAttributeValue = {
        id: generateTempId(),
        value: newAttribute.value,
      };
      const existingAttr = productData.attributes.find((a) => a.name === newAttribute.name);

      if (existingAttr) {
        const valueExists = existingAttr.values.some((v: any) => v.value === newAttribute.value);
        if (valueExists) {
          toast.error(`Thuộc tính "${newAttribute.value}" đã tồn tại.`);
          return;
        }
        setProductData({
          ...productData,
          attributes: productData.attributes.map((a) =>
            a.name === newAttribute.name ? { ...a, values: [...a.values, newAttributeValue] } : a
          ),
        });
      } else {
        setProductData({
          ...productData,
          attributes: [
            ...productData.attributes,
            { name: newAttribute.name, values: [newAttributeValue] },
          ],
        });
      }
      setNewAttribute({ name: '', value: '' });
      toast.success('Đã thêm thuộc tính!');
    }
  };

  const removeAttributeValue = (attrName: string, valueToRemove: { id: string; value: string }) => {
    setProductData({
      ...productData,
      attributes: productData.attributes
        .map((a) =>
          a.name === attrName
            ? { ...a, values: a.values.filter((v: any) => v.id !== valueToRemove.id) }
            : a
        )
        .filter((a) => a.values.length > 0),
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-success text-success-foreground">Còn hàng</Badge>;
      case 'low_stock':
        return <Badge className="bg-warning text-warning-foreground">Sắp hết</Badge>;
      case 'OUT_OF_STOCK':
        return <Badge className="bg-destructive text-destructive-foreground">Hết hàng</Badge>;
      default:
        return <Badge>Ngừng bán</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Chi tiết sản phẩm #{productData.id}</h1>
          <p className="text-muted-foreground mt-1">Xem và chỉnh sửa thông tin sản phẩm</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tên sản phẩm</Label>
              <Input
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Danh mục</Label>
                <Select
                  value={productData.category}
                  onValueChange={(value) => setProductData({ ...productData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat: any) => (
                      <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                        {cat.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Thương hiệu</Label>
                <Select
                  value={productData.brand}
                  onValueChange={(value) => setProductData({ ...productData, brand: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-50">
                    {brands?.map((brand: any) => (
                      <SelectItem key={brand.brandId} value={brand.brandId.toString()}>
                        {brand.brandName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Giá bán (VNĐ)</Label>
                <Input
                  type="number"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Giá vốn (VNĐ)</Label>
                <Input
                  type="number"
                  value={productData.cost}
                  onChange={(e) => setProductData({ ...productData, cost: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tồn kho</Label>
                <Input
                  type="number"
                  value={productData.stock}
                  onChange={(e) =>
                    setProductData({ ...productData, stock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Images */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Trạng thái sản phẩm</Label>
                <Select
                  value={productData.status}
                  onValueChange={(value) => setProductData({ ...productData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-50">
                    <SelectItem value="ACTIVE">Còn hàng</SelectItem>
                    <SelectItem value="low_stock">Sắp hết</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Hết hàng</SelectItem>
                    <SelectItem value="STOP_SELLING">Ngừng bán</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2">{getStatusBadge(productData.status)}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Hình ảnh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {/* 1. Hiển thị ảnh CŨ (Old Images) */}
                {productData.oldImages.map((img, index) => (
                  <div key={`old-${index}`} className="relative group">
                    <img
                      src={img}
                      alt={`Old Product ${index}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        setProductData({
                          ...productData,
                          oldImages: productData.oldImages.filter((_, i) => i !== index),
                        })
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {/* 2. Hiển thị ảnh MỚI (New Images - Preview) */}
                {productData.newImagePreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={preview}
                      alt={`New Product ${index}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-green-500/50" // Border xanh để phân biệt
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeNewImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Hidden Input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />

              {/* Button Trigger */}
              <Button variant="outline" className="w-full gap-2" onClick={triggerFileInput}>
                <Upload className="h-4 w-4" />
                Thêm hình ảnh
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attributes */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Thuộc tính sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {productData.attributes.map((attr) => (
            <div key={attr.name} className="space-y-2">
              <Label>{attr.name}</Label>
              <div className="flex flex-wrap gap-2">
                {attr.values.map((value) => (
                  <Badge key={value.id} variant="secondary" className="gap-2">
                    {value.value}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeAttributeValue(attr.name, value)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-4 pt-4 border-t">
            <Input
              placeholder="Tên thuộc tính (VD: Màu sắc)"
              value={newAttribute.name}
              onChange={(e) => setNewAttribute({ ...newAttribute, name: e.target.value })}
            />
            <Input
              placeholder="Giá trị (VD: Đỏ)"
              value={newAttribute.value}
              onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
            />
            <Button onClick={handleAddAttribute}>Thêm</Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/admin/products/')}>
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
