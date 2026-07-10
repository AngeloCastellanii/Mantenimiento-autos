import { Button, Group, NumberInput, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import type { Vehicle } from '../../types';

export interface VehicleFormValues {
  alias: string;
  brand: string;
  model: string;
  year: number | string;
  currentMileage: number | string;
  plate: string;
}

interface VehicleFormProps {
  initial?: Vehicle;
  onSubmit: (values: VehicleFormValues) => void;
  onCancel: () => void;
}

export function VehicleForm({ initial, onSubmit, onCancel }: VehicleFormProps) {
  const form = useForm<VehicleFormValues>({
    initialValues: {
      alias: initial?.alias ?? '',
      brand: initial?.brand ?? '',
      model: initial?.model ?? '',
      year: initial?.year ?? new Date().getFullYear(),
      currentMileage: initial?.currentMileage ?? 0,
      plate: initial?.plate ?? '',
    },
    validate: {
      alias: (v) => (v.trim().length < 2 ? 'Mínimo 2 caracteres' : null),
      brand: (v) => (!v.trim() ? 'Requerido' : null),
      model: (v) => (!v.trim() ? 'Requerido' : null),
      year: (v) => {
        const n = Number(v);
        if (!n || n < 1980 || n > new Date().getFullYear() + 1) {
          return 'Año inválido';
        }
        return null;
      },
      currentMileage: (v) =>
        Number(v) < 0 ? 'Debe ser ≥ 0' : null,
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    onSubmit(values);
    notifications.show({
      title: initial ? 'Vehículo actualizado' : 'Vehículo agregado',
      message: values.alias,
      color: 'green',
    });
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput label="Alias" placeholder="Mi Corolla" {...form.getInputProps('alias')} />
        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
          <TextInput label="Marca" {...form.getInputProps('brand')} />
          <TextInput label="Modelo" {...form.getInputProps('model')} />
        </SimpleGrid>
        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
          <NumberInput label="Año" {...form.getInputProps('year')} />
          <NumberInput
            label="Kilometraje actual"
            thousandSeparator="."
            {...form.getInputProps('currentMileage')}
          />
        </SimpleGrid>
        <TextInput label="Placa (opcional)" {...form.getInputProps('plate')} />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{initial ? 'Guardar' : 'Agregar'}</Button>
        </Group>
      </Stack>
    </form>
  );
}
