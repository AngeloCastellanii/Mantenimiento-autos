# Evaluación 2 — Exposición grupal de librería UI

**Evaluación Sumativa 2 · 25% · Modalidad en grupos de 4** Asignatura: Programación Basada en Componentes Catedrático: Ing. Victor Kneider Período académico: Trimestre 2026B

Documento de requerimientos y rúbrica de evaluación de la segunda evaluación sumativa. **Librería propuesta por los alumnos, aplicación demo construida en el framework nativo de la librería y defensa oral apoyada en material audiovisual.**

---

## 1\. Resumen ejecutivo

La Evaluación 2 es la evaluación sumativa de la **Unidad II** y representa el **25% de la calificación final** de la asignatura. El grupo investiga en profundidad una librería de componentes UI madura del ecosistema profesional, construye una aplicación demo con esa librería y expone los hallazgos ante la clase en una sesión defendida con Q\&A técnico.

**Principio rector:** la elección del framework basado en componentes sobre el cual se construyen sistemas reales no es ingenua. El ecosistema ofrece librerías UI maduras que encarnan decisiones técnicas profesionales (Atomic Design, Compound Components, Headless, design tokens). Comprender esas decisiones —y testearlas críticamente— es lo que permite al ingeniero seleccionar la herramienta correcta para cada producto. La exposición debe demostrar una comprensión absoluta de la arquitectura subyacente y las decisiones de diseño tomadas por los creadores de la herramienta.

### Tipo de evaluación y entregables

Construcción técnica \+ defensa oral. Los elementos de entrega consisten en el **material audiovisual (presentación/diapositivas)** y la **aplicación DEMO funcional** con su respectivo código fuente. La investigación técnica, el análisis estructural y el criterio profesional deben quedar plasmados de forma rigurosa a través del material audiovisual y el discurso técnico durante la defensa.

### Datos clave

| Campo | Valor |
| :---- | :---- |
| Modalidad | Grupos (4 estudiantes) |
| Entregas requeridas | Material audiovisual (Diapositivas) \+ Aplicación DEMO desplegada |
| Estructura de la sesión | Exposición oral \+ demo en vivo \+ Q\&A técnico |
| Tiempo de presentación | 35 minutos por grupo |

---

## 2\. Marco técnico

### Sobre la elección de librería

Cada grupo debe proponer y elegir libremente la librería de componentes UI sobre la cual investigará y construirá su demo. Los alumnos deben realizar su propia investigación preliminar para proponer una herramienta que sea madura y ampliamente adoptada en el ecosistema profesional.

Por motivos de coordinación académica y para asegurar que la clase se exponga a la mayor variedad posible de filosofías de desarrollo, **cada grupo debe proponer y elegir una librería distinta**.

### Sobre el framework de la aplicación demo

La aplicación demo se construye en el **framework de preferencia del grupo**, siempre y cuando sea el entorno nativo para el cual la librería fue diseñada u optimizada (React, Vue, Svelte, Angular, etc.). No se permite el uso de abstracciones ajenas o adaptaciones artificiales; el grupo debe experimentar el comportamiento de la librería interactuando directamente con el estado, el ciclo de vida y el paradigma natural de su framework destino.

### Restricciones técnicas de la DEMO

* La aplicación debe estar **desplegada en una URL pública** (Vercel, Netlify, GitHub Pages, Cloudflare Pages u otro servicio gratuito equivalente). No se aceptan demostraciones que corran exclusivamente en localhost.  
* El código fuente debe vivir en un **repositorio Git compartido** entre los cuatro integrantes. El catedrático debe tener acceso de lectura desde el inicio del desarrollo.  
* La instalación y configuración de la librería deben realizarse **siguiendo las guías oficiales**, demostrando un control total sobre la inyección de estilos y la inicialización del entorno.

---

## 3\. Contenido obligatorio de la exposición

La presentación y el material audiovisual constituyen los vehículos principales para la transmisión de la investigación realizada. La estructura de la defensa debe abordar obligatoriamente los siguientes núcleos temáticos:

### Núcleo 1: Decisiones técnicas de estructura de los creadores

El grupo debe desglosar la arquitectura interna de la librería tal como fue concebida por sus autores:

* Organización del código base (monorrepo, paquetes independientes, exportaciones atómicas).  
* Estructuración de la inyección y el aislamiento de estilos (CSS-in-JS, CSS Modules, utilitarios puros, o soluciones *headless*).

### Núcleo 2: Historia, contexto y filosofía de diseño

* Origen de la librería: creadores, empresas o comunidades que la respaldan y el problema técnico concreto que buscaba resolver.  
* Principios de ingeniería rectores: qué prioriza la herramienta y qué queda fuera deliberadamente del alcance del proyecto.

### Núcleo 3: Patrones de diseño aplicados

* Identificación y demostración técnica (mediante fragmentos de código fuente) de al menos **dos patrones de arquitectura de componentes** estudiados en clase (ej: *Compound Components*, *Composition over Inheritance*, *Atomic Design*, *Headless Primitives*, etc.).

### Núcleo 4: Operatividad y cobertura técnica

* Guía de instalación y configuración reproducible.  
* Recorrido crítico por el catálogo de componentes (layout, navegación, formularios, overlays y respuestas de estado), identificando fortalezas y carencias.  
* Mecanismos de personalización (*design tokens*, temas) y cumplimiento de estándares de accesibilidad (WAI-ARIA).

### Núcleo 5: Estrategia de testing de la librería

* Análisis de la infraestructura de pruebas empleada por los creadores (unitarias, regresión visual, CI).  
* Evaluación de la *testeabilidad* real al construir aplicaciones sobre esta librería.

### Núcleo 6: Posicionamiento crítico en el ecosistema

* Análisis comparativo frente a competidores directos y fundamentación técnica sobre cuándo adoptar esta solución y cuándo descartarla profesionalmente.

---

## 4\. Estructura y alcance de la DEMO

La aplicación demo es el escenario para validar la investigación.

Se requiere el desarrollo de una interfaz interactiva que justifique el uso de componentes complejos y flujos de datos reales (ej: paneles administrativos de analítica, flujos de e-commerce con gestión de carrito, gestores Kanban de proyectos, o sistemas de reservaciones dinámicas). La demo debe integrar **al menos cinco tipos de componentes diferenciados** de la librería:

1. **Captura de datos:** Formularios con validaciones y selectores enriquecidos.  
2. **Disposición estructural:** Grillas, *cards* o contenedores complejos.  
3. **Navegación:** Barras laterales, menús dinámicos o *breadcrumbs*.  
4. **Colecciones:** Tablas dinámicas o listas con estados vacíos.  
5. **Capas flotantes:** Modales, *toasts* o indicadores de carga.

---

## 5\. Estructura de evaluación y defensa

### Cronograma de presentación (35 minutos por grupo)

| Segmento | Tiempo |
| :---- | :---- |
| Apertura, contexto, arquitectura de los creadores y filosofía | 10 min |
| Patrones de diseño, operativa, customización y testing | 10 min |
| Demo interactiva en vivo (URL pública) | 10 min |
| Conclusión, posicionamiento crítico y Q\&A | 5 min |

---

## 6\. Rúbrica de evaluación

*(La rúbrica permanece con los mismos criterios y ponderación de 20 puntos, evaluando la profundidad técnica de la exposición oral, la calidad del material audiovisual y la excelencia funcional de la demo desplegada).*

Rúbrica institucional basada en escala Likert (0-4 puntos por criterio). Calificación máxima total: 20 puntos.

| Criterio | 0 — No cumple | 1 — Deficiente | 2 — Aceptable | 3 — Bueno | 4 — Excelente | Pts |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **1\. Comprensión de la arquitectura y estructura de los creadores***Evaluación del Núcleo 1: Desglose de empaquetamiento, monorrepos,bundle size e inyección de estilos.* | No se menciona la estructura interna de la librería. Se limita a describir el uso superficial sin entender cómo fue construida por sus autores. | Mención vaga de la estructura sin bases técnicas. Confunde los conceptos de empaquetamiento o asume características de estilos erróneas. | Identifica la organización del código y el manejo de estilos de forma global, pero carece de un análisis profundo sobre el impacto técnico de estas decisiones. | Explica con claridad las decisiones estructurales de los creadores (paquetes, bundle size, etc.) y argumenta correctamente cómo funciona el aislamiento de estilos. | Demuestra un dominio absoluto de la arquitectura interna de la librería. Desglosa con rigor técnico las ventajas y costos de las decisiones estructurales de los creadores y su impacto directo en producción. | \_\_ |
| **2\. Rigor de la investigación técnica en el material audiovisual***Evaluación de los Núcleos 2, 3, 4 y 6 en las diapositivas: historia, patrones de diseño con código, tokens y ecosistema.* | El material audiovisual es inexistente o carece por completo de contenido técnico, limitándose a copiar frases del README oficial. | El material cubre de forma superficial los núcleos. Identifica patrones de diseño de manera errónea o no incluye fragmentos de código que los respalden. | Las diapositivas contienen los núcleos obligatorios. Identifica patrones de forma correcta pero la argumentación sobre tokens, accesibilidad o competidores es esquemática. | Buena síntesis de la investigación en las diapositivas. Patrones demostrados con snippets de código reales. Análisis claro de la filosofía de diseño y posicionamiento en el mercado. | Material audiovisual de nivel profesional. Jerarquía visual impecable que plasma una investigación profunda: contrastes de fuentes, análisis crítico del ecosistema y demostraciones explícitas de código de la librería. | \_\_ |
| **3\. Análisis crítico de la estrategia de testing***Evaluación del Núcleo 5: Infraestructura de pruebas interna y testeabilidad para el desarrollador adoptante.* | Omisión total del análisis de testing en el material y en el discurso oral, o uso de definiciones teóricas abstractas. | Nombra las herramientas que usa la librería pero demuestra desconocimiento sobre cómo operan o qué cubren. Sin reflexión sobre la testeabilidad. | Describe de forma general el entorno de pruebas de la librería. La reflexión sobre las ventajas o dificultades de testear una app con esta librería es muy básica. | Análisis claro de las suites de prueba de la librería (CI, regresión visual, etc.). Reflexión fundamentada sobre el impacto técnico y costes de testing para un equipo que la adopta. | Análisis comparativo maduro y profundo. Delimita con precisión el alcance de los tests internos frente a las responsabilidades del adoptante. Conecta con las buenas prácticas de validación automatizada. | \_\_ |
| **4\. Complejidad técnica y calidad de la aplicación DEMO***Evaluación de la Sección 4: Despliegue público, repositorio, ausencia de TODO lists, uso de 5+ componentes avanzados.* | No hay demo o no está desplegada públicamente. El código no es accesible o la aplicación presenta fallos críticos que impiden su uso. | La aplicación funciona pero es de baja complejidad (como una lista de tareas pendientes) o integra menos componentes de la librería que los requeridos. | Demo interactiva estable que cumple la cuota mínima de 5 componentes avanzados de la librería. Los flujos de la aplicación son simples pero operativos. | Aplicación de complejidad adecuada bien estructurada en el framework elegido. Uso justificado de los componentes avanzados de la librería. Manejo correcto de estados y estilos. | Software ejemplar. Arquitectura limpia y modular que aprovecha al máximo el paradigma del framework nativo. Interfaz fluida, manejo impecable de datos, diseño cuidado y consideración de accesibilidad semántica. | \_\_ |
| **5\. Cohesión del equipo y defensa técnica en Q\&A***Distribución balanceada de la oratoria, dominio del tiempo y solvencia en las respuestas ante la cátedra.* | Participación exclusiva de un miembro del grupo. Desconocimiento general de los demás integrantes ante preguntas técnicas básicas. | Distribución de la palabra desequilibrada. Respuestas vagas o conceptualmente erróneas ante los cuestionamientos del catedrático o de la clase. | Distribución aceptable del discurso. El grupo responde bien las preguntas predecibles sobre el uso, pero titubea ante preguntas sobre la arquitectura interna. | Coordinación grupal evidente que respeta los tiempos de exposición. Responden con seguridad la mayoría de las preguntas técnicas demostrando dominio del código desarrollado. | Sinergia grupal perfecta. Todos los integrantes evidencian un manejo técnico integral tanto de la demo como de la arquitectura de la librería. Respuestas precisas que defienden con argumentos de ingeniería cada decisión tomada. | \_\_ |
|  |  |  |  |  | **TOTAL** | **\_\_ / 20** |

---

*Documento de uso académico — Universidad Rafael Urdaneta · Facultad de Ingeniería · Escuela de Ingeniería de Computación · Trimestre 2026B*  
