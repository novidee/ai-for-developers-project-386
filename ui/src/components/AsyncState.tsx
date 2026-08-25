import { Alert, Center, Loader, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export function PageLoader() {
  return (
    <Center mih={280}>
      <Stack align="center" gap="sm">
        <Loader color="teal" />
        <Text c="dimmed" size="sm">Загружаем данные...</Text>
      </Stack>
    </Center>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return (
    <Alert variant="light" color="red" title="Не удалось загрузить данные" icon={<IconAlertCircle size={20} />}>
      {message}
    </Alert>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Center className="empty-state">
      <Stack align="center" gap={6} maw={440}>
        <Title order={3}>{title}</Title>
        <Text c="dimmed" ta="center">{description}</Text>
      </Stack>
    </Center>
  );
}
