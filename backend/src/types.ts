export interface Owner {
  id: string;
  name: string;
}

export interface EventType {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
}

export interface Slot {
  id: string;
  eventTypeId: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
}

export interface Booking {
  id: string;
  eventTypeId: string;
  slotId: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
}

export type CreateEventTypeRequest = EventType;

export interface CreateBookingRequest {
  slotId: string;
}
