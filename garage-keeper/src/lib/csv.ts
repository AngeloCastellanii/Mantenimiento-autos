import type { Maintenance, Vehicle } from '../types';

function escapeCell(value: string | number | undefined): string {
  const s = String(value ?? '');
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Genera y descarga un CSV del historial de un vehículo. */
export function exportMaintenancesCsv(
  vehicle: Vehicle,
  maintenances: Maintenance[],
  getLabel: (typeId: string) => string,
): void {
  const header = ['Fecha', 'Tipo', 'Kilometraje', 'Costo', 'Mecánico/Taller', 'Notas'];
  const rows = [...maintenances]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((m) =>
      [m.date, getLabel(m.type), m.mileage, m.cost, m.provider, m.notes ?? '']
        .map(escapeCell)
        .join(';'),
    );

  // BOM para que Excel respete acentos.
  const csv = '\uFEFF' + [header.join(';'), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeAlias = vehicle.alias.replace(/[^\w\-]+/g, '_');
  a.href = url;
  a.download = `historial_${safeAlias}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
