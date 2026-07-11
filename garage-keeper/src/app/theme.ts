import { createTheme, rem, type MantineColorsTuple } from '@mantine/core';
import type { AlertSeverity } from '../types';

// Paleta "forest" (verde) — sello de marca sobrio y natural.
const forest: MantineColorsTuple = [
  '#ecf8f0',
  '#d7efe0',
  '#b1dfc1',
  '#86cf9f',
  '#63c283',
  '#4cb972',
  '#3fb568',
  '#2e9f57',
  '#238d4b',
  '#0f7a3d',
];

// Neutro cálido "ink" para textos y superficies.
const ink: MantineColorsTuple = [
  '#f6f5f3',
  '#e7e5e1',
  '#cbc7bf',
  '#aea79c',
  '#958c7e',
  '#867c6c',
  '#7f7565',
  '#6b6254',
  '#5f5749',
  '#524b3c',
];

// Paleta oscura "slate" (azul-grisácea) — modo oscuro con más carácter que el gris plano.
const dark: MantineColorsTuple = [
  '#c7ccd6',
  '#aeb4c1',
  '#8b93a5',
  '#6b7488',
  '#4d5566',
  '#3b4353',
  '#2d3442',
  '#242a36',
  '#1c212b',
  '#151922',
];

export const theme = createTheme({
  primaryColor: 'forest',
  primaryShade: { light: 6, dark: 4 },
  colors: { forest, ink, dark },
  fontFamily: 'Inter, system-ui, sans-serif',
  defaultRadius: 'lg',
  headings: {
    fontWeight: '800',
  },
  components: {
    Card: {
      defaultProps: {
        withBorder: true,
        shadow: 'sm',
        radius: 'lg',
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
});

export const ALERT_COLOR: Record<AlertSeverity, string> = {
  ok: 'teal',
  warning: 'orange',
  critical: 'red',
};

export const SHELL_TRANSITION = {
  duration: 300,
  timingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const contentMaxWidth = rem(1100);
