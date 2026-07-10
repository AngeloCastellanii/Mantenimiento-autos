import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { ServiceTypesPage } from './pages/ServiceTypesPage';
import { UpcomingPage } from './pages/UpcomingPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { VehiclesPage } from './pages/VehiclesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="vehiculos" element={<VehiclesPage />} />
          <Route path="vehiculos/:id" element={<VehicleDetailPage />} />
          <Route path="gastos" element={<ExpensesPage />} />
          <Route path="proximos" element={<UpcomingPage />} />
          <Route path="tipos-servicio" element={<ServiceTypesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
