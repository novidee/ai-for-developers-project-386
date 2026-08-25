import "@typespec/http";

using Http;

@service(#{ title: "Calendar Booking API" })
namespace CalendarBooking;

model ErrorBody {
  code: string;
  message: string;
}

@error
model ErrorResponse {
  @statusCode statusCode: 400 | 404 | 409;
  @body body: ErrorBody;
}

model Owner {
  id: string;
  name: string;
}

model EventType {
  id: string;
  title: string;
  description: string;
  @minValue(1)
  durationMinutes: int32;
}

model EventTypeList {
  items: EventType[];
}

model Slot {
  id: string;
  eventTypeId: string;
  startsAt: utcDateTime;
  endsAt: utcDateTime;
  available: boolean;
}

model SlotList {
  items: Slot[];
}

model Booking {
  id: string;
  eventTypeId: string;
  slotId: string;
  startsAt: utcDateTime;
  endsAt: utcDateTime;
  createdAt: utcDateTime;
}

model BookingList {
  items: Booking[];
}

model CreateEventTypeRequest {
  id: string;
  title: string;
  description: string;
  @minValue(1)
  durationMinutes: int32;
}

model CreateBookingRequest {
  slotId: string;
}

@route("/owner")
@tag("Owner")
interface OwnerOperations {
  @get getProfile(): Owner | ErrorResponse;

  @route("event-types")
  @post createEventType(@body request: CreateEventTypeRequest): EventType | ErrorResponse;

  @route("bookings")
  @get listUpcomingBookings(): BookingList | ErrorResponse;
}

@route("/event-types")
@tag("Guest")
interface GuestEventTypes {
  @get list(): EventTypeList | ErrorResponse;

  @get read(@path id: string): EventType | ErrorResponse;

  @route("{eventTypeId}/slots")
  @get listAvailableSlots(@path eventTypeId: string): SlotList | ErrorResponse;
}

@route("/bookings")
@tag("Guest")
interface GuestBookings {
  @post create(@body request: CreateBookingRequest): Booking | ErrorResponse;
}
