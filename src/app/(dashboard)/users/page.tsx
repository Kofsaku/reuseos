"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserPlus,
  Shield,
  ShieldCheck,
  User,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";

// ─── User Data ───────────────────────────────────────────────────────────────

const usersData = [
  {
    id: "USR001",
    name: "田中 太郎",
    email: "tanaka@reuseos.jp",
    role: "admin" as const,
    roleLabel: "管理者",
    lastLogin: "2026-03-19 08:55",
    status: "active" as const,
    createdAt: "2025-04-01",
    initials: "田中",
    color: "bg-blue-600",
  },
  {
    id: "USR002",
    name: "佐藤 美咲",
    email: "sato@reuseos.jp",
    role: "manager" as const,
    roleLabel: "マネージャー",
    lastLogin: "2026-03-19 09:02",
    status: "active" as const,
    createdAt: "2025-06-15",
    initials: "佐藤",
    color: "bg-blue-500",
  },
  {
    id: "USR003",
    name: "鈴木 健一",
    email: "suzuki@reuseos.jp",
    role: "staff" as const,
    roleLabel: "スタッフ",
    lastLogin: "2026-03-19 09:10",
    status: "active" as const,
    createdAt: "2025-08-01",
    initials: "鈴木",
    color: "bg-emerald-500",
  },
  {
    id: "USR004",
    name: "高橋 裕子",
    email: "takahashi@reuseos.jp",
    role: "staff" as const,
    roleLabel: "スタッフ",
    lastLogin: "2026-03-18 18:05",
    status: "active" as const,
    createdAt: "2025-09-10",
    initials: "高橋",
    color: "bg-amber-500",
  },
  {
    id: "USR005",
    name: "伊藤 大輔",
    email: "ito@reuseos.jp",
    role: "staff" as const,
    roleLabel: "スタッフ",
    lastLogin: "2026-03-18 18:30",
    status: "active" as const,
    createdAt: "2025-11-01",
    initials: "伊藤",
    color: "bg-rose-500",
  },
  {
    id: "USR006",
    name: "山本 浩二",
    email: "yamamoto@reuseos.jp",
    role: "staff" as const,
    roleLabel: "スタッフ",
    lastLogin: "2026-02-28 17:00",
    status: "inactive" as const,
    createdAt: "2025-07-20",
    initials: "山本",
    color: "bg-gray-400",
  },
];

const roleConfig = {
  admin: { label: "管理者", variant: "secondary" as const, icon: Shield },
  manager: { label: "マネージャー", variant: "secondary" as const, icon: ShieldCheck },
  staff: { label: "スタッフ", variant: "secondary" as const, icon: User },
};

// ─── Permission Matrix ──────────────────────────────────────────────────────

const permissions = [
  { feature: "ダッシュボード閲覧", admin: true, manager: true, staff: true },
  { feature: "買取案件の作成", admin: true, manager: true, staff: true },
  { feature: "買取案件の承認", admin: true, manager: true, staff: false },
  { feature: "在庫管理", admin: true, manager: true, staff: true },
  { feature: "在庫の削除・廃棄", admin: true, manager: true, staff: false },
  { feature: "売上登録", admin: true, manager: true, staff: true },
  { feature: "顧客情報の閲覧", admin: true, manager: true, staff: true },
  { feature: "顧客情報の編集・削除", admin: true, manager: true, staff: false },
  { feature: "経費登録", admin: true, manager: true, staff: true },
  { feature: "損益レポート閲覧", admin: true, manager: true, staff: false },
  { feature: "ユーザー管理", admin: true, manager: false, staff: false },
  { feature: "監査ログ閲覧", admin: true, manager: true, staff: false },
  { feature: "システム設定", admin: true, manager: false, staff: false },
  { feature: "データエクスポート", admin: true, manager: true, staff: false },
  { feature: "マスタ管理", admin: true, manager: false, staff: false },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">ユーザー管理</h1>
          <p className="text-gray-500 mt-1">
            スタッフのアカウントと権限を管理します
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          新規ユーザー追加
        </Button>
      </div>

      {/* User Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {usersData.map((user) => {
          const config = roleConfig[user.role];
          const RoleIcon = config.icon;

          return (
            <Card
              key={user.id}
              className={
                user.status === "inactive" ? "opacity-60" : ""
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-white font-bold text-sm ${user.color}`}
                    >
                      {user.initials}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="secondary" className={`gap-1 ${
                    user.role === "admin" ? "bg-indigo-50 text-indigo-700" :
                    user.role === "manager" ? "bg-blue-50 text-blue-700" :
                    "bg-slate-50 text-slate-600"
                  }`}>
                    <RoleIcon className="h-3 w-3" />
                    {config.label}
                  </Badge>
                  {user.status === "active" ? (
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-emerald-50 text-emerald-700"
                    >
                      <CheckCircle className="h-3 w-3" />
                      アクティブ
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-rose-50 text-rose-700"
                    >
                      <XCircle className="h-3 w-3" />
                      無効
                    </Badge>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">最終ログイン</p>
                    <p className="font-medium">{user.lastLogin}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">登録日</p>
                    <p className="font-medium">{user.createdAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Role Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>ロール権限マトリクス</CardTitle>
          <CardDescription>
            各ロールに付与されている権限の一覧です
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">機能</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Shield className="h-4 w-4 text-gray-500" />
                    管理者
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-gray-500" />
                    マネージャー
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <User className="h-4 w-4 text-gray-500" />
                    スタッフ
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((perm, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{perm.feature}</TableCell>
                  <TableCell className="text-center">
                    {perm.admin ? (
                      <CheckCircle className="mx-auto h-5 w-5 text-gray-900" />
                    ) : (
                      <XCircle className="mx-auto h-5 w-5 text-gray-300" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {perm.manager ? (
                      <CheckCircle className="mx-auto h-5 w-5 text-gray-900" />
                    ) : (
                      <XCircle className="mx-auto h-5 w-5 text-gray-300" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {perm.staff ? (
                      <CheckCircle className="mx-auto h-5 w-5 text-gray-900" />
                    ) : (
                      <XCircle className="mx-auto h-5 w-5 text-gray-300" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
