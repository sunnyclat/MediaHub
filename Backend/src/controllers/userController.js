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



// ======================================================
// CONTENIDO GUARDADO DEL USUARIO LOGUEADO
// ======================================================

export async function getMySaved(req, res) {

  try {

    if (!(await tableExists("saved_content"))) {

      return sendOk(res, [], {
        total: 0,
        note: "La tabla saved_content aun no existe"
      });
    }

    const limit = Math.min(
      Math.max(Number(req.query.limit || 24), 1),
      50
    );

    const [rows] = await pool.query(
      `SELECT c.id, c.title, c.type, c.poster_path, c.release_year, sc.created_at AS saved_at
       FROM saved_content sc
       JOIN content c ON c.id = sc.content_id
       WHERE sc.user_id = ?
       ORDER BY sc.created_at DESC
       LIMIT ?`,
      [req.user.id, limit]
    );

    return sendOk(res, rows, {
      total: rows.length
    });

  } catch (error) {

    console.error(error);

    return sendError(
      res,
      500,
      "Error obteniendo guardados",
      "SAVED_FETCH_FAILED"
    );
  }
}



// ======================================================
// LIKES DEL USUARIO LOGUEADO
// ======================================================

export async function getMyLikes(req, res) {

  try {

    if (!(await tableExists("content_likes"))) {

      return sendOk(res, [], {
        total: 0,
        note: "La tabla content_likes aun no existe"
      });
    }

    const limit = Math.min(
      Math.max(Number(req.query.limit || 24), 1),
      50
    );

    const [rows] = await pool.query(
      `SELECT c.id, c.title, c.type, c.poster_path, c.release_year, cl.created_at AS liked_at
       FROM content_likes cl
       JOIN content c ON c.id = cl.content_id
       WHERE cl.user_id = ?
       ORDER BY cl.created_at DESC
       LIMIT ?`,
      [req.user.id, limit]
    );

    return sendOk(res, rows, {
      total: rows.length
    });

  } catch (error) {

    console.error(error);

    return sendError(
      res,
      500,
      "Error obteniendo likes",
      "LIKES_FETCH_FAILED"
    );
  }
}



// ======================================================
// ACTIVIDAD PUBLICA DE UN USUARIO
// ======================================================

export async function getUserActivity(req, res) {

  try {

    if (!(await tableExists("user_activity"))) {

      return sendOk(res, [], {
        total: 0,
        note: "La tabla user_activity aun no existe"
      });
    }

    const { username } = req.params;
    const limit = Math.min(
      Math.max(Number(req.query.limit || 24), 1),
      50
    );

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

    const [rows] = await pool.query(
      `SELECT ua.id, ua.type, ua.action, ua.content_id, ua.payload, ua.created_at,
              c.title AS content_title
       FROM user_activity ua
       LEFT JOIN content c ON c.id = ua.content_id
       WHERE ua.user_id = ?
       ORDER BY ua.created_at DESC
       LIMIT ?`,
      [user.id, limit]
    );

    return sendOk(res, rows, {
      total: rows.length
    });

  } catch (error) {

    console.error(error);

    return sendError(
      res,
      500,
      "Error obteniendo actividad",
      "ACTIVITY_FETCH_FAILED"
    );
  }
}



// ======================================================
// SEGUIR USUARIO
// ======================================================

export async function followUser(req, res) {

  try {

    if (!(await tableExists("user_follows"))) {

      return sendError(
        res,
        501,
        "La tabla user_follows aun no existe",
        "FOLLOWS_TABLE_MISSING"
      );
    }

    const followedUserId = Number(req.params.id);

    if (!Number.isInteger(followedUserId) || followedUserId <= 0) {

      return sendError(
        res,
        400,
        "ID de usuario invalido",
        "INVALID_USER_ID"
      );
    }

    if (followedUserId === Number(req.user.id)) {

      return sendError(
        res,
        400,
        "No podes seguirte a vos mismo",
        "CANNOT_FOLLOW_SELF"
      );
    }

    const [[targetUser]] = await pool.query(
      "SELECT id FROM users WHERE id = ?",
      [followedUserId]
    );

    if (!targetUser) {

      return sendError(
        res,
        404,
        "Usuario no encontrado",
        "USER_NOT_FOUND"
      );
    }

    await pool.query(
      "INSERT IGNORE INTO user_follows (user_id, followed_user_id) VALUES (?, ?)",
      [req.user.id, followedUserId]
    );

    return sendOk(res, {
      following: true,
      followed_user_id: followedUserId
    });

  } catch (error) {

    console.error(error);

    return sendError(
      res,
      500,
      "Error siguiendo usuario",
      "FOLLOW_FAILED"
    );
  }
}



// ======================================================
// DEJAR DE SEGUIR USUARIO
// ======================================================

export async function unfollowUser(req, res) {

  try {

    if (!(await tableExists("user_follows"))) {

      return sendError(
        res,
        501,
        "La tabla user_follows aun no existe",
        "FOLLOWS_TABLE_MISSING"
      );
    }

    const followedUserId = Number(req.params.id);

    if (!Number.isInteger(followedUserId) || followedUserId <= 0) {

      return sendError(
        res,
        400,
        "ID de usuario invalido",
        "INVALID_USER_ID"
      );
    }

    await pool.query(
      "DELETE FROM user_follows WHERE user_id = ? AND followed_user_id = ?",
      [req.user.id, followedUserId]
    );

    return sendOk(res, {
      following: false,
      followed_user_id: followedUserId
    });

  } catch (error) {

    console.error(error);

    return sendError(
      res,
      500,
      "Error dejando de seguir usuario",
      "UNFOLLOW_FAILED"
    );
  }
}



// ======================================================
// ACTUALIZAR PERFIL PROPIO
// ======================================================

export async function updateMyProfile(req, res) {

  try {

    const usersColumns = await getTableColumns("users");
    const updates = [];
    const values = [];

    if (
      Object.prototype.hasOwnProperty.call(req.body, "username") &&
      typeof req.body.username === "string"
    ) {

      const username = req.body.username.trim();

      if (username.length < 3 || username.length > 50) {

        return sendError(
          res,
          400,
          "El usuario debe tener entre 3 y 50 caracteres",
          "INVALID_USERNAME"
        );
      }

      updates.push("username = ?");
      values.push(username);
    }

    if (
      usersColumns.has("display_name") &&
      Object.prototype.hasOwnProperty.call(req.body, "display_name")
    ) {

      updates.push("display_name = ?");
      values.push(String(req.body.display_name || "").trim().slice(0, 100));
    }

    if (
      usersColumns.has("bio") &&
      Object.prototype.hasOwnProperty.call(req.body, "bio")
    ) {

      updates.push("bio = ?");
      values.push(String(req.body.bio || "").trim().slice(0, 500));
    }

    if (updates.length === 0) {

      return sendError(
        res,
        400,
        "No hay datos validos para actualizar",
        "NO_VALID_FIELDS"
      );
    }

    values.push(req.user.id);

    await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    

    const [[user]] = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    // ======================================================
    // RESPUESTA
    // ======================================================
    return sendOk(res, user);

  } catch (error) {

    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {

      return sendError(
        res,
        409,
        "El nombre de usuario ya esta en uso",
        "USERNAME_TAKEN"
      );
    }

    return sendError(
      res,
      500,
      "Error actualizando perfil",
      "PROFILE_UPDATE_FAILED"
    );
  }
}
