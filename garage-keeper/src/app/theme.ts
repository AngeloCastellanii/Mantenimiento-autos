import { createTheme, rem } from '@mantine/core';
import type { AlertSeverity } from '../types';

export const theme = createTheme({
  primaryColor: 'indigo',
  fontFamily: 'Inter, system-ui, sans-serif',
  defaultRadius: 'md',
  headings: {
    fontWeight: '700',
  },
  components: {
    Card: {
      defaultProps: {
        withBorder: true,
        shadow: 'sm',
        radius: 'md',
      },
    },
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    NavLink: {
      defaultProps: {
        variant: 'light',
        radius: 'md',
      },
    },
  },
  other: {
    pageGradient:
      'linear-gradient(180deg, var(--mantine-color-indigo-0) 0%, var(--mantine-color-gray-0) 220px)',
  },
});

export const ALERT_COLOR: Record<AlertSeverity, string> = {
  ok: 'green',
  warning: 'orange',
  critical: 'red',
};

export const SHELL_TRANSITION = {
  duration: 300,
  timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const contentMaxWidth = rem(1100);
