import { createTheme } from '@mantine/core';
import type { AlertSeverity } from '../types';

export const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, system-ui, sans-serif',
  defaultRadius: 'md',
});

// Mapeo severidad de alerta -> color del tema (dashboard/mantenimientos).
export const ALERT_COLOR: Record<AlertSeverity, string> = {
  ok: 'green',
  warning: 'orange',
  critical: 'red',
};
