import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { PageHeader } from '../components/layout/PageHeader';
import { useGarage } from '../context/GarageContext';
import { useResponsiveModalProps } from '../hooks/useResponsiveModal';
import { useIsMobile } from '../hooks/useIsMobile';
import type { ServiceType } from '../types';

const COLOR_OPTIONS = [
  'forest',
  'teal',
  'blue',
  'cyan',
  'grape',
  'violet',
  'red',
  'orange',
  'yellow',
  'dark',
  'gray',
].map((c) => ({ value: c, label: c }));

interface FormValues {
  label: string;
  color: string;
  km: number | string;
  months: number | string;
  warnIfMissing: boolean;
}

export function ServiceTypesPage() {
  const { state, addServiceType, updateServiceType, deleteServiceType } =
    useGarage();
  const modalProps = useResponsiveModalProps();
  const isMobile = useIsMobile();
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<ServiceType | null>(null);

  const form = useForm<FormValues>({
    mode: 'controlled',
    initialValues: {
      label: '',
      color: 'forest',
      km: '',
      months: '',
      warnIfMissing: false,
    },
    validate: {
      label: (v) =>
        v.trim().length < 2 || v.trim().length > 40
          ? 'Nombre entre 2 y 40 caracteres'
          : null,
    },
  });

  const openNew = () => {
    setEditing(null);
    form.setValues({
      label: '',
      color: 'forest',
      km: '',
      months: '',
      warnIfMissing: false,
    });
    setOpened(true);
  };

  const openEdit = (t: ServiceType) => {
    setEditing(t);
    form.setValues({
      label: t.label,
      color: t.color ?? 'forest',
      km: t.km ?? '',
      months: t.months ?? '',
      warnIfMissing: t.warnIfMissing ?? false,
    });
    setOpened(true);
  };

  const handleSubmit = (values: FormValues) => {
    const base: ServiceType = {
      id: editing?.id ?? `custom-${crypto.randomUUID().slice(0, 8)}`,
      label: values.label.trim(),
      color: values.color,
      km: values.km === '' ? undefined : Number(values.km),
      months: values.months === '' ? undefined : Number(values.months),
      warnIfMissing: values.warnIfMissing,
      builtIn: editing?.builtIn,
    };
    if (editing) {
      updateServiceType(base);
      notifications.show({ message: 'Tipo de servicio actualizado.', color: 'teal' });
    } else {
      addServiceType(base);
      notifications.show({ message: 'Tipo de servicio agregado.', color: 'teal' });
    }
    setOpened(false);
  };

  const handleDelete = (t: ServiceType) => {
    deleteServiceType(t.id);
    notifications.show({
      message: `"${t.label}" eliminado. Sus servicios pasaron a "Otro".`,
      color: 'orange',
    });
  };

  const thresholdText = (t: ServiceType) => {
    const parts: string[] = [];
    if (t.km != null) parts.push(`${t.km.toLocaleString('es')} km`);
    if (t.months != null) parts.push(`${t.months} meses`);
    return parts.length ? parts.join(' · ') : 'Sin alerta';
  };

  return (
    <>
      <PageHeader
        title="Tipos de servicio"
        subtitle="Renombra los tipos existentes o crea los tuyos con sus alertas."
        crumbs={[{ label: 'Inicio', to: '/' }, { label: 'Tipos de servicio' }]}
        action={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openNew}
            fullWidth={isMobile}
            maw={isMobile ? undefined : 200}
          >
            Nuevo tipo
          </Button>
        }
      />

      <Card padding={0}>
        <Table.ScrollContainer minWidth={520}>
          <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre</Table.Th>
                <Table.Th>Alerta cada</Table.Th>
                <Table.Th>Origen</Table.Th>
                <Table.Th ta="right">Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {state.serviceTypes.map((t) => (
                <Table.Tr key={t.id}>
                  <Table.Td>
                    <Badge variant="light" color={t.color ?? 'teal'}>
                      {t.label}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {thresholdText(t)}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {t.builtIn ? 'Integrado' : 'Personalizado'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="flex-end" wrap="nowrap">
                      <ActionIcon
                        variant="light"
                        color="gray"
                        onClick={() => openEdit(t)}
                        aria-label="Editar"
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        disabled={t.builtIn}
                        onClick={() => handleDelete(t)}
                        aria-label="Eliminar"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editing ? 'Editar tipo de servicio' : 'Nuevo tipo de servicio'}
        {...modalProps}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="sm">
            <TextInput
              label="Nombre"
              placeholder="Ej. Cambio de filtro"
              withAsterisk
              key={form.key('label')}
              {...form.getInputProps('label')}
            />
            <Select
              label="Color"
              data={COLOR_OPTIONS}
              key={form.key('color')}
              {...form.getInputProps('color')}
            />
            <Group grow>
              <NumberInput
                label="Alerta cada (km)"
                placeholder="Opcional"
                min={0}
                thousandSeparator="."
                decimalSeparator=","
                allowDecimal={false}
                key={form.key('km')}
                {...form.getInputProps('km')}
              />
              <NumberInput
                label="Alerta cada (meses)"
                placeholder="Opcional"
                min={0}
                allowDecimal={false}
                key={form.key('months')}
                {...form.getInputProps('months')}
              />
            </Group>
            <Switch
              label="Avisar si nunca se ha registrado"
              key={form.key('warnIfMissing')}
              {...form.getInputProps('warnIfMissing', { type: 'checkbox' })}
            />
            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={() => setOpened(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editing ? 'Guardar' : 'Agregar'}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
