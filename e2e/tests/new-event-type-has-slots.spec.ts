import { expect, test } from "@playwright/test";
import { createEventTypeThroughUi } from "./helpers";

test("для нового типа встречи автоматически появляются доступные слоты", async ({ page }, testInfo) => {
  const suffix = `${Date.now()}-${testInfo.workerIndex}`;
  const eventType = {
    id: `e2e-demo-${suffix}`,
    title: `E2E демонстрация ${suffix}`,
    description: `Встреча для проверки доступных слотов ${suffix}`,
    durationMinutes: 30,
  };

  const response = await createEventTypeThroughUi(page, eventType);
  expect(response.ok()).toBe(true);
  await expect(page.getByText("Тип встречи создан", { exact: true })).toBeVisible();

  await page.getByRole("banner").getByRole("link", { name: "Выбрать встречу" }).click();
  const eventCard = page.locator(".event-card", { hasText: eventType.title });
  await expect(eventCard).toContainText(eventType.description);
  await eventCard.getByRole("link", { name: "Выбрать время" }).click();

  await expect(page.getByRole("heading", { name: eventType.title })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Доступные слоты" })).toBeVisible();

  const slotButtons = page.locator("main").getByRole("button").filter({ hasText: /^\d{2}:\d{2}$/ });
  expect(await slotButtons.count()).toBeGreaterThan(0);
  await slotButtons.first().click();
  await expect(page.getByRole("dialog", { name: "Подтвердите бронирование" })).toBeVisible();
});
