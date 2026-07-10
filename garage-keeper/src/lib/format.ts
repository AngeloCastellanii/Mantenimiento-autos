// Helpers de formato compartidos (moneda, fechas, km).
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMileage(km: number): string {
  return `${new Intl.NumberFormat('es-VE').format(km)} km`;
}

export function formatDate(iso: string): string {
  return dayjs(iso).format('DD/MM/YYYY');
}

export { dayjs };
