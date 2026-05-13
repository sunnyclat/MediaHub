// Importa Express
//
// Framework principal del backend
import express from "express";

// Importa CORS
//
// Permite conexiones entre distintos dominios
import cors from "cors";

// Importa dotenv
//
// Carga variables .env
import dotenv from "dotenv";

// Importa función que asegura
// la existencia del rol en users
import { ensureUserRolesReady } from "./db.js";



// ======================================================
// IMPORTAR RUTAS
// ======================================================

// Cada archivo maneja
// un grupo específico de endpoints

import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import genresRoutes from "./routes/genres.js";
import platformsRoutes from "./routes/platforms.js";
import testRoutes from "./routes/test.js";
import tmdbRoutes from "./routes/tmdb.js";
import userRoutes from "./routes/user.js";



// ======================================================
// CARGAR VARIABLES .ENV
// ======================================================

dotenv.config();



// ======================================================
// ASEGURAR SCHEMA NECESARIO
// ======================================================

// Verifica que exista:
// users.role
//
// Si no existe:
// la crea automáticamente
await ensureUserRolesReady();



// ======================================================
// CREAR APP EXPRESS
// ======================================================

const app = express();



// ======================================================
// MIDDLEWARE JSON
// ======================================================

// Permite recibir JSON en req.body
//
// Sin esto:
// req.body sería undefined
app.use(express.json());



// ======================================================
// CONFIGURAR CORS
// ======================================================

// CORS:
// Cross-Origin Resource Sharing
//
// Permite que el frontend
// pueda conectarse al backend
app.use(cors({

  // Frontend permitido
  //
  // Usa CLIENT_ORIGIN
  // o fallback localhost
  origin:
    process.env.CLIENT_ORIGIN
    || "http://localhost:5173",

  // Permite cookies/autenticación
  credentials: true
}));



// ======================================================
// HEALTH CHECK
// ======================================================

// Endpoint simple para verificar
// si la API está funcionando
//
// GET /api/health
app.get("/api/health", (_, res) =>

  res.json({
    ok: true
  })
);



// ======================================================
// REGISTRAR RUTAS
// ======================================================

// Todas estas rutas quedan montadas
// bajo prefijos específicos

// Autenticación
app.use("/api/auth", authRoutes);

// Contenido
app.use("/api/content", contentRoutes);

// Géneros
app.use("/api/genres", genresRoutes);

// Plataformas
app.use("/api/platforms", platformsRoutes);

// Rutas de prueba
app.use("/api/test", testRoutes);

// Integración TMDB
app.use("/api/tmdb", tmdbRoutes);

// Usuarios
app.use("/api/user", userRoutes);

// Alias alternativo
app.use("/api/users", userRoutes);



// ======================================================
// PUERTO DEL SERVIDOR
// ======================================================

// Usa PORT del .env
// o fallback 4000
const port =
  process.env.PORT || 4000;



// ======================================================
// INICIAR SERVIDOR
// ======================================================

const server = app.listen(

  port,

  () => {

    // Mensaje en consola
    console.log(
      `API escuchando en http://localhost:${port}`
    );
  }
);



// ======================================================
// MANEJO DE ERRORES DEL SERVIDOR
// ======================================================

// Escucha errores del servidor
server.on("error", (error) => {



  // ======================================================
  // PUERTO YA EN USO
  // ======================================================

  // EADDRINUSE:
  // otro proceso ya usa el puerto
  if (error.code === "EADDRINUSE") {

    console.error(

      `No se pudo iniciar el backend porque el puerto ${port} ya esta en uso. Cambia PORT en el .env o cierra el proceso que lo esta usando.`,
    );

    // Finaliza proceso Node.js
    process.exit(1);
  }



  // ======================================================
  // OTROS ERRORES
  // ======================================================

  console.error(
    "Error iniciando el servidor:",
    error
  );

  process.exit(1);
});