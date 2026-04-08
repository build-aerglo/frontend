import { test, expect } from "@playwright/test";

test.describe("User Landing Websocket Rendering", () => {
  test("home page loads key websocket sections without runtime errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];

    page.on("console", (msg) => {
      const text = msg.text();
      if (msg.type() === "error" || /slice is not a function/i.test(text)) {
        consoleErrors.push(text);
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", { name: "Explore categories" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Top Businesses" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Recent Reviews" }),
    ).toBeVisible();

    await expect(page.locator("body")).not.toContainText("NaN");
    expect(
      consoleErrors.filter((e) => /slice is not a function/i.test(e)).length,
    ).toBe(0);
  });
});
