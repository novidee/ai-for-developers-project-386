import { AppShell, Box, Burger, Button, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCalendarEvent, IconCalendarStats, IconHome, IconUser } from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { Link, Outlet, useLocation } from "react-router-dom";

interface NavigationItem {
  label: string;
  path: string;
  icon: Icon;
}

const navigation: NavigationItem[] = [
  { label: "Выбрать встречу", path: "/", icon: IconHome },
  { label: "Профиль владельца", path: "/owner", icon: IconUser },
  { label: "Типы встреч", path: "/owner/event-types", icon: IconCalendarEvent },
  { label: "Бронирования", path: "/owner/bookings", icon: IconCalendarStats },
];

export function AppLayout() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const { pathname } = useLocation();

  const links = navigation.map(({ label, path, icon: ItemIcon }) => (
    <Button
      key={path}
      component={Link}
      to={path}
      variant={pathname === path ? "light" : "subtle"}
      color={pathname === path ? "teal" : "gray"}
      leftSection={<ItemIcon size={18} />}
      justify="flex-start"
      onClick={close}
    >
      {label}
    </Button>
  ));

  return (
    <AppShell
      header={{ height: 68 }}
      navbar={{ width: 280, breakpoint: "sm", collapsed: { desktop: true, mobile: !opened } }}
      padding={0}
    >
      <AppShell.Header className="app-header">
        <Group h="100%" px={{ base: "md", sm: "xl" }} justify="space-between" wrap="nowrap">
          <Link to="/" className="brand">
            <Group gap="sm">
              <ThemeIcon size={38} radius="xl" variant="gradient" gradient={{ from: "teal", to: "cyan" }}>
                <IconCalendarEvent size={21} />
              </ThemeIcon>
              <Box>
                <Text fw={750} lh={1.1}>Время встречи</Text>
                <Text size="xs" c="dimmed">Онлайн-запись</Text>
              </Box>
            </Group>
          </Link>

          <Group gap={4} visibleFrom="sm">
            {links}
          </Group>

          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" aria-label="Открыть меню" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">{links}</Stack>
      </AppShell.Navbar>

      <AppShell.Main className="app-background">
        <Box component="main" className="page-container">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
