import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

config(); // load .env into process.env before anything reads it

const baseURL = process.env.BASE_URL || "http://127.0.0.1:3001";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  timeout: 90000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
    browserName: "chromium",
    channel: "chrome", // use your installed Chrome
    headless: process.env.HEADLESS !== "false",
  },

  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
