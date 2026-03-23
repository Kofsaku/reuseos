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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Bell,
  Database,
  Settings2,
  Save,
  Download,
  Pencil,
  Plus,
  Info,
  CheckCircle,
} from "lucide-react";

// ─── Toggle Switch Component ─────────────────────────────────────────────────

function ToggleSwitch({
  checked,
  onCheckedChange,
  label,
  description,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          checked ? "bg-primary" : "bg-input"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-background shadow-sm transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

// ─── Settings Data ───────────────────────────────────────────────────────────

const categories = [
  { id: 1, name: "ブランドバッグ", count: 8 },
  { id: 2, name: "時計", count: 3 },
  { id: 3, name: "ジュエリー", count: 4 },
  { id: 4, name: "貴金属", count: 2 },
  { id: 5, name: "家電", count: 3 },
  { id: 6, name: "楽器", count: 3 },
  { id: 7, name: "カメラ", count: 3 },
  { id: 8, name: "骨董品", count: 4 },
];

const expenseTypes = [
  { id: 1, name: "交通費" },
  { id: 2, name: "送料" },
  { id: 3, name: "修理・クリーニング費" },
  { id: 4, name: "出品手数料" },
  { id: 5, name: "その他" },
];

const customerRanks = [
  { id: 1, name: "ブロンズ", threshold: "¥0〜", color: "bg-amber-700" },
  { id: 2, name: "シルバー", threshold: "¥500,000〜", color: "bg-gray-400" },
  { id: 3, name: "ゴールド", threshold: "¥1,500,000〜", color: "bg-yellow-500" },
  { id: 4, name: "プラチナ", threshold: "¥3,000,000〜", color: "bg-blue-400" },
];

export default function SettingsPage() {
  // Notification toggles
  const [notifications, setNotifications] = useState({
    inventoryAlert: true,
    purchaseComplete: true,
    approvalRequest: true,
    highValueAlert: true,
    photoMissing: false,
    dailyReport: true,
    monthlyReport: true,
    customerRankChange: true,
    idVerification: true,
    systemMaintenance: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">設定</h1>
        <p className="text-gray-500 mt-1">
          システムの各種設定を管理します
        </p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            会社情報
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            通知設定
          </TabsTrigger>
          <TabsTrigger value="master" className="gap-2">
            <Database className="h-4 w-4" />
            マスタ管理
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Settings2 className="h-4 w-4" />
            システム
          </TabsTrigger>
        </TabsList>

        {/* ─── 会社情報 Tab ─────────────────────────────────────────────────── */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>会社情報</CardTitle>
              <CardDescription>
                会社の基本情報を管理します。古物商許可番号は正確に入力してください。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">会社名</Label>
                  <Input
                    id="companyName"
                    defaultValue="株式会社リユースOS"
                    placeholder="会社名を入力"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeName">店舗名</Label>
                  <Input
                    id="storeName"
                    defaultValue="ReuseOS 本店"
                    placeholder="店舗名を入力"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">所在地</Label>
                <Input
                  id="address"
                  defaultValue="東京都渋谷区神宮前1-2-3 リユースビル4F"
                  placeholder="住所を入力"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">電話番号</Label>
                  <Input
                    id="phone"
                    defaultValue="03-1234-5678"
                    placeholder="電話番号を入力"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fax">FAX番号</Label>
                  <Input
                    id="fax"
                    defaultValue="03-1234-5679"
                    placeholder="FAX番号を入力"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    defaultValue="info@reuseos.jp"
                    placeholder="メールアドレスを入力"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">ウェブサイト</Label>
                  <Input
                    id="website"
                    defaultValue="https://reuseos.jp"
                    placeholder="URLを入力"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">古物商許可情報</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dealerLicense">古物商許可番号</Label>
                    <Input
                      id="dealerLicense"
                      defaultValue="第304371234567号"
                      placeholder="古物商許可番号を入力"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publicSafetyCommission">
                      公安委員会
                    </Label>
                    <Input
                      id="publicSafetyCommission"
                      defaultValue="東京都公安委員会"
                      placeholder="公安委員会名を入力"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="representative">代表者名</Label>
                    <Input
                      id="representative"
                      defaultValue="田中 太郎"
                      placeholder="代表者名を入力"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseDate">許可年月日</Label>
                    <Input
                      id="licenseDate"
                      defaultValue="2025-03-15"
                      type="date"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  保存する
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── 通知設定 Tab ─────────────────────────────────────────────────── */}
        <TabsContent value="notifications">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>業務通知</CardTitle>
                <CardDescription>
                  買取・在庫・売上に関する通知の設定
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <ToggleSwitch
                  checked={notifications.purchaseComplete}
                  onCheckedChange={() => toggleNotification("purchaseComplete")}
                  label="買取完了通知"
                  description="買取案件が完了した際に通知を受け取ります"
                />
                <Separator />
                <ToggleSwitch
                  checked={notifications.approvalRequest}
                  onCheckedChange={() => toggleNotification("approvalRequest")}
                  label="承認リクエスト通知"
                  description="買取承認が必要な場合に通知を受け取ります"
                />
                <Separator />
                <ToggleSwitch
                  checked={notifications.highValueAlert}
                  onCheckedChange={() => toggleNotification("highValueAlert")}
                  label="高額買取アラート"
                  description="一定金額以上の買取が行われた際に通知します"
                />
                <Separator />
                <ToggleSwitch
                  checked={notifications.inventoryAlert}
                  onCheckedChange={() => toggleNotification("inventoryAlert")}
                  label="在庫アラート"
                  description="在庫の長期滞留や価格見直し時期に通知します"
                />
                <Separator />
                <ToggleSwitch
                  checked={notifications.photoMissing}
                  onCheckedChange={() => toggleNotification("photoMissing")}
                  label="写真未登録アラート"
                  description="在庫に写真が未登録の場合に通知します"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>レポート・その他</CardTitle>
                <CardDescription>
                  定期レポートやシステム関連の通知設定
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <ToggleSwitch
                  checked={notifications.dailyReport}
                  onCheckedChange={() => toggleNotification("dailyReport")}
                  label="日次レポート"
                  description="毎日の業務サマリーを通知します"
                />
                <Separator />
                <ToggleSwitch
                  checked={notifications.monthlyReport}
                  onCheckedChange={() => toggleNotification("monthlyReport")}
                  label="月次レポート"
                  description="月次の損益レポートを通知します"
                />
                <Separator />
                <ToggleSwitch
                  checked={notifications.customerRankChange}
                  onCheckedChange={() =>
                    toggleNotification("customerRankChange")
                  }
                  label="顧客ランク変更通知"
                  description="顧客のランクが変更された際に通知します"
                />
                <Separator />
                <ToggleSwitch
                  checked={notifications.idVerification}
                  onCheckedChange={() => toggleNotification("idVerification")}
                  label="身分証未確認通知"
                  description="身分証が未確認の顧客について通知します"
                />
                <Separator />
                <ToggleSwitch
                  checked={notifications.systemMaintenance}
                  onCheckedChange={() =>
                    toggleNotification("systemMaintenance")
                  }
                  label="システムメンテナンス通知"
                  description="計画メンテナンスの事前通知を受け取ります"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── マスタ管理 Tab ───────────────────────────────────────────────── */}
        <TabsContent value="master">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Categories */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">商品カテゴリ</CardTitle>
                    <CardDescription>買取・在庫のカテゴリ分類</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Plus className="h-3 w-3" />
                    追加
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between rounded-lg border px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{cat.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {cat.count}件
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expense Types */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">経費区分</CardTitle>
                    <CardDescription>経費の分類カテゴリ</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Plus className="h-3 w-3" />
                    追加
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expenseTypes.map((et) => (
                    <div
                      key={et.id}
                      className="flex items-center justify-between rounded-lg border px-3 py-2"
                    >
                      <span className="text-sm font-medium">{et.name}</span>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Ranks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">顧客ランク</CardTitle>
                    <CardDescription>顧客の取引額に基づくランク</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Plus className="h-3 w-3" />
                    追加
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {customerRanks.map((rank) => (
                    <div
                      key={rank.id}
                      className="flex items-center justify-between rounded-lg border px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${rank.color}`}
                        />
                        <span className="text-sm font-medium">{rank.name}</span>
                        <span className="text-xs text-gray-500">
                          {rank.threshold}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── システム Tab ─────────────────────────────────────────────────── */}
        <TabsContent value="system">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Data Export */}
            <Card>
              <CardHeader>
                <CardTitle>データエクスポート</CardTitle>
                <CardDescription>
                  各種データをCSV形式でエクスポートできます
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "買取データ", desc: "全買取案件の一覧" },
                  { label: "在庫データ", desc: "現在の在庫一覧" },
                  { label: "売上データ", desc: "全売上記録" },
                  { label: "顧客データ", desc: "顧客情報一覧" },
                  { label: "経費データ", desc: "経費記録一覧" },
                  { label: "監査ログ", desc: "操作履歴の全記録" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500">
                        {item.desc}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-3 w-3" />
                      CSV
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>バックアップ情報</CardTitle>
                  <CardDescription>
                    データの自動バックアップ状況
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                    <CheckCircle className="h-5 w-5 text-gray-900" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        バックアップは正常です
                      </p>
                      <p className="text-xs text-gray-500">
                        最終バックアップ: 2026-03-19 03:00:00
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        バックアップ頻度
                      </span>
                      <span className="font-medium">毎日 03:00</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">保持期間</span>
                      <span className="font-medium">30日間</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        ストレージ使用量
                      </span>
                      <span className="font-medium">2.4 GB / 10 GB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>バージョン情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg border px-4 py-3">
                    <Info className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-bold">
                        ReuseOS v1.0.0 Phase 1 MVP
                      </p>
                      <p className="text-xs text-gray-500">
                        リリース日: 2026-03-01
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">フレームワーク</span>
                      <span className="font-medium">Next.js 14</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">UIライブラリ</span>
                      <span className="font-medium">shadcn/ui</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">データベース</span>
                      <span className="font-medium">PostgreSQL 16</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">ホスティング</span>
                      <span className="font-medium">Vercel</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
