"use client";

import { useState, useMemo } from "react";
import { Download, Search, BookOpen, ShieldCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { purchases, customers } from "@/lib/mock-data";

// Generate ledger rows from purchases and their items
interface LedgerRow {
  seqNumber: number;
  purchaseDate: string;
  category: string;
  itemName: string;
  quantity: number;
  description: string;
  customerName: string;
  customerAddress: string;
  verificationMethod: string;
  verificationNumber: string;
}

function generateLedgerRows(): LedgerRow[] {
  const rows: LedgerRow[] = [];
  let seq = 1;

  // Sort purchases by date
  const sortedPurchases = [...purchases].sort(
    (a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
  );

  for (const purchase of sortedPurchases) {
    const customer = customers.find((c) => c.id === purchase.customerId);
    for (const item of purchase.items) {
      const isVerified = customer?.idVerified ?? false;
      // Generate a deterministic mock license number from the customer id
      const idNum = customer?.id
        ? String(customer.id.replace(/\D/g, "")).padStart(3, "0")
        : "000";
      const mockLicenseNumber = isVerified
        ? `第${idNum}${String(seq).padStart(5, "0")}号`
        : "";

      rows.push({
        seqNumber: seq,
        purchaseDate: purchase.purchaseDate,
        category: "買受",
        itemName: item.name,
        quantity: item.quantity,
        description: item.description,
        customerName: customer?.name ?? "不明",
        customerAddress: customer?.address ?? "不明",
        verificationMethod: isVerified ? "運転免許証" : "未確認",
        verificationNumber: mockLicenseNumber,
      });
      seq++;
    }
  }

  return rows;
}

const ITEMS_PER_PAGE = 10;

export default function LedgerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allRows = useMemo(() => generateLedgerRows(), []);

  // Filter rows by search query
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return allRows;
    const q = searchQuery.toLowerCase();
    return allRows.filter(
      (row) =>
        row.itemName.toLowerCase().includes(q) ||
        row.customerName.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q) ||
        row.customerAddress.toLowerCase().includes(q)
    );
  }, [allRows, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredRows.length / ITEMS_PER_PAGE);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Summary calculations
  const totalItemCount = allRows.length;

  const currentMonthCount = allRows.filter((row) => {
    const date = new Date(row.purchaseDate);
    return date.getFullYear() === 2026 && date.getMonth() === 2; // March = 2 (0-indexed)
  }).length;

  const verifiedPurchaseCount = purchases.filter((p) => {
    const customer = customers.find((c) => c.id === p.customerId);
    return customer?.idVerified;
  }).length;
  const verificationRate = Math.round((verifiedPurchaseCount / purchases.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <BookOpen className="size-6 text-indigo-600" />
            古物台帳
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            古物営業法に基づく取引記録
          </p>
        </div>
        <Button variant="outline">
          <Download className="size-4" />
          CSV出力
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <FileText className="size-4 text-indigo-500" />
              総取引件数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {totalItemCount}
              <span className="text-sm font-normal text-gray-500 ml-1">件</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <BookOpen className="size-4 text-indigo-500" />
              今月の取引
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {currentMonthCount}
              <span className="text-sm font-normal text-gray-500 ml-1">件</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-indigo-500" />
              本人確認率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {verificationRate}
              <span className="text-sm font-normal text-gray-500 ml-1">%</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">法定記載事項</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="品目・顧客名で検索..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70px]">受入番号</TableHead>
                <TableHead>取引年月日</TableHead>
                <TableHead>区分</TableHead>
                <TableHead>品目</TableHead>
                <TableHead className="text-center">数量</TableHead>
                <TableHead>特徴</TableHead>
                <TableHead>相手方氏名</TableHead>
                <TableHead>相手方住所</TableHead>
                <TableHead>確認方法</TableHead>
                <TableHead>確認書類番号</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row) => {
                  const date = new Date(row.purchaseDate);
                  const dateStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
                  return (
                    <TableRow key={row.seqNumber}>
                      <TableCell className="font-mono text-xs text-gray-500">
                        {String(row.seqNumber).padStart(4, "0")}
                      </TableCell>
                      <TableCell className="text-sm">{dateStr}</TableCell>
                      <TableCell>
                        <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {row.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm max-w-[200px] truncate" title={row.itemName}>
                          {row.itemName}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">{row.quantity}</TableCell>
                      <TableCell>
                        <p className="text-xs text-gray-500 max-w-[180px] truncate" title={row.description}>
                          {row.description}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm">{row.customerName}</TableCell>
                      <TableCell>
                        <p className="text-xs text-gray-500 max-w-[160px] truncate" title={row.customerAddress}>
                          {row.customerAddress}
                        </p>
                      </TableCell>
                      <TableCell>
                        {row.verificationMethod === "運転免許証" ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="size-3" />
                            {row.verificationMethod}
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-50 text-rose-700 border border-rose-200">
                            {row.verificationMethod}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-gray-500">
                        {row.verificationNumber}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    該当する取引記録がありません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-gray-500">
              {filteredRows.length} 件中 {(currentPage - 1) * ITEMS_PER_PAGE + 1}〜
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredRows.length)} 件を表示
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                前へ
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={page === currentPage ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                次へ
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
