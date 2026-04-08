import { test, expect } from "@playwright/test";

test.describe("Business Auth Screens", () => {
  test("sign-in page renders and links to sign-up", async ({ page }) => {
    await page.goto("/business/auth/sign-in", {
      timeout: 60000,
      waitUntil: "domcontentloaded",
    });

    await expect(page.getByText("Welcome Back!")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    await page.getByText("Create an account").click();
    await expect(page).toHaveURL(/\/business\/auth\/sign-up/);
  });
});
