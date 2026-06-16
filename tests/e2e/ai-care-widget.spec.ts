import { expect, test } from "@playwright/test";

test("pet care widget blocks off-topic questions and shows affiliate suggestions for pet questions", async ({ page }) => {
  const email = `widget-${Date.now()}@example.com`;

  await page.context().addCookies([
    {
      name: "bosscare-locale",
      value: "en",
      domain: "localhost",
      path: "/",
    },
  ]);

  const otpResponse = await page.request.post("/api/auth/register/otp", {
    data: {
      email,
      displayName: "Widget User",
      password: "password123",
      passwordConfirm: "password123",
      householdName: "Widget household",
    },
  });
  expect(otpResponse.ok()).toBeTruthy();

  const otpBody = await otpResponse.json();
  expect(otpBody.devOtp).toMatch(/^\d{6}$/);

  const registerResponse = await page.request.post("/api/auth/register", {
    data: {
      email,
      otp: otpBody.devOtp,
    },
  });
  expect(registerResponse.ok()).toBeTruthy();

  const rawCookie = registerResponse.headers()["set-cookie"] ?? "";
  const cookiePair = rawCookie.split(";")[0];
  const [name, ...valueParts] = cookiePair.split("=");
  await page.context().addCookies([
    {
      name,
      value: valueParts.join("="),
      domain: "localhost",
      path: "/",
    },
  ]);

  await page.goto("/dashboard");
  await expect(page.getByTestId("pet-care-launcher")).toBeVisible();

  await page.getByTestId("pet-care-launcher").click();
  await expect(page.getByTestId("pet-care-widget")).toBeVisible();

  await page.getByTestId("pet-care-question").fill("Write me a movie review.");
  await page.getByTestId("pet-care-submit").click();
  await expect(page.locator("p.whitespace-pre-line").filter({ hasText: /I only help with pet-related questions/i })).toBeVisible();

  await page.getByTestId("pet-care-question").fill("My dog needs food recommendations.");
  await page.getByTestId("pet-care-submit").click();
  await expect(page.getByText(/Relevant affiliate links/i)).toBeVisible();
  await expect(page.locator('a[href*="shopee.vn/search"]').first()).toBeVisible();
});
