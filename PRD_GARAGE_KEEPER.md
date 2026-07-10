# PRD — GarageKeeper

**Product Requirements Document**  
**Proyecto:** Demo académica — Evaluación 2 · Programación Basada en Componentes  
**Stack:** React + Mantine  
**Versión:** 1.0  
**Fecha:** Julio 2026

---

## 1. Visión del producto

**GarageKeeper** es una aplicación web para registrar vehículos personales y llevar un historial de mantenimientos (cambios de aceite, frenos, llantas, revisiones, etc.). Permite visualizar costos acumulados, consultar el historial por vehículo y recibir alertas cuando un mantenimiento programado se acerca según kilometraje o fecha.

La aplicación funciona como **demo funcional** para la exposición grupal: demuestra el uso profundo de una librería UI (Mantine) en un flujo de datos real, sin depender de un backend externo.

### Problema que resuelve

Los propietarios de vehículos suelen olvidar cuándo fue el último cambio de aceite, cuánto han gastado en mantenimiento o qué servicios tiene pendientes. Las apps genéricas de notas no estructuran esta información de forma útil.

### Propuesta de valor

- Centralizar vehículos y su historial de servicios en un solo lugar.
- Calcular costos totales por vehículo y globalmente.
- Alertar mantenimientos próximos por kilometraje o tiempo.
- Interfaz clara, accesible y construida con componentes profesionales de Mantine.

---

## 2. Objetivos

### Objetivos de producto

| ID | Objetivo | Métrica de éxito |
|----|----------|------------------|
| O1 | Registrar y consultar vehículos | CRUD completo de vehículos operativo |
| O2 | Registrar mantenimientos con contexto | Cada servicio vinculado a un vehículo con km, costo y tipo |
| O3 | Visualizar historial y costos | Totales calculados en tiempo real desde datos locales |
| O4 | Alertar mantenimientos pendientes | Al menos 1 alerta visible cuando un umbral se supera |
| O5 | Cumplir requisitos académicos | 5 tipos de componentes Mantine + demo desplegada en URL pública |

### Objetivos académicos (Evaluación 2)

- Investigar y exponer la arquitectura interna de **Mantine**.
- Demostrar al menos **2 patrones de diseño** con código real.
- Entregar **material audiovisual** + **demo desplegada** + **repositorio Git** compartido.
- Defender la solución en **35 minutos** con demo en vivo y Q&A técnico.

---

## 3. Usuarios y casos de uso

### Usuario principal

**Propietario de vehículo** — persona que administra uno o más autos y quiere llevar control de mantenimientos sin usar hojas de cálculo.

### Casos de uso prioritarios

| ID | Caso de uso | Prioridad |
|----|-------------|-----------|
| CU-01 | Agregar un vehículo (marca, modelo, año, km actual) | Must |
| CU-02 | Ver listado de mis vehículos | Must |
| CU-03 | Registrar un mantenimiento para un vehículo | Must |
| CU-04 | Ver historial de mantenimientos de un vehículo | Must |
| CU-05 | Ver resumen de costos (por vehículo y total) | Must |
| CU-06 | Consultar mantenimientos próximos / vencidos | Must |
| CU-07 | Editar o eliminar vehículo | Should |
| CU-08 | Editar o eliminar mantenimiento | Should |
| CU-09 | Filtrar historial por tipo de servicio o rango de fechas | Could |
| CU-10 | Exportar historial (JSON) | Won't (v1) |

---

## 4. Alcance

### En alcance (v1 — demo académica)

- Aplicación SPA en React con Mantine.
- Persistencia local con `localStorage` (sin backend).
- Datos mock iniciales precargados para la demo.
- Navegación entre secciones principales.
- Formularios con validación.
- Modales, notificaciones toast y estados de carga.
- Despliegue en Vercel (o equivalente gratuito).
- Repositorio Git con acceso al catedrático desde el inicio.

### Fuera de alcance (v1)

- Autenticación de usuarios.
- Backend / API REST.
- Integración con talleres reales.
- Recordatorios push o email.
- App móvil nativa.
- OCR de facturas o subida de imágenes.
- Multi-idioma.

---

## 5. Requisitos funcionales

### RF-01 — Gestión de vehículos

- El usuario puede crear un vehículo con: alias, marca, modelo, año, kilometraje actual, placa (opcional).
- El usuario puede ver una lista/grid de sus vehículos.
- El usuario puede editar y eliminar un vehículo.
- Al eliminar un vehículo, se eliminan sus mantenimientos asociados (con confirmación).

### RF-02 — Gestión de mantenimientos

- El usuario puede registrar un mantenimiento con: tipo, fecha, kilometraje al momento, costo, taller/proveedor, notas.
- Tipos predefinidos: Cambio de aceite, Frenos, Llantas, Batería, Alineación, Revisión general, Otro.
- El usuario puede ver el detalle de un mantenimiento en modal.
- El usuario puede editar y eliminar un mantenimiento.

### RF-03 — Historial y colecciones

- Tabla/lista de mantenimientos por vehículo, ordenable por fecha.
- Estado vacío cuando un vehículo no tiene mantenimientos registrados.
- Filtro por tipo de servicio.

### RF-04 — Alertas de mantenimiento

- Reglas configurables por tipo (valores por defecto en v1):
  - **Cambio de aceite:** cada 5 000 km o 6 meses desde el último.
  - **Frenos:** cada 30 000 km.
  - **Revisión general:** cada 12 meses.
- Panel "Próximos mantenimientos" con alertas visuales (badge/warning).
- Modal o sección con detalle de qué está por vencer y por qué.

### RF-05 — Resumen y métricas

- Card con costo total de mantenimiento por vehículo.
- Card con costo global de todos los vehículos.
- Contador de servicios registrados.
- Kilometraje actual vs último servicio por tipo.

### RF-06 — Navegación

- Layout persistente con sidebar.
- Secciones: Inicio (dashboard), Mis vehículos, Próximos mantenimientos.
- Breadcrumbs en vistas de detalle (Inicio → Vehículos → Toyota Corolla → Historial).

---

## 6. Requisitos no funcionales

| ID | Requisito | Criterio |
|----|-----------|----------|
| RNF-01 | Rendimiento | Carga inicial < 3 s en conexión media |
| RNF-02 | Responsividad | usable en desktop y tablet (≥ 768px) |
| RNF-03 | Accesibilidad | Componentes Mantine con soporte WAI-ARIA; labels en formularios |
| RNF-04 | Persistencia | Datos sobreviven recarga de página vía localStorage |
| RNF-05 | Despliegue | URL pública accesible sin localhost |
| RNF-06 | Mantenibilidad | Código modular por features/páginas |
| RNF-07 | Instalación | Setup según documentación oficial de Mantine con pnpm |

---

## 7. Mapeo a componentes Mantine (requisito académico)

La demo debe integrar **al menos 5 tipos diferenciados** de componentes:

| Tipo académico | Implementación en GarageKeeper |
|----------------|-------------------------------|
| Captura de datos | Formularios vehículo y mantenimiento (`TextInput`, `NumberInput`, `Select`, `DatePickerInput`, `@mantine/form`) |
| Disposición estructural | Dashboard con `Grid`, `Card`, `SimpleGrid`, `Stack`, `Group` |
| Navegación | `AppShell` + navbar lateral, `Breadcrumbs`, `NavLink` |
| Colecciones | `Table` de mantenimientos con estado vacío (`Text` + icono) |
| Capas flotantes | `Modal` (detalle/edición), `notifications` (toast), `Loader` / `Skeleton` |

---

## 8. Flujo de demo en vivo (10 minutos)

Secuencia sugerida para la exposición:

1. **Inicio** — Mostrar dashboard con 1 vehículo precargado y alerta de aceite próximo.
2. **Agregar vehículo** — Formulario con validación; toast de éxito.
3. **Registrar mantenimiento** — Cambio de aceite con km y costo; tabla actualizada.
4. **Historial** — Filtrar por tipo; abrir detalle en modal.
5. **Alertas** — Ir a "Próximos mantenimientos"; explicar lógica de umbrales.
6. **Eliminar** — Confirmar eliminación con modal; toast de confirmación.
7. **Persistencia** — Recargar página; datos siguen presentes (localStorage).

---

## 9. Criterios de aceptación (Definition of Done)

- [ ] App desplegada en URL pública funcional.
- [ ] Repositorio Git con los 4 integrantes y acceso al catedrático.
- [ ] CRUD de vehículos y mantenimientos operativo.
- [ ] 5 tipos de componentes Mantine integrados y visibles en la demo.
- [ ] Formularios con validación (campos requeridos, km ≥ 0, costo ≥ 0).
- [ ] Tabla con estado vacío cuando no hay datos.
- [ ] Al menos una alerta de mantenimiento calculada dinámicamente.
- [ ] Modales, toasts y loader implementados.
- [ ] Datos persisten en localStorage.
- [ ] Sin TODOs críticos en el código entregado.
- [ ] Presentación cubre los 6 núcleos temáticos de la evaluación.

---

## 10. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Otro grupo elige Mantine | Medio | Confirmar con catedrático; tener MUI como plan B |
| Complejidad de fechas/km | Medio | Reglas simples y documentadas; usar `dayjs` |
| Scope creep | Alto | Respetar alcance v1; postergar features "Could" |
| Un integrante domina todo el código | Alto | Reparto por módulos desde el PRD (ver ESPECIFICACION) |
| Demo falla en vivo | Alto | URL de respaldo; datos mock precargados; ensayo previo |

---

## 11. Reparto sugerido del equipo (4 integrantes)

| Integrante | Módulo | Entregables |
|------------|--------|-------------|
| 1 | Layout, navegación, tema Mantine | `AppShell`, sidebar, breadcrumbs, `MantineProvider` |
| 2 | Vehículos | Listado, formulario CRUD, cards |
| 3 | Mantenimientos | Formulario, tabla, modal detalle, filtros |
| 4 | Dashboard, alertas, deploy | Métricas, lógica de umbrales, Vercel, repo Git |

**Todos** deben dominar arquitectura de Mantine y el código de la demo para el Q&A.

---

## 12. Entregables del proyecto

| Entregable | Descripción |
|------------|-------------|
| Aplicación demo | GarageKeeper desplegada |
| Código fuente | Repo Git compartido |
| Material audiovisual | Diapositivas con 6 núcleos temáticos |
| Defensa oral | 35 min: exposición + demo + Q&A |

---

## 13. Glosario

| Término | Definición |
|---------|------------|
| Mantenimiento | Servicio realizado al vehículo (aceite, frenos, etc.) |
| Umbral | Límite de km o tiempo para disparar una alerta |
| SPA | Single Page Application |
| PRD | Product Requirements Document |
| Token | Variable de diseño de Mantine (colores, spacing, etc.) |

---

*Documento de planificación académica — GarageKeeper · Trimestre 2026B*
