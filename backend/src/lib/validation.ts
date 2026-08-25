import { badRequest } from "./errors.js";
import type { CreateBookingRequest, CreateEventTypeRequest } from "../types.js";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readNonEmptyString(body: Record<string, unknown>, field: string): string {
  const value = body[field];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw badRequest(`Поле '${field}' обязательно и должно быть непустой строкой.`);
  }
  return value.trim();
}

export function validateEventType(value: unknown): CreateEventTypeRequest {
  if (!isObject(value)) throw badRequest("Тело запроса должно быть объектом.");

  const durationMinutes = value.durationMinutes;
  if (!Number.isInteger(durationMinutes) || (durationMinutes as number) < 1 || (durationMinutes as number) > 2_147_483_647) {
    throw badRequest("Поле 'durationMinutes' должно быть положительным целым числом.");
  }

  return {
    id: readNonEmptyString(value, "id"),
    title: readNonEmptyString(value, "title"),
    description: readNonEmptyString(value, "description"),
    durationMinutes: durationMinutes as number,
  };
}

export function validateBooking(value: unknown): CreateBookingRequest {
  if (!isObject(value)) throw badRequest("Тело запроса должно быть объектом.");
  return { slotId: readNonEmptyString(value, "slotId") };
}
