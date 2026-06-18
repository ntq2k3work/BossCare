import { expect, test } from "@playwright/test";

test("admin overview shows core platform totals", async ({ page }) => {
  const email = `admin-${Date.now()}@example.com`;

  await page.context().addCookies([
    { name: "bosscare-locale", value: "en", domain: "localhost", path: "/" },
  ]);

  const otpResponse = await page.request.post("/api/auth/register/otp", {
    data: {
      email,
      displayName: "Admin User",
      password: "password123",
      passwordConfirm: "password123",
      householdName: "Admin household",
    },
  });
  expect(otpResponse.ok()).toBeTruthy();
  const otpBody = await otpResponse.json();

  const registerResponse = await page.request.post("/api/auth/register", { data: { email, otp: otpBody.devOtp } });
  expect(registerResponse.ok()).toBeTruthy();
  const rawCookie = registerResponse.headers()["set-cookie"] ?? "";
  const cookiePair = rawCookie.split(";")[0];
  const [name, ...valueParts] = cookiePair.split("=");
  await page.context().addCookies([{ name, value: valueParts.join("="), domain: "localhost", path: "/" }]);

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /Admin overview/i })).toBeVisible();
  await expect(page.getByText("Users", { exact: true })).toBeVisible();
  await expect(page.getByText("Households", { exact: true })).toBeVisible();
  await expect(page.getByText("Pets", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("Payments", { exact: true })).toBeVisible();
  await expect(page.getByText("Paid revenue", { exact: true })).toBeVisible();
  await expect(page.getByText("Open reviews", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Review payments/i })).toHaveAttribute("href", "/admin/payments");
});
