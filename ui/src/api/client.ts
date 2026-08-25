import type {
  Booking,
  BookingList,
  CreateBookingRequest,
  CreateEventTypeRequest,
  ErrorBody,
  EventType,
  EventTypeList,
  Owner,
  SlotList,
} from "./types";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const baseUrl = configuredBaseUrl || (import.meta.env.DEV ? "http://localhost:4010" : window.location.origin);

export class ApiError extends Error {
  readonly code: string | number;
  readonly status: number;

  constructor(code: string | number, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = new URL(path.replace(/^\//, ""), `${baseUrl.replace(/\/$/, "")}/`);
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  if (init?.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(url, { ...init, headers });
  } catch {
    throw new ApiError(0, "Не удалось соединиться с сервером. Проверьте, что бэкенд запущен.", 0);
  }

  const data = (await response.json().catch(() => null)) as T | ErrorBody | null;

  if (!response.ok) {
    const error = data as ErrorBody | null;
    throw new ApiError(error?.code ?? response.status, error?.message ?? `Ошибка запроса (${response.status})`, response.status);
  }

  return data as T;
}

function post<TResponse, TBody>(path: string, body: TBody): Promise<TResponse> {
  return request<TResponse>(path, { method: "POST", body: JSON.stringify(body) });
}

export const api = {
  getOwner: () => request<Owner>("/owner"),
  listEventTypes: () => request<EventTypeList>("/event-types"),
  getEventType: (id: string) => request<EventType>(`/event-types/${encodeURIComponent(id)}`),
  listAvailableSlots: (eventTypeId: string) =>
    request<SlotList>(`/event-types/${encodeURIComponent(eventTypeId)}/slots`),
  createBooking: (slotId: string) => post<Booking, CreateBookingRequest>("/bookings", { slotId }),
  createEventType: (eventType: CreateEventTypeRequest) =>
    post<EventType, CreateEventTypeRequest>("/owner/event-types", eventType),
  listUpcomingBookings: () => request<BookingList>("/owner/bookings"),
};
