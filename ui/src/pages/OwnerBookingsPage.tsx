import { useEffect, useState } from "react";
import { Badge, Paper, Stack, Table, Text, Title } from "@mantine/core";
import { api } from "../api/client";
import type { Booking } from "../api/types";
import { EmptyState, ErrorAlert, PageLoader } from "../components/AsyncState";
import { formatDateTime, getErrorMessage } from "../utils/date";

interface BookingRow extends Booking {
  eventTitle: string;
}

export function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.listUpcomingBookings(), api.listEventTypes()])
      .then(([bookingList, eventTypeList]) => {
        const titles = new Map(eventTypeList.items.map((eventType) => [eventType.id, eventType.title]));
        setBookings(
          bookingList.items
            .map((booking) => ({ ...booking, eventTitle: titles.get(booking.eventTypeId) ?? booking.eventTypeId }))
            .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt)),
        );
      })
      .catch((reason: unknown) => setError(getErrorMessage(reason)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Stack gap="xl">
      <div>
        <Text c="teal" fw={700} size="sm" tt="uppercase">Владелец</Text>
        <Title order={1}>Предстоящие бронирования</Title>
      </div>
      {loading && <PageLoader />}
      {error && <ErrorAlert message={error} />}
      {!loading && !error && bookings.length === 0 && (
        <EmptyState title="Записей пока нет" description="Новые бронирования гостей появятся на этой странице." />
      )}
      {!loading && !error && bookings.length > 0 && (
        <Paper withBorder radius="lg" className="table-paper">
          <Table.ScrollContainer minWidth={680}>
            <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
              <Table.Thead>
                <Table.Tr><Table.Th>Начало</Table.Th><Table.Th>Окончание</Table.Th><Table.Th>Тип встречи</Table.Th><Table.Th>Статус</Table.Th></Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {bookings.map((booking) => (
                  <Table.Tr key={booking.id}>
                    <Table.Td fw={600}>{formatDateTime(booking.startsAt)}</Table.Td>
                    <Table.Td>{formatDateTime(booking.endsAt)}</Table.Td>
                    <Table.Td>{booking.eventTitle}</Table.Td>
                    <Table.Td><Badge variant="light" color="teal">Подтверждено</Badge></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Paper>
      )}
    </Stack>
  );
}
