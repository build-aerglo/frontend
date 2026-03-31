import { test, expect, request } from "@playwright/test";
import dotenv from "dotenv";

// Load .env
dotenv.config();

test("login API returns 200 for valid credentials", async () => {
  const apiUrl = process.env.API_URL + "/api/auth/login";

  // Create a new request context
  const requestContext = await request.newContext();

  // Correct way to send JSON body
  const response = await requestContext.post(apiUrl, {
    data: {
      email: "test@test.com",
      password: "Test1000$",
    },
  });

  // Assert status code
  expect(response.status()).toBe(200);

  // Check JSON body
  const body = await response.json();
  expect(body).toHaveProperty("id"); // adjust according to your API response
});
