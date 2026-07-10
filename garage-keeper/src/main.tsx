import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'dayjs/locale/es';
import App from './App.tsx';
import { theme } from './app/theme.ts';
import { GarageProvider } from './context/GarageContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <DatesProvider settings={{ locale: 'es' }}>
        <Notifications position="top-right" />
        <GarageProvider>
          <App />
        </GarageProvider>
      </DatesProvider>
    </MantineProvider>
  </StrictMode>,
);
