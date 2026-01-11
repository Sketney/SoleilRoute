import { expect, test } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3001";
const loginEmail = process.env.E2E_EMAIL ?? "test@example.com";
const loginPassword = process.env.E2E_PASSWORD ?? "password";
const registerPassword =
  process.env.E2E_REGISTER_PASSWORD ?? "Password123!";

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: "tp_locale",
      value: "en",
      url: baseURL,
      path: "/",
    },
  ]);
});

test("register new user", async ({ page }) => {
  const email =
    process.env.E2E_REGISTER_EMAIL ??
    `e2e+${Date.now()}@example.com`;

  await page.goto("/register");
  await page.getByTestId("register-email").fill(email);
  await page.getByTestId("register-password").fill(registerPassword);
  await page.getByTestId("register-confirm").fill(registerPassword);
  await page.getByTestId("register-submit").click();
  await page.waitForURL("**/dashboard");
});

test("login, create trip, add budget item", async ({ page }) => {
  await page.goto("/login");

  await page.getByTestId("login-email").fill(loginEmail);
  await page.getByTestId("login-password").fill(loginPassword);
  await page.getByTestId("login-submit").click();
  await page.waitForURL("**/dashboard");

  const tripName = `E2E Trip ${Date.now()}`;
  await page.getByTestId("quick-plan-trip").click();
  await page.getByTestId("trip-name").fill(tripName);

  await page.getByTestId("trip-citizenship").click();
  await page.getByTestId("trip-citizenship-search").fill("USA");
  await page.getByRole("option", { name: "USA" }).click();

  await page.getByTestId("trip-destination-country").fill("Japan");
  await page.getByTestId("trip-destination-city").fill("Tokyo");
  await page.getByTestId("trip-start-date").fill("2025-01-10");
  await page.getByTestId("trip-end-date").fill("2025-01-15");
  await page.getByTestId("trip-total-budget").fill("2500");
  await page.getByTestId("trip-submit").click();

  await expect(page.getByText(tripName)).toBeVisible();

  const tripCardHeader = page
    .getByRole("heading", { name: tripName })
    .locator("..")
    .locator("..");
  await tripCardHeader.getByRole("button").click();
  await page.getByRole("menuitem", { name: "Manage budget" }).click();

  await page.waitForURL(/\/dashboard\/trips\/.*\/budget/);
  await page.getByTestId("budget-new-description").fill("Test expense");
  await page.getByTestId("budget-new-amount").fill("120");
  await page.getByTestId("budget-new-submit").click();

  await expect(page.getByText("Test expense")).toBeVisible();
});
