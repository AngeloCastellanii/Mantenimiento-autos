import { AppShell, Box, Burger, Divider, Group, NavLink, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAlertTriangle,
  IconCarSuv,
  IconHome,
} from '@tabler/icons-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SHELL_TRANSITION } from '../../app/theme';
import { BrandMark } from './BrandMark';
import { ErrorBoundary } from './ErrorBoundary';

const navItems = [
  {
    label: 'Inicio',
    description: 'Resumen general',
    path: '/',
    icon: IconHome,
  },
  {
    label: 'Vehículos',
    description: 'Tus autos registrados',
    path: '/vehiculos',
    icon: IconCarSuv,
  },
  {
    label: 'Próximos',
    description: 'Alertas de servicio',
    path: '/proximos',
    icon: IconAlertTriangle,
  },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, { toggle, close }] = useDisclosure();

  const goTo = (path: string) => {
    navigate(path);
    close();
  };

  const isActive = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  return (
    <AppShell
      header={{ height: { base: 60, sm: 0 } }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding={{ base: 'sm', sm: 'md' }}
      transitionDuration={SHELL_TRANSITION.duration}
      transitionTimingFunction={SHELL_TRANSITION.timingFunction}
    >
      <AppShell.Header hiddenFrom="sm" withBorder>
        <Group h="100%" px="sm" justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            <Burger opened={opened} onClick={toggle} aria-label="Abrir menú" size="sm" />
            <BrandMark compact />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" withBorder>
        <Box visibleFrom="sm">
          <BrandMark />
        </Box>
        <Divider mb="md" visibleFrom="sm" />
        <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb="xs" px={4}>
          Navegación
        </Text>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            description={item.description}
            leftSection={<item.icon size={18} stroke={1.75} />}
            active={isActive(item.path)}
            onClick={() => goTo(item.path)}
            mb={6}
          />
        ))}
        <Box mt="auto" pt="xl" px={4} visibleFrom="sm">
          <Text size="xs" c="dimmed">
            Tip: toca un vehículo para ver su historial y registrar servicios.
          </Text>
        </Box>
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          overflowX: 'hidden',
          maxWidth: '100%',
          background: 'var(--gk-page-gradient)',
        }}
      >
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </AppShell.Main>
    </AppShell>
  );
}
