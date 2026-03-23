"use client";

import { useState, useMemo } from "react";
import { sales, inventories, users } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  TrendingUp,
  DollarSign,
  BarChart3,
  Trophy,
  Store,
  ShoppingCart,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const channelConfig: Record<string, { className: string; icon: React.ElementType }> = {
  "店頭": {
    className: "bg-indigo-50 text-indigo-700",
    icon: Store,
  },
  "ヤフオク": {
    className: "bg-red-50 text-red-700",
    icon: ShoppingCart,
  },
  "メルカリShops": {
    className: "bg-rose-50 text-rose-700",
    icon: ShoppingCart,
  },
  "業販": {
    className: "bg-slate-50 text-slate-600",
    icon: Truck,
  },
};

function formatCurrency(amount: number) {
  return `¥${amount.toLocaleString()}`;
}

const ITEMS_PER_PAGE = 10;

export default function SalesPage() {
  const [channelFilter, setChannelFilter] = useState<string>("全て");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Enrich sales data with inventory and user info
  const enrichedSales = useMemo(() => {
    return sales.map((sale) => {
      const inventory = inventories.find((inv) => inv.id === sale.inventoryId);
      const staff = users.find((u) => u.id === sale.staffId);
      const cost = inventory?.cost ?? 0;
      const grossProfit = sale.salePrice - cost;
      return {
        ...sale,
        itemName: inventory?.name ?? "不明",
        cost,
        grossProfit,
        staffName: staff?.name ?? "不明",
      };
    });
  }, []);

  // Summary calculations
  const summary = useMemo(() => {
    const now = new Date();
    const thisMonth = enrichedSales.filter((s) => {
      const d = new Date(s.saleDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const totalSalesAmount = enrichedSales.reduce((sum, s) => sum + s.salePrice, 0);
    const totalCost = enrichedSales.reduce((sum, s) => sum + s.cost, 0);
    const totalProfit = totalSalesAmount - totalCost;
    const avgProfitRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    // Best channel
    const channelTotals: Record<string, number> = {};
    for (const s of enrichedSales) {
      channelTotals[s.channel] = (channelTotals[s.channel] || 0) + s.salePrice;
    }
    const bestChannel = Object.entries(channelTotals).sort((a, b) => b[1] - a[1])[0];

    return {
      monthlyCount: thisMonth.length,
      totalSalesAmount,
      avgProfitRate,
      bestChannel: bestChannel ? bestChannel[0] : "-",
      bestChannelAmount: bestChannel ? bestChannel[1] : 0,
    };
  }, [enrichedSales]);

  // Filter
  const filtered = useMemo(() => {
    let items = [...enrichedSales];

    if (channelFilter !== "全て") {
      items = items.filter((s) => s.channel === channelFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (s) =>
          s.itemName.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.buyerInfo.toLowerCase().includes(q)
      );
    }

    // Sort by date descending
    items.sort(
      (a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
    );

    return items;
  }, [channelFilter, searchQuery, enrichedSales]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">売却管理</h1>
          <p className="text-gray-500 mt-1">
            売却履歴の確認・管理を行います。
          </p>
        </div>
        <Button>
          <Plus className="size-4 mr-1.5" />
          新規売却登録
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <TrendingUp className="size-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">今月の売却件数</p>
              <p className="text-2xl font-bold text-gray-900">{summary.monthlyCount}件</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <DollarSign className="size-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">売却総額</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalSalesAmount)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <BarChart3 className="size-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">平均粗利率</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.avgProfitRate.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Trophy className="size-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">チャネル別最高</p>
              <p className="text-lg font-bold text-gray-900">{summary.bestChannel}</p>
              <p className="text-xs text-gray-500">
                {formatCurrency(summary.bestChannelAmount)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          {/* Channel Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["全て", "店頭", "ヤフオク", "メルカリShops", "業販"].map((ch) => (
              <Button
                key={ch}
                variant={channelFilter === ch ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setChannelFilter(ch);
                  setCurrentPage(1);
                }}
              >
                {ch}
              </Button>
            ))}
          </div>

          <div className="hidden sm:block h-6 w-px bg-border" />

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            <Input
              placeholder="商品名・売却ID・購入者で検索..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        {filtered.length}件の売却記録
      </p>

      {/* Data Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>売却ID</TableHead>
              <TableHead>商品名</TableHead>
              <TableHead>売却チャネル</TableHead>
              <TableHead className="text-right">買取額</TableHead>
              <TableHead className="text-right">売却額</TableHead>
              <TableHead className="text-right">粗利</TableHead>
              <TableHead>売却日</TableHead>
              <TableHead>担当者</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((sale) => {
              const chConf = channelConfig[sale.channel];
              return (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono text-xs">{sale.id}</TableCell>
                  <TableCell>
                    <span className="font-medium">{sale.itemName}</span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${chConf.className}`}
                    >
                      {sale.channel}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatCurrency(sale.cost)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatCurrency(sale.salePrice)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    <span
                      className={
                        sale.grossProfit >= 0
                          ? "text-green-700"
                          : "text-red-700"
                      }
                    >
                      {sale.grossProfit >= 0 ? "+" : ""}
                      {formatCurrency(sale.grossProfit)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(sale.saleDate).toLocaleDateString("ja-JP")}
                  </TableCell>
                  <TableCell className="text-sm">{sale.staffName}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="size-4" />
            前へ
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon-xs"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            次へ
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
