import { randomUUID } from "node:crypto";
import { conflict, notFound } from "./lib/errors.js";
import type { Booking, CreateEventTypeRequest, EventType, Owner, Slot } from "./types.js";

const BOOKING_WINDOW_DAYS = 14;
const FIRST_SLOT_HOUR = 10;
const LAST_SLOT_HOUR = 17;

function intervalsOverlap(firstStart: string, firstEnd: string, secondStart: string, secondEnd: string): boolean {
  return Date.parse(firstStart) < Date.parse(secondEnd) && Date.parse(secondStart) < Date.parse(firstEnd);
}

export class MemoryStore {
  private readonly owner: Owner = { id: "owner-1", name: "Иван Петров" };
  private readonly eventTypes = new Map<string, EventType>();
  private readonly slots = new Map<string, Slot>();
  private readonly bookings = new Map<string, Booking>();

  constructor() {
    const initialEventTypes: EventType[] = [
      {
        id: "quick-call",
        title: "Короткий созвон",
        description: "Быстро обсудить вопрос и договориться о следующих шагах.",
        durationMinutes: 30,
      },
      {
        id: "project-meeting",
        title: "Рабочая встреча",
        description: "Подробное обсуждение проекта и текущих задач.",
        durationMinutes: 60,
      },
      {
        id: "consultation",
        title: "Консультация",
        description: "Персональная консультация по выбранной теме.",
        durationMinutes: 45,
      },
    ];

    for (const eventType of initialEventTypes) this.addEventType(eventType);
  }

  getOwner(): Owner {
    return this.owner;
  }

  listEventTypes(): EventType[] {
    return [...this.eventTypes.values()];
  }

  getEventType(id: string): EventType {
    const eventType = this.eventTypes.get(id);
    if (!eventType) throw notFound(`Тип встречи с id='${id}' не найден.`);
    return eventType;
  }

  createEventType(request: CreateEventTypeRequest): EventType {
    if (this.eventTypes.has(request.id)) {
      throw conflict(`Тип встречи с id='${request.id}' уже существует.`);
    }

    return this.addEventType(request);
  }

  listAvailableSlots(eventTypeId: string): Slot[] {
    this.getEventType(eventTypeId);
    const now = Date.now();

    return [...this.slots.values()]
      .filter((slot) => slot.eventTypeId === eventTypeId && Date.parse(slot.startsAt) > now && this.isSlotAvailable(slot))
      .sort((first, second) => Date.parse(first.startsAt) - Date.parse(second.startsAt))
      .map((slot) => ({ ...slot, available: true }));
  }

  createBooking(slotId: string): Booking {
    const slot = this.slots.get(slotId);
    if (!slot) throw notFound(`Слот с id='${slotId}' не найден.`);

    if (Date.parse(slot.startsAt) <= Date.now()) {
      throw conflict("Нельзя забронировать слот, который уже начался.");
    }

    if (!this.isSlotAvailable(slot)) {
      throw conflict(`Слот с id='${slotId}' уже занят.`);
    }

    // Проверка и запись выполняются синхронно, без await, поэтому два запроса
    // не смогут занять один слот между чтением его состояния и обновлением.
    slot.available = false;
    const booking: Booking = {
      id: randomUUID(),
      eventTypeId: slot.eventTypeId,
      slotId: slot.id,
      startsAt: slot.startsAt,
      endsAt: slot.endsAt,
      createdAt: new Date().toISOString(),
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  listUpcomingBookings(): Booking[] {
    const now = Date.now();
    return [...this.bookings.values()]
      .filter((booking) => Date.parse(booking.startsAt) > now)
      .sort((first, second) => Date.parse(first.startsAt) - Date.parse(second.startsAt));
  }

  private addEventType(eventType: EventType): EventType {
    const stored = { ...eventType };
    this.eventTypes.set(stored.id, stored);
    this.generateSlots(stored);
    return stored;
  }

  private generateSlots(eventType: EventType): void {
    const firstDay = new Date();
    firstDay.setDate(firstDay.getDate() + 1);
    firstDay.setHours(0, 0, 0, 0);

    for (let dayOffset = 0; dayOffset < BOOKING_WINDOW_DAYS; dayOffset += 1) {
      for (let hour = FIRST_SLOT_HOUR; hour <= LAST_SLOT_HOUR; hour += 1) {
        const startsAt = new Date(firstDay);
        startsAt.setDate(firstDay.getDate() + dayOffset);
        startsAt.setHours(hour, 0, 0, 0);
        const endsAt = new Date(startsAt.getTime() + eventType.durationMinutes * 60_000);
        const startIso = startsAt.toISOString();
        const slot: Slot = {
          id: `slot-${eventType.id}-${startIso}`,
          eventTypeId: eventType.id,
          startsAt: startIso,
          endsAt: endsAt.toISOString(),
          available: true,
        };
        this.slots.set(slot.id, slot);
      }
    }
  }

  private isSlotAvailable(slot: Slot): boolean {
    if (!slot.available) return false;

    return ![...this.bookings.values()].some((booking) =>
      intervalsOverlap(slot.startsAt, slot.endsAt, booking.startsAt, booking.endsAt),
    );
  }
}
