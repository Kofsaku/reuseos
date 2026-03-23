"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Phone,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { customers } from "@/lib/mock-data";
import type { Customer } from "@/lib/types";

const ITEMS_PER_PAGE = 12;

function getRankBadge(rank: Customer["rank"]) {
  const styles: Record<Customer["rank"], string> = {
    ブロンズ: "bg-orange-50 text-orange-700 border border-orange-200",
    シルバー: "bg-slate-50 text-slate-600 border border-slate-200",
    ゴールド: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    プラチナ: "bg-violet-50 text-violet-700 border border-violet-200",
  };
  return <Badge className={styles[rank]}>{rank}</Badge>;
}

function getInitials(name: string) {
  return name.charAt(0);
}

function getAvatarColor(rank: Customer["rank"]) {
  const colors: Record<Customer["rank"], string> = {
    ブロンズ: "bg-orange-100 text-orange-700",
    シルバー: "bg-slate-100 text-slate-600",
    ゴールド: "bg-yellow-100 text-yellow-700",
    プラチナ: "bg-violet-100 text-violet-700",
  };
  return colors[rank];
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rankFilter, setRankFilter] = useState<string>("全て");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("全て");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (rankFilter !== "全て" && c.rank !== rankFilter) return false;
      if (verifiedFilter === "確認済" && !c.idVerified) return false;
      if (verifiedFilter === "未確認" && c.idVerified) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(query) ||
          c.nameKana.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          c.id.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [searchQuery, rankFilter, verifiedFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goldPlusCount = customers.filter(
    (c) => c.rank === "ゴールド" || c.rank === "プラチナ"
  ).length;
  const repeaterCount = customers.filter((c) => c.totalCount >= 2).length;
  const repeaterRate = Math.round((repeaterCount / customers.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">顧客管理</h1>
          <p className="text-gray-500 mt-1">
            顧客情報の一覧と管理
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="size-4" />
          新規顧客登録
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>
          全 <span className="font-semibold text-gray-900">{customers.length}</span> 名
        </span>
        <span className="text-border">|</span>
        <span>
          ゴールド以上:{" "}
          <span className="font-semibold text-gray-900">{goldPlusCount}</span> 名
        </span>
        <span className="text-border">|</span>
        <span>
          リピーター率:{" "}
          <span className="font-semibold text-gray-900">{repeaterRate}%</span>
        </span>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={rankFilter}
              onValueChange={(val) => {
                setRankFilter(val ?? "全て");
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="ランク" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="全て">全ランク</SelectItem>
                <SelectItem value="プラチナ">プラチナ</SelectItem>
                <SelectItem value="ゴールド">ゴールド</SelectItem>
                <SelectItem value="シルバー">シルバー</SelectItem>
                <SelectItem value="ブロンズ">ブロンズ</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={verifiedFilter}
              onValueChange={(val) => {
                setVerifiedFilter(val ?? "全て");
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="本人確認" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="全て">全て</SelectItem>
                <SelectItem value="確認済">確認済</SelectItem>
                <SelectItem value="未確認">未確認</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="名前、フリガナ、電話番号で検索..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex items-center gap-1 rounded-lg border p-0.5">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="icon-sm"
                onClick={() => setViewMode("table")}
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((customer) => (
            <Link key={customer.id} href={`/customers/${customer.id}`}>
              <Card className="h-full cursor-pointer">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-full font-bold text-lg ${getAvatarColor(customer.rank)}`}
                    >
                      {getInitials(customer.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{customer.name}</h3>
                        {customer.idVerified && (
                          <ShieldCheck className="size-4 shrink-0 text-gray-500" />
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {getRankBadge(customer.rank)}
                        <span className="text-xs text-gray-500">
                          {customer.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Phone className="size-3.5" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">取引回数</span>
                      <span className="font-medium">{customer.totalCount} 回</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">取引合計</span>
                      <span className="font-medium">
                        ¥{customer.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {paginated.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              該当する顧客がいません
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>顧客</TableHead>
                  <TableHead>ランク</TableHead>
                  <TableHead>電話番号</TableHead>
                  <TableHead className="text-center">取引回数</TableHead>
                  <TableHead className="text-right">取引合計</TableHead>
                  <TableHead className="text-center">本人確認</TableHead>
                  <TableHead>アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((customer) => (
                  <TableRow key={customer.id} className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${getAvatarColor(customer.rank)}`}
                        >
                          {getInitials(customer.name)}
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRankBadge(customer.rank)}</TableCell>
                    <TableCell className="text-gray-500">{customer.phone}</TableCell>
                    <TableCell className="text-center">{customer.totalCount}</TableCell>
                    <TableCell className="text-right font-medium">
                      ¥{customer.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {customer.idVerified ? (
                        <ShieldCheck className="mx-auto size-4 text-gray-500" />
                      ) : (
                        <span className="text-xs text-gray-500">未確認</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/customers/${customer.id}`}>
                        <Button variant="ghost" size="xs">
                          詳細
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                      該当する顧客がいません
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filtered.length} 名中 {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} 名を表示
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon-sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
