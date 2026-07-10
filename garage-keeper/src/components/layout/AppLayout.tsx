import { AppShell, Burger, Group, NavLink, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAlertTriangle,
  IconCar,
  IconHome,
} from '@tabler/icons-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Inicio', path: '/', icon: IconHome },
  { label: 'Vehículos', path: '/vehiculos', icon: IconCar },
  { label: 'Próximos', path: '/proximos', icon: IconAlertTriangle },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, { toggle, close }] = useDisclosure();

  const goTo = (path: string) => {
    navigate(path);
    close();
  };

  return (
    <AppShell
      header={{ height: { base: 56, sm: 0 } }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding={{ base: 'sm', sm: 'md' }}
    >
      <AppShell.Header hiddenFrom="sm">
        <Group h="100%" px="sm" justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Burger opened={opened} onClick={toggle} aria-label="Abrir menú" />
            <div>
              <Title order={5} lineClamp={1}>
                GarageKeeper
              </Title>
              <Text size="xs" c="dimmed" lineClamp={1}>
                Mantenimiento
              </Text>
            </div>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Title order={4} mb="lg" visibleFrom="sm">
          GarageKeeper
        </Title>
        <Text size="xs" c="dimmed" mb="md" visibleFrom="sm">
          Control de mantenimiento
        </Text>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            leftSection={<item.icon size={18} />}
            active={
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)
            }
            onClick={() => goTo(item.path)}
            mb={4}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main style={{ overflowX: 'hidden', maxWidth: '100%' }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
