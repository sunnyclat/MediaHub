// Importa Express
import express from "express";

// Importa los controllers de autenticación
//
// login:
// maneja inicio de sesión
//
// register:
// maneja registro de usuario
import {
  login,
  register
} from "../controllers/authController.js";



// ======================================================
// CREAR ROUTER
// ======================================================

// express.Router():
// crea un mini sistema de rutas modular
//
// Esto permite separar:
// - auth
// - users
// - content
// - admin
// etc.
const router = express.Router();



// ======================================================
// RUTA DE REGISTRO
// ======================================================

// POST /register
//
// Cuando alguien haga:
//
// POST /register
//
// Express ejecutará:
// register(req, res)
router.post(
  "/register",
  register
);



// ======================================================
// RUTA DE LOGIN
// ======================================================

// POST /login
//
// Ejecuta:
// login(req, res)
router.post(
  "/login",
  login
);



// ======================================================
// EXPORTAR ROUTER
// ======================================================

// Permite importar este router
// en el archivo principal del servidor
//
// Ejemplo:
// app.use("/api/auth", router)
export default router;