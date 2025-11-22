import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const stats = [
  { title: 'Tổng sản phẩm', value: '1,234', icon: Package, color: 'text-primary' },
  { title: 'Đơn hàng', value: '856', icon: ShoppingCart, color: 'text-success' },
  { title: 'Doanh thu tháng', value: '125M VNĐ', icon: TrendingUp, color: 'text-warning' },
  { title: 'Sắp hết hàng', value: '23', icon: AlertTriangle, color: 'text-destructive' },
];

const bestSellers = [
  { name: 'Áo thun basic trắng', sold: 345, revenue: '12.5M' },
  { name: 'Quần jean skinny đen', sold: 289, revenue: '18.2M' },
  { name: 'Áo hoodie xám', sold: 267, revenue: '15.8M' },
  { name: 'Váy hoa midi', sold: 234, revenue: '14.3M' },
  { name: 'Áo sơ mi trắng', sold: 198, revenue: '9.8M' },
];

const lowStock = [
  { name: 'Áo khoác da', stock: 3, status: 'critical' },
  { name: 'Quần short kaki', stock: 8, status: 'warning' },
  { name: 'Váy maxi đen', stock: 12, status: 'warning' },
  { name: 'Áo len cổ lọ', stock: 5, status: 'critical' },
];

const revenueData = [
  { month: 'T1', revenue: 85, profit: 35 },
  { month: 'T2', revenue: 92, profit: 38 },
  { month: 'T3', revenue: 88, profit: 36 },
  { month: 'T4', revenue: 105, profit: 45 },
  { month: 'T5', revenue: 98, profit: 42 },
  { month: 'T6', revenue: 125, profit: 58 },
  { month: 'T7', revenue: 118, profit: 52 },
  { month: 'T8', revenue: 135, profit: 62 },
];

const topProductsData = [
  { name: 'Áo thun basic', value: 345, fill: 'hsl(var(--primary))' },
  { name: 'Quần jean skinny', value: 289, fill: 'hsl(var(--success))' },
  { name: 'Áo hoodie', value: 267, fill: 'hsl(var(--warning))' },
  { name: 'Váy hoa midi', value: 234, fill: 'hsl(var(--accent))' },
  { name: 'Áo sơ mi', value: 198, fill: 'hsl(var(--primary-glow))' },
];

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Tổng quan hoạt động cửa hàng</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="shadow-card hover:shadow-elegant transition-shadow duration-300 animate-scale-in"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Profit Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Doanh thu & Lợi nhuận (triệu VNĐ)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  name="Doanh thu"
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--success))"
                  strokeWidth={3}
                  name="Lợi nhuận"
                  dot={{ fill: 'hsl(var(--success))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products Pie Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-success" />
              Top 5 sản phẩm bán chạy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProductsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topProductsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Sellers */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Sản phẩm bán chạy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bestSellers.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">Đã bán: {product.sold}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Sản phẩm sắp hết hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStock.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Còn lại: {product.stock} sản phẩm
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.status === 'critical'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {product.status === 'critical' ? 'Cần nhập' : 'Cảnh báo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
