import { test, expect, request } from "@playwright/test";
import dotenv from "dotenv";

// Load .env
dotenv.config();

let userId: string; // declared at the top to use later

test("load dashboard and branches", async ({ page, request }) => {
  const apiUrl = process.env.API_URL + "/api/auth/login";
  const businessUrl = process.env.BUSINESS_API_URL;

  // Sign in via API
  const response = await request.post(apiUrl, {
    data: {
      email: "test@test.com",
      password: "Test1000$",
    },
  });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toHaveProperty("id");

  userId = body.id; // store for later

  // Optionally, store token if your app needs it for UI
  const token = body.token; // if your API returns a JWT

  // -----------------------------
  // Now simulate login on the page
  // -----------------------------
  // Example: set localStorage if your Nuxt auth depends on it
  await page.addInitScript((value) => {
    localStorage.setItem("authToken", value);
  }, token);

  await page.goto("/business/dashboard");

  // Wait for page to load
  await expect(page).toHaveURL("/business/dashboard");

  // -----------------------------
  // Navigate to branches page
  // -----------------------------
  await page.goto(`/business/branches`);

  // Wait for the API call to /api/business-branch/:id
  const branchResponse = await page.waitForResponse(
    (res) =>
      res.url().includes(`${businessUrl}/api/business-branch/${userId}`) &&
      res.status() === 200,
  );

  expect(branchResponse.status()).toBe(200);

  // -----------------------------
  // Optional: check UI content
  // -----------------------------
  // If your page renders the branches fetched, wait for an element
  await expect(page.locator("[data-test=business-branches]")).toBeVisible();
});
