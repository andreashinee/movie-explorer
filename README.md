# KnoxTest — Media Library Tree Explorer

Una aplicación Angular para explorar y gestionar una biblioteca de títulos, temporadas y episodios en una interfaz de árbol interactiva.

An Angular app for browsing and managing a library of titles, seasons, and episodes in an interactive tree interface.

---

## 🇬🇧 English

### Overview

KnoxTest is a single-page application built with **Angular 20.3** (standalone, zoneless change detection, `OnPush` strategy). It renders a hierarchical library of media content using a tree UI.

### Features

- **Tree navigation** – Browse titles (top-level), seasons, and episodes in a collapsible tree panel.
- **Search** – Filter the tree by name; non-matching nodes are hidden.
- **Detail panel** – Click any node to view its hero banner, metadata (season count, episode count, descriptions), and child list.
- **Edit mode** – Toggle edit mode to **add**, **rename**, or **delete** nodes.
- **Add modal** – Choose a name, number, icon, and description when creating new titles, seasons, or episodes.
- **Confirm dialogs** – Delete actions require confirmation.
- **Image placeholders** – Auto-generated via picsum.photos; graceful fallback on error.
- **Accessibility** – ARIA tree roles (`role="tree"`, `treeitem`, `aria-expanded`, `aria-selected`, `aria-level`), modal dialogs with focus lock and Escape-to-close, keyboard support.
- **Responsive scrollbars** – Thin styled scrollbars instead of hidden ones.

### Tech Stack

- Angular 20.3, TypeScript
- PrimeNG (Tag, Button)
- Karma + Jasmine (unit tests)
- SCSS
- Zoneless change detection

### Commands

| Command | Description |
|---------|-------------|
| `ng serve` | Start dev server at `http://localhost:4200` |
| `ng build` | Production build to `dist/` |
| `ng test` | Run unit tests (Karma + ChromeHeadless) |

### Tests

109 unit tests covering:
- Tree building, filtering, add/delete/rename operations
- Detail panel rendering, add/delete flows, empty states
- Hero component display and metadata access
- Modal and confirmation dialog behavior

---

## 🇪🇸 Español

### Descripción general

KnoxTest es una aplicación de una sola página construida con **Angular 20.3** (standalone, detección de cambios sin zone, estrategia `OnPush`). Renderiza una biblioteca jerárquica de contenido multimedia mediante una interfaz de árbol.

### Funcionalidades

- **Navegación en árbol** – Explora títulos (nivel superior), temporadas y episodios en un panel de árbol colapsable.
- **Búsqueda** – Filtra el árbol por nombre; los nodos no coincidentes se ocultan.
- **Panel de detalle** – Haz clic en cualquier nodo para ver su banner, metadatos (cantidad de temporadas, episodios, descripciones) y lista de hijos.
- **Modo edición** – Activa el modo edición para **agregar**, **renombrar** o **eliminar** nodos.
- **Modal de agregar** – Elige nombre, número, ícono y descripción al crear nuevos títulos, temporadas o episodios.
- **Diálogos de confirmación** – Las acciones de eliminación requieren confirmación.
- **Imágenes placeholder** – Generadas automáticamente con picsum.photos; fallback elegante en caso de error.
- **Accesibilidad** – Roles ARIA de árbol (`role="tree"`, `treeitem`, `aria-expanded`, `aria-selected`, `aria-level`), modales con bloqueo de foco y cierre con Escape, soporte de teclado.
- **Scrollbars responsivas** – Barras de desplazamiento delgadas con estilo en lugar de ocultas.

### Tecnologías

- Angular 20.3, TypeScript
- PrimeNG (Tag, Button)
- Karma + Jasmine (pruebas unitarias)
- SCSS
- Detección de cambios sin zone (zoneless)

### Comandos

| Comando | Descripción |
|---------|-------------|
| `ng serve` | Inicia servidor de desarrollo en `http://localhost:4200` |
| `ng build` | Compilación de producción en `dist/` |
| `ng test` | Ejecuta pruebas unitarias (Karma + ChromeHeadless) |

### Pruebas

109 pruebas unitarias que cubren:
- Construcción del árbol, filtrado, agregar/eliminar/renombrar
- Renderizado del panel de detalle, flujos de agregar/eliminar, estados vacíos
- Visualización del componente hero y acceso a metadatos
- Comportamiento de modales y diálogos de confirmación
