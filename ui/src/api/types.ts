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

export interface EventTypeList {
  items: EventType[];
}

export interface Slot {
  id: string;
  eventTypeId: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
}

export interface SlotList {
  items: Slot[];
}

export interface Booking {
  id: string;
  eventTypeId: string;
  slotId: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
}

export interface BookingList {
  items: Booking[];
}

export type CreateEventTypeRequest = EventType;

export interface CreateBookingRequest {
  slotId: string;
}

export interface ErrorBody {
  code: string;
  message: string;
}
