# Especificación técnica — GarageKeeper

**Documento de detalle de implementación**  
**Complemento de:** `PRD_GARAGE_KEEPER.md`  
**Stack:** React 19 · Vite · TypeScript · Mantine v7 · React Router · pnpm  
**Versión:** 1.0

---

## 1. Resumen técnico

GarageKeeper es una **SPA** sin backend. El estado de la aplicación vive en React Context (o Zustand) y se persiste en `localStorage`. La UI se construye exclusivamente con **Mantine v7** siguiendo la guía oficial de instalación.

### Decisiones de arquitectura

| Decisión | Elección | Justificación |
|----------|----------|---------------|
| Framework | React 19 + Vite | Entorno nativo de Mantine; build rápido |
| Librería UI | Mantine v7 | Cumple requisitos académicos; catálogo completo |
| Routing | React Router v7 | Navegación entre secciones y detalle de vehículo |
| Estado | React Context + useReducer | Suficiente para demo; sin dependencia extra |
| Persistencia | localStorage | Sin backend; datos sobreviven reload |
| Fechas | dayjs | Requerido por Mantine DatePicker |
| Package manager | pnpm | Estándar del equipo |
| Deploy | Vercel | Gratuito, URL pública, integración Git |

---

## 2. Estructura de carpetas propuesta

```
Demo/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx                 # Router + providers
│   │   └── theme.ts                # Tema Mantine (tokens)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx       # AppShell + sidebar
│   │   │   └── PageHeader.tsx      # Título + breadcrumbs
│   │   ├── vehicles/
│   │   │   ├── VehicleCard.tsx
│   │   │   ├── VehicleForm.tsx
│   │   │   └── VehicleGrid.tsx
│   │   ├── maintenance/
│   │   │   ├── MaintenanceForm.tsx
│   │   │   ├── MaintenanceTable.tsx
│   │   │   ├── MaintenanceDetailModal.tsx
│   │   │   └── EmptyMaintenanceState.tsx
│   │   └── dashboard/
│   │       ├── StatsCards.tsx
│   │       └── UpcomingAlerts.tsx
│   ├── context/
│   │   └── GarageContext.tsx       # Estado global + acciones
│   ├── hooks/
│   │   ├── useGarage.ts
│   │   └── useMaintenanceAlerts.ts
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── VehiclesPage.tsx
│   │   ├── VehicleDetailPage.tsx
│   │   └── UpcomingPage.tsx
│   ├── services/
│   │   ├── storage.ts              # localStorage read/write
│   │   └── alertEngine.ts          # Lógica de umbrales
│   ├── types/
│   │   └── index.ts                # Vehicle, Maintenance, Alert
│   ├── data/
│   │   └── seed.ts                 # Datos mock iniciales
│   └── main.tsx
├── PRD_GARAGE_KEEPER.md
├── ESPECIFICACION_GARAGE_KEEPER.md
├── REQUERIMIENTOS_EXPO.md
├── package.json
├── vite.config.ts
└── vercel.json
```

---

## 3. Modelo de datos

### 3.1 Entidad `Vehicle`

```typescript
interface Vehicle {
  id: string;              // uuid
  alias: string;           // "Mi Corolla"
  brand: string;           // "Toyota"
  model: string;           // "Corolla"
  year: number;            // 2019
  currentMileage: number;  // km actuales
  plate?: string;          // opcional
  createdAt: string;       // ISO date
}
```

### 3.2 Entidad `Maintenance`

```typescript
type MaintenanceType =
  | 'oil_change'
  | 'brakes'
  | 'tires'
  | 'battery'
  | 'alignment'
  | 'general_inspection'
  | 'other';

interface Maintenance {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  date: string;            // ISO date
  mileage: number;         // km al momento del servicio
  cost: number;            // en moneda local (USD o VES, definir en UI)
  provider: string;        // taller
  notes?: string;
  createdAt: string;
}
```

### 3.3 Entidad `MaintenanceAlert` (calculada, no persistida)

```typescript
type AlertSeverity = 'ok' | 'warning' | 'critical';

interface MaintenanceAlert {
  vehicleId: string;
  vehicleAlias: string;
  type: MaintenanceType;
  severity: AlertSeverity;
  message: string;         // "Cambio de aceite en ~800 km"
  dueByMileage?: number;   // km restantes
  dueByDate?: string;      // fecha límite estimada
}
```

### 3.4 Estado global `GarageState`

```typescript
interface GarageState {
  vehicles: Vehicle[];
  maintenances: Maintenance[];
}
```

**Clave localStorage:** `garage-keeper-v1`

---

## 4. Reglas de negocio — Motor de alertas

### 4.1 Umbrales por defecto (v1)

| Tipo | Intervalo km | Intervalo tiempo |
|------|-------------|------------------|
| `oil_change` | 5 000 km | 6 meses |
| `brakes` | 30 000 km | — |
| `tires` | 40 000 km | — |
| `battery` | — | 24 meses |
| `alignment` | 15 000 km | — |
| `general_inspection` | — | 12 meses |
| `other` | — | — (sin alerta automática) |

### 4.2 Algoritmo de alerta (por vehículo y tipo)

```
1. Obtener último mantenimiento del tipo T para el vehículo V
2. Si no existe:
   → severity: warning
   → message: "Sin registro de {T}. Se recomienda programar."
3. Si existe con fecha F y km K:
   a. kmRestantes = (K + umbralKm) - V.currentMileage
   b. fechaLimite = F + umbralMeses
   c. Si kmRestantes <= 0 OR hoy >= fechaLimite → critical
   d. Si kmRestantes <= 1000 OR faltan <= 30 días → warning
   e. Else → ok (no mostrar en panel principal)
```

### 4.3 Validaciones de formulario

**Vehículo:**

| Campo | Regla |
|-------|-------|
| alias | requerido, 2–40 caracteres |
| brand | requerido |
| model | requerido |
| year | requerido, 1980 – año actual + 1 |
| currentMileage | requerido, entero ≥ 0 |
| plate | opcional, máx 15 caracteres |

**Mantenimiento:**

| Campo | Regla |
|-------|-------|
| type | requerido |
| date | requerido, no futura |
| mileage | requerido, entero ≥ 0 |
| cost | requerido, número ≥ 0 |
| provider | requerido, 2–80 caracteres |
| notes | opcional, máx 500 caracteres |

**Regla cruzada:** `mileage` del mantenimiento no debería ser menor que el del mantenimiento anterior del mismo vehículo (warning visual, no bloqueo en v1).

---

## 5. Rutas y pantallas

### 5.1 Mapa de rutas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | DashboardPage | Resumen, stats, alertas destacadas |
| `/vehiculos` | VehiclesPage | Grid de vehículos + botón agregar |
| `/vehiculos/:id` | VehicleDetailPage | Detalle, tabla historial, acciones |
| `/proximos` | UpcomingPage | Lista completa de alertas |

### 5.2 Wireframes textuales

#### Dashboard (`/`)

```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Inicio                                    │
│            │  ─────────────────────────────────────     │
│  Inicio    │  [Card: Total gastado] [Card: Vehículos]   │
│  Vehículos │  [Card: Servicios]   [Card: Alertas activas]│
│  Próximos  │                                             │
│            │  Próximos mantenimientos                    │
│            │  ┌─────────────────────────────────────┐   │
│            │  │ ⚠ Corolla — Aceite en ~800 km      │   │
│            │  │ ⚠ Civic — Revisión vence en 12 días │   │
│            │  └─────────────────────────────────────┘   │
│            │  Mis vehículos (preview cards)              │
└─────────────────────────────────────────────────────────┘
```

#### Vehículos (`/vehiculos`)

```
┌─────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Mis vehículos          [+ Agregar]        │
│            │  ─────────────────────────────────────     │
│            │  ┌──────────┐  ┌──────────┐                │
│            │  │ Corolla  │  │ Civic    │                │
│            │  │ 85.000km │  │ 42.000km │                │
│            │  │ $1.240   │  │ $680     │                │
│            │  └──────────┘  └──────────┘                │
└─────────────────────────────────────────────────────────┘
```

#### Detalle vehículo (`/vehiculos/:id`)

```
┌─────────────────────────────────────────────────────────┐
│ Breadcrumb: Inicio > Vehículos > Toyota Corolla         │
│                                                         │
│ Toyota Corolla 2019 · 85.000 km    [Editar] [Eliminar]  │
│ Total mantenimiento: $1.240                             │
│                                                         │
│ [+ Registrar mantenimiento]   Filtro: [Tipo ▼]          │
│ ┌───────────────────────────────────────────────────┐   │
│ │ Fecha    │ Tipo      │ Km    │ Costo │ Taller    │   │
│ │ 01/03/26 │ Aceite    │ 80000 │ $45   │ AutoFast  │   │
│ │ 15/11/25 │ Frenos    │ 75000 │ $320  │ Frenos+   │   │
│ └───────────────────────────────────────────────────┘   │
│ (o estado vacío si no hay registros)                    │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Componentes Mantine — Inventario detallado

### 6.1 Layout y navegación

| Componente Mantine | Uso |
|--------------------|-----|
| `AppShell` | Layout principal con navbar y main |
| `AppShell.Navbar` | Sidebar persistente |
| `AppShell.Main` | Contenido de cada página |
| `NavLink` | Items del menú con iconos Tabler |
| `Breadcrumbs` | Navegación contextual en detalle |
| `Container` | Ancho máximo del contenido |
| `Title`, `Text` | Tipografía |

### 6.2 Captura de datos

| Componente Mantine | Uso |
|--------------------|-----|
| `TextInput` | alias, marca, modelo, placa, taller |
| `NumberInput` | año, km, costo |
| `Select` | tipo de mantenimiento |
| `DatePickerInput` | fecha del servicio |
| `Textarea` | notas |
| `@mantine/form` | validación y estado del formulario |
| `Button` | submit, cancelar |

### 6.3 Disposición estructural

| Componente Mantine | Uso |
|--------------------|-----|
| `Grid` / `Grid.Col` | Dashboard y listado responsive |
| `Card` | vehículos, métricas, alertas |
| `Stack` / `Group` | agrupación vertical/horizontal |
| `Badge` | tipo de servicio, severidad de alerta |
| `ThemeIcon` | iconos en cards |

### 6.4 Colecciones

| Componente Mantine | Uso |
|--------------------|-----|
| `Table` | historial de mantenimientos |
| `Table.Tr`, `Table.Td` | filas con click → modal |
| `Select` | filtro por tipo en tabla |
| Estado vacío custom | `Stack` + `ThemeIcon` + `Text` + `Button` |

### 6.5 Capas flotantes

| Componente Mantine | Uso |
|--------------------|-----|
| `Modal` | crear/editar vehículo, detalle mantenimiento, confirmar eliminar |
| `notifications.show()` | toast éxito/error |
| `Loader` | overlay al guardar (simulado 300ms) |
| `Skeleton` | carga inicial opcional |

### 6.6 Paquetes Mantine a instalar

```bash
pnpm add @mantine/core @mantine/hooks @mantine/form @mantine/dates @mantine/notifications dayjs
pnpm add react-router-dom
pnpm add @tabler/icons-react
```

PostCSS (según docs oficiales Mantine v7):

```bash
pnpm add -D postcss postcss-preset-mantine postcss-simple-vars
```

---

## 7. Tema y design tokens

Archivo `src/app/theme.ts`:

```typescript
import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter, system-ui, sans-serif',
  defaultRadius: 'md',
  colors: {
    // opcional: paleta personalizada para alertas
  },
});
```

### Tokens relevantes para la expo

| Token | Uso en GarageKeeper |
|-------|---------------------|
| `theme.colors.blue` | Acciones primarias |
| `theme.colors.orange` | Alertas warning |
| `theme.colors.red` | Alertas critical |
| `theme.spacing` | Padding de cards y secciones |
| `theme.radius` | Bordes de cards y modales |
| `theme.fontSizes` | Jerarquía tipográfica |

---

## 8. Flujos de interacción

### 8.1 Crear vehículo

```
Usuario click "+ Agregar vehículo"
  → Modal con VehicleForm
  → Validación @mantine/form
  → dispatch ADD_VEHICLE
  → storage.save(state)
  → notifications.show({ title: 'Vehículo agregado', color: 'green' })
  → Modal cierra, grid actualiza
```

### 8.2 Registrar mantenimiento

```
Usuario en /vehiculos/:id click "+ Registrar mantenimiento"
  → Modal con MaintenanceForm (vehicleId preseleccionado)
  → Validación
  → Si vehicle.currentMileage < maintenance.mileage:
      → actualizar vehicle.currentMileage
  → dispatch ADD_MAINTENANCE
  → storage.save(state)
  → toast éxito
  → tabla actualiza, stats recalculan, alertas recalculan
```

### 8.3 Eliminar vehículo

```
Usuario click "Eliminar"
  → Modal confirmación: "Se eliminarán X mantenimientos"
  → Confirmar
  → dispatch DELETE_VEHICLE (cascade maintenances)
  → redirect a /vehiculos
  → toast
```

### 8.4 Ver detalle de mantenimiento

```
Usuario click fila en tabla
  → MaintenanceDetailModal abierto
  → Muestra todos los campos + botones Editar / Eliminar
```

---

## 9. Datos mock iniciales (seed)

Precargar al primer arranque si localStorage está vacío:

**Vehículo 1:** Toyota Corolla 2019, 85 000 km, alias "Mi Corolla"  
**Vehículo 2:** Honda Civic 2021, 42 000 km, alias "Civic Familiar"

**Mantenimientos Corolla:**
- Aceite — 01/09/2025 — 80 000 km — $45 — AutoFast
- Frenos — 15/03/2025 — 75 000 km — $320 — Frenos+

**Mantenimientos Civic:**
- Aceite — 10/01/2026 — 40 000 km — $50 — Lubricentro Central

Esto garantiza que en la demo siempre haya alertas visibles (Corolla aceite cerca de los 5 000 km).

---

## 10. Cálculos derivados

### Costo total por vehículo

```
totalCost(vehicleId) = sum(maintenances where vehicleId).cost
```

### Costo global

```
globalCost = sum(all maintenances).cost
```

### Servicios por vehículo

```
count(vehicleId) = maintenances.filter(m => m.vehicleId === id).length
```

Todos los cálculos son **selectores derivados** en el hook `useGarage`, no se persisten.

---

## 11. Accesibilidad

- Todos los `TextInput` / `Select` con `label` y `description` donde aplique.
- Modales con `title` y foco atrapado (Mantine lo maneja).
- Colores de alerta con texto alternativo (no solo color: incluir icono + texto).
- `aria-label` en botones solo con icono.
- Contraste suficiente usando paleta por defecto de Mantine.

---

## 12. Despliegue

### Vercel

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- Conectar repo GitHub → Vercel.
- Build: `pnpm build`
- Output: `dist`
- URL pública para la exposición.

---

## 13. Material para la exposición (vinculado a la demo)

### Patrones de diseño a demostrar con código Mantine

1. **Compound Components** — `Tabs`, `Menu` o `Accordion` en alguna sección (ej. detalle vehículo con tabs: Historial | Alertas | Info).
2. **Composition over Inheritance** — Layout compuesto con `Stack`/`Group`/`Card` sin clases heredadas.

### Núcleos académicos — qué mostrar en diapositivas

| Núcleo | Contenido específico de GarageKeeper + Mantine |
|--------|-----------------------------------------------|
| 1. Arquitectura | Monorepo `@mantine/*`, CSS Modules, `MantineProvider` |
| 2. Filosofía | Por qué Mantine vs MUI para este tipo de app |
| 3. Patrones | Compound en Tabs; composición en AppShell |
| 4. Operatividad | Recorrido por form, table, modal, notifications |
| 5. Testing | CI del repo Mantine; cómo testearían VehicleForm con RTL |
| 6. Ecosistema | Comparar con MUI, Chakra, Ant Design |

---

## 14. Plan de implementación por fases

### Fase 1 — Setup (1–2 días)
- [ ] Vite + React + TS + Mantine + Router
- [ ] Tema, AppShell, rutas vacías
- [ ] Context + localStorage + seed

### Fase 2 — Vehículos (2–3 días)
- [ ] VehicleCard, VehicleGrid, VehicleForm
- [ ] CRUD completo con modales y toasts

### Fase 3 — Mantenimientos (2–3 días)
- [ ] MaintenanceForm, MaintenanceTable
- [ ] Detalle modal, filtros, estado vacío

### Fase 4 — Dashboard y alertas (2 días)
- [ ] StatsCards, alertEngine, UpcomingPage

### Fase 5 — Pulido y deploy (1–2 días)
- [ ] Responsive, accesibilidad, loader
- [ ] Deploy Vercel, ensayo demo 10 min

**Estimación total:** 8–12 días de trabajo distribuido en 4 personas.

---

## 15. Checklist de calidad pre-entrega

- [ ] `pnpm build` sin errores
- [ ] `pnpm lint` sin errores críticos
- [ ] Todas las rutas funcionan al recargar (SPA rewrite)
- [ ] localStorage funciona tras refresh
- [ ] Formularios muestran errores de validación
- [ ] Eliminar pide confirmación
- [ ] Demo ensayada en ≤ 10 minutos
- [ ] Cada integrante puede explicar su módulo y 1 núcleo de Mantine

---

*Especificación técnica v1.0 — GarageKeeper · URU · Trimestre 2026B*
