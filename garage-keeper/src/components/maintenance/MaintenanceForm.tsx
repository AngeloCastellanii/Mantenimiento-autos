// Formulario crear/editar mantenimiento (ESPECIFICACION §4.3, §8.2).
// MANTENIMIENTOS — owner: Marcial.
import {
  Alert,
  Button,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useServiceTypes } from '../../hooks/useServiceTypes';
import { dayjs } from '../../lib/format';
import type { Maintenance, MaintenanceType } from '../../types';

export interface MaintenanceFormValues {
  type: MaintenanceType | null;
  date: Date | null;
  mileage: number | string;
  cost: number | string;
  provider: string;
  notes: string;
}

interface MaintenanceFormProps {
  initial?: Maintenance;
  /** Máximo km de servicios previos del vehículo (regla cruzada §4.3). */
  lastMileage?: number;
  onSubmit: (values: MaintenanceFormValues) => void;
  onCancel: () => void;
}

const TODAY = new Date();

export function MaintenanceForm({
  initial,
  lastMileage,
  onSubmit,
  onCancel,
}: MaintenanceFormProps) {
  const { options } = useServiceTypes();
  const form = useForm<MaintenanceFormValues>({
    mode: 'controlled',
    initialValues: {
      type: initial?.type ?? null,
      date: initial ? dayjs(initial.date).toDate() : TODAY,
      mileage: initial?.mileage ?? '',
      cost: initial?.cost ?? '',
      provider: initial?.provider ?? '',
      notes: initial?.notes ?? '',
    },
    validate: {
      type: (v) => (v ? null : 'Selecciona un tipo de servicio'),
      date: (v) => {
        if (!v) return 'Fecha requerida';
        return dayjs(v).isAfter(dayjs(), 'day')
          ? 'La fecha no puede ser futura'
          : null;
      },
      mileage: (v) =>
        v !== '' && Number.isInteger(Number(v)) && Number(v) >= 0
          ? null
          : 'Kilometraje entero ≥ 0',
      cost: (v) => (v !== '' && Number(v) >= 0 ? null : 'Costo válido ≥ 0'),
      provider: (v) =>
        v.trim().length < 2 || v.trim().length > 80
          ? 'Mecánico/Taller entre 2 y 80 caracteres'
          : null,
      notes: (v) => (v.length > 500 ? 'Máx 500 caracteres' : null),
    },
  });

  // Regla cruzada: advertencia visual (no bloquea) si el km es menor al último.
  const mileageNum = Number(form.values.mileage);
  const showMileageWarning =
    lastMileage != null &&
    form.values.mileage !== '' &&
    Number.isFinite(mileageNum) &&
    mileageNum < lastMileage;

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="sm">
        <Select
          label="Tipo de servicio"
          placeholder="Selecciona"
          withAsterisk
          searchable
          data={options}
          key={form.key('type')}
          {...form.getInputProps('type')}
        />
        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
          <DatePickerInput
            label="Fecha del servicio"
            placeholder="Selecciona fecha"
            withAsterisk
            maxDate={TODAY}
            valueFormat="DD/MM/YYYY"
            key={form.key('date')}
            {...form.getInputProps('date')}
          />
          <NumberInput
            label="Kilometraje"
            placeholder="80000"
            withAsterisk
            min={0}
            thousandSeparator="."
            decimalSeparator=","
            suffix=" km"
            key={form.key('mileage')}
            {...form.getInputProps('mileage')}
          />
        </SimpleGrid>
        {showMileageWarning && (
          <Alert
            variant="light"
            color="orange"
            icon={<IconAlertTriangle size={16} />}
            p="xs"
          >
            El kilometraje es menor al último registrado ({lastMileage} km).
            Verifica el dato.
          </Alert>
        )}
        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
          <NumberInput
            label="Costo"
            placeholder="45"
            withAsterisk
            min={0}
            prefix="$"
            thousandSeparator="."
            decimalSeparator=","
            key={form.key('cost')}
            {...form.getInputProps('cost')}
          />
          <TextInput
            label="Mecánico/Taller"
            placeholder="AutoFast"
            withAsterisk
            key={form.key('provider')}
            {...form.getInputProps('provider')}
          />
        </SimpleGrid>
        <Textarea
          label="Notas"
          description="Opcional"
          placeholder="Detalles del servicio…"
          autosize
          minRows={2}
          maxRows={4}
          key={form.key('notes')}
          {...form.getInputProps('notes')}
        />
        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{initial ? 'Guardar' : 'Registrar'}</Button>
        </Group>
      </Stack>
    </form>
  );
}
