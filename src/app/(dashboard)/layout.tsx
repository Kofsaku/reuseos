"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  Receipt,
  BarChart3,
  UserCog,
  FileText,
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronRight,
  Diamond,
  Menu,
  BookOpen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mainNavItems = [
  { label: "ダッシュボード", icon: LayoutDashboard, href: "/dashboard" },
  { label: "買取管理", icon: ShoppingBag, href: "/purchases" },
  { label: "顧客管理", icon: Users, href: "/customers" },
  { label: "在庫管理", icon: Package, href: "/inventory" },
  { label: "売却管理", icon: TrendingUp, href: "/sales" },
  { label: "経費管理", icon: Receipt, href: "/expenses" },
  { label: "古物台帳", icon: BookOpen, href: "/ledger" },
  { label: "損益レポート", icon: BarChart3, href: "/reports" },
];

const adminNavItems = [
  { label: "ユーザー管理", icon: UserCog, href: "/users" },
  { label: "監査ログ", icon: FileText, href: "/audit-logs" },
  { label: "設定", icon: Settings, href: "/settings" },
];

const navLabelMap: Record<string, string> = {
  "/dashboard": "ダッシュボード",
  "/purchases": "買取管理",
  "/customers": "顧客管理",
  "/inventory": "在庫管理",
  "/sales": "売却管理",
  "/expenses": "経費管理",
  "/ledger": "古物台帳",
  "/reports": "損益レポート",
  "/users": "ユーザー管理",
  "/audit-logs": "監査ログ",
  "/settings": "設定",
};

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: { label: string; icon: React.ElementType; href: string };
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
        isActive
          ? "bg-indigo-50 text-indigo-700 shadow-sm"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <item.icon className="h-[18px] w-[18px] shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/20">
          <Diamond className="h-5 w-5 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-800">
            ReuseOS
          </span>
          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
            BETA
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          メインメニュー
        </p>
        {mainNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive}
              onClick={onNavigate}
            />
          );
        })}

        <div className="my-4 border-t border-slate-200" />

        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          管理
        </p>
        {adminNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive}
              onClick={onNavigate}
            />
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-slate-200 p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-slate-50" />
            }
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              管
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-slate-800">
                管理者ユーザー
              </p>
              <p className="truncate text-xs text-slate-500">
                admin@reuseos.jp
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
              アカウント
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/login")}>
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const currentLabel =
    Object.entries(navLabelMap).find(([path]) =>
      pathname.startsWith(path)
    )?.[1] || "ダッシュボード";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 md:block">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-72 animate-in slide-in-from-left">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-white/80 px-4 backdrop-blur-sm">
          <button
            className="rounded-lg p-1.5 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm">
            <Link
              href="/dashboard"
              className="text-gray-400 transition-colors hover:text-gray-600"
            >
              ReuseOS
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
            <span className="font-medium text-gray-800">{currentLabel}</span>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="検索..."
                className="h-8 w-56 border-gray-200 bg-gray-50 pl-8 text-sm"
                readOnly
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                3
              </span>
            </Button>

            {/* User Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-gray-100" />
                }
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  管
                </div>
                <span className="hidden text-sm font-medium md:inline-block">
                  管理者
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
                  管理者ユーザー
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  設定
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/login")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
