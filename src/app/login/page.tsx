"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Diamond, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate a brief loading state for polish
    await new Promise((resolve) => setTimeout(resolve, 600));
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 h-[800px] w-[800px] rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/4 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute top-1/4 right-1/3 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo & Tagline */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-indigo-600/20 p-3 shadow-lg shadow-indigo-600/10 ring-1 ring-indigo-400/20 backdrop-blur-sm">
            <Diamond className="size-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            ReuseOS
          </h1>
          <p className="mt-2 text-sm text-indigo-200/70">
            リユース業務管理システム
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 bg-white/[0.07] shadow-2xl shadow-black/20 ring-1 ring-white/10 backdrop-blur-xl">
          <CardHeader className="pb-2 pt-6 px-6">
            <h2 className="text-center text-lg font-semibold text-white">
              ログイン
            </h2>
            <p className="text-center text-sm text-slate-400">
              アカウント情報を入力してください
            </p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-slate-300">
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@reuseos.jp"
                  defaultValue="admin@reuseos.jp"
                  className="h-10 border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-slate-300">
                  パスワード
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    defaultValue="password123"
                    className="h-10 border-white/10 bg-white/5 pr-10 text-white placeholder:text-slate-500 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-10 w-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="size-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    ログイン中...
                  </span>
                ) : (
                  "ログイン"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm text-indigo-400 transition-colors hover:text-indigo-300 hover:underline"
              >
                パスワードを忘れた方
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-500">
          &copy; 2026 ReuseOS by miitaso Inc.
        </p>
      </div>
    </div>
  );
}
