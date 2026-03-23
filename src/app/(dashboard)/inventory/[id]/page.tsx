"use client";

import { use } from "react";
import Link from "next/link";
import { inventories, purchaseItems } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShoppingBag,
  Watch,
  Gem,
  Coins,
  Monitor,
  Guitar,
  Camera,
  Landmark,
  Package,
  QrCode,
  RefreshCw,
  Check,
  MapPin,
  Barcode,
  ImageIcon,
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

const statusSteps = ["在庫中", "出品中", "売却済"] as const;

const statusConfig: Record<string, { dotColor: string }> = {
  "在庫中": { dotColor: "bg-blue-500" },
  "出品中": { dotColor: "bg-yellow-500" },
  "売却済": { dotColor: "bg-green-500" },
  "廃棄": { dotColor: "bg-red-500" },
};

function formatCurrency(amount: number | undefined) {
  if (amount === undefined) return "-";
  return `¥${amount.toLocaleString()}`;
}

const conditionLabels: Record<string, string> = {
  S: "S - 新品同様",
  A: "A - 美品",
  B: "B - 良品",
  C: "C - やや難あり",
  D: "D - 難あり",
};

export default function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const item = inventories.find((i) => i.id === id);

  if (!item) {
    return (
      <div className="space-y-4">
        <Link href="/inventory" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="size-4" />
          在庫一覧に戻る
        </Link>
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            在庫が見つかりませんでした。
          </CardContent>
        </Card>
      </div>
    );
  }

  const catConf = categoryConfig[item.category] || {
    icon: Package,
  };
  const CatIcon = catConf.icon;
  const purchaseItem = purchaseItems.find((pi) => pi.id === item.purchaseItemId);
  const profit =
    item.listedPrice !== undefined ? item.listedPrice - item.cost : undefined;

  const currentStepIndex = statusSteps.indexOf(item.status as (typeof statusSteps)[number]);

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/inventory"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="size-4" />
        在庫一覧に戻る
      </Link>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Image */}
        <div className="space-y-4">
          {/* Main Image Placeholder */}
          <Card className="overflow-hidden">
            <div
              className="relative h-80 lg:h-96 bg-gray-50 flex items-center justify-center"
            >
              <CatIcon className="size-24 text-gray-400 opacity-30" />
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-gray-700">
                  <span className={`h-2 w-2 rounded-full ${statusConfig[item.status].dotColor}`} />
                  {item.status}
                </span>
              </div>
              {item.photosCount === 0 && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  <ImageIcon className="size-3" />
                  写真未登録
                </div>
              )}
            </div>
          </Card>

          {/* Photo Gallery Thumbnails */}
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: Math.min(item.photosCount, 5) }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer ring-1 ring-gray-200 hover:ring-2 hover:ring-gray-300 transition-all ${i === 0 ? "ring-2 ring-gray-400" : ""}`}
              >
                <CatIcon className="size-5 text-gray-400 opacity-30" />
              </div>
            ))}
            {item.photosCount > 5 && (
              <div className="aspect-square rounded-lg bg-gray-50 flex items-center justify-center text-xs text-gray-500 ring-1 ring-gray-200">
                +{item.photosCount - 5}
              </div>
            )}
            {item.photosCount === 0 && (
              <div className="col-span-5 h-16 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500">
                写真がありません
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-4">
          {/* Item Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>商品情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{item.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">ID: {item.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">カテゴリ</p>
                  <span className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5 text-xs font-medium">{item.category}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">コンディション</p>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.condition === "S" ? "bg-indigo-50 text-indigo-700" :
                    item.condition === "A" ? "bg-emerald-50 text-emerald-700" :
                    item.condition === "B" ? "bg-blue-50 text-blue-700" :
                    item.condition === "C" ? "bg-amber-50 text-amber-700" :
                    item.condition === "D" ? "bg-rose-50 text-rose-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {conditionLabels[item.condition] || item.condition}
                  </span>
                </div>
              </div>

              {purchaseItem && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">説明</p>
                  <p className="text-sm">{purchaseItem.description}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 mb-1">登録日</p>
                <p className="text-sm">
                  {new Date(item.registeredAt).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle>価格情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">買取額</p>
                  <p className="text-lg font-bold">{formatCurrency(item.cost)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">出品額</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(item.listedPrice)}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">想定粗利</p>
                  <p
                    className={`text-lg font-bold ${
                      profit !== undefined
                        ? profit >= 0
                          ? "text-green-700"
                          : "text-red-700"
                        : ""
                    }`}
                  >
                    {profit !== undefined ? formatCurrency(profit) : "-"}
                  </p>
                </div>
              </div>
              {profit !== undefined && item.listedPrice !== undefined && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-500">
                    粗利率:{" "}
                    <span className="font-medium text-gray-900">
                      {((profit / item.cost) * 100).toFixed(1)}%
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>ステータス管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                {statusSteps.map((step, i) => {
                  const isActive = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`size-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                            isActive
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-500"
                          } ${isCurrent ? "ring-2 ring-indigo-600 ring-offset-2" : ""}`}
                        >
                          {isActive && i < currentStepIndex ? (
                            <Check className="size-4" />
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span
                          className={`text-xs mt-1.5 ${
                            isActive
                              ? "text-indigo-700 font-medium"
                              : "text-gray-400"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 mx-1 -mt-5 ${
                            i < currentStepIndex ? "bg-indigo-600" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {item.status === "廃棄" && (
                <div className="text-center p-2 rounded-lg bg-red-50">
                  <span className="text-sm text-red-700 font-medium">
                    この商品は廃棄済みです
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location & Barcode */}
          <Card>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-gray-400" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Barcode className="size-4 text-gray-400" />
                  <span className="font-mono text-xs">{item.barcode}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-3 justify-end">
        <Button variant="outline" size="lg">
          <QrCode className="size-4 mr-1.5" />
          QRコード発行
        </Button>
        <Button size="lg">
          <RefreshCw className="size-4 mr-1.5" />
          ステータス変更
        </Button>
      </div>
    </div>
  );
}
