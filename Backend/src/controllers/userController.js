// Importa la conexión a la base de datos
import { pool } from "../db.js";



// ======================================================
// CACHE DE COLUMNAS DE TABLAS
// ======================================================

// Map guarda datos en memoria usando clave -> valor
//
// Acá se usa para evitar consultar constantemente
// information_schema.columns
//
// Ejemplo:
// "users" => Set("id", "username", ...)
const tableColumnsCache = new Map();



// ======================================================
// RESPUESTA EXITOSA ESTÁNDAR
// ======================================================

// Función helper para responder siempre
// con formato consistente
function sendOk(res, data, meta = {}) {

  return res.json({

    // Indica éxito
    ok: true,

    // Datos principales
    data,

    // Información extra opcional
    meta
  });
}



// ======================================================
// RESPUESTA DE ERROR ESTÁNDAR
// ======================================================

// Helper para errores
function sendError(res, status, message, code = "ERROR") {

  return res.status(status).json({

    // Indica fallo
    ok: false,

    // Objeto de error
    error: {
      code,
      message
    }
  });
}



// ======================================================
// OBTENER COLUMNAS DE UNA TABLA
// ======================================================

// Lee las columnas reales desde MySQL
async function getTableColumns(tableName) {

  // Si ya existe en cache
  // devuelve el resultado guardado
  if (tableColumnsCache.has(tableName)) {
    return tableColumnsCache.get(tableName);
  }

  // Consulta information_schema
  //
  // information_schema.columns:
  // tabla interna de MySQL con metadata
  const [rows] = await pool.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = ?`,
    [tableName]
  );

  // Convierte las columnas en un Set
  //
  // Set permite:
  // columns.has("email")
  const columns = new Set(
    rows.map((row) => row.column_name)
  );

  // Guarda en cache
  tableColumnsCache.set(tableName, columns);

  return columns;
}



// ======================================================
// VERIFICAR SI EXISTE UNA TABLA
// ======================================================

async function tableExists(tableName) {

  // Obtiene columnas
  const columns = await getTableColumns(tableName);

  // Si tiene columnas, existe
  return columns.size > 0;
}



// ======================================================
// OBTENER PERFIL DEL USUARIO LOGUEADO
// ======================================================

export async function getProfile(req, res) {

  // Busca el usuario usando req.user.id
  //
  // req.user normalmente viene
  // desde middleware JWT
  const [[user]] = await pool.query(
    "SELECT id, username, email, created_at FROM users WHERE id = ?",
    [req.user.id]
  );

  // Devuelve el usuario
  res.json(user);
}



// ======================================================
// PERFIL PÚBLICO
// ======================================================

export async function getPublicProfile(req, res) {

  try {

    // Username desde URL
    const { username } = req.params;

    // Busca usuario
    const [[user]] = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE username = ?",
      [username]
    );

    // Si no existe
    if (!user) {

      return sendError(
        res,
        404,
        "Usuario no encontrado",
        "USER_NOT_FOUND"
      );
    }

    // Variables iniciales
    let posts = 0;
    let followers = 0;
    let following = 0;
    let socialEnabled = false;



    // ======================================================
    // CONTAR POSTS
    // ======================================================

    const contentColumns = await getTableColumns("content");

    // Verifica si existe columna user_id
    if (contentColumns.has("user_id")) {

      const [[countRow]] = await pool.query(
        "SELECT COUNT(*) AS total FROM content WHERE user_id = ?",
        [user.id]
      );

      // Convierte resultado a número
      posts = Number(countRow?.total || 0);
    }



    // ======================================================
    // SISTEMA DE FOLLOWERS
    // ======================================================

    // Verifica si existe tabla user_follows
    if (await tableExists("user_follows")) {

      const followsColumns = await getTableColumns("user_follows");

      // Verifica columnas necesarias
      if (
        followsColumns.has("user_id") &&
        followsColumns.has("followed_user_id")
      ) {

        socialEnabled = true;

        // Cuenta seguidores
        const [[followersRow]] = await pool.query(
          "SELECT COUNT(*) AS total FROM user_follows WHERE followed_user_id = ?",
          [user.id]
        );

        // Cuenta seguidos
        const [[followingRow]] = await pool.query(
          "SELECT COUNT(*) AS total FROM user_follows WHERE user_id = ?",
          [user.id]
        );

        followers = Number(followersRow?.total || 0);
        following = Number(followingRow?.total || 0);
      }
    }



    // ======================================================
    // RESPUESTA FINAL
    // ======================================================

    return sendOk(
      res,

      // Data
      {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,

        stats: {
          posts,
          followers,
          following
        }
      },

      // Meta
      {
        social_enabled: socialEnabled
      }
    );

  } catch (error) {

    console.error(error);

    return sendError(
      res,
      500,
      "Error obteniendo perfil",
      "PROFILE_FETCH_FAILED"
    );
  }
}



// ======================================================
// CONTENIDO DE UN USUARIO
// ======================================================

export async function getUserContent(req, res) {

  try {

    // Username desde params
    const { username } = req.params;

    // Orden solicitado
    //
    // recent
    // popular
    // commented
    const sort = (req.query.sort || "recent")
      .toString()
      .toLowerCase();

    // Límite máximo 50
    const limit = Math.min(
      Math.max(Number(req.query.limit || 12), 1),
      50
    );

    // Página actual
    const page = Math.max(
      Number(req.query.page || 1),
      1
    );

    // Offset SQL
    const offset = (page - 1) * limit;



    // ======================================================
    // BUSCAR USUARIO
    // ======================================================

    const [[user]] = await pool.query(
      "SELECT id, username FROM users WHERE username = ?",
      [username]
    );

    if (!user) {

      return sendError(
        res,
        404,
        "Usuario no encontrado",
        "USER_NOT_FOUND"
      );
    }



    // ======================================================
    // VALIDAR user_id EN content
    // ======================================================

    const contentColumns = await getTableColumns("content");

    // Si no existe user_id
    if (!contentColumns.has("user_id")) {

      return sendOk(res, [], {

        page,
        limit,
        sort,
        total: 0,

        note: "La tabla content aun no tiene user_id"
      });
    }



    // ======================================================
    // MAPEO DE ORDENAMIENTO
    // ======================================================

    const sortToColumn = {

      // Más recientes
      recent: "created_at",

      // Más populares
      popular: contentColumns.has("views")
        ? "views"
        : "created_at",

      // Más comentados
      commented: contentColumns.has("comments_count")
        ? "comments_count"
        : "created_at"
    };

    // Columna final
    const orderColumn =
      sortToColumn[sort] || "created_at";



    // ======================================================
    // TOTAL DE POSTS
    // ======================================================

    const [[countRow]] = await pool.query(
      "SELECT COUNT(*) AS total FROM content WHERE user_id = ?",
      [user.id]
    );

    const total = Number(countRow?.total || 0);



    // ======================================================
    // CONSULTA PRINCIPAL
    // ======================================================

    const [rows] = await pool.query(
      `SELECT id, title, type, poster_path, release_year, created_at
       FROM content
       WHERE user_id = ?
       ORDER BY ${orderColumn} DESC
       LIMIT ? OFFSET ?`,
      [user.id, limit, offset]
    );



    // ======================================================
    // RESPUESTA
    // ======================================================

    return sendOk(res, rows, {
      page,
      limit,
      sort,
      total
    });

  } catch (error) {

    console.error(error);

    return sendError(
      res,
      500,
      "Error obteniendo contenido",
      "CONTENT_FETCH_FAILED"
    );
  }
}