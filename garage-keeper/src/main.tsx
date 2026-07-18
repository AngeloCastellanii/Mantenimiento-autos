import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import 'dayjs/locale/es';
import App from './App.tsx';
import { theme } from './app/theme.ts';
import { GarageProvider } from './context/GarageContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <DatesProvider settings={{ locale: 'es' }}>
        <ModalsProvider>
          <Notifications position="top-right" />
          <GarageProvider>
            <App />
          </GarageProvider>
        </ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  </StrictMode>,
);
