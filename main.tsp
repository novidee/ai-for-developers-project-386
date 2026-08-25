import "@typespec/http";

using Http;

/**
 * API сервиса бронирования календаря.
 *
 * Регистрации и авторизации нет. В системе существует один заранее заданный
 * владелец календаря, а гости используют публичные операции анонимно.
 */
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

/** Единственный заранее заданный владелец календаря. */
model Owner {
  id: string;
  name: string;
}

/** Тип события, создаваемый владельцем календаря. */
model EventType {
  id: string;
  title: string;
  description: string;
  /** Длительность события в минутах. */
  @minValue(1)
  durationMinutes: int32;
}

model EventTypeList {
  items: EventType[];
}

/** Временной интервал, доступный для выбранного типа события. */
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

/** Подтвержденная запись гостя на событие. */
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
  /** Получить профиль владельца, используемый административной частью. */
  @get getProfile(): Owner | ErrorResponse;

  /** Создать новый тип события. */
  @route("event-types")
  @post createEventType(@body request: CreateEventTypeRequest): EventType | ErrorResponse;

  /** Получить одним списком все предстоящие бронирования всех типов событий. */
  @route("bookings")
  @get listUpcomingBookings(): BookingList | ErrorResponse;
}

@route("/event-types")
@tag("Guest")
interface GuestEventTypes {
  /** Получить доступные гостю типы событий с названием, описанием и длительностью. */
  @get list(): EventTypeList | ErrorResponse;

  /** Получить выбранный тип события. */
  @get read(@path id: string): EventType | ErrorResponse;

  /**
   * Получить свободные слоты выбранного типа события.
   *
   * Возвращаются только свободные слоты в окне ближайших 14 дней, начиная с
   * текущей даты. Слоты вне окна и уже занятые слоты не возвращаются.
   */
  @route("{eventTypeId}/slots")
  @get listAvailableSlots(@path eventTypeId: string): SlotList | ErrorResponse;
}

@route("/bookings")
@tag("Guest")
interface GuestBookings {
  /**
   * Создать бронирование выбранного свободного слота.
   *
   * Слот должен находиться в 14-дневном окне записи. Операция возвращает 409,
   * если выбранный слот уже занят или его время пересекается с существующим
   * бронированием, даже если бронирования относятся к разным типам событий.
   */
  @post create(@body request: CreateBookingRequest): Booking | ErrorResponse;
}
