import { test, expect } from "@playwright/test";

test.describe("Business Registration Screen", () => {
  test("sign-up page renders required fields", async ({ page }) => {
    await page.goto("/business/auth/sign-up", {
      timeout: 60000,
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByText("Register your business").first(),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Business Name")).toBeVisible();
    await expect(page.getByLabel("Phone Number")).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Password", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Confirm Password" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Register your business" }),
    ).toBeVisible();
  });
});
