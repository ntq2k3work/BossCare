import { expect, test } from "@playwright/test";

test("register, manage first pet, sign out, and sign in again", async ({ page }) => {
  const email = `lan-${Date.now()}@example.com`;

  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Display name").fill("Lan Nguyen");
  await page.getByLabel("Household name").fill("Lan household");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByRole("heading", { name: "Welcome, Lan Nguyen" })).toBeVisible();
  await expect(page.getByText("Lan household")).toBeVisible();
  await expect(page.getByText("free")).toBeVisible();
  await expect(page.getByText(/Member limit: 1/)).toBeVisible();

  await page.getByRole("link", { name: "Manage pets" }).click();
  await expect(page.getByRole("heading", { name: "Pets" })).toBeVisible();
  await page.getByLabel("Name").fill("Milo");
  await page.getByLabel("Species").fill("Dog");
  await page.getByLabel("Breed").fill("Corgi");
  await page.getByLabel("Allergies").fill("Chicken");
  await page.getByRole("button", { name: "Create pet" }).click();
  await expect(page.getByRole("heading", { name: "Milo" })).toBeVisible();

  await page.getByLabel("Medical notes").fill("Prefers evening walks.");
  await page.getByRole("button", { name: "Save pet" }).click();
  await expect(page.getByRole("heading", { name: "Milo" })).toBeVisible();
  await page.getByRole("button", { name: "Archive pet" }).click();
  await expect(page.getByText("Archived")).toBeVisible();

  await expect(page.getByRole("heading", { name: "Pets" })).toBeVisible();
  await page.getByLabel("Name").fill("Luna");
  await page.getByLabel("Species").fill("Cat");
  await page.getByRole("button", { name: "Create pet" }).click();
  await expect(page.getByRole("heading", { name: "Luna" })).toBeVisible();
  await page.getByRole("link", { name: "Health logs" }).click();
  await expect(page.getByRole("heading", { name: "Health logs" })).toBeVisible();
  await page.getByLabel("Type").selectOption("symptom");
  await page.getByLabel("Title").fill("Morning cough");
  await page.getByLabel("Note").fill("Short cough after breakfast");
  await page.getByRole("button", { name: "Add log" }).click();
  await expect(page.getByText("Morning cough")).toBeVisible();
  await page.getByRole("button", { name: "symptom" }).click();
  await expect(page.getByText("Short cough after breakfast")).toBeVisible();
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Title").fill("Morning cough resolved");
  await page.getByRole("button", { name: "Save log" }).click();
  await expect(page.getByText("Morning cough resolved")).toBeVisible();
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("No health logs match this view.")).toBeVisible();

  await page.goto("/app/pets");
  await page.getByRole("link", { name: /Luna/ }).click();
  await page.getByRole("link", { name: "Vaccinations" }).click();
  await expect(page.getByRole("heading", { name: "Vaccinations" })).toBeVisible();
  await page.getByLabel("Vaccine name").fill("Rabies");
  await page.getByLabel("Given at").fill("2025-06-01");
  await page.getByLabel("Next due at").fill("2026-06-08");
  await page.getByLabel("Clinic").fill("Happy Vet");
  await page.getByLabel("Note").fill("Annual shot");
  await page.getByRole("button", { name: "Add vaccination" }).click();
  await expect(page.getByText("Rabies")).toBeVisible();
  await expect(page.getByText("Overdue")).toBeVisible();
  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Vaccine name").fill("Rabies booster");
  await page.getByLabel("Next due at").fill("2026-07-01");
  await page.getByRole("button", { name: "Save vaccination" }).click();
  await expect(page.getByText("Rabies booster")).toBeVisible();

  await page.goto("/app/pets");
  await page.getByRole("link", { name: /Luna/ }).click();
  await page.getByRole("link", { name: "Check-ins" }).click();
  await expect(page.getByRole("heading", { name: "Check-ins" })).toBeVisible();
  await page.getByLabel("Mood").fill("playful");
  await page.getByLabel("Note").fill("Fetched ball in the park");
  await page.getByLabel("Media storage key").fill("demo/luna.webp");
  await page.getByLabel("MIME type").selectOption("image/webp");
  await page.getByLabel("Byte size").fill("2048");
  await page.getByRole("button", { name: "Add check-in" }).click();
  await expect(page.getByText("playful")).toBeVisible();
  await expect(page.getByText("Fetched ball in the park")).toBeVisible();
  await expect(page.getByText(/demo\/luna.webp/)).toBeVisible();

  await page.goto("/app");
  await page.getByRole("link", { name: "Household" }).click();
  await expect(page.getByRole("heading", { name: "Household" })).toBeVisible();
  await expect(page.getByText("Lan Nguyen")).toBeVisible();
  await expect(page.getByText(/OWNER/)).toBeVisible();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByRole("heading", { name: "Welcome, Lan Nguyen" })).toBeVisible();
});
