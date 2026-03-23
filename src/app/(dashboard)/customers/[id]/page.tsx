"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CircleDot,
  CreditCard,
  Upload,
  MessageCircle,
  Smartphone,
  Send,
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
import { Textarea } from "@/components/ui/textarea";
import { customers, purchases } from "@/lib/mock-data";
import type { Customer } from "@/lib/types";

function getRankBadge(rank: Customer["rank"]) {
  const styles: Record<Customer["rank"], string> = {
    ブロンズ: "bg-orange-50 text-orange-700 border border-orange-200",
    シルバー: "bg-slate-50 text-slate-600 border border-slate-200",
    ゴールド: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    プラチナ: "bg-violet-50 text-violet-700 border border-violet-200",
  };
  return <Badge className={styles[rank]}>{rank}</Badge>;
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

function getStatusDotColor(status: string) {
  const colors: Record<string, string> = {
    買取完了: "text-green-500",
    査定中: "text-yellow-500",
    承認待ち: "text-blue-500",
    キャンセル: "text-red-500",
  };
  return colors[status] ?? "text-gray-500";
}

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">顧客情報が見つかりませんでした</p>
        <Link href="/customers">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="size-4" />
            一覧に戻る
          </Button>
        </Link>
      </div>
    );
  }

  const customerPurchases = purchases
    .filter((p) => p.customerId === customer.id)
    .sort(
      (a, b) =>
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    );

  const totalPurchaseAmount = customerPurchases
    .filter((p) => p.status === "買取完了")
    .reduce((sum, p) => sum + p.totalAmount, 0);
  const avgPerTransaction =
    customerPurchases.length > 0
      ? Math.round(totalPurchaseAmount / customerPurchases.filter((p) => p.status === "買取完了").length) || 0
      : 0;
  const firstDate = customerPurchases.length > 0
    ? new Date(
        customerPurchases[customerPurchases.length - 1].purchaseDate
      ).toLocaleDateString("ja-JP")
    : "-";
  const lastDate = customerPurchases.length > 0
    ? new Date(customerPurchases[0].purchaseDate).toLocaleDateString("ja-JP")
    : "-";

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="size-4" />
        顧客一覧に戻る
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className={`flex size-16 shrink-0 items-center justify-center rounded-full text-2xl font-bold ${getAvatarColor(customer.rank)}`}
        >
          {customer.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {customer.name}
            </h1>
            {getRankBadge(customer.rank)}
            {customer.idVerified ? (
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="size-3" />
                確認済
              </Badge>
            ) : (
              <Badge className="bg-rose-50 text-rose-700 border border-rose-200">
                <ShieldAlert className="size-3" />
                未確認
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {customer.nameKana} / {customer.id}
          </p>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs text-gray-500 mb-0.5">氏名</dt>
                <dd className="text-sm font-medium">{customer.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-0.5">フリガナ</dt>
                <dd className="text-sm">{customer.nameKana}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                  <Phone className="size-3" />
                  電話番号
                </dt>
                <dd className="text-sm">{customer.phone}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                  <Mail className="size-3" />
                  メール
                </dt>
                <dd className="text-sm break-all">{customer.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                  <MapPin className="size-3" />
                  住所
                </dt>
                <dd className="text-sm">{customer.address}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-0.5">ランク</dt>
                <dd>{getRankBadge(customer.rank)}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-0.5">本人確認</dt>
                <dd className="text-sm">
                  {customer.idVerified ? (
                    <span className="text-gray-900 flex items-center gap-1">
                      <ShieldCheck className="size-3.5" /> 確認済
                    </span>
                  ) : (
                    <span className="text-gray-500 flex items-center gap-1">
                      <ShieldAlert className="size-3.5" /> 未確認
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                  <Calendar className="size-3" />
                  登録日
                </dt>
                <dd className="text-sm">
                  {new Date(customer.createdAt).toLocaleDateString("ja-JP")}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Center: Transaction Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>取引履歴</CardTitle>
            <CardDescription>{customerPurchases.length} 件の取引</CardDescription>
          </CardHeader>
          <CardContent>
            {customerPurchases.length > 0 ? (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

                <ul className="space-y-4">
                  {customerPurchases.map((purchase) => (
                    <li key={purchase.id} className="relative pl-7">
                      {/* Timeline dot */}
                      <CircleDot
                        className={`absolute left-0 top-0.5 size-[15px] ${getStatusDotColor(purchase.status)}`}
                      />
                      <Link
                        href={`/purchases/${purchase.id}`}
                        className="block rounded-lg border p-3 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-gray-500">
                            {purchase.id}
                          </span>
                          <Badge
                            className={
                              purchase.status === "買取完了" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              purchase.status === "査定中" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                              purchase.status === "承認待ち" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                              purchase.status === "キャンセル" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                              "bg-gray-100 text-gray-700"
                            }
                          >
                            {purchase.status}
                          </Badge>
                        </div>
                        <p className="mt-1.5 text-sm font-medium">
                          ¥{purchase.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(purchase.purchaseDate).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                          {" / "}
                          {purchase.items.length} 点
                        </p>
                        {purchase.items.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {purchase.items.map((i) => i.name).join("、")}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">
                取引履歴はありません
              </p>
            )}
          </CardContent>
        </Card>

        {/* Right: Statistics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>統計</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-3">
                  <dt className="text-xs text-gray-500">取引回数</dt>
                  <dd className="text-2xl font-bold mt-0.5">
                    {customerPurchases.length}{" "}
                    <span className="text-sm font-normal text-gray-500">回</span>
                  </dd>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <dt className="text-xs text-gray-500">取引合計金額</dt>
                  <dd className="text-2xl font-bold mt-0.5">
                    ¥{totalPurchaseAmount.toLocaleString()}
                  </dd>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <dt className="text-xs text-gray-500">平均取引金額</dt>
                  <dd className="text-2xl font-bold mt-0.5">
                    ¥{avgPerTransaction.toLocaleString()}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <dt className="text-xs text-gray-500">初回取引日</dt>
                    <dd className="text-sm font-medium mt-0.5">{firstDate}</dd>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <dt className="text-xs text-gray-500">最新取引日</dt>
                    <dd className="text-sm font-medium mt-0.5">{lastDate}</dd>
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Memo Section */}
          <Card>
            <CardHeader>
              <CardTitle>メモ</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={customer.memo}
                placeholder="顧客に関するメモを入力..."
                rows={4}
                className="resize-none"
              />
              <Button variant="outline" size="sm" className="mt-3">
                メモを保存
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 本人確認書類 Section */}
      <IdVerificationSection customer={customer} />

      {/* メッセージ連携 Section */}
      <MessageIntegrationSection customer={customer} />
    </div>
  );
}

function IdVerificationSection({ customer }: { customer: Customer }) {
  if (customer.idVerified) {
    const verificationDate = new Date(customer.createdAt);
    verificationDate.setDate(verificationDate.getDate() - 30);

    return (
      <Card>
        <CardHeader>
          <CardTitle>本人確認書類</CardTitle>
          <CardDescription>提出済みの本人確認書類</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex h-48 flex-col items-center justify-center rounded-lg bg-gray-100">
              <CreditCard className="size-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">運転免許証（表面）</p>
            </div>
            <div className="flex h-48 flex-col items-center justify-center rounded-lg bg-gray-100">
              <CreditCard className="size-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">運転免許証（裏面）</p>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div>
              <dt className="text-xs text-gray-500">書類種別</dt>
              <dd className="text-sm font-medium mt-0.5">運転免許証</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">確認日</dt>
              <dd className="text-sm font-medium mt-0.5">
                {verificationDate.toLocaleDateString("ja-JP")}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">有効期限</dt>
              <dd className="text-sm font-medium mt-0.5">2029年03月15日</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">ステータス</dt>
              <dd className="mt-0.5">
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                  確認済
                </Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>本人確認書類</CardTitle>
        <CardDescription>提出済みの本人確認書類</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 py-12">
          <Upload className="size-10 text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-700">
            本人確認書類をアップロード
          </p>
          <p className="mt-1 text-xs text-slate-500">
            運転免許証・マイナンバーカード・パスポートに対応
          </p>
          <Button variant="outline" className="mt-4">
            ファイルを選択
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MessageIntegrationSection({ customer }: { customer: Customer }) {
  const [activeTab, setActiveTab] = useState<"LINE" | "SMS">("LINE");

  const customerIdNum = parseInt(customer.id.replace(/\D/g, ""), 10);
  const isLineConnected = customerIdNum % 2 !== 0;

  const lineConnectionDate = new Date(customer.createdAt);
  lineConnectionDate.setDate(lineConnectionDate.getDate() + 30);

  const lineMessages = [
    { date: "2026-03-20 14:30", content: "買取完了のお知らせ", status: "送信済" },
    { date: "2026-03-15 10:00", content: "査定結果のご連絡", status: "送信済" },
    { date: "2026-03-01 09:00", content: "キャンペーンのご案内", status: "開封済" },
    { date: "2026-02-15 11:00", content: "ご来店ありがとうございます", status: "送信済" },
  ];

  const smsMessages = [
    { date: "2026-03-18 16:00", content: "買取予約確認", status: "送信済" },
    { date: "2026-02-28 09:30", content: "ご来店確認", status: "送信済" },
  ];

  function getMessageStatusBadge(status: string) {
    const styles: Record<string, string> = {
      送信済: "bg-blue-50 text-blue-700",
      開封済: "bg-emerald-50 text-emerald-700",
      失敗: "bg-rose-50 text-rose-700",
    };
    return <Badge className={styles[status] ?? "bg-gray-100 text-gray-700"}>{status}</Badge>;
  }

  const currentMessages = activeTab === "LINE" ? lineMessages : smsMessages;

  return (
    <Card>
      <CardHeader>
        <CardTitle>メッセージ連携</CardTitle>
        <CardDescription>LINE・SMSでの顧客コミュニケーション</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <Button
            size="sm"
            variant={activeTab === "LINE" ? "default" : "outline"}
            className={
              activeTab === "LINE"
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                : ""
            }
            onClick={() => setActiveTab("LINE")}
          >
            <MessageCircle className="size-4" />
            LINE
          </Button>
          <Button
            size="sm"
            variant={activeTab === "SMS" ? "default" : "outline"}
            className={
              activeTab === "SMS"
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                : ""
            }
            onClick={() => setActiveTab("SMS")}
          >
            <Smartphone className="size-4" />
            SMS
          </Button>
        </div>

        {activeTab === "LINE" && (
          <div className="mb-6 rounded-lg border p-4">
            {isLineConnected ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">LINE連携済</span>
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                    連携中
                  </Badge>
                </div>
                <dl className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <dt className="text-xs text-gray-500">LINE表示名</dt>
                    <dd className="text-sm font-medium mt-0.5">{customer.name}様</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">連携日</dt>
                    <dd className="text-sm font-medium mt-0.5">
                      {lineConnectionDate.toLocaleDateString("ja-JP")}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">未連携</span>
                  <Badge className="bg-gray-100 text-gray-600">未連携</Badge>
                </div>
                <Button variant="outline" size="sm">
                  LINE連携を送信
                </Button>
              </div>
            )}
          </div>
        )}

        {(activeTab === "LINE" && isLineConnected) || activeTab === "SMS" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>送信日時</TableHead>
                <TableHead>内容</TableHead>
                <TableHead>ステータス</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMessages.map((msg, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm text-gray-500">{msg.date}</TableCell>
                  <TableCell className="text-sm">{msg.content}</TableCell>
                  <TableCell>{getMessageStatusBadge(msg.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}

        <div className="mt-6">
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
            <Send className="size-4" />
            メッセージを送信
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
