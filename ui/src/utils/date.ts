const dayFormatter = new Intl.DateTimeFormat("ru-RU", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatDay = (value: string) => dayFormatter.format(new Date(value));
export const formatTime = (value: string) => timeFormatter.format(new Date(value));
export const formatDateTime = (value: string) => dateTimeFormatter.format(new Date(value));

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Произошла неизвестная ошибка.";
}
