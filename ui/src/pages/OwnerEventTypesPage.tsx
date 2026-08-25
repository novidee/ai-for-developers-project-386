import { useEffect, useState } from "react";
import { Button, Group, Modal, NumberInput, Paper, Stack, Table, Text, Textarea, TextInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { api } from "../api/client";
import type { CreateEventTypeRequest, EventType } from "../api/types";
import { EmptyState, ErrorAlert, PageLoader } from "../components/AsyncState";
import { getErrorMessage } from "../utils/date";

export function OwnerEventTypesPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<CreateEventTypeRequest>({
    mode: "uncontrolled",
    initialValues: { id: "", title: "", description: "", durationMinutes: 30 },
    validate: {
      id: (value) => value.trim() ? null : "Укажите идентификатор",
      title: (value) => value.trim() ? null : "Укажите название",
      description: (value) => value.trim() ? null : "Добавьте описание",
      durationMinutes: (value) => value >= 1 ? null : "Минимум 1 минута",
    },
  });

  async function loadEventTypes() {
    setLoading(true);
    setError(null);
    try {
      const { items } = await api.listEventTypes();
      setEventTypes(items);
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEventTypes();
  }, []);

  async function createEventType(values: CreateEventTypeRequest) {
    setSaving(true);
    try {
      await api.createEventType({
        ...values,
        id: values.id.trim(),
        title: values.title.trim(),
        description: values.description.trim(),
      });
      close();
      form.reset();
      await loadEventTypes();
      notifications.show({ color: "teal", title: "Тип встречи создан", message: values.title, icon: <IconCheck size={18} /> });
    } catch (reason) {
      notifications.show({ color: "red", title: "Не удалось сохранить", message: getErrorMessage(reason) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="flex-end">
        <div>
          <Text c="teal" fw={700} size="sm" tt="uppercase">Владелец</Text>
          <Title order={1}>Типы встреч</Title>
        </div>
        <Button leftSection={<IconPlus size={18} />} onClick={open}>Добавить тип</Button>
      </Group>

      {loading && <PageLoader />}
      {error && <ErrorAlert message={error} />}
      {!loading && !error && eventTypes.length === 0 && (
        <EmptyState title="Типов встреч пока нет" description="Создайте первый тип, чтобы гости могли выбрать формат встречи." />
      )}
      {!loading && !error && eventTypes.length > 0 && (
        <Paper withBorder radius="lg" className="table-paper">
          <Table.ScrollContainer minWidth={680}>
            <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
              <Table.Thead>
                <Table.Tr><Table.Th>Название</Table.Th><Table.Th>ID</Table.Th><Table.Th>Описание</Table.Th><Table.Th>Длительность</Table.Th></Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {eventTypes.map((eventType) => (
                  <Table.Tr key={eventType.id}>
                    <Table.Td fw={650}>{eventType.title}</Table.Td>
                    <Table.Td><Text c="dimmed" size="sm">{eventType.id}</Text></Table.Td>
                    <Table.Td>{eventType.description}</Table.Td>
                    <Table.Td>{eventType.durationMinutes} мин</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Paper>
      )}

      <Modal opened={opened} onClose={close} title="Новый тип встречи" centered>
        <form onSubmit={form.onSubmit(createEventType)}>
          <Stack>
            <TextInput label="Идентификатор" placeholder="consultation" required key={form.key("id")} {...form.getInputProps("id")} />
            <TextInput label="Название" placeholder="Консультация" required key={form.key("title")} {...form.getInputProps("title")} />
            <Textarea label="Описание" placeholder="Коротко расскажите о встрече" minRows={3} required key={form.key("description")} {...form.getInputProps("description")} />
            <NumberInput label="Длительность, минут" min={1} required key={form.key("durationMinutes")} {...form.getInputProps("durationMinutes")} />
            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={close}>Отмена</Button>
              <Button type="submit" loading={saving}>Создать</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
