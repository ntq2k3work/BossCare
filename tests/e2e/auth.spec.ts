import { expect, test } from "@playwright/test";

test("register, use app surfaces, review payment, sign out, and sign in again", async ({ page }) => {
  const email = `lan-${Date.now()}@example.com`;

  await page.context().addCookies([
    {
      name: "bosscare-locale",
      value: "en",
      domain: "localhost",
      path: "/",
    },
  ]);

  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Display name").fill("Lan Nguyen");
  await page.getByLabel("Household name").fill("Lan household");
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByLabel("Confirm password").fill("password123");
  await page.getByRole("button", { name: /Send OTP/i }).click();
  await expect(page.getByRole("heading", { name: /Verify email/i })).toBeVisible();

  const otpText = await page.getByText(/Dev OTP:/).textContent();
  const otp = otpText?.match(/\d{6}/)?.[0] ?? "";
  expect(otp).toHaveLength(6);

  await page.getByLabel("OTP").fill(otp);
  await page.getByRole("button", { name: /Verify and create account/i }).click();

  await expect(page.getByRole("heading", { name: /Hi, Lan Nguyen!/ })).toBeVisible();
  await expect(page.getByText(/Add your first pet/i)).toBeVisible();
  await expect(page.getByText("Free", { exact: true })).toBeVisible();
  await expect(page.getByText(/1 pet/)).toBeVisible();

  await page.goto("/dashboard/pets");
  await expect(page.getByRole("heading", { name: /Pets/i })).toBeVisible();
  await expect(page.getByText(/Demo data/i)).toBeVisible();

  await page.goto("/dashboard/care-guide");
  await expect(page.getByRole("heading", { name: /AI Care Guide/i })).toBeVisible();
  await page.getByTestId("care-guide-question").fill("My dog has diarrhea, what should I monitor?");
  await page.getByTestId("care-guide-submit").click();
  await expect(page.getByText(/general/i)).toBeVisible();
  await expect(page.getByText(/Sources: .*stool/i)).toBeVisible();
  await page.getByTestId("care-guide-question").fill("My dog cannot breathe, is this emergency?");
  await page.getByTestId("care-guide-submit").click();
  await expect(page.getByText(/emergency/i)).toBeVisible();

  await page.goto("/dashboard/household");
  await expect(page.getByRole("heading", { name: /Household/i })).toBeVisible();
  await expect(page.getByText("Lan household")).toBeVisible();
  await expect(page.getByText("Lan Nguyen", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("OWNER").first()).toBeVisible();

  await page.goto("/dashboard/billing");
  await expect(page.getByRole("heading", { name: /Billing and upgrades/i })).toBeVisible();
  await page.getByRole("button", { name: /Choose plan/i }).first().click();
  await expect(page).toHaveURL(/\/dashboard\/billing\/payment_/);
  await expect(page.getByRole("heading", { name: /Complete payment/i })).toBeVisible();
  await expect(page.getByText(/Premium/i).first()).toBeVisible();
  await expect(page.getByText(/PH-/).first()).toBeVisible();

  const reviewPayment = await page.request.post("/api/payments", { data: { plan: "plus" } });
  const reviewPaymentBody = await reviewPayment.json();
  await page.request.post("/api/payments/reconcile", {
    data: {
      transactions: [
        {
          providerTransactionId: `txn_e2e_review_${Date.now()}`,
          bankReference: `ref_e2e_review_${Date.now()}`,
          transactionDate: new Date().toISOString(),
          transferAmountVnd: reviewPaymentBody.expectedAmountVnd,
          transferDirection: "in",
          transactionContent: "Missing payment code",
        },
      ],
    },
  });

  await page.goto("/admin/payments");
  await expect(page.getByRole("heading", { name: /Admin payment review/i })).toBeVisible();
  await page.getByLabel("Payment code").first().fill(reviewPaymentBody.providerOrderCode);
  await page.getByRole("button", { name: /Resolve/i }).first().click();
  await expect(page.getByText(/No payment reviews/i)).toBeVisible();

  await page.getByRole("button", { name: /Sign out/i }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("password123");
  await page.getByRole("button", { name: /Sign in/i }).click();

  await expect(page.getByRole("heading", { name: /Hi, Lan Nguyen!/ })).toBeVisible();
});
