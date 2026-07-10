import { Button, Group, NumberInput, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { MAINTENANCE_OPTIONS } from '../../constants/maintenance';
import type { Maintenance, MaintenanceType } from '../../types';

export interface MaintenanceFormValues {
  type: MaintenanceType;
  date: Date | null;
  mileage: number | string;
  cost: number | string;
  provider: string;
  notes: string;
}

interface MaintenanceFormProps {
  initial?: Maintenance;
  onSubmit: (values: MaintenanceFormValues) => void;
  onCancel: () => void;
}

export function MaintenanceForm({
  initial,
  onSubmit,
  onCancel,
}: MaintenanceFormProps) {
  const form = useForm<MaintenanceFormValues>({
    initialValues: {
      type: initial?.type ?? 'oil_change',
      date: initial ? dayjs(initial.date).toDate() : new Date(),
      mileage: initial?.mileage ?? 0,
      cost: initial?.cost ?? 0,
      provider: initial?.provider ?? '',
      notes: initial?.notes ?? '',
    },
    validate: {
      type: (v) => (!v ? 'Requerido' : null),
      date: (v) => (!v ? 'Requerido' : null),
      mileage: (v) => (Number(v) < 0 ? 'Debe ser ≥ 0' : null),
      cost: (v) => (Number(v) < 0 ? 'Debe ser ≥ 0' : null),
      provider: (v) => (v.trim().length < 2 ? 'Mínimo 2 caracteres' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    if (values.date && dayjs(values.date).isAfter(dayjs(), 'day')) {
      form.setFieldError('date', 'No puede ser futura');
      return;
    }
    onSubmit(values);
    notifications.show({
      title: initial ? 'Mantenimiento actualizado' : 'Mantenimiento registrado',
      message: 'Cambios guardados',
      color: 'green',
    });
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Select
          label="Tipo de servicio"
          data={MAINTENANCE_OPTIONS}
          {...form.getInputProps('type')}
        />
        <DatePickerInput
          label="Fecha"
          valueFormat="DD/MM/YYYY"
          {...form.getInputProps('date')}
        />
        <Group grow>
          <NumberInput
            label="Kilometraje"
            thousandSeparator="."
            {...form.getInputProps('mileage')}
          />
          <NumberInput
            label="Costo ($)"
            decimalScale={2}
            {...form.getInputProps('cost')}
          />
        </Group>
        <TextInput label="Taller / proveedor" {...form.getInputProps('provider')} />
        <Textarea label="Notas (opcional)" {...form.getInputProps('notes')} />
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{initial ? 'Guardar' : 'Registrar'}</Button>
        </Group>
      </Stack>
    </form>
  );
}
