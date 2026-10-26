# 🐮 AgroApp Móvil (React Native + TypeScript + SQLite)

Frontend móvil para la gestión integral de explotaciones agropecuarias y ganado bovino, con base de datos local SQLite (`expo-sqlite`) y arquitectura offline-first adaptada al esquema de base de datos relacional de **AgroAppDB**.

---

## 🚀 Inicio Rápido

1. Abre tu terminal en la carpeta `Frontend`:
   ```bash
   cd c:\Users\fm469\OneDrive\Documents\AgroApp\Frontend
   ```

2. Inicia la aplicación con Expo:
   ```bash
   npx expo start
   ```

3. Opciones para probar:
   - **Dispositivo móvil físico**: Escanea el código QR desde la app **Expo Go** (Android / iOS).
   - **Emulador Android**: Presiona `a` en la terminal.
   - **Simulador iOS**: Presiona `i` en la terminal (requiere macOS).
   - **Navegador Web**: Presiona `w` en la terminal.

---

## 🔑 Credenciales por Defecto (Base de Datos Local SQLite)

Al abrir la aplicación por primera vez, SQLite crea automáticamente todas las tablas, índices, llaves foráneas y el usuario administrador inicial:

- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Rol:** `Administrador`

*(También puedes crear nuevos usuarios con roles de `Trabajador` y `Veterinario` desde la sección Más -> Gestión de Usuarios).*

---

## 📁 Arquitectura del Proyecto

```text
Frontend/
├── App.tsx                         # Inicialización de SQLite y Providers principales
├── package.json
└── src/
    ├── database/                  # Capa de Acceso a Datos (expo-sqlite)
    │   ├── Database.ts            # Esquema DDL, llaves foráneas e índices SQLite
    │   ├── UsuariosDB.ts          # CRUD y autenticación de usuarios
    │   ├── UbicacionesDB.ts       # CRUD de potreros y establos
    │   ├── BovinosDB.ts           # CRUD y búsqueda de ganado bovino
    │   ├── NfcDB.ts               # Asignación y lectura de tags NFC
    │   ├── PesosDB.ts             # Registro y evolución de pesaje
    │   ├── VacunacionesDB.ts      # Control de vacunaciones y alertas de refuerzo
    │   ├── ReportesSaludDB.ts     # Reportes clínicos, síntomas y atención médica
    │   ├── ReproduccionesDB.ts    # Montas, inseminación y cálculo de parto (+283 días)
    │   ├── PartosDB.ts            # Registro de partos y alumbramientos
    │   └── CriasPartoDB.ts        # Crías nacidas asociadas a cada parto
    │
    ├── context/
    │   └── AuthContext.tsx         # Estado global de autenticación y sesión
    │
    ├── navigation/
    │   └── AppNavigator.tsx        # Bottom Tabs (Inicio, Bovinos, Salud, Más) y Stacks
    │
    ├── screens/                   # Pantallas completas de la aplicación
    │   ├── LoginScreen.tsx         # Inicio de sesión con validación
    │   ├── HomeScreen.tsx          # Tablero con estadísticas y accesos directos
    │   ├── BovinosListScreen.tsx   # Listado con filtros, búsqueda y badges de estado
    │   ├── BovinoDetailScreen.tsx  # Ficha técnica, edad calculada y accesos directos
    │   ├── BovinoFormScreen.tsx    # Alta y edición de bovino
    │   ├── PesosScreen.tsx         # Histórico de pesos del animal
    │   ├── PesoFormScreen.tsx      # Registro de pesaje individual
    │   ├── NfcScreen.tsx           # Aretes y chips NFC asociados al animal
    │   ├── VacunacionesListScreen.tsx # Calendario y listado de vacunas aplicadas
    │   ├── VacunacionFormScreen.tsx   # Formulario de aplicación de biológicos/lote
    │   ├── ReportesSaludListScreen.tsx # Incidencias de salud con filtros de estado
    │   ├── ReporteSaludFormScreen.tsx  # Reporte de síntomas y nivel de gravedad
    │   ├── ReporteSaludDetailScreen.tsx # Diagnóstico y tratamiento veterinario
    │   ├── MasScreen.tsx           # Menú de gestión, cuenta y administración
    │   ├── UbicacionesScreen.tsx   # Listado de potreros, corrales y pasturas
    │   ├── UbicacionFormScreen.tsx # Registro/edición de ubicaciones
    │   ├── ReproduccionesScreen.tsx # Control de montas, inseminaciones y preñadas
    │   ├── ReproduccionFormScreen.tsx # Formulario con cálculo automático de fecha de parto
    │   ├── PartosScreen.tsx        # Histórico de partos
    │   ├── PartoFormScreen.tsx     # Formulario de parto y alta inmediata de cría
    │   ├── UsuariosScreen.tsx      # Listado de usuarios del sistema
    │   └── UsuarioFormScreen.tsx   # Registro de usuarios y asignación de roles
    │
    ├── components/                # Componentes UI reutilizables
    │   ├── StatCard.tsx            # Tarjeta de métricas para el dashboard
    │   ├── SearchBar.tsx           # Barra de búsqueda con limpieza rápida
    │   ├── ListItem.tsx            # Elemento de lista estándar con badge
    │   ├── PickerSelect.tsx        # Selector interactivo de opciones
    │   ├── EmptyState.tsx          # Mensaje visual para listas vacías
    │   ├── LoadingSpinner.tsx      # Indicador de carga estilizado
    │   └── ConfirmDialog.ts       # Diálogos de confirmación
    │
    └── utils/
        ├── constants.ts           # Paleta de colores agropecuarios y enumeraciones
        └── helpers.ts             # Formateo de fechas, cálculo de edad de animales
```


## TypeScript y validación

El código de la aplicación usa archivos `.ts` y `.tsx`, con `strict: true`. El punto de entrada es `index.ts`. Los modelos de datos, la interfaz de almacenamiento y los parámetros de navegación están en `src/types/`.

- `npm run typecheck`: comprueba todos los archivos TypeScript sin generar JavaScript.
- `npm run lint`: analiza el código.
- `npm test`: comprueba SQLite, el almacenamiento de respaldo y las fechas.

La configuración de ESLint y el ejecutor de pruebas permanecen en JavaScript para ejecutarse directamente con Node.js.
