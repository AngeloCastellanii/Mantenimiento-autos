import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import { AppLayout } from './components/layout/AppLayout';

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const ExpensesPage = lazy(() =>
  import('./pages/ExpensesPage').then((m) => ({ default: m.ExpensesPage })),
);
const ServiceTypesPage = lazy(() =>
  import('./pages/ServiceTypesPage').then((m) => ({
    default: m.ServiceTypesPage,
  })),
);
const UpcomingPage = lazy(() =>
  import('./pages/UpcomingPage').then((m) => ({ default: m.UpcomingPage })),
);
const VehicleDetailPage = lazy(() =>
  import('./pages/VehicleDetailPage').then((m) => ({
    default: m.VehicleDetailPage,
  })),
);
const VehiclesPage = lazy(() =>
  import('./pages/VehiclesPage').then((m) => ({ default: m.VehiclesPage })),
);

function RouteFallback() {
  return (
    <Center mih={240}>
      <Loader />
    </Center>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<RouteFallback />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="vehiculos"
            element={
              <Suspense fallback={<RouteFallback />}>
                <VehiclesPage />
              </Suspense>
            }
          />
          <Route
            path="vehiculos/:id"
            element={
              <Suspense fallback={<RouteFallback />}>
                <VehicleDetailPage />
              </Suspense>
            }
          />
          <Route
            path="gastos"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ExpensesPage />
              </Suspense>
            }
          />
          <Route
            path="proximos"
            element={
              <Suspense fallback={<RouteFallback />}>
                <UpcomingPage />
              </Suspense>
            }
          />
          <Route
            path="tipos-servicio"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ServiceTypesPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
