"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { inventories } from "@/lib/mock-data";
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
  LayoutGrid,
  List,
  ShoppingBag,
  Watch,
  Gem,
  Coins,
  Monitor,
  Guitar,
  Camera,
  Landmark,
  Package,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const categoryConfig: Record<string, { icon: React.ElementType }> = {
  "ブランドバッグ": { icon: ShoppingBag },
  "時計": { icon: Watch },
  "ジュエリー": { icon: Gem },
  "貴金属": { icon: Coins },
  "家電": { icon: Monitor },
  "楽器": { icon: Guitar },
  "カメラ": { icon: Camera },
  "骨董品": { icon: Landmark },
};

const statusConfig: Record<string, { label: string; dotColor: string }> = {
  "在庫中": { label: "在庫中", dotColor: "bg-blue-500" },
  "出品中": { label: "出品中", dotColor: "bg-yellow-500" },
  "売却済": { label: "売却済", dotColor: "bg-green-500" },
  "廃棄": { label: "廃棄", dotColor: "bg-red-500" },
};

const sortOptions = [
  { value: "registeredAt-desc", label: "登録日（新しい順）" },
  { value: "registeredAt-asc", label: "登録日（古い順）" },
  { value: "cost-desc", label: "買取額（高い順）" },
  { value: "cost-asc", label: "買取額（低い順）" },
  { value: "name-asc", label: "商品名（A→Z）" },
];

const ITEMS_PER_PAGE = 12;

function formatCurrency(amount: number | undefined) {
  if (amount === undefined) return "-";
  return `¥${amount.toLocaleString()}`;
}

function getDaysInStock(registeredAt: string) {
  const registered = new Date(registeredAt);
  const now = new Date();
  return Math.floor((now.getTime() - registered.getTime()) / (1000 * 60 * 60 * 24));
}

export default function InventoryPage() {
  const [statusFilter, setStatusFilter] = useState<string>("全て");
  const [categoryFilter, setCategoryFilter] = useState<string>("全て");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("registeredAt-desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const cats = new Set(inventories.map((i) => i.category));
    return ["全て", ...Array.from(cats)];
  }, []);

  const statusCounts = useMemo(() => {
    return {
      "在庫中": inventories.filter((i) => i.status === "在庫中").length,
      "出品中": inventories.filter((i) => i.status === "出品中").length,
      "売却済": inventories.filter((i) => i.status === "売却済").length,
    };
  }, []);

  const filtered = useMemo(() => {
    let items = [...inventories];

    if (statusFilter !== "全て") {
      items = items.filter((i) => i.status === statusFilter);
    }
    if (categoryFilter !== "全て") {
      items = items.filter((i) => i.category === categoryFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.barcode.toLowerCase().includes(q)
      );
    }

    const [field, direction] = sortBy.split("-");
    items.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;
      if (field === "cost") {
        valA = a.cost;
        valB = b.cost;
      } else if (field === "name") {
        valA = a.name;
        valB = b.name;
      } else {
        valA = a.registeredAt;
        valB = b.registeredAt;
      }
      if (typeof valA === "string" && typeof valB === "string") {
        return direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return direction === "asc" ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    return items;
  }, [statusFilter, categoryFilter, searchQuery, sortBy]);

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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">在庫管理</h1>
          <p className="text-gray-500 mt-1">
            商品在庫の一覧・管理を行います。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
            <span className={`h-2 w-2 rounded-full ${statusConfig["在庫中"].dotColor}`} />
            在庫中: {statusCounts["在庫中"]}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
            <span className={`h-2 w-2 rounded-full ${statusConfig["出品中"].dotColor}`} />
            出品中: {statusCounts["出品中"]}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
            <span className={`h-2 w-2 rounded-full ${statusConfig["売却済"].dotColor}`} />
            売却済: {statusCounts["売却済"]}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["全て", "在庫中", "出品中", "売却済", "廃棄"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
              >
                {status}
              </Button>
            ))}
          </div>

          <div className="hidden sm:block h-6 w-px bg-border" />

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

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            <Input
              placeholder="商品名・ID・バーコードで検索..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-7 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-0.5 rounded-lg border border-input p-0.5">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="size-3.5" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => setViewMode("table")}
            >
              <List className="size-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        {filtered.length}件の在庫
        {filtered.length !== inventories.length && ` (全${inventories.length}件中)`}
      </p>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedItems.map((item) => {
            const catConf = categoryConfig[item.category] || {
              icon: Package,
            };
            const CatIcon = catConf.icon;
            const days = getDaysInStock(item.registeredAt);
            const statusConf = statusConfig[item.status];

            return (
              <Link key={item.id} href={`/inventory/${item.id}`}>
                <Card className="group/item cursor-pointer h-full">
                  {/* Image Placeholder */}
                  <div
                    className="relative h-40 bg-gray-50 flex items-center justify-center rounded-t-xl"
                  >
                    <CatIcon className="size-12 text-gray-400 opacity-40" />
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium text-gray-700">
                        <span className={`h-2 w-2 rounded-full ${statusConf.dotColor}`} />
                        {statusConf.label}
                      </span>
                    </div>
                    {item.photosCount > 0 && (
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                        {item.photosCount}枚
                      </div>
                    )}
                  </div>

                  <CardContent className="space-y-2">
                    <h3 className="font-medium text-sm leading-tight line-clamp-2 text-gray-900">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5 text-xs font-medium">
                        {item.category}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.condition === "S" ? "bg-indigo-50 text-indigo-700" :
                        item.condition === "A" ? "bg-emerald-50 text-emerald-700" :
                        item.condition === "B" ? "bg-blue-50 text-blue-700" :
                        item.condition === "C" ? "bg-amber-50 text-amber-700" :
                        item.condition === "D" ? "bg-rose-50 text-rose-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {item.condition}ランク
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-500">
                      <div>
                        <span className="block text-gray-900 font-medium">
                          {formatCurrency(item.cost)}
                        </span>
                        <span>買取額</span>
                      </div>
                      <div>
                        <span className="block text-gray-900 font-medium">
                          {formatCurrency(item.listedPrice)}
                        </span>
                        <span>出品額</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {item.location.replace("本店", "")}
                      </span>
                      <span>{days}日経過</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>商品名</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>状態</TableHead>
                <TableHead>ランク</TableHead>
                <TableHead className="text-right">買取額</TableHead>
                <TableHead className="text-right">出品額</TableHead>
                <TableHead>保管場所</TableHead>
                <TableHead className="text-right">経過日数</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item) => {
                const statusConf = statusConfig[item.status];
                const days = getDaysInStock(item.registeredAt);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.id}</TableCell>
                    <TableCell>
                      <Link
                        href={`/inventory/${item.id}`}
                        className="text-gray-900 hover:underline font-medium"
                      >
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5 text-xs font-medium">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
                        <span className={`h-2 w-2 rounded-full ${statusConf.dotColor}`} />
                        {statusConf.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{item.condition}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(item.cost)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(item.listedPrice)}
                    </TableCell>
                    <TableCell className="text-xs">{item.location}</TableCell>
                    <TableCell className="text-right">{days}日</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

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
