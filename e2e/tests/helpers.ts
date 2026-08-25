import { expect, type APIResponse, type Page } from "@playwright/test";

export interface EventTypeFormData {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
}

export async function createEventTypeThroughUi(page: Page, eventType: EventTypeFormData): Promise<APIResponse> {
  await page.goto("/owner/event-types");
  await page.getByRole("button", { name: "Добавить тип" }).click();

  const dialog = page.getByRole("dialog", { name: "Новый тип встречи" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Идентификатор").fill(eventType.id);
  await dialog.getByLabel("Название").fill(eventType.title);
  await dialog.getByLabel("Описание").fill(eventType.description);
  await dialog.getByLabel("Длительность, минут").fill(String(eventType.durationMinutes));

  const responsePromise = page.waitForResponse(
    (response) => response.request().method() === "POST" && new URL(response.url()).pathname === "/owner/event-types",
  );
  await dialog.getByRole("button", { name: "Создать" }).click();
  return responsePromise;
}
