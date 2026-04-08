import { test, expect } from "@playwright/test";

const businessEmail = process.env.E2E_BUSINESS_EMAIL;
const businessPassword = process.env.E2E_BUSINESS_PASSWORD;
const businessApiBase = process.env.BUSINESS_API_URL;

test.describe("Business Dashboard Flow", () => {
  test.skip(
    !businessEmail || !businessPassword,
    "Set E2E_BUSINESS_EMAIL and E2E_BUSINESS_PASSWORD to run dashboard flow test.",
  );

  test("sign in and load business dashboard pages", async ({ page }) => {
    // ── Clear any stale session before logging in ──────────────────────────
    await page.context().clearCookies();
    // waitUntil: "networkidle" ensures Vue has fully hydrated before we interact.
    // Without this, clicking submit hits the SSR HTML before @submit.prevent is bound,
    // causing a native GET form submission to /business/auth/sign-in?
    await page.goto("/business/auth/sign-in", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // ── Debug: log all network requests and URL changes ────────────────────
    page.on("request", (req) => {
      if (req.resourceType() === "fetch" || req.resourceType() === "xhr") {
        console.log(`[REQ] ${req.method()} ${req.url()}`);
      }
    });
    page.on("response", (res) => {
      if (
        res.request().resourceType() === "fetch" ||
        res.request().resourceType() === "xhr"
      ) {
        console.log(`[RES] ${res.status()} ${res.url()}`);
      }
    });
    page.on("console", (msg) => {
      console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
    });
    page.on("pageerror", (err) => {
      console.log(`[PAGE ERROR] ${err.message}`);
    });

    // ── Login ──────────────────────────────────────────────────────────────
    console.log("[TEST] Navigating to sign-in page");
    console.log(`[TEST] Current URL: ${page.url()}`);

    console.log("[TEST] Filling in credentials");
    await page.getByLabel("Email").fill(businessEmail!);
    await page.getByLabel("Password").fill(businessPassword!);

    // Target the submit button directly via type attribute (more reliable than role+name)
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible({ timeout: 5000 });
    console.log(
      `[TEST] Button text before submit: "${(await submitBtn.textContent())?.trim()}"`,
    );

    // Click the submit button directly
    console.log("[TEST] Clicking submit button");
    await submitBtn.click();
    console.log(`[TEST] Click done. URL: ${page.url()}`);

    // ── Track loading states to confirm HandleLogin fired ─────────────────
    // After click the button becomes disabled and shows a pi-spinner icon.
    // Two phases: isLoading (loginUser) → isPreloadingDashboard (preloadDashboard)
    const spinner = submitBtn.locator(".pi-spinner");

    console.log(
      "[TEST] Waiting for spinner to appear (button entered loading state)",
    );
    await expect(spinner).toBeVisible({ timeout: 10000 });
    console.log(
      `[TEST] ✓ Spinner visible. Button text: "${(await submitBtn.textContent())?.trim()}"`,
    );

    console.log("[TEST] Waiting for label to show 'Fetching business data...'");
    await expect(submitBtn).toContainText("Fetching business data", {
      timeout: 15000,
    });
    console.log(
      "[TEST] ✓ Button shows 'Fetching' — preloadDashboard() is running",
    );

    // preloadDashboard (profile + subscription + verification) must all
    // succeed for the app to navigate here — if any fail this times out and
    // the test fails.
    console.log("[TEST] Waiting for redirect to /business/dashboard ...");
    await page.waitForURL(/\/business\/dashboard/, { timeout: 90000 });
    console.log(`[TEST] ✓ Reached dashboard. URL: ${page.url()}`);

    // ── Protected routes ───────────────────────────────────────────────────
    const protectedRoutes = [
      // "/business/dashboard",
      "/business/branches",
      "/business/manage-reviews",
      "/business/messages",
      "/business/reports",
      "/business/help",
      "/business/access",
      "/business/verification",
      "/business/profile",
      "/business/setting",
    ];

    for (const route of protectedRoutes) {
      // Use client-side router navigation instead of page.goto() to avoid a full
      // page reload. page.goto() triggers SSR where the Pinia store is always empty
      // (no localStorage on the server), causing the middleware to log the user out.
      await page.evaluate((path) => {
        const el = document.getElementById("__nuxt");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (el as any)?.__vue_app__?.config.globalProperties.$router?.push(path);
      }, route);
      await page.waitForURL(new RegExp(route.replace(/\//g, "\\/")), { timeout: 10000 });

      // Wait for GeneralLoader spinner to disappear (pages that show one while fetching)
      await page
        .locator('img[src="/svg/spinner.svg"]')
        .waitFor({ state: "hidden", timeout: 30000 })
        .catch(() => {
          // spinner never appeared — page has no loader, that's fine
        });

      // Assert the real page content is mounted and visible
      await expect(page.locator('[data-test="page-content"]')).toBeVisible({
        timeout: 15000,
      });
    }
  });
});
