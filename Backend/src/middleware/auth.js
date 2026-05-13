// Importa jsonwebtoken para verificar JWTs
import jwt from "jsonwebtoken";

// Importa dotenv para cargar variables de entorno
import dotenv from "dotenv";

// Carga variables desde .env
dotenv.config();



// ======================================================
// MIDDLEWARE DE AUTENTICACIÓN OBLIGATORIA
// ======================================================

// Este middleware protege rutas privadas
//
// Ejemplo:
// GET /profile
//
// Si no hay token válido:
// devuelve 401
export function authRequired(req, res, next) {

  // Obtiene el header Authorization
  //
  // Ejemplo:
  // Authorization: Bearer abc123
  const auth = req.headers.authorization || "";

  // Verifica si empieza con "Bearer "
  //
  // slice(7):
  // elimina "Bearer "
  const token = auth.startsWith("Bearer ")
    ? auth.slice(7)
    : null;



  // ======================================================
  // VALIDAR EXISTENCIA DE TOKEN
  // ======================================================

  // Si no existe token
  if (!token)

    // Error 401 Unauthorized
    return res.status(401).json({
      message: "Token requerido"
    });



  // ======================================================
  // VERIFICAR JWT
  // ======================================================

  try {

    // Verifica:
    // - firma
    // - expiración
    // - integridad
    //
    // Si todo es válido:
    // devuelve el payload
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );



    // ======================================================
    // GUARDAR USUARIO EN req
    // ======================================================

    // Guarda datos del usuario autenticado
    //
    // Esto permite usar req.user
    // en cualquier controller posterior
    req.user = {

      id: payload.id,
      username: payload.username,
      email: payload.email,

      // Si no existe role
      // usa "user"
      role: payload.role || "user"
    };



    // ======================================================
    // CONTINUAR
    // ======================================================

    // Pasa al siguiente middleware/controller
    next();

  } catch {

    // Si el token:
    // - expiró
    // - fue modificado
    // - es inválido
    return res.status(401).json({
      message: "Token invalido o expirado"
    });
  }
}



// ======================================================
// AUTENTICACIÓN OPCIONAL
// ======================================================

// Similar a authRequired
//
// Pero NO obliga a estar logueado
//
// Si hay token válido:
// req.user tendrá datos
//
// Si no:
// req.user = null
export function authOptional(req, _res, next) {

  // Obtiene Authorization header
  const auth = req.headers.authorization || "";

  // Extrae token Bearer
  const token = auth.startsWith("Bearer ")
    ? auth.slice(7)
    : null;



  // ======================================================
  // SIN TOKEN
  // ======================================================

  // Si no hay token
  if (!token) {

    // Usuario anónimo
    req.user = null;

    return next();
  }



  // ======================================================
  // VERIFICAR TOKEN
  // ======================================================

  try {

    // Verifica JWT
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Guarda usuario autenticado
    req.user = {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role || "user"
    };

  } catch {

    // Si el token es inválido
    // simplemente se ignora
    req.user = null;
  }



  // ======================================================
  // CONTINUAR
  // ======================================================

  return next();
}



// ======================================================
// MIDDLEWARE DE ADMINISTRADOR
// ======================================================

// Solo permite continuar
// si el usuario tiene role admin
export function adminRequired(req, res, next) {

  // Optional chaining:
  // req.user?.role
  //
  // evita errores si req.user es null
  if (req.user?.role !== "admin") {

    // Error Forbidden
    return res.status(403).json({
      message: "Solo el administrador puede editar miniaturas"
    });
  }



  // ======================================================
  // USUARIO AUTORIZADO
  // ======================================================

  return next();
}