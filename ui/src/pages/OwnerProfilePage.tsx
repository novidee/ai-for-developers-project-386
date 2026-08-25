import { useEffect, useState } from "react";
import { Avatar, Button, Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconCalendarEvent, IconCalendarStats, IconUser } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Owner } from "../api/types";
import { ErrorAlert, PageLoader } from "../components/AsyncState";
import { getErrorMessage } from "../utils/date";

export function OwnerProfilePage() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getOwner()
      .then(setOwner)
      .catch((reason: unknown) => setError(getErrorMessage(reason)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Stack gap="xl">
      <div>
        <Text c="teal" fw={700} size="sm" tt="uppercase">Панель владельца</Text>
        <Title order={1}>Управление календарём</Title>
      </div>
      {loading && <PageLoader />}
      {error && <ErrorAlert message={error} />}
      {!loading && !error && owner && (
        <>
          <Card withBorder radius="lg" padding="xl">
            <Group>
              <Avatar color="teal" radius="xl" size="lg"><IconUser size={28} /></Avatar>
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Владелец календаря</Text>
                <Title order={2}>{owner.name}</Title>
                <Text c="dimmed" size="sm">ID: {owner.id}</Text>
              </div>
            </Group>
          </Card>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Card withBorder radius="lg" padding="xl">
              <Stack>
                <IconCalendarEvent size={30} color="var(--mantine-color-teal-7)" />
                <Title order={3}>Типы встреч</Title>
                <Text c="dimmed">Добавляйте форматы встреч, доступные гостям.</Text>
                <Button component={Link} to="/owner/event-types" variant="light">Открыть типы встреч</Button>
              </Stack>
            </Card>
            <Card withBorder radius="lg" padding="xl">
              <Stack>
                <IconCalendarStats size={30} color="var(--mantine-color-teal-7)" />
                <Title order={3}>Предстоящие встречи</Title>
                <Text c="dimmed">Просматривайте все созданные бронирования.</Text>
                <Button component={Link} to="/owner/bookings" variant="light">Открыть бронирования</Button>
              </Stack>
            </Card>
          </SimpleGrid>
        </>
      )}
    </Stack>
  );
}
