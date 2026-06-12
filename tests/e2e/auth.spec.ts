import { expect, test } from "@playwright/test";

test("register, use app surfaces, review payment, sign out, and sign in again", async ({ page }) => {
  const email = `lan-${Date.now()}@example.com`;

  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Ten hien thi").fill("Lan Nguyen");
  await page.getByLabel("Ten ho gia dinh").fill("Lan household");
  await page.getByLabel("Mat khau", { exact: true }).fill("password123");
  await page.getByLabel("Xac nhan mat khau").fill("password123");
  await page.getByRole("button", { name: "Gui ma OTP" }).click();
  await expect(page.getByRole("heading", { name: "Xac thuc email" })).toBeVisible();
  const otpText = await page.getByText(/Dev OTP:/).textContent();
  const otp = otpText?.match(/\d{6}/)?.[0] ?? "";
  expect(otp).toHaveLength(6);
  await page.getByLabel("Ma OTP").fill(otp);
  await page.getByRole("button", { name: "Xac thuc va tao tai khoan" }).click();

  await expect(page.getByRole("heading", { name: /Xin chào, Lan Nguyen!/ })).toBeVisible();
  await expect(page.getByText("Thêm thú cưng đầu tiên để bắt đầu theo dõi sức khỏe.")).toBeVisible();
  await expect(page.getByText("Free", { exact: true })).toBeVisible();
  await expect(page.getByText(/1 thú cưng/)).toBeVisible();

  await page.goto("/app/pets");
  await expect(page.getByRole("heading", { name: "Thú cưng" })).toBeVisible();
  await expect(page.getByText(/Demo data/)).toBeVisible();

  await page.goto("/app/care-guide");
  await expect(page.getByRole("heading", { name: "AI Care Guide" })).toBeVisible();
  await page.getByLabel("Question").fill("My dog has diarrhea, what should I monitor?");
  await page.getByRole("button", { name: "Ask Care Guide" }).click();
  await expect(page.getByText("general")).toBeVisible();
  await expect(page.getByText(/Sources: stool/)).toBeVisible();
  await page.getByLabel("Question").fill("My dog cannot breathe, is this emergency?");
  await page.getByRole("button", { name: "Ask Care Guide" }).click();
  await expect(page.getByText("emergency")).toBeVisible();

  await page.goto("/app/household");
  await expect(page.getByRole("heading", { name: "Ho gia dinh" })).toBeVisible();
  await expect(page.getByText("Lan household")).toBeVisible();
  await expect(page.getByText("Lan Nguyen", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("OWNER").first()).toBeVisible();

  await page.goto("/app/billing");
  await expect(page.getByRole("heading", { name: "Thanh toan va nang cap" })).toBeVisible();
  await page.getByRole("button", { name: "Chon goi" }).first().click();
  await expect(page).toHaveURL(/\/app\/billing\/payment_/);
  await expect(page.getByRole("heading", { name: "Hoan tat thanh toan" })).toBeVisible();
  await expect(page.getByText("plus")).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "Admin payment review" })).toBeVisible();
  await page.getByLabel("Payment code").first().fill(reviewPaymentBody.providerOrderCode);
  await page.getByRole("button", { name: "Resolve" }).first().click();
  await expect(page.getByText("No payment reviews")).toBeVisible();

  await page.getByRole("button", { name: "Dang xuat" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mat khau", { exact: true }).fill("password123");
  await page.getByRole("button", { name: "Dang nhap" }).click();

  await expect(page.getByRole("heading", { name: /Xin chào, Lan Nguyen!/ })).toBeVisible();
});
