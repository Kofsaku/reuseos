import { test, expect } from "@playwright/test";

test.describe("App smoke tests", () => {
  test("root redirects to login", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });

  test("login form works and navigates to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Check login page elements
    await expect(page.getByRole("heading", { name: "ReuseOS" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "ログイン" })
    ).toBeVisible();

    // Form fields should have default values
    const emailInput = page.locator("#email");
    await expect(emailInput).toHaveValue("admin@reuseos.jp");

    // Click login button
    await page.getByRole("button", { name: "ログイン" }).click();

    // Should navigate to dashboard
    await page.waitForURL("**/dashboard", { timeout: 5000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("sidebar dropdown menus open without errors", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Click sidebar user button (bottom of sidebar)
    const sidebarUserBtn = page.locator(
      'aside [data-slot="dropdown-menu-trigger"]'
    );
    if (await sidebarUserBtn.isVisible()) {
      await sidebarUserBtn.click();
      await page.waitForTimeout(500);

      // Menu should be visible
      const accountLabel = page.getByText("アカウント");
      await expect(accountLabel).toBeVisible();

      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
    }

    // Click header user dropdown
    const headerUserBtn = page.locator(
      'header [data-slot="dropdown-menu-trigger"]'
    );
    if (await headerUserBtn.isVisible()) {
      await headerUserBtn.click();
      await page.waitForTimeout(500);

      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
    }

    expect(pageErrors).toHaveLength(0);
  });

  test("all sidebar navigation links work", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const navItems = [
      { label: "買取管理", url: "/purchases" },
      { label: "顧客管理", url: "/customers" },
      { label: "在庫管理", url: "/inventory" },
      { label: "売却管理", url: "/sales" },
      { label: "経費管理", url: "/expenses" },
      { label: "古物台帳", url: "/ledger" },
      { label: "損益レポート", url: "/reports" },
      { label: "ユーザー管理", url: "/users" },
      { label: "監査ログ", url: "/audit-logs" },
      { label: "設定", url: "/settings" },
      { label: "ダッシュボード", url: "/dashboard" },
    ];

    for (const { label, url } of navItems) {
      await page.locator(`aside a:has-text("${label}")`).click();
      await page.waitForURL(`**${url}`);
      expect(page.url()).toContain(url);
      await page.waitForTimeout(200);
    }

    expect(pageErrors).toHaveLength(0);
  });

  test("detail pages render correctly", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    // Purchase detail
    await page.goto("/purchases/PUR001");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { name: "案件 PUR001" })
    ).toBeVisible();

    // Customer detail
    await page.goto("/customers/CUS001");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { name: "山田 花子" })
    ).toBeVisible();

    // Check new sections exist (CardTitle renders as div, not heading)
    await expect(page.getByText("本人確認書類", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("メッセージ連携", { exact: true }).first()).toBeVisible();

    // Inventory detail
    await page.goto("/inventory/INV001");
    await page.waitForLoadState("networkidle");

    expect(pageErrors).toHaveLength(0);
  });

  test("settings page tabs work without errors", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/settings");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "設定", exact: true })
    ).toBeVisible();

    // Click each tab
    const tabs = ["通知設定", "マスタ管理", "システム"];
    for (const tab of tabs) {
      await page.getByRole("tab", { name: tab }).click();
      await page.waitForTimeout(300);
    }

    expect(pageErrors).toHaveLength(0);
  });

  test("purchase receipt dialog opens without errors", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/purchases/PUR001");
    await page.waitForLoadState("networkidle");

    // Click the receipt button
    const receiptBtn = page.getByRole("button", {
      name: "電子買受書プレビュー",
    });
    if (await receiptBtn.isVisible()) {
      await receiptBtn.click();
      await page.waitForTimeout(500);

      // Receipt dialog should show heading
      await expect(
        page.getByRole("heading", { name: "買 受 書" })
      ).toBeVisible();

      await page.keyboard.press("Escape");
    }

    expect(pageErrors).toHaveLength(0);
  });

  test("ledger page renders with data", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/ledger");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "古物台帳" })
    ).toBeVisible();
    await expect(page.getByText("総取引件数")).toBeVisible();

    // Table should have rows
    const rows = page.locator("tbody tr");
    expect(await rows.count()).toBeGreaterThan(0);

    expect(pageErrors).toHaveLength(0);
  });
});
