import { test, expect } from "@playwright/test";

test.describe("Client-side error investigation", () => {
  test("capture console errors on dashboard dropdown clicks", async ({ page }) => {
    const errors: string[] = [];

    // Capture all console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    // Capture page errors (uncaught exceptions)
    page.on("pageerror", (err) => {
      errors.push(`PAGE_ERROR: ${err.message}`);
    });

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Click sidebar user dropdown (bottom of sidebar)
    const sidebarUserButton = page.locator("aside button").first();
    if (await sidebarUserButton.isVisible()) {
      await sidebarUserButton.click();
      await page.waitForTimeout(500);
    }

    // Close by pressing escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    // Click header user dropdown (top right)
    const headerUserButton = page.locator("header button").last();
    if (await headerUserButton.isVisible()) {
      await headerUserButton.click();
      await page.waitForTimeout(500);
    }

    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    // Log all errors found
    console.log("=== ERRORS FOUND ===");
    errors.forEach((e) => console.log(e));
    console.log("=== END ERRORS ===");
    console.log(`Total errors: ${errors.length}`);

    expect(errors.filter(e => e.includes("PAGE_ERROR"))).toHaveLength(0);
  });

  test("check all main pages for client errors", async ({ page }) => {
    const routes = [
      "/login",
      "/dashboard",
      "/purchases",
      "/customers",
      "/inventory",
      "/sales",
      "/expenses",
      "/ledger",
      "/reports",
      "/users",
      "/audit-logs",
      "/settings",
      "/purchases/PUR001",
      "/customers/CUS001",
      "/inventory/INV001",
    ];

    for (const route of routes) {
      const pageErrors: string[] = [];

      page.on("pageerror", (err) => {
        pageErrors.push(err.message);
      });

      await page.goto(route);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(300);

      if (pageErrors.length > 0) {
        console.log(`ERRORS on ${route}:`);
        pageErrors.forEach((e) => console.log(`  ${e}`));
      } else {
        console.log(`OK: ${route}`);
      }

      expect(pageErrors, `Page ${route} has client-side errors`).toHaveLength(0);
    }
  });
});
