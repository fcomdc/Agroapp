# AgroApp

Aplicación móvil de la finca El Esfuerzo, Rivas, Nicaragua. Esta actualización reorganiza el frontend con Expo Router y conserva las funciones de registro bovino, salud, vacunas, reproducción, partos, ubicaciones y usuarios. La interfaz está en español y usa una misma paleta de verdes, crema y tonos tierra.

## Abrir el proyecto

Extrae el ZIP en una carpeta nueva para evitar archivos de navegación antiguos. El proyecto no incluye `node_modules`: las dependencias se recuperan con el archivo de bloqueo. Usa Node.js 22.13 o posterior.

```bash
cd Frontend
npm ci
npm start
```

La vista y los registros locales pueden probarse con Expo Go compatible con SDK 58. NFC requiere una instalación de desarrollo que incluya su módulo nativo.

Para revisar la interfaz en el navegador:

```bash
npm run web
```

En una instalación nueva se conserva la cuenta local inicial del proyecto original:

- Usuario: `admin`
- Contraseña: `admin123`

No se inventan fichas para las siete vacas: registra sus datos reales desde Ganado. Los datos que ya existan en una instalación compatible se conservan. No desinstales la aplicación que contiene información de campo sin haberla respaldado.

## Cambios de esta actualización

`npm start` abre ahora Expo Go de forma predeterminada. `npm run start:go` sigue disponible como equivalente; `npm run start:dev` se reserva para una futura instalación de desarrollo. No hace falta generar una APK para revisar la interfaz ni los registros locales.

Se conserva la paleta de colores existente y se muestra el logotipo original enviado por el equipo, sin redibujarlo.

Los filtros de preñadas y próximas dosis usan Ionicons de `@expo/vector-icons`. No se incluyen emojis en los componentes de la aplicación.

Los formularios breves de observación de salud, vacunación, nueva o edición de ubicación y datos de la finca se presentan como modales. En Android e iOS usan una hoja que ocupa inicialmente el 85 % de la pantalla y puede ampliarse. Incluyen título, botón de cierre y desplazamiento para acceder a los campos con el teclado abierto. Los formularios largos de ficha bovina, mediciones, reproducción y partos conservan su pantalla completa.

## Subrayados de Visual Studio Code

Que la aplicación se ejecute no sustituye la revisión de tipos. React Native transforma TypeScript al empaquetar, mientras que el editor y `tsc` realizan una comprobación independiente. La captura recibida muestra subrayados, pero no incluye el mensaje ni su código, de modo que no permite asegurar una causa concreta.

1. Abre `Frontend` como carpeta de proyecto, o abre `AgroApp.code-workspace`.
2. Ejecuta `npm ci` si todavía no instalaste las dependencias de esa carpeta.
3. Abre un archivo `.tsx`. En la paleta de comandos, elige `TypeScript: Select TypeScript Version` y luego `Use Workspace Version`.
4. Ejecuta `TypeScript: Restart TS Server` si los subrayados siguen mostrando un estado anterior.
5. Comprueba `npm run typecheck`. Si devuelve errores, conserva su texto y el código completo para identificar el problema.

Se incluye la selección del TypeScript local en la configuración del editor, y JSX y resolución de módulos se declaran expresamente en `tsconfig.json`. No se desactiva la validación ni se añaden exclusiones para ocultar errores.

## Probar NFC en Android

Esta versión añade módulos nativos. Una APK anterior no contiene automáticamente estos módulos.

Con tu cuenta EAS y el proyecto enlazado a la cuenta correspondiente:

```bash
npx eas-cli@latest build --platform android --profile development
```

Instala esa versión de desarrollo y ejecuta:

```bash
npm run start:dev
```

Desde Identificación NFC puedes leer una etiqueta, buscar una ya registrada y, como administrador, asociarla a una ficha. No es necesario escribir en la etiqueta: se vincula su identificador físico con el registro local. Las etiquetas sin formato NDEF pueden detectarse mediante NFC-A en Android. La compatibilidad real debe comprobarse con los adhesivos comprados y los teléfonos de la finca.

Si el teléfono no tiene NFC, si está desactivado o si se usa la vista web o Expo Go sin el módulo, la pantalla ofrece una explicación en español y mantiene la búsqueda manual.

## Organización

```text
src/
  app/                         Rutas de Expo Router
    _layout.tsx                Inicio de sesión y rutas protegidas
    login.tsx
    (private)/
      _layout.tsx              Pantallas y restricciones administrativas
      (tabs)/                  Mi finca, Ganado, Salud y Gestión
      bovinos/                 Ficha, registro y edición
      pesos/                   Historial y mediciones con cinta
      salud/                   Observación y detalle clínico
      reportes/                Reportes de un bovino
      vacunas/
      reproduccion/
      partos/
      ubicaciones/
      usuarios/
      nfc.tsx
      finca.tsx
      sincronizacion.tsx
  components/                  Controles y presentación compartidos
  screens/                     Implementación de cada pantalla
  database/
    Database.ts                Adaptador y persistencia local
    migrations.ts              Cambios de esquema sin borrar registros
    mutations.ts               Operaciones pendientes con UUID
    repositories/              Consultas y escritura por entidad
  services/                    Sesión, NFC, API, envíos y pronósticos
  store/                       Zustand para sesión, finca y filtros
  hooks/                       Lectura y validación de parámetros
  theme/                       Colores, tipografía y estilos compartidos
  types/                       Modelos TypeScript
  utils/                       Fechas, permisos y cálculos
```

Todas las pantallas navegan con Expo Router. Se retiraron `AppNavigator`, `App.tsx` y el punto de entrada anterior. `package.json` usa `expo-router/entry`. Las rutas transportan identificadores, no objetos completos que puedan quedar desactualizados.

## Tecnologías

| Tecnología | Uso en esta versión |
| --- | --- |
| React Native, Expo SDK 58 y TypeScript estricto | Aplicación móvil y modelos de datos |
| Expo Router | Rutas, pestañas, parámetros y acceso protegido |
| Zustand | Sesión, datos de la finca y búsqueda del ganado |
| expo-sqlite | Datos locales en instalaciones nativas compatibles |
| SecureStore | Identificador de la sesión en Android e iOS; espacio reservado para el token del servidor |
| AsyncStorage | Preferencias no secretas, último pronóstico y adaptador web o de instalaciones antiguas |
| expo-crypto | UUID estable de cada operación pendiente |
| react-native-nfc-manager | Lectura física de identificadores NFC en una compilación compatible |
| expo-dev-client y EAS | Instalación de desarrollo con módulos nativos |
| Cliente HTTP tipado | Preparación de la integración con ASP.NET Core, SQL Server y Python |

## Guardado y conservación

En SQLite, un registro y su operación pendiente se guardan dentro de una misma transacción exclusiva. Si falla alguno de los dos pasos, ambos se revierten. Cada operación conserva UUID, entidad, acción, identificador local, datos, responsable y fecha. Los reintentos conservan el mismo UUID.

La vista web usa un adaptador con una sola escritura de datos y operaciones pendientes en AsyncStorage. Las instalaciones antiguas que ya trabajaban con ese adaptador lo mantienen para no ocultar información previa. No se fuerza una migración entre adaptadores ni se mezclan bases distintas. Los registros anteriores a esta actualización no se presentan como enviados ni se incorporan automáticamente a la nueva cola.

Las migraciones de SQLite añaden columnas a Pesos e índices sin borrar las tablas existentes. Los cambios de estado de un bovino conservan sus historiales. Cambiar de estado no equivale automáticamente a declarar un fallecimiento.

## Medición con cinta

Se registran tres lecturas de perímetro torácico y tres de longitud corporal, en centímetros. El cálculo utiliza la mediana de cada dimensión y conserva las seis lecturas, fecha, autor, observaciones y versión del método:

```text
kg = 0.45359237 × longitud_cm × perimetro_cm² / (300 × 2.54³)
```

La pantalla indica que es un peso estimado. Para la variación diaria se comparan dos sesiones con el mismo método y fechas distintas; los registros anteriores sin método se identifican por separado. La colocación de la cinta y la aplicabilidad de la ecuación deben revisarse con el profesional de la finca, conforme al protocolo.

## Permisos

| Acción | Administrador | Trabajador | Veterinario |
| --- | --- | --- | --- |
| Consultar fichas e historiales | Sí | Sí | Sí |
| Registrar mediciones y observaciones | Sí | Sí | Sí |
| Crear y editar fichas o cambiar su estado | Sí | No | No |
| Administrar usuarios, finca y ubicaciones | Sí | No | No |
| Asociar o desactivar etiquetas NFC | Sí | No | No |
| Registrar diagnóstico y tratamiento clínico | No | No | Sí |

Los formularios administrativos están protegidos también al abrir una ruta directa. La identidad se vuelve a consultar en los registros locales al restaurar la sesión. Las sesiones antiguas que estaban en AsyncStorage requieren iniciar sesión una vez más. En la vista web solo se guarda el identificador local en la sesión de la pestaña; no se almacena un token de API en el navegador.

La autenticación sigue siendo la autenticación local del prototipo original. Las credenciales locales heredadas aún no equivalen a una autenticación JWT de producción. Los permisos deben volver a comprobarse en la API cuando se integre; las restricciones de interfaz no sustituyen los controles del servidor.

## Integración pendiente con el servidor

No se incluyeron backend, credenciales ni contratos reales de API entre los archivos recibidos. La aplicación muestra ese estado y no inventa sincronizaciones ni pronósticos.

Copia `.env.example` a `.env` y define `EXPO_PUBLIC_API_URL` cuando dispongas de la API. Esa variable contiene una dirección pública, nunca un secreto. El cliente nativo buscará un token del servidor en SecureStore bajo `agroapp.api.token`; el inicio de sesión local no crea ese token.

Los contratos siguientes son propuestas tipadas que deben acordarse con el backend:

| Operación | Contrato propuesto |
| --- | --- |
| Enviar una operación pendiente | `POST /api/sync/operations` |
| Confirmación | `{ "operationId": "UUID recibido", "accepted": true }` |
| Consultar pronóstico Ridge | `GET /api/bovinos/local/{id}/prediccion` |
| Pronóstico | `animalLocalId`, `kg`, `issuedAt`, `targetDate`, `modelVersion`, `method: "ridge"` |

Un envío se marca como confirmado únicamente cuando la respuesta acepta el mismo UUID. Un fallo o conflicto mantiene la operación pendiente. No se ejecutan envíos automáticos sin cuenta de servidor.

El servidor aún debe implementar autenticación, idempotencia, correspondencia de identificadores locales y centrales, versiones de origen, descarga de cambios y resolución de conflictos. `baseVersion` se deja explícitamente sin valor hasta acordar ese contrato. También falta implementar y evaluar Ridge en Python; el frontend puede conservar y mostrar su último resultado válido cuando exista.

## Relación con los requerimientos del documento

| Requerimiento | Estado de este frontend |
| --- | --- |
| RF01 Fichas bovinas | Registro, consulta, edición y cambio de estado con historial conservado |
| RF02 Identificación | Búsqueda manual y lectura/asociación NFC; pendiente validación con hardware |
| RF03 Biometría | Seis lecturas, medianas, Schaeffer, autor y fecha |
| RF04 Historial | Se conservan salud, vacunas, reproducción y partos; alimentación queda para un siguiente desarrollo |
| RF05 Análisis | Variación diaria y presentación de pronóstico; modelo Ridge y datos de evaluación pendientes |
| RF06 Venta o conservación | Comparación de escenarios y costos pendiente de desarrollar |
| RNF01 Persistencia | Transacción de registro y operación pendiente en SQLite; recuperación local comprobada |
| RNF02 Sincronización | Cola y envío con confirmación preparados; contrato completo y servidor pendientes |
| RNF03 Seguridad | Sesión nativa con SecureStore y permisos de interfaz; autenticación central pendiente |
| RNF04 Usabilidad | Interfaz en español, formularios con desplazamiento y manejo del teclado; evaluación SUS en finca pendiente |
| RNF05 Compatibilidad | Configuración y código nativo preparados; pruebas físicas de instalación y NFC pendientes |

## Comprobaciones

```bash
npm run typecheck
npm run lint
npm test
npx expo install --check
npm run export:web
```

Las pruebas de datos cubren SQLite, el adaptador de respaldo, conservación al recargar, fallo de escritura, transacción de registro y cola, migraciones repetibles, medianas, conversión de unidades, fechas y reglas de permisos. La exportación de Android comprueba el empaquetado JavaScript; no sustituye una compilación y prueba en el teléfono.

Documentación de referencia: [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/), [Expo Router](https://docs.expo.dev/router/installation/), [rutas protegidas](https://docs.expo.dev/router/advanced/protected/), [SQLite](https://docs.expo.dev/versions/v58.0.0/sdk/sqlite/), [SecureStore](https://docs.expo.dev/versions/v58.0.0/sdk/securestore/) y [NFC Manager](https://github.com/revtel/react-native-nfc-manager).
