import { AppShell, NavLink, Text, Title } from '@mantine/core';
import {
  IconCar,
  IconHome,
  IconAlertTriangle,
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

  return (
    <AppShell navbar={{ width: 240, breakpoint: 'sm' }} padding="md">
      <AppShell.Navbar p="md">
        <Title order={4} mb="lg">
          GarageKeeper
        </Title>
        <Text size="xs" c="dimmed" mb="md">
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
            onClick={() => navigate(item.path)}
            mb={4}
          />
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
