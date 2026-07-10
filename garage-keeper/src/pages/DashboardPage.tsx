import { Button, Card, Modal, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import {
  IconAlertTriangle,
  IconArrowRight,
  IconCarSuv,
  IconTags,
  IconWallet,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_TAGLINE } from '../constants/brand';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionBlock } from '../components/layout/SectionBlock';
import { StatsCards } from '../components/dashboard/StatsCards';
import { UpcomingAlerts } from '../components/dashboard/UpcomingAlerts';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { VehicleForm, type VehicleFormValues } from '../components/vehicles/VehicleForm';
import { useGarage } from '../context/GarageContext';
import { useResponsiveModalProps } from '../hooks/useResponsiveModal';
import type { Vehicle } from '../types';

const QUICK_LINKS = [
  {
    label: 'Vehículos',
    description: 'Gestiona tus autos e historial',
    to: '/vehiculos',
    icon: IconCarSuv,
    color: 'teal',
  },
  {
    label: 'Gastos',
    description: 'Filtra costos por vehículo o servicio',
    to: '/gastos',
    icon: IconWallet,
    color: 'forest',
  },
  {
    label: 'Próximos',
    description: 'Revisa alertas y pendientes',
    to: '/proximos',
    icon: IconAlertTriangle,
    color: 'orange',
  },
  {
    label: 'Tipos de servicio',
    description: 'Personaliza y renombra servicios',
    to: '/tipos-servicio',
    icon: IconTags,
    color: 'violet',
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { addVehicle } = useGarage();
  const [opened, setOpened] = useState(false);
  const modalProps = useResponsiveModalProps();

  const handleAdd = (values: VehicleFormValues) => {
    const vehicle: Vehicle = {
      id: crypto.randomUUID(),
      alias: values.alias.trim(),
      brand: values.brand.trim(),
      model: values.model.trim(),
      year: Number(values.year),
      currentMileage: Number(values.currentMileage),
      plate: values.plate.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    addVehicle(vehicle);
    setOpened(false);
  };

  return (
    <>
      <PageHeader
        title="Inicio"
        subtitle={APP_TAGLINE}
        crumbs={[{ label: 'Inicio' }]}
      />

      <WelcomeBanner onAddVehicle={() => setOpened(true)} />
      <StatsCards />

      <SectionBlock
        title="Accesos rápidos"
        description="Navega directo a cada sección."
      >
        <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} spacing="md">
          {QUICK_LINKS.map((link) => (
            <Card
              key={link.to}
              padding="lg"
              style={{ cursor: 'pointer', transition: 'transform 150ms ease, box-shadow 150ms ease' }}
              onClick={() => navigate(link.to)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--mantine-shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
              }}
            >
              <ThemeIcon size={42} radius="md" variant="light" color={link.color} mb="sm">
                <link.icon size={22} />
              </ThemeIcon>
              <Text fw={700}>{link.label}</Text>
              <Text size="sm" c="dimmed">
                {link.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </SectionBlock>

      <SectionBlock
        title="Próximos mantenimientos"
        description="Servicios que vencen pronto o ya están atrasados."
        action={
          <Button
            variant="light"
            size="compact-sm"
            rightSection={<IconArrowRight size={14} />}
            onClick={() => navigate('/proximos')}
          >
            Ver todos
          </Button>
        }
        mb={0}
      >
        <UpcomingAlerts limit={3} />
      </SectionBlock>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Nuevo vehículo"
        {...modalProps}
      >
        <VehicleForm onSubmit={handleAdd} onCancel={() => setOpened(false)} />
      </Modal>
    </>
  );
}
