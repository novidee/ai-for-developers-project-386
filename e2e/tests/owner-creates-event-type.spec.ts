import { expect, test } from "@playwright/test";
import { createEventTypeThroughUi } from "./helpers";

test("владелец создаёт новый тип встречи", async ({ page }, testInfo) => {
  const suffix = `${Date.now()}-${testInfo.workerIndex}`;
  const eventType = {
    id: `e2e-consultation-${suffix}`,
    title: `E2E консультация ${suffix}`,
    description: `Описание тестовой консультации ${suffix}`,
    durationMinutes: 45,
  };

  const response = await createEventTypeThroughUi(page, eventType);

  expect(response.ok()).toBe(true);
  await expect(page.getByRole("dialog", { name: "Новый тип встречи" })).toBeHidden();
  await expect(page.getByText("Тип встречи создан", { exact: true })).toBeVisible();

  const eventTypeRow = page.getByRole("row", { name: new RegExp(eventType.title) });
  await expect(eventTypeRow).toContainText(eventType.id);
  await expect(eventTypeRow).toContainText(eventType.description);
  await expect(eventTypeRow).toContainText("45 мин");
});
