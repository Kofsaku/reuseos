"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
} from "lucide-react";

// ─── Audit Log Data ──────────────────────────────────────────────────────────

const userMap: Record<string, string> = {
  USR001: "田中 太郎",
  USR002: "佐藤 美咲",
  USR003: "鈴木 健一",
  USR004: "高橋 裕子",
  USR005: "伊藤 大輔",
};

const allLogs = [
  { id: "LOG001", userId: "USR001", action: "ログイン", targetType: "セッション", targetId: "", changes: "", timestamp: "2026-03-19T08:55:00Z", ip: "192.168.1.10" },
  { id: "LOG002", userId: "USR002", action: "ログイン", targetType: "セッション", targetId: "", changes: "", timestamp: "2026-03-19T09:02:00Z", ip: "192.168.1.11" },
  { id: "LOG003", userId: "USR003", action: "ログイン", targetType: "セッション", targetId: "", changes: "", timestamp: "2026-03-19T09:10:00Z", ip: "192.168.1.12" },
  { id: "LOG026", userId: "USR001", action: "ログイン", targetType: "セッション", targetId: "", changes: "", timestamp: "2026-03-18T09:00:00Z", ip: "192.168.1.10" },
  { id: "LOG027", userId: "USR002", action: "ログイン", targetType: "セッション", targetId: "", changes: "", timestamp: "2026-03-18T09:05:00Z", ip: "192.168.1.11" },
  { id: "LOG028", userId: "USR003", action: "ログイン", targetType: "セッション", targetId: "", changes: "", timestamp: "2026-03-18T09:12:00Z", ip: "192.168.1.12" },
  { id: "LOG029", userId: "USR004", action: "ログイン", targetType: "セッション", targetId: "", changes: "", timestamp: "2026-03-18T09:08:00Z", ip: "192.168.1.13" },
  { id: "LOG030", userId: "USR005", action: "ログイン", targetType: "セッション", targetId: "", changes: "", timestamp: "2026-03-18T09:15:00Z", ip: "192.168.1.14" },
  { id: "LOG019", userId: "USR004", action: "ログアウト", targetType: "セッション", targetId: "", changes: "", timestamp: "2026-03-18T18:05:00Z", ip: "192.168.1.13" },
  { id: "LOG020", userId: "USR005", action: "ログアウト", targetType: "セッション", targetId: "", changes: "", timestamp: "2026-03-18T18:30:00Z", ip: "192.168.1.14" },
  { id: "LOG009", userId: "USR005", action: "作成", targetType: "買取", targetId: "PUR020", changes: "新規買取案件を作成", timestamp: "2026-03-15T11:50:00Z", ip: "192.168.1.14" },
  { id: "LOG010", userId: "USR005", action: "更新", targetType: "買取", targetId: "PUR020", changes: "ステータス: 査定中 → キャンセル", timestamp: "2026-03-15T14:00:00Z", ip: "192.168.1.14" },
  { id: "LOG008", userId: "USR004", action: "作成", targetType: "買取", targetId: "PUR019", changes: "新規買取案件を作成", timestamp: "2026-03-12T13:05:00Z", ip: "192.168.1.13" },
  { id: "LOG007", userId: "USR003", action: "作成", targetType: "買取", targetId: "PUR018", changes: "新規買取案件を作成", timestamp: "2026-03-10T15:35:00Z", ip: "192.168.1.12" },
  { id: "LOG013", userId: "USR002", action: "作成", targetType: "在庫", targetId: "INV024", changes: "新規在庫登録", timestamp: "2026-03-06T09:05:00Z", ip: "192.168.1.11" },
  { id: "LOG014", userId: "USR002", action: "作成", targetType: "在庫", targetId: "INV025", changes: "新規在庫登録", timestamp: "2026-03-06T09:35:00Z", ip: "192.168.1.11" },
  { id: "LOG005", userId: "USR002", action: "作成", targetType: "買取", targetId: "PUR017", changes: "新規買取案件を作成", timestamp: "2026-03-05T10:05:00Z", ip: "192.168.1.11" },
  { id: "LOG006", userId: "USR002", action: "更新", targetType: "買取", targetId: "PUR017", changes: "ステータス: 査定中 → 買取完了", timestamp: "2026-03-05T12:30:00Z", ip: "192.168.1.11" },
  { id: "LOG016", userId: "USR002", action: "更新", targetType: "顧客", targetId: "CUS007", changes: "メモを更新", timestamp: "2026-03-05T12:00:00Z", ip: "192.168.1.11" },
  { id: "LOG012", userId: "USR003", action: "作成", targetType: "在庫", targetId: "INV026", changes: "新規在庫登録", timestamp: "2026-03-04T09:05:00Z", ip: "192.168.1.12" },
  { id: "LOG004", userId: "USR003", action: "作成", targetType: "買取", targetId: "PUR016", changes: "新規買取案件を作成", timestamp: "2026-03-03T11:05:00Z", ip: "192.168.1.12" },
  { id: "LOG018", userId: "USR001", action: "作成", targetType: "経費", targetId: "EXP019", changes: "経費を登録: 店舗清掃", timestamp: "2026-02-28T18:05:00Z", ip: "192.168.1.10" },
  { id: "LOG015", userId: "USR004", action: "更新", targetType: "顧客", targetId: "CUS003", changes: "ランク: ブロンズ → シルバー", timestamp: "2026-02-26T15:00:00Z", ip: "192.168.1.13" },
  { id: "LOG017", userId: "USR001", action: "作成", targetType: "経費", targetId: "EXP018", changes: "経費を登録: 撮影用照明機材", timestamp: "2026-02-15T12:05:00Z", ip: "192.168.1.10" },
  { id: "LOG021", userId: "USR002", action: "更新", targetType: "在庫", targetId: "INV018", changes: "出品価格を設定: ¥548,000", timestamp: "2026-02-13T10:00:00Z", ip: "192.168.1.11" },
  { id: "LOG024", userId: "USR002", action: "削除", targetType: "在庫写真", targetId: "INV017", changes: "不鮮明な写真を削除し再撮影", timestamp: "2026-02-10T11:00:00Z", ip: "192.168.1.11" },
  { id: "LOG023", userId: "USR004", action: "作成", targetType: "売上", targetId: "SLE009", changes: "店頭販売: シャネル マトラッセ ¥548,000", timestamp: "2026-02-18T13:35:00Z", ip: "192.168.1.13" },
  { id: "LOG011", userId: "USR002", action: "更新", targetType: "在庫", targetId: "INV008", changes: "販売価格を設定: ¥2,480,000", timestamp: "2026-01-24T10:00:00Z", ip: "192.168.1.11" },
  { id: "LOG022", userId: "USR003", action: "更新", targetType: "在庫", targetId: "INV002", changes: "ステータス: 在庫中 → 出品中", timestamp: "2026-01-12T10:00:00Z", ip: "192.168.1.12" },
  { id: "LOG025", userId: "USR001", action: "更新", targetType: "ユーザー", targetId: "USR004", changes: "権限を更新", timestamp: "2026-01-05T09:00:00Z", ip: "192.168.1.10" },
];

const actionDotColor: Record<string, string> = {
  作成: "bg-emerald-500",
  更新: "bg-blue-500",
  削除: "bg-rose-500",
  ログイン: "bg-blue-500",
  ログアウト: "bg-gray-400",
};

const actionConfig: Record<string, { label: string }> = {
  作成: { label: "作成" },
  更新: { label: "更新" },
  削除: { label: "削除" },
  ログイン: { label: "ログイン" },
  ログアウト: { label: "ログアウト" },
};

const ITEMS_PER_PAGE = 10;

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AuditLogsPage() {
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = useMemo(() => {
    return allLogs
      .filter((log) => {
        if (actionFilter !== "all" && log.action !== actionFilter) return false;
        if (userFilter !== "all" && log.userId !== userFilter) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const userName = userMap[log.userId]?.toLowerCase() || "";
          return (
            userName.includes(q) ||
            log.targetType.toLowerCase().includes(q) ||
            log.targetId.toLowerCase().includes(q) ||
            log.changes.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }, [actionFilter, userFilter, searchQuery]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">監査ログ</h1>
          <p className="text-gray-500 mt-1">
            システム操作の履歴を確認できます
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          CSV出力
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-2">
                <FileText className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">総ログ数</p>
                <p className="text-xl font-bold text-gray-900">{allLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-2">
                <Shield className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">今日の操作</p>
                <p className="text-xl font-bold text-gray-900">
                  {allLogs.filter((l) => l.timestamp.startsWith("2026-03-19")).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-2">
                <Shield className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">削除操作</p>
                <p className="text-xl font-bold text-gray-900">
                  {allLogs.filter((l) => l.action === "削除").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-2">
                <Shield className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">アクティブユーザー</p>
                <p className="text-xl font-bold text-gray-900">
                  {new Set(allLogs.map((l) => l.userId)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={actionFilter} onValueChange={(v: string | null) => { setActionFilter(v ?? "all"); setCurrentPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="操作タイプ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全て</SelectItem>
                <SelectItem value="作成">作成</SelectItem>
                <SelectItem value="更新">更新</SelectItem>
                <SelectItem value="削除">削除</SelectItem>
                <SelectItem value="ログイン">ログイン</SelectItem>
                <SelectItem value="ログアウト">ログアウト</SelectItem>
              </SelectContent>
            </Select>

            <Select value={userFilter} onValueChange={(v: string | null) => { setUserFilter(v ?? "all"); setCurrentPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="ユーザー" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全ユーザー</SelectItem>
                {Object.entries(userMap).map(([id, name]) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="対象・変更内容を検索..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">日時</TableHead>
                <TableHead className="w-[120px]">ユーザー</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
                <TableHead className="w-[100px]">対象</TableHead>
                <TableHead className="w-[100px]">対象ID</TableHead>
                <TableHead>変更内容</TableHead>
                <TableHead className="w-[130px]">IPアドレス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-500 py-8"
                  >
                    該当するログが見つかりませんでした
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map((log) => {
                  const config = actionConfig[log.action] || actionConfig["作成"];
                  return (
                    <TableRow key={log.id} className="group">
                      <TableCell className="font-mono text-sm">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {userMap[log.userId] || log.userId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`gap-1.5 ${
                          log.action === "作成" ? "bg-emerald-50 text-emerald-700" :
                          log.action === "更新" ? "bg-blue-50 text-blue-700" :
                          log.action === "削除" ? "bg-rose-50 text-rose-700" :
                          log.action === "ログイン" ? "bg-indigo-50 text-indigo-700" :
                          log.action === "ログアウト" ? "bg-slate-50 text-slate-600" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          <span className={`inline-block h-2 w-2 rounded-full ${actionDotColor[log.action] || "bg-gray-400"}`} />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.targetType}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-500">
                        {log.targetId || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 max-w-[300px] truncate">
                        {log.changes || "-"}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-500">
                        {log.ip}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">
                全{filteredLogs.length}件中{" "}
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}〜
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)}件を表示
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  前へ
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-9"
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  次へ
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
