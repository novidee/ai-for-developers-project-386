import { useEffect, useState } from "react";
import { Badge, Button, Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight, IconClock } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { EventType } from "../api/types";
import { EmptyState, ErrorAlert, PageLoader } from "../components/AsyncState";
import { getErrorMessage } from "../utils/date";

export function GuestEventsPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listEventTypes()
      .then(({ items }) => setEventTypes(items))
      .catch((reason: unknown) => setError(getErrorMessage(reason)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Stack gap="xl">
      <Stack gap={8} className="hero-copy">
        <Badge variant="light" size="lg">Свободное время в календаре</Badge>
        <Title order={1}>Выберите формат встречи</Title>
        <Text c="dimmed" size="lg" maw={640}>
          Посмотрите доступные варианты, выберите удобное время и подтвердите запись.
        </Text>
      </Stack>

      {loading && <PageLoader />}
      {error && <ErrorAlert message={error} />}
      {!loading && !error && eventTypes.length === 0 && (
        <EmptyState title="Встреч пока нет" description="Владелец календаря ещё не добавил доступные типы встреч." />
      )}

      {!loading && !error && eventTypes.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {eventTypes.map((eventType) => (
            <Card key={eventType.id} withBorder radius="lg" padding="xl" className="event-card">
              <Stack h="100%" gap="md">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Title order={3}>{eventType.title}</Title>
                  <Badge leftSection={<IconClock size={13} />} variant="outline" color="gray">
                    {eventType.durationMinutes} мин
                  </Badge>
                </Group>
                <Text c="dimmed" className="event-description">{eventType.description}</Text>
                <Button
                  component={Link}
                  to={`/events/${encodeURIComponent(eventType.id)}`}
                  variant="light"
                  rightSection={<IconArrowRight size={17} />}
                  mt="auto"
                >
                  Выбрать время
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
