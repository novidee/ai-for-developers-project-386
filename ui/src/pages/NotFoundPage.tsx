import { Button, Center, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Center mih={420}>
      <Stack align="center">
        <Text c="teal" fw={800} size="xl">404</Text>
        <Title order={1}>Страница не найдена</Title>
        <Text c="dimmed">Проверьте адрес или вернитесь к списку встреч.</Text>
        <Button component={Link} to="/">На главную</Button>
      </Stack>
    </Center>
  );
}
