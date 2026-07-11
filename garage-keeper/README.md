# CarroServizio

Demo de mantenimiento vehicular — **React + TypeScript + Vite + Mantine v7**.
App instalable (PWA) con modo claro/oscuro y datos persistentes en el navegador.

**Demo en vivo:** https://mantenimiento-autos.vercel.app

## Stack

- **UI:** Mantine (`@mantine/core`, `form`, `dates`, `hooks`, `notifications`, `modals`)
- **Estado:** Context + `useReducer`, persistido en `localStorage`
- **Ruteo:** React Router (code-splitting por ruta con `React.lazy`)
- **Tests:** Vitest + Testing Library

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Build y tests

```bash
pnpm build   # typecheck + build de producción
pnpm test    # pruebas unitarias
```

## Deploy (Vercel)

- Root directory: raíz del repo (usa `vercel.json`) **o** `garage-keeper`
- Install: `pnpm install` · Build: `pnpm build` · Output: `dist`

## Funcionalidades

1. **Inicio** — resumen, accesos rápidos y próximos mantenimientos
2. **Vehículos** — alta/edición, búsqueda y orden
3. **Detalle** — historial por vehículo, alertas y exportación a CSV
4. **Gastos** — filtros por vehículo/tipo, evolución mensual y desglose
5. **Próximos** — alertas por km o tiempo
6. **Tipos de servicio** — renombrar y crear tipos con sus umbrales de alerta

## Arquitectura

- `src/context/GarageContext.tsx` — estado global y acciones
- `src/services/alertEngine.ts` — motor de alertas (km/tiempo)
- `src/services/selectors.ts` — cálculos derivados (gastos, agrupaciones)
- `src/hooks/` — `useServiceTypes`, `useMaintenanceAlerts`, responsivos
- `src/app/theme.ts` — tema y design tokens (paleta `forest`)
