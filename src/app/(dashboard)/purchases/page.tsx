"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
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
import { purchases, customers, users } from "@/lib/mock-data";
import type { Purchase } from "@/lib/types";

const ITEMS_PER_PAGE = 10;

function getStatusBadge(status: Purchase["status"]) {
  const styles: Record<Purchase["status"], string> = {
    買取完了: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    査定中: "bg-amber-50 text-amber-700 border border-amber-200",
    承認待ち: "bg-blue-50 text-blue-700 border border-blue-200",
    キャンセル: "bg-rose-50 text-rose-700 border border-rose-200",
  };
  return (
    <Badge className={styles[status]}>
      {status}
    </Badge>
  );
}

function getCustomerName(customerId: string) {
  return customers.find((c) => c.id === customerId)?.name ?? "不明";
}

function getStaffName(staffId: string) {
  return users.find((u) => u.id === staffId)?.name ?? "不明";
}

export default function PurchasesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("全て");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return purchases.filter((p) => {
      if (statusFilter !== "全て" && p.status !== statusFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const customerName = getCustomerName(p.customerId).toLowerCase();
        return (
          p.id.toLowerCase().includes(query) ||
          customerName.includes(query) ||
          p.items.some((item) => item.name.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [statusFilter, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const completedCount = purchases.filter((p) => p.status === "買取完了").length;
  const totalAmount = purchases
    .filter((p) => p.status === "買取完了")
    .reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">買取管理</h1>
          <p className="text-gray-500 mt-1">
            買取案件の一覧と管理
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="size-4" />
          新規買取登録
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>
          全 <span className="font-semibold text-gray-900">{purchases.length}</span> 件
        </span>
        <span className="text-border">|</span>
        <span>
          買取完了: <span className="font-semibold text-gray-900">{completedCount}</span> 件
        </span>
        <span className="text-border">|</span>
        <span>
          合計金額:{" "}
          <span className="font-semibold text-gray-900">
            ¥{totalAmount.toLocaleString()}
          </span>
        </span>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val ?? "全て");
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="全て">全て</SelectItem>
                <SelectItem value="査定中">査定中</SelectItem>
                <SelectItem value="承認待ち">承認待ち</SelectItem>
                <SelectItem value="買取完了">買取完了</SelectItem>
                <SelectItem value="キャンセル">キャンセル</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="案件ID、顧客名、品目名で検索..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>案件ID</TableHead>
                <TableHead>取引日</TableHead>
                <TableHead>顧客名</TableHead>
                <TableHead className="text-center">品目数</TableHead>
                <TableHead className="text-right">買取金額</TableHead>
                <TableHead>担当者</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((purchase) => (
                <TableRow key={purchase.id} className="cursor-pointer">
                  <TableCell className="font-mono text-xs font-medium">
                    {purchase.id}
                  </TableCell>
                  <TableCell>
                    {new Date(purchase.purchaseDate).toLocaleDateString("ja-JP")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {getCustomerName(purchase.customerId)}
                  </TableCell>
                  <TableCell className="text-center">
                    {purchase.items.length}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ¥{purchase.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {getStaffName(purchase.staffId)}
                  </TableCell>
                  <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                  <TableCell>
                    <Link href={`/purchases/${purchase.id}`}>
                      <Button variant="ghost" size="xs">
                        詳細
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                    該当する買取案件がありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filtered.length} 件中 {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} 件を表示
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
