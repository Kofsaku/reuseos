"use client";

import { useState, useMemo } from "react";
import { expenses, users } from "@/lib/mock-data";
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
  Wallet,
  Train,
  PackageCheck,
  Wrench,
  Tag,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const categoryConfig: Record<
  string,
  { className: string; icon: React.ElementType; barColor: string }
> = {
  "交通費": {
    className: "bg-blue-50 text-blue-700",
    icon: Train,
    barColor: "bg-blue-500",
  },
  "送料": {
    className: "bg-amber-50 text-amber-700",
    icon: PackageCheck,
    barColor: "bg-amber-500",
  },
  "修理・クリーニング費": {
    className: "bg-violet-50 text-violet-700",
    icon: Wrench,
    barColor: "bg-violet-500",
  },
  "出品手数料": {
    className: "bg-emerald-50 text-emerald-700",
    icon: Tag,
    barColor: "bg-emerald-500",
  },
  "その他": {
    className: "bg-slate-50 text-slate-600",
    icon: MoreHorizontal,
    barColor: "bg-slate-400",
  },
};

function formatCurrency(amount: number) {
  return `¥${amount.toLocaleString()}`;
}

const ITEMS_PER_PAGE = 10;

export default function ExpensesPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("全て");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Enrich expense data
  const enrichedExpenses = useMemo(() => {
    return expenses.map((exp) => {
      const staff = users.find((u) => u.id === exp.staffId);
      return {
        ...exp,
        staffName: staff?.name ?? "不明",
      };
    });
  }, []);

  // Summary calculations
  const summary = useMemo(() => {
    const now = new Date();
    const thisMonth = enrichedExpenses.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthlyTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);

    // Category breakdown
    const catTotals: Record<string, number> = {};
    const total = enrichedExpenses.reduce((sum, e) => sum + e.amount, 0);
    for (const e of enrichedExpenses) {
      catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
    }

    return {
      monthlyTotal,
      total,
      categoryBreakdown: Object.entries(catTotals).sort((a, b) => b[1] - a[1]),
    };
  }, [enrichedExpenses]);

  // Filter
  const filtered = useMemo(() => {
    let items = [...enrichedExpenses];

    if (categoryFilter !== "全て") {
      items = items.filter((e) => e.category === categoryFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          (e.purchaseId && e.purchaseId.toLowerCase().includes(q)) ||
          (e.inventoryId && e.inventoryId.toLowerCase().includes(q))
      );
    }

    // Sort by date descending
    items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return items;
  }, [categoryFilter, searchQuery, enrichedExpenses]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const categories = ["全て", "交通費", "送料", "修理・クリーニング費", "出品手数料", "その他"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">経費管理</h1>
          <p className="text-gray-500 mt-1">
            経費の登録・確認を行います。
          </p>
        </div>
        <Button>
          <Plus className="size-4 mr-1.5" />
          新規経費登録
        </Button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Total */}
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Wallet className="size-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">今月の経費総額</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.monthlyTotal)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="lg:col-span-2">
          <CardContent>
            <p className="text-xs text-gray-500 mb-3">カテゴリ別内訳</p>
            <div className="space-y-2">
              {summary.categoryBreakdown.map(([cat, amount]) => {
                const conf = categoryConfig[cat];
                const percentage = summary.total > 0 ? (amount / summary.total) * 100 : 0;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs w-32 truncate flex items-center gap-1.5">
                      {conf && <conf.icon className="size-3 shrink-0" />}
                      {cat}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${conf?.barColor ?? "bg-gray-400"}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono w-24 text-right">
                      {formatCurrency(amount)}
                    </span>
                    <span className="text-xs text-gray-500 w-12 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-7 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "全て" ? "全カテゴリ" : cat}
              </option>
            ))}
          </select>

          <div className="hidden sm:block h-6 w-px bg-border" />

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            <Input
              placeholder="説明・ID・案件番号で検索..."
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
        {filtered.length}件の経費記録
      </p>

      {/* Data Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>経費ID</TableHead>
              <TableHead>案件番号</TableHead>
              <TableHead>カテゴリ</TableHead>
              <TableHead className="text-right">金額</TableHead>
              <TableHead>説明</TableHead>
              <TableHead>担当者</TableHead>
              <TableHead>登録日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((exp) => {
              const conf = categoryConfig[exp.category];
              const CatIcon = conf?.icon ?? MoreHorizontal;
              const relatedId = exp.purchaseId || exp.inventoryId || "-";
              return (
                <TableRow key={exp.id}>
                  <TableCell className="font-mono text-xs">{exp.id}</TableCell>
                  <TableCell className="font-mono text-xs">{relatedId}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${conf?.className ?? ""}`}
                    >
                      <CatIcon className="size-3" />
                      {exp.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-medium">
                    {formatCurrency(exp.amount)}
                  </TableCell>
                  <TableCell className="text-sm max-w-[300px] truncate">
                    {exp.description}
                  </TableCell>
                  <TableCell className="text-sm">{exp.staffName}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(exp.date).toLocaleDateString("ja-JP")}
                  </TableCell>
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
