import { expect, test } from "@playwright/test";

test("гость бронирует свободный слот, и владелец видит бронирование", async ({ page }) => {
  const eventTitle = "Короткий созвон";

  await test.step("гость выбирает тип встречи", async () => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Выберите формат встречи" })).toBeVisible();

    const eventCard = page.locator(".event-card", { hasText: eventTitle });
    await expect(eventCard).toBeVisible();
    await eventCard.getByRole("link", { name: "Выбрать время" }).click();
  });

  const slotButtons = page.locator("main").getByRole("button").filter({ hasText: /^\d{2}:\d{2}$/ });
  await expect(page.getByRole("heading", { name: "Доступные слоты" })).toBeVisible();
  const slotsBeforeBooking = await slotButtons.count();
  expect(slotsBeforeBooking).toBeGreaterThan(0);

  await test.step("гость подтверждает бронирование", async () => {
    await slotButtons.first().click();

    const dialog = page.getByRole("dialog", { name: "Подтвердите бронирование" });
    await expect(dialog).toBeVisible();

    const bookingResponsePromise = page.waitForResponse(
      (response) => response.request().method() === "POST" && new URL(response.url()).pathname === "/bookings",
    );
    await dialog.getByRole("button", { name: "Забронировать" }).click();

    const bookingResponse = await bookingResponsePromise;
    expect(bookingResponse.ok()).toBe(true);
    await expect(page.getByText("Встреча забронирована", { exact: true })).toBeVisible();
    await expect.poll(() => slotButtons.count()).toBe(slotsBeforeBooking - 1);
  });

  await test.step("владелец видит созданное бронирование", async () => {
    await page.getByRole("banner").getByRole("link", { name: "Бронирования" }).click();
    await expect(page.getByRole("heading", { name: "Предстоящие бронирования" })).toBeVisible();

    const bookingRow = page.getByRole("row", { name: new RegExp(eventTitle) });
    await expect(bookingRow).toContainText(eventTitle);
    await expect(bookingRow).toContainText("Подтверждено");
  });
});
