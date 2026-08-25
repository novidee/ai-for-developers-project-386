import { useEffect, useState } from "react";
import { Anchor, Badge, Button, Group, Modal, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft, IconCalendar, IconCheck, IconClock } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import type { EventType, Slot } from "../api/types";
import { EmptyState, ErrorAlert, PageLoader } from "../components/AsyncState";
import { formatDay, formatTime, getErrorMessage } from "../utils/date";

export function GuestEventSlotsPage() {
  const { id = "" } = useParams();
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPage() {
    setLoading(true);
    setError(null);
    try {
      const [eventTypeResponse, slotsResponse] = await Promise.all([
        api.getEventType(id),
        api.listAvailableSlots(id),
      ]);
      setEventType(eventTypeResponse);
      setSlots(slotsResponse.items.filter((slot) => slot.available).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt)));
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPage();
  }, [id]);

  async function confirmBooking() {
    if (!selectedSlot) return;
    setBooking(true);
    try {
      await api.createBooking(selectedSlot.id);
      setSelectedSlot(null);
      await loadPage();
      notifications.show({
        color: "teal",
        title: "Встреча забронирована",
        message: "Выбранное время закреплено за вами.",
        icon: <IconCheck size={18} />,
      });
    } catch (reason) {
      notifications.show({ color: "red", title: "Не удалось забронировать", message: getErrorMessage(reason) });
    } finally {
      setBooking(false);
    }
  }

  const slotsByDay = new Map<string, Slot[]>();
  for (const slot of slots) {
    const day = formatDay(slot.startsAt);
    slotsByDay.set(day, [...(slotsByDay.get(day) ?? []), slot]);
  }

  return (
    <Stack gap="xl">
      <Anchor component={Link} to="/" className="back-link" c="dimmed">
        <IconArrowLeft size={17} /> К списку встреч
      </Anchor>

      {loading && <PageLoader />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && eventType && (
        <>
          <Paper withBorder radius="lg" p={{ base: "lg", sm: "xl" }} className="event-summary">
            <Stack gap="sm">
              <Badge variant="light" w="fit-content">Выбор времени</Badge>
              <Title order={1}>{eventType.title}</Title>
              <Text c="dimmed" size="lg">{eventType.description}</Text>
              <Group gap="xs">
                <IconClock size={18} />
                <Text fw={600}>{eventType.durationMinutes} минут</Text>
              </Group>
            </Stack>
          </Paper>

          {slots.length === 0 ? (
            <EmptyState title="Свободного времени нет" description="Для этой встречи пока нет доступных слотов. Загляните позже." />
          ) : (
            <Stack gap="lg">
              <Title order={2}>Доступные слоты</Title>
              {Array.from(slotsByDay.entries()).map(([day, daySlots]) => (
                <Paper key={day} withBorder radius="lg" p="lg">
                  <Group gap="xs" mb="md">
                    <IconCalendar size={19} color="var(--mantine-color-teal-7)" />
                    <Text fw={700} tt="capitalize">{day}</Text>
                  </Group>
                  <SimpleGrid cols={{ base: 2, xs: 3, sm: 4, md: 6 }} spacing="sm">
                    {daySlots.map((slot) => (
                      <Button key={slot.id} variant="outline" onClick={() => setSelectedSlot(slot)}>
                        {formatTime(slot.startsAt)}
                      </Button>
                    ))}
                  </SimpleGrid>
                </Paper>
              ))}
            </Stack>
          )}
        </>
      )}

      <Modal opened={selectedSlot !== null} onClose={() => setSelectedSlot(null)} title="Подтвердите бронирование" centered>
        <Stack>
          {selectedSlot && (
            <Text>
              {formatDay(selectedSlot.startsAt)}, {formatTime(selectedSlot.startsAt)}–{formatTime(selectedSlot.endsAt)}
            </Text>
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setSelectedSlot(null)}>Отмена</Button>
            <Button loading={booking} onClick={confirmBooking}>Забронировать</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
