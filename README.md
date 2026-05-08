# MediaHub

MediaHub es una aplicacion web para explorar contenido multimedia, con catalogo de peliculas y series, autenticacion de usuarios, perfiles, likes y un panel de administracion para gestionar contenido.

El proyecto esta dividido en dos aplicaciones:

- `Backend`: API REST con Node.js, Express y MySQL.
- `Frontend`: interfaz web con React y Vite.

## Estado del proyecto

El proyecto esta en desarrollo. Ya cuenta con una base funcional para autenticacion, catalogo, perfiles y administracion, pero todavia faltan algunas piezas para dejarlo mas completo, como documentar o automatizar la creacion completa de la base de datos.

## Funcionalidades principales

- Registro e inicio de sesion con JWT.
- Rutas protegidas para usuarios autenticados.
- Roles de usuario y administrador.
- Catalogo de contenido multimedia.
- Busqueda de contenido.
- Detalle de contenido.
- Likes por contenido.
- Perfil de usuario.
- Contenido guardado y actividad de usuario, si existen las tablas correspondientes.
- Panel de administracion para editar y eliminar contenido.
- Integracion con TMDB para buscar peliculas y series.
- Tema claro/oscuro en el frontend.

## Tecnologias

### Backend

- Node.js
- Express
- MySQL
- mysql2
- JSON Web Token
- bcryptjs
- dotenv
- node-fetch

### Frontend

- React
- Vite
- React Router
- Three.js
- React Three Fiber
- ESLint

## Requisitos

- Node.js
- npm
- MySQL
- Una API key de TMDB, si se quiere usar la busqueda externa de peliculas y series

## Instalacion

Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd Media_hub
```

Instalar dependencias del backend:

```bash
cd Backend
npm install
```

Instalar dependencias del frontend:

```bash
cd ../Frontend
npm install
```

## Variables de entorno

Crear un archivo `.env` dentro de `Backend` tomando como referencia `Backend/.env.example`:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=media_hub
DB_PORT=3306

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d

TMDB_API_KEY=your_tmdb_api_key
```

Crear un archivo `.env` dentro de `Frontend` tomando como referencia `Frontend/.env.example`:

```env
VITE_API_BASE=http://localhost:4000/api
```

## Base de datos

El backend espera una base de datos MySQL configurada con el nombre indicado en `DB_NAME`.

Hay archivos SQL con datos de prueba en `Backend`:

- `seed_content_50.sql`
- `seed_content_50_tmdb.sql`
- `seed_content_100_tmdb_unique.sql`
- `remove_duplicate_content.sql`

Nota: actualmente el repositorio no incluye un script unico de schema/migraciones para crear todas las tablas desde cero. Algunas rutas verifican si ciertas tablas existen, como `content_likes`, `saved_content`, `user_follows` o `user_activity`, y devuelven respuestas controladas si todavia no estan creadas.

## Ejecutar en desarrollo

Levantar el backend:

```bash
cd Backend
npm run dev
```

La API queda disponible en:

```text
http://localhost:4000
```

Endpoint de salud:

```text
GET http://localhost:4000/api/health
```

Levantar el frontend:

```bash
cd Frontend
npm run dev
```

La app queda disponible en:

```text
http://localhost:5173
```

## Scripts disponibles

### Backend

```bash
npm run dev
npm start
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Endpoints principales

### Autenticacion

- `POST /api/auth/register`
- `POST /api/auth/login`

### Contenido

- `GET /api/content`
- `GET /api/content/featured`
- `GET /api/content/:id`
- `POST /api/content/from-tmdb`
- `PUT /api/content/:id`
- `DELETE /api/content/:id`
- `GET /api/content/:id/likes`
- `POST /api/content/:id/like`
- `DELETE /api/content/:id/like`

### Usuarios

- `GET /api/user/me`
- `GET /api/user/me/saved`
- `GET /api/user/me/likes`
- `PATCH /api/user/me/profile`
- `POST /api/user/:id/follow`
- `DELETE /api/user/:id/follow`
- `GET /api/user/:username/profile`
- `GET /api/user/:username/content`
- `GET /api/user/:username/activity`

### Otros

- `GET /api/genres`
- `GET /api/platforms`
- `GET /api/tmdb/search?query=<busqueda>`
- `GET /api/health`

## Estructura general

```text
Media_hub/
  Backend/
    src/
      controllers/
      helpers/
      middleware/
      routes/
      db.js
      server.js
    package.json
  Frontend/
    src/
      auth/
      components/
      pages/
      App.jsx
      api.js
      main.jsx
    package.json
```

## Proximos pasos sugeridos

- Agregar un script SQL de schema completo para crear la base de datos desde cero.
- Agregar capturas de pantalla al README.
- Agregar una seccion de roles y permisos mas detallada.
- Agregar tests para backend y frontend.
- Si `node_modules`, `.env` o `dist` ya fueron versionados, quitarlos del seguimiento de Git y mantenerlos ignorados.
