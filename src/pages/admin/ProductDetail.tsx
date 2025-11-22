import { useState } from 'react';
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

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - would come from API/database
  const [productData, setProductData] = useState({
    id: id || '1',
    name: 'Áo thun basic trắng',
    category: 'ao',
    brand: 'fashion-pro',
    price: '299000',
    cost: '150000',
    stock: 45,
    status: 'in_stock',
    description: 'Áo thun basic chất liệu cotton 100%, form rộng thoải mái',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400',
    ],
    attributes: [
      { name: 'Màu sắc', values: ['Trắng', 'Đen', 'Xám'] },
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
    ],
  });

  const [newAttribute, setNewAttribute] = useState({ name: '', value: '' });

  const handleSave = () => {
    toast.success('Đã cập nhật sản phẩm thành công!');
  };

  const handleAddAttribute = () => {
    if (newAttribute.name && newAttribute.value) {
      const existingAttr = productData.attributes.find((a) => a.name === newAttribute.name);
      if (existingAttr) {
        setProductData({
          ...productData,
          attributes: productData.attributes.map((a) =>
            a.name === newAttribute.name ? { ...a, values: [...a.values, newAttribute.value] } : a
          ),
        });
      } else {
        setProductData({
          ...productData,
          attributes: [
            ...productData.attributes,
            { name: newAttribute.name, values: [newAttribute.value] },
          ],
        });
      }
      setNewAttribute({ name: '', value: '' });
      toast.success('Đã thêm thuộc tính!');
    }
  };

  const removeAttributeValue = (attrName: string, value: string) => {
    setProductData({
      ...productData,
      attributes: productData.attributes
        .map((a) =>
          a.name === attrName ? { ...a, values: a.values.filter((v) => v !== value) } : a
        )
        .filter((a) => a.values.length > 0),
    });
  };

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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/products')}>
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ao">Áo</SelectItem>
                    <SelectItem value="quan">Quần</SelectItem>
                    <SelectItem value="vay">Váy</SelectItem>
                    <SelectItem value="ao-khoac">Áo khoác</SelectItem>
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fashion-pro">Fashion Pro</SelectItem>
                    <SelectItem value="denim-co">Denim Co</SelectItem>
                    <SelectItem value="elegant">Elegant</SelectItem>
                    <SelectItem value="street-style">Street Style</SelectItem>
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
                    setProductData({ ...productData, stock: parseInt(e.target.value) })
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
                  <SelectContent>
                    <SelectItem value="in_stock">Còn hàng</SelectItem>
                    <SelectItem value="low_stock">Sắp hết</SelectItem>
                    <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                    <SelectItem value="discontinued">Ngừng bán</SelectItem>
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
                {productData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() =>
                        setProductData({
                          ...productData,
                          images: productData.images.filter((_, i) => i !== index),
                        })
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full gap-2">
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
                  <Badge key={value} variant="secondary" className="gap-2">
                    {value}
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
        <Button variant="outline" onClick={() => navigate('/products')}>
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
