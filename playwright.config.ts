import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL, // <- environment-dependent
    trace: "on-first-retry",
    browserName: "chromium",
    channel: "chrome", // use your installed Chrome
    headless: false, // set to true for CI
  },

  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: process.env.BASE_URL, // same as baseURL
    reuseExistingServer: !process.env.CI,
  },
});
