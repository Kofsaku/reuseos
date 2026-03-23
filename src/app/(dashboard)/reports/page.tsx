"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Download,
  DollarSign,
  ShoppingCart,
  Receipt,
  Wallet,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// ─── Chart Data ──────────────────────────────────────────────────────────────

const monthlyPnL = [
  { month: "10月", revenue: 2850000, cost: 1980000, profit: 870000, expenses: 125000 },
  { month: "11月", revenue: 3120000, cost: 2150000, profit: 970000, expenses: 148000 },
  { month: "12月", revenue: 4580000, cost: 3200000, profit: 1380000, expenses: 195000 },
  { month: "1月", revenue: 3924500, cost: 2870000, profit: 1054500, expenses: 168000 },
  { month: "2月", revenue: 3624300, cost: 2628000, profit: 996300, expenses: 207800 },
  { month: "3月", revenue: 2074800, cost: 1430000, profit: 644800, expenses: 115500 },
];

const categoryData = [
  { name: "ブランドバッグ", value: 4250000, color: "#6366f1" },
  { name: "時計", value: 3580000, color: "#06b6d4" },
  { name: "ジュエリー", value: 1820000, color: "#10b981" },
  { name: "貴金属", value: 1480000, color: "#f59e0b" },
  { name: "カメラ", value: 980000, color: "#f43f5e" },
  { name: "楽器", value: 650000, color: "#6366f1" },
  { name: "家電", value: 420000, color: "#14b8a6" },
  { name: "骨董品", value: 1350000, color: "#0891b2" },
];

const staffPnL = [
  { name: "佐藤 美咲", role: "マネージャー", purchases: 6, purchaseTotal: 4925000, salesTotal: 5832000, expenses: 58700, grossProfit: 848300, profitRate: 14.6 },
  { name: "鈴木 健一", role: "スタッフ", purchases: 5, purchaseTotal: 1697000, salesTotal: 2318500, expenses: 67950, grossProfit: 553550, profitRate: 23.9 },
  { name: "高橋 裕子", role: "スタッフ", purchases: 4, purchaseTotal: 1356000, salesTotal: 1936000, expenses: 51000, grossProfit: 529000, profitRate: 27.3 },
  { name: "伊藤 大輔", role: "スタッフ", purchases: 3, purchaseTotal: 1105000, salesTotal: 1538800, expenses: 51100, grossProfit: 382700, profitRate: 24.9 },
  { name: "田中 太郎", role: "管理者", purchases: 0, purchaseTotal: 0, salesTotal: 0, expenses: 100000, grossProfit: -100000, profitRate: 0 },
];

const monthlySummary = [
  { month: "2025年10月", purchaseCount: 15, purchaseTotal: 1980000, salesCount: 12, salesTotal: 2850000, expenses: 125000, grossProfit: 745000, profitRate: 26.1 },
  { month: "2025年11月", purchaseCount: 18, purchaseTotal: 2150000, salesCount: 14, salesTotal: 3120000, expenses: 148000, grossProfit: 822000, profitRate: 26.3 },
  { month: "2025年12月", purchaseCount: 22, purchaseTotal: 3200000, salesCount: 19, salesTotal: 4580000, expenses: 195000, grossProfit: 1185000, profitRate: 25.9 },
  { month: "2026年1月", purchaseCount: 7, purchaseTotal: 2870000, salesCount: 5, salesTotal: 3924500, expenses: 168000, grossProfit: 886500, profitRate: 22.6 },
  { month: "2026年2月", purchaseCount: 7, purchaseTotal: 2628000, salesCount: 5, salesTotal: 3624300, expenses: 207800, grossProfit: 788500, profitRate: 21.8 },
  { month: "2026年3月", purchaseCount: 6, purchaseTotal: 1430000, salesCount: 5, salesTotal: 2074800, expenses: 115500, grossProfit: 529300, profitRate: 25.5 },
];

function formatCurrency(value: number) {
  return `¥${value.toLocaleString()}`;
}

export default function ReportsPage() {
  const [period, setPeriod] = useState("monthly");

  const totalRevenue = monthlyPnL.reduce((s, m) => s + m.revenue, 0);
  const totalCost = monthlyPnL.reduce((s, m) => s + m.cost, 0);
  const totalExpenses = monthlyPnL.reduce((s, m) => s + m.expenses, 0);
  const netProfit = totalRevenue - totalCost - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  const kpis = [
    { label: "売上総額", value: totalRevenue, icon: DollarSign, trend: "+12.5%", up: true, color: "text-gray-500", bg: "bg-gray-100" },
    { label: "仕入総額", value: totalCost, icon: ShoppingCart, trend: "+8.3%", up: true, color: "text-gray-500", bg: "bg-gray-100" },
    { label: "経費合計", value: totalExpenses, icon: Receipt, trend: "-3.2%", up: false, color: "text-gray-500", bg: "bg-gray-100" },
    { label: "純利益", value: netProfit, icon: Wallet, trend: `利益率 ${profitMargin}%`, up: true, color: "text-gray-500", bg: "bg-gray-100" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">損益レポート</h1>
          <p className="text-gray-500 mt-1">
            期間別の損益データを確認できます
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList>
              <TabsTrigger value="daily">日次</TabsTrigger>
              <TabsTrigger value="weekly">週次</TabsTrigger>
              <TabsTrigger value="monthly">月次</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            CSV出力
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">
                    {kpi.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(kpi.value)}
                  </p>
                </div>
                <div className={`rounded-full p-3 ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-sm">
                {kpi.up ? (
                  <TrendingUp className="h-4 w-4 text-green-700" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-700" />
                )}
                <span className={kpi.up ? "text-green-700" : "text-red-700"}>
                  {kpi.trend}
                </span>
                <span className="text-gray-500 ml-1">前期比</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* P&L Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>損益推移グラフ</CardTitle>
            <CardDescription>直近6ヶ月の売上・原価・利益の推移</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={monthlyPnL}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis
                  className="text-xs"
                  tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelStyle={{ color: "#374151" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="売上"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  name="原価"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#colorCost)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="粗利益"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>カテゴリ別売上構成</CardTitle>
            <CardDescription>商品カテゴリごとの売上比率</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={true}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Staff P&L Table */}
      <Card>
        <CardHeader>
          <CardTitle>担当者別損益テーブル</CardTitle>
          <CardDescription>
            スタッフごとの買取・売却パフォーマンス
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>担当者名</TableHead>
                <TableHead className="text-right">買取件数</TableHead>
                <TableHead className="text-right">買取総額</TableHead>
                <TableHead className="text-right">売却総額</TableHead>
                <TableHead className="text-right">経費</TableHead>
                <TableHead className="text-right">粗利益</TableHead>
                <TableHead className="text-right">粗利率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffPnL.map((staff, i) => {
                return (
                  <TableRow
                    key={i}
                    className={
                      ""
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{staff.name}</span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            staff.role === "管理者" ? "bg-indigo-50 text-indigo-700" :
                            staff.role === "マネージャー" ? "bg-blue-50 text-blue-700" :
                            "bg-slate-50 text-slate-600"
                          }`}
                        >
                          {staff.role}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-gray-900">{staff.purchases}件</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(staff.purchaseTotal)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(staff.salesTotal)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(staff.expenses)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span
                        className={
                          staff.grossProfit >= 0
                            ? "text-green-700"
                            : "text-red-700"
                        }
                      >
                        {formatCurrency(staff.grossProfit)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {staff.purchases > 0 ? (
                        <span className={staff.profitRate >= 15 ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                          {staff.profitRate}%
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>月別サマリー</CardTitle>
          <CardDescription>月ごとの損益一覧</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>月</TableHead>
                <TableHead className="text-right">買取件数</TableHead>
                <TableHead className="text-right">買取総額</TableHead>
                <TableHead className="text-right">売却件数</TableHead>
                <TableHead className="text-right">売上総額</TableHead>
                <TableHead className="text-right">経費</TableHead>
                <TableHead className="text-right">粗利益</TableHead>
                <TableHead className="text-right">粗利率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlySummary.map((m, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{m.month}</TableCell>
                  <TableCell className="text-right">{m.purchaseCount}件</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(m.purchaseTotal)}
                  </TableCell>
                  <TableCell className="text-right">{m.salesCount}件</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(m.salesTotal)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(m.expenses)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-700">
                    {formatCurrency(m.grossProfit)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={m.profitRate >= 15 ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                      {m.profitRate}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {/* Totals row */}
              <TableRow className="border-t-2 font-bold">
                <TableCell>合計</TableCell>
                <TableCell className="text-right">
                  {monthlySummary.reduce((s, m) => s + m.purchaseCount, 0)}件
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    monthlySummary.reduce((s, m) => s + m.purchaseTotal, 0)
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {monthlySummary.reduce((s, m) => s + m.salesCount, 0)}件
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    monthlySummary.reduce((s, m) => s + m.salesTotal, 0)
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(
                    monthlySummary.reduce((s, m) => s + m.expenses, 0)
                  )}
                </TableCell>
                <TableCell className="text-right text-green-700">
                  {formatCurrency(
                    monthlySummary.reduce((s, m) => s + m.grossProfit, 0)
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-green-700 font-medium">
                    {(
                      (monthlySummary.reduce((s, m) => s + m.grossProfit, 0) /
                        monthlySummary.reduce((s, m) => s + m.salesTotal, 0)) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
