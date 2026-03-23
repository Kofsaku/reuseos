"use client";

import { useMemo } from "react";
import {
  ShoppingBag,
  Wallet,
  TrendingUp,
  PiggyBank,
  AlertTriangle,
  Clock,
  Camera,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import {
  purchases,
  sales,
  expenses,
  inventories,
  users,
  customers,
} from "@/lib/mock-data";
import type { Purchase } from "@/lib/types";

function formatCurrency(value: number): string {
  return `¥${value.toLocaleString()}`;
}

function getStatusDotColor(status: Purchase["status"]): string {
  switch (status) {
    case "買取完了":
      return "bg-green-500";
    case "査定中":
      return "bg-yellow-500";
    case "承認待ち":
      return "bg-blue-500";
    case "キャンセル":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

const monthlyData = [
  { month: "10月", 買取額: 980000, 売却額: 720000 },
  { month: "11月", 買取額: 1250000, 売却額: 1050000 },
  { month: "12月", 買取額: 1680000, 売却額: 1420000 },
  { month: "1月", 買取額: 4295000, 売却額: 2122500 },
  { month: "2月", 買取額: 3648000, 売却額: 3118300 },
  { month: "3月", 買取額: 1468000, 売却額: 2074800 },
];

const channelData = [
  { name: "店頭", value: 3167000, color: "#6366f1" },
  { name: "ヤフオク", value: 335800, color: "#0891b2" },
  { name: "メルカリShops", value: 286500, color: "#059669" },
  { name: "業販", value: 1778000, color: "#0891b2" },
];

export default function DashboardPage() {
  const thisMonthPurchases = useMemo(
    () =>
      purchases.filter((p) => {
        const d = new Date(p.purchaseDate);
        return d.getFullYear() === 2026 && d.getMonth() === 2;
      }),
    []
  );

  const totalPurchaseAmount = useMemo(
    () => purchases.reduce((sum, p) => sum + p.totalAmount, 0),
    []
  );

  const totalSalesAmount = useMemo(
    () => sales.reduce((sum, s) => sum + s.salePrice, 0),
    []
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    []
  );

  const grossProfit = totalSalesAmount - totalExpenses;
  const profitRate =
    totalSalesAmount > 0
      ? ((grossProfit / totalSalesAmount) * 100).toFixed(1)
      : "0";

  const recentPurchases = useMemo(
    () =>
      [...purchases]
        .sort(
          (a, b) =>
            new Date(b.purchaseDate).getTime() -
            new Date(a.purchaseDate).getTime()
        )
        .slice(0, 5),
    []
  );

  const inventoryAlerts = useMemo(() => {
    const now = new Date("2026-03-19T12:00:00Z");
    return inventories
      .filter((inv) => inv.status === "在庫中" || inv.status === "出品中")
      .map((inv) => {
        const registeredDate = new Date(inv.registeredAt);
        const daysInStock = Math.floor(
          (now.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return { ...inv, daysInStock };
      })
      .filter((inv) => inv.daysInStock > 20 || inv.photosCount === 0)
      .sort((a, b) => b.daysInStock - a.daysInStock)
      .slice(0, 6);
  }, []);

  const staffPerformance = useMemo(() => {
    const staffMap = new Map<
      string,
      { name: string; count: number; totalAmount: number; salesAmount: number }
    >();
    users.forEach((u) => {
      staffMap.set(u.id, { name: u.name, count: 0, totalAmount: 0, salesAmount: 0 });
    });
    purchases.forEach((p) => {
      const staff = staffMap.get(p.staffId);
      if (staff) { staff.count += 1; staff.totalAmount += p.totalAmount; }
    });
    sales.forEach((s) => {
      const staff = staffMap.get(s.staffId);
      if (staff) { staff.salesAmount += s.salePrice; }
    });
    return Array.from(staffMap.values()).filter((s) => s.count > 0 || s.salesAmount > 0);
  }, []);

  const getCustomerName = (customerId: string) =>
    customers.find((c) => c.id === customerId)?.name ?? "不明";
  const getStaffName = (staffId: string) =>
    users.find((u) => u.id === staffId)?.name ?? "不明";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mt-1 text-sm text-gray-500">
          ReuseOSへようこそ。業務の概要をご確認ください。
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">今月の買取件数</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {thisMonthPurchases.length}<span className="ml-1 text-lg font-normal text-gray-500">件</span>
            </div>
            <p className="mt-1 text-xs text-green-600">↑12% vs 先月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">買取総額</CardTitle>
            <Wallet className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalPurchaseAmount)}</div>
            <p className="mt-1 text-xs text-green-600">↑8% vs 先月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">売却総額</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(totalSalesAmount)}</div>
            <p className="mt-1 text-xs text-green-600">↑15% vs 先月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">粗利益</CardTitle>
            <PiggyBank className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(grossProfit)}</div>
            <p className="mt-1 text-xs text-gray-500">利益率 {profitRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-gray-900">月別買取・売却推移</CardTitle>
            <p className="text-sm text-gray-500">過去6ヶ月の買取額と売却額の推移</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="買取額" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="売却額" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-gray-900">売却チャネル別構成比</CardTitle>
            <p className="text-sm text-gray-500">チャネルごとの売上金額割合</p>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchases & Alerts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-gray-900">最近の買取案件</CardTitle>
            <p className="text-sm text-gray-500">直近5件の買取案件</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>顧客</TableHead>
                  <TableHead>金額</TableHead>
                  <TableHead>担当</TableHead>
                  <TableHead className="text-right">ステータス</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-mono text-xs text-gray-500">{purchase.id}</TableCell>
                    <TableCell className="font-medium text-gray-900">{getCustomerName(purchase.customerId)}</TableCell>
                    <TableCell className="text-gray-700">{formatCurrency(purchase.totalAmount)}</TableCell>
                    <TableCell className="text-gray-500">{getStaffName(purchase.staffId)}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${getStatusDotColor(purchase.status)}`} />
                        <span className="text-xs text-gray-700">{purchase.status}</span>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-gray-900">在庫アラート</CardTitle>
            <p className="text-sm text-gray-500">長期在庫・写真未登録の商品</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventoryAlerts.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
                  <div className="mt-0.5">
                    {item.photosCount === 0 ? (
                      <Camera className="h-4 w-4 text-gray-400" />
                    ) : item.daysInStock > 45 ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>{item.category}</span>
                      <span>・原価 {formatCurrency(item.cost)}</span>
                      {item.daysInStock > 0 && (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-700">{item.daysInStock}日経過</span>
                      )}
                      {item.photosCount === 0 && (
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-700">写真未登録</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-gray-900">担当者別パフォーマンス</CardTitle>
          <p className="text-sm text-gray-500">各担当者の買取件数・買取額・売上額</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>担当者</TableHead>
                  <TableHead className="text-center">買取件数</TableHead>
                  <TableHead className="text-right">買取額</TableHead>
                  <TableHead className="text-right">売上額</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffPerformance.map((staff) => (
                  <TableRow key={staff.name}>
                    <TableCell className="font-medium text-gray-900">{staff.name}</TableCell>
                    <TableCell className="text-center text-gray-700">{staff.count}件</TableCell>
                    <TableCell className="text-right text-gray-700">{formatCurrency(staff.totalAmount)}</TableCell>
                    <TableCell className="text-right text-gray-700">{formatCurrency(staff.salesAmount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={staffPerformance.map((s) => ({
                    name: s.name.split(" ")[0],
                    買取額: s.totalAmount,
                    売上額: s.salesAmount,
                  }))}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
                  <YAxis type="category" dataKey="name" fontSize={12} tickLine={false} axisLine={false} width={50} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="買取額" fill="#6366f1" radius={[0, 4, 4, 0]} maxBarSize={24} />
                  <Bar dataKey="売上額" fill="#059669" radius={[0, 4, 4, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
