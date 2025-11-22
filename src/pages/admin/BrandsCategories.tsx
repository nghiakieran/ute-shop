import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

const brands = [
  { id: 1, name: 'Fashion Pro', products: 45, status: 'active' },
  { id: 2, name: 'Denim Co', products: 32, status: 'active' },
  { id: 3, name: 'Elegant', products: 28, status: 'active' },
  { id: 4, name: 'Street Style', products: 51, status: 'active' },
];

const categories = [
  { id: 1, name: 'Áo', products: 120, status: 'active' },
  { id: 2, name: 'Quần', products: 89, status: 'active' },
  { id: 3, name: 'Váy', products: 67, status: 'active' },
  { id: 4, name: 'Áo khoác', products: 45, status: 'active' },
];

export default function BrandsCategories() {
  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Thương hiệu & Danh mục</h1>
        <p className="text-muted-foreground mt-1">Quản lý thương hiệu và danh mục sản phẩm</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brands */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Thương hiệu
              </CardTitle>
              <Button size="sm" className="gap-2 gradient-primary">
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
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow key={brand.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell>{brand.products}</TableCell>
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

        {/* Categories */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-success" />
                Danh mục
              </CardTitle>
              <Button size="sm" className="gap-2 gradient-primary">
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
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.products}</TableCell>
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
    </div>
  );
}
