import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { vi } from 'date-fns/locale';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  DollarSign,
  CalendarRange,
  UserPlus,
  Trophy,
  Shirt,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { dashboardApi } from '@/utils/dashboard.api';

// --- DATA ---
const fullYearData = [
  { date: '2024-01', name: 'T1', revenue: 85, profit: 35, customers: 120, orders: 450 },
  { date: '2024-02', name: 'T2', revenue: 92, profit: 38, customers: 145, orders: 480 },
  { date: '2024-03', name: 'T3', revenue: 88, profit: 36, customers: 130, orders: 460 },
  { date: '2024-04', name: 'T4', revenue: 105, profit: 45, customers: 160, orders: 550 },
  { date: '2024-05', name: 'T5', revenue: 98, profit: 42, customers: 380, orders: 510 },
  { date: '2024-06', name: 'T6', revenue: 125, profit: 58, customers: 450, orders: 620 },
  { date: '2024-07', name: 'T7', revenue: 118, profit: 52, customers: 430, orders: 590 },
  { date: '2024-08', name: 'T8', revenue: 135, profit: 62, customers: 500, orders: 700 },
  { date: '2024-09', name: 'T9', revenue: 140, profit: 65, customers: 520, orders: 720 },
  { date: '2024-10', name: 'T10', revenue: 130, profit: 58, customers: 480, orders: 680 },
  { date: '2024-11', name: 'T11', revenue: 150, profit: 70, customers: 600, orders: 750 },
  { date: '2024-12', name: 'T12', revenue: 160, profit: 75, customers: 650, orders: 800 },
];

const topProductsData = [
  { name: 'Áo thun basic', value: 345, fill: 'hsl(var(--primary))' },
  { name: 'Quần jean skinny', value: 289, fill: 'hsl(var(--success))' },
  { name: 'Áo hoodie', value: 267, fill: 'hsl(var(--warning))' },
  { name: 'Váy hoa midi', value: 234, fill: 'hsl(var(--accent))' },
  { name: 'Áo sơ mi', value: 198, fill: 'hsl(var(--primary-glow))' },
];

// const bestSellers = [
//   { name: 'Áo thun basic trắng', sold: 345, revenue: '12.5M' },
//   { name: 'Quần jean skinny đen', sold: 289, revenue: '18.2M' },
//   { name: 'Áo hoodie xám', sold: 267, revenue: '15.8M' },
//   { name: 'Váy hoa midi', sold: 234, revenue: '14.3M' },
//   { name: 'Áo sơ mi trắng', sold: 198, revenue: '9.8M' },
// ];

export default function Dashboard() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [startDate, setStartDate] = useState<Date>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<Date>(today);

  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const mapChartData = (revenue: any, profit: any, customers: any) => {
    return revenue.time.map((t: string, index: number) => ({
      name: t,
      revenue: Number(revenue.data[index]),
      profit: Number(profit.data[index]),
      customers: Number(customers.data[index]),
    }));
  };
  const toISODate = (date: Date) => date.toISOString().slice(0, 10);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const body = {
          startDate: toISODate(startDate),
          endDate: toISODate(endDate),
        };

        const [cardRes, revenueRes, profitRes, customerRes, bestSellerRes] = await Promise.all([
          dashboardApi.getChartCard(),
          dashboardApi.getRevenueByTime(body),
          dashboardApi.getProfitByTime(body),
          dashboardApi.getNewUserByTime(body),
          dashboardApi.getBestSeller(body),
        ]);

        setChartData(
          mapChartData(revenueRes.data.data, profitRes.data.data, customerRes.data.data)
        );

        setStats([
          {
            title: 'Doanh thu',
            value: `${cardRes.data.data.totalRevenue}`,
            icon: TrendingUp,
            color: 'text-primary',
          },
          {
            title: 'Lợi nhuận',
            value: `${cardRes.data.data.totalProfit}`,
            icon: DollarSign,
            color: 'text-success',
          },
          {
            title: 'Đơn hàng cần xử lý',
            value: cardRes.data.data.quantityBillNeedToProcess,
            icon: ShoppingCart,
            color: 'text-warning',
          },
          {
            title: 'Sản phẩm',
            value: cardRes.data.data.quantityProduct,
            icon: Shirt,
            color: 'text-indigo-500',
          },
        ]);

        setBestSellers(bestSellerRes.data.data);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [startDate, endDate]);

  return (
    <div className="p-8 space-y-8 animate-fade-in bg-background min-h-screen">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Báo cáo hiệu quả kinh doanh</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-card p-3 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarRange className="w-4 h-4 text-muted-foreground" />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date!)}
              dateFormat="dd/MM/yyyy"
              locale={vi}
              className="bg-background border border-border rounded px-2 py-1 text-sm
                 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <span className="text-muted-foreground">-</span>

          <div className="flex items-center gap-2">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date!)}
              dateFormat="dd/MM/yyyy"
              locale={vi}
              className="bg-background border border-border rounded px-2 py-1 text-sm
                 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-card hover:shadow-elegant transition-all">
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

      {/* === HÀNG 1: TÀI CHÍNH & TỶ TRỌNG SẢN PHẨM === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Biểu đồ Tài chính (Chiếm 2 phần) */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Tăng trưởng Tài chính
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Doanh thu"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--success))"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  name="Lợi nhuận"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Biểu đồ Tỷ trọng (Chiếm 1 phần) */}
        <Card className="shadow-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-warning" />
              Tỷ trọng sản phẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
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
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* === HÀNG 2: SẢN PHẨM BÁN CHẠY & KHÁCH HÀNG MỚI === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Danh sách Sản phẩm bán chạy */}
        <Card className="shadow-card h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Sản phẩm bán chạy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bestSellers.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index < 3 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3" /> {product.sold} bán
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success text-sm">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Biểu đồ Khách hàng mới */}
        <Card className="shadow-card h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-indigo-500" />
              Khách hàng mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Bar
                  dataKey="customers"
                  name="Khách mới"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                >
                  {/* Hiệu ứng màu gradient cho cột nếu muốn */}
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.customers > 400 ? '#8884d8' : '#8884d890'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
