"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Download,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { purchases, customers, users, expenses } from "@/lib/mock-data";
import type { Purchase } from "@/lib/types";

function getStatusBadge(status: Purchase["status"]) {
  const styles: Record<Purchase["status"], string> = {
    買取完了: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    査定中: "bg-amber-50 text-amber-700 border border-amber-200",
    承認待ち: "bg-blue-50 text-blue-700 border border-blue-200",
    キャンセル: "bg-rose-50 text-rose-700 border border-rose-200",
  };
  return <Badge className={styles[status]}>{status}</Badge>;
}

function getConditionBadge(condition: string) {
  const styles: Record<string, string> = {
    S: "bg-indigo-50 text-indigo-700",
    A: "bg-emerald-50 text-emerald-700",
    B: "bg-blue-50 text-blue-700",
    C: "bg-amber-50 text-amber-700",
    D: "bg-rose-50 text-rose-700",
  };
  return <Badge className={styles[condition] ?? ""}>{condition}ランク</Badge>;
}

export default function PurchaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const purchase = purchases.find((p) => p.id === id);
  const [receiptOpen, setReceiptOpen] = useState(false);

  if (!purchase) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">買取案件が見つかりませんでした</p>
        <Link href="/purchases">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="size-4" />
            一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

  const customer = customers.find((c) => c.id === purchase.customerId);
  const staff = users.find((u) => u.id === purchase.staffId);
  const relatedExpenses = expenses.filter(
    (e) => e.purchaseId === purchase.id
  );
  const totalExpenses = relatedExpenses.reduce((sum, e) => sum + e.amount, 0);

  const purchaseDate = new Date(purchase.purchaseDate);
  const formattedDate = `${purchaseDate.getFullYear()}年${purchaseDate.getMonth() + 1}月${purchaseDate.getDate()}日`;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/purchases"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="size-4" />
        買取一覧に戻る
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            案件 {purchase.id}
          </h1>
          {getStatusBadge(purchase.status)}
        </div>
        <p className="text-sm text-gray-500">
          {new Date(purchase.purchaseDate).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
          })}
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-4" />
                顧客情報
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customer ? (
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-bold text-lg">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/customers/${customer.id}`}
                        className="font-semibold text-base hover:underline"
                      >
                        {customer.name}
                      </Link>
                      {customer.idVerified && (
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="size-3" />
                          本人確認済
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{customer.nameKana}</p>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Phone className="size-3.5" />
                      {customer.phone}
                    </div>
                    <p className="text-xs text-gray-500">
                      ID: {customer.id}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">顧客情報なし</p>
              )}
            </CardContent>
          </Card>

          {/* Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>品目一覧</CardTitle>
              <CardDescription>
                {purchase.items.length} 点の品目
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>品名</TableHead>
                    <TableHead>カテゴリ</TableHead>
                    <TableHead>状態</TableHead>
                    <TableHead className="text-center">数量</TableHead>
                    <TableHead className="text-right">買取価格</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchase.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5 max-w-xs truncate">
                            {item.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{getConditionBadge(item.condition)}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        ¥{item.price.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>案件サマリー</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500">買取合計金額</dt>
                  <dd className="text-xl font-bold">
                    ¥{purchase.totalAmount.toLocaleString()}
                  </dd>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500">担当者</dt>
                  <dd className="text-sm font-medium">{staff?.name ?? "不明"}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    場所
                  </dt>
                  <dd className="text-sm">{purchase.location}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500">品目数</dt>
                  <dd className="text-sm">{purchase.items.length} 点</dd>
                </div>
                {purchase.memo && (
                  <>
                    <div className="h-px bg-border" />
                    <div>
                      <dt className="text-sm text-gray-500 mb-1">メモ</dt>
                      <dd className="text-sm rounded-md bg-gray-50 p-2.5">
                        {purchase.memo}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Related Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>関連経費</CardTitle>
              {relatedExpenses.length > 0 && (
                <CardDescription>
                  合計: ¥{totalExpenses.toLocaleString()}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {relatedExpenses.length > 0 ? (
                <ul className="space-y-2">
                  {relatedExpenses.map((expense) => (
                    <li
                      key={expense.id}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{expense.category}</p>
                        <p className="text-xs text-gray-500">
                          {expense.description}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        ¥{expense.amount.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  関連経費はありません
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-3 border-t pt-6">
        <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
          <DialogTrigger
            render={
              <Button variant="outline">
                <FileText className="size-4" />
                電子買受書プレビュー
              </Button>
            }
          />
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>電子買受書プレビュー</DialogTitle>
            </DialogHeader>

            {/* Receipt Document */}
            <div className="bg-white border border-gray-300 rounded-sm p-8 space-y-6 text-gray-900" style={{ fontFamily: "'Yu Mincho', 'Hiragino Mincho Pro', 'MS PMincho', serif" }}>
              {/* Title */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-[0.5em]">買 受 書</h2>
                <p className="text-xs text-gray-500">古物商許可番号: 東京都公安委員会 第301234567890号</p>
                <p className="text-sm">取引日: {formattedDate}</p>
              </div>

              <div className="h-px bg-gray-900" />

              {/* Seller (Customer) Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold border-b border-gray-400 pb-1">売渡人（お客様）</h3>
                {customer ? (
                  <div className="text-sm space-y-1 pl-2">
                    <p>氏名: {customer.name}（{customer.nameKana}）</p>
                    <p>住所: {customer.address}</p>
                    <p>電話: {customer.phone}</p>
                    <p>本人確認方法: 運転免許証</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 pl-2">顧客情報なし</p>
                )}
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold border-b border-gray-400 pb-1">買受品目</h3>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-400">
                      <th className="text-left py-1.5 px-1 font-semibold">品名</th>
                      <th className="text-left py-1.5 px-1 font-semibold">カテゴリ</th>
                      <th className="text-center py-1.5 px-1 font-semibold">状態</th>
                      <th className="text-center py-1.5 px-1 font-semibold">数量</th>
                      <th className="text-right py-1.5 px-1 font-semibold">買取金額</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchase.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="py-1.5 px-1 whitespace-normal">{item.name}</td>
                        <td className="py-1.5 px-1">{item.category}</td>
                        <td className="py-1.5 px-1 text-center">{item.condition}</td>
                        <td className="py-1.5 px-1 text-center">{item.quantity}</td>
                        <td className="py-1.5 px-1 text-right">¥{item.price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="border-2 border-gray-900 px-6 py-3">
                  <p className="text-sm text-gray-600">合計金額</p>
                  <p className="text-xl font-bold text-right">¥{purchase.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="h-px bg-gray-900" />

              {/* Buyer (Company) Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold border-b border-gray-400 pb-1">買受人</h3>
                <div className="text-sm space-y-1 pl-2">
                  <p className="font-semibold">株式会社安心鑑定団</p>
                  <p>東京都千代田区丸の内1-1-1</p>
                  <p>代表取締役 田中太郎</p>
                </div>
              </div>

              {/* Staff */}
              <div className="text-sm pl-2">
                <p>担当者: {staff?.name ?? "不明"}</p>
              </div>

              {/* Signature Area */}
              <div className="pt-4 space-y-6">
                <div className="flex justify-between items-end">
                  <div className="text-sm">
                    <p>{formattedDate}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="w-24 h-24 border border-gray-400 rounded-sm flex items-center justify-center text-xs text-gray-400">
                      印
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="outline">
          <Download className="size-4" />
          PDF出力
        </Button>
      </div>
    </div>
  );
}
