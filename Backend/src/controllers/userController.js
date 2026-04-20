import { pool } from "../db.js";

const tableColumnsCache = new Map();

function sendOk(res, data, meta = {}) {
  return res.json({ ok: true, data, meta });
}

function sendError(res, status, message, code = "ERROR") {
  return res.status(status).json({
    ok: false,
    error: { code, message }
  });
}

async function getTableColumns(tableName) {
  if (tableColumnsCache.has(tableName)) {
    return tableColumnsCache.get(tableName);
  }

  const [rows] = await pool.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = ?`,
    [tableName]
  );

  const columns = new Set(rows.map((row) => row.column_name));
  tableColumnsCache.set(tableName, columns);
  return columns;
}

async function tableExists(tableName) {
  const columns = await getTableColumns(tableName);
  return columns.size > 0;
}

export async function getProfile(req, res) {
  const [[user]] = await pool.query(
    "SELECT id, username, email, created_at FROM users WHERE id = ?",
    [req.user.id]
  );

  res.json(user);
}

export async function getPublicProfile(req, res) {
  try {
    const { username } = req.params;
    const [[user]] = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE username = ?",
      [username]
    );

    if (!user) {
      return sendError(res, 404, "Usuario no encontrado", "USER_NOT_FOUND");
    }

    let posts = 0;
    let followers = 0;
    let following = 0;
    let socialEnabled = false;

    const contentColumns = await getTableColumns("content");
    if (contentColumns.has("user_id")) {
      const [[countRow]] = await pool.query(
        "SELECT COUNT(*) AS total FROM content WHERE user_id = ?",
        [user.id]
      );
      posts = Number(countRow?.total || 0);
    }

    if (await tableExists("user_follows")) {
      const followsColumns = await getTableColumns("user_follows");
      if (followsColumns.has("user_id") && followsColumns.has("followed_user_id")) {
        socialEnabled = true;
        const [[followersRow]] = await pool.query(
          "SELECT COUNT(*) AS total FROM user_follows WHERE followed_user_id = ?",
          [user.id]
        );
        const [[followingRow]] = await pool.query(
          "SELECT COUNT(*) AS total FROM user_follows WHERE user_id = ?",
          [user.id]
        );
        followers = Number(followersRow?.total || 0);
        following = Number(followingRow?.total || 0);
      }
    }

    return sendOk(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      stats: { posts, followers, following }
    }, {
      social_enabled: socialEnabled
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Error obteniendo perfil", "PROFILE_FETCH_FAILED");
  }
}

export async function getUserContent(req, res) {
  try {
    const { username } = req.params;
    const sort = (req.query.sort || "recent").toString().toLowerCase();
    const limit = Math.min(Math.max(Number(req.query.limit || 12), 1), 50);
    const page = Math.max(Number(req.query.page || 1), 1);
    const offset = (page - 1) * limit;

    const [[user]] = await pool.query(
      "SELECT id, username FROM users WHERE username = ?",
      [username]
    );

    if (!user) {
      return sendError(res, 404, "Usuario no encontrado", "USER_NOT_FOUND");
    }

    const contentColumns = await getTableColumns("content");
    if (!contentColumns.has("user_id")) {
      return sendOk(res, [], {
        page,
        limit,
        sort,
        total: 0,
        note: "La tabla content aun no tiene user_id"
      });
    }

    const sortToColumn = {
      recent: "created_at",
      popular: contentColumns.has("views") ? "views" : "created_at",
      commented: contentColumns.has("comments_count") ? "comments_count" : "created_at"
    };
    const orderColumn = sortToColumn[sort] || "created_at";

    const [[countRow]] = await pool.query(
      "SELECT COUNT(*) AS total FROM content WHERE user_id = ?",
      [user.id]
    );
    const total = Number(countRow?.total || 0);

    const [rows] = await pool.query(
      `SELECT id, title, type, poster_path, release_year, created_at
       FROM content
       WHERE user_id = ?
       ORDER BY ${orderColumn} DESC
       LIMIT ? OFFSET ?`,
      [user.id, limit, offset]
    );

    return sendOk(res, rows, { page, limit, sort, total });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Error obteniendo contenido", "CONTENT_FETCH_FAILED");
  }
}

export async function getMySaved(req, res) {
  try {
    if (!(await tableExists("saved_content"))) {
      return sendOk(res, [], {
        total: 0,
        note: "Tabla saved_content no creada aun"
      });
    }

    const savedColumns = await getTableColumns("saved_content");
    if (!savedColumns.has("user_id") || !savedColumns.has("content_id")) {
      return sendError(
        res,
        500,
        "saved_content no tiene columnas user_id/content_id",
        "SAVED_SCHEMA_INVALID"
      );
    }

    const [rows] = await pool.query(
      `SELECT c.id, c.title, c.type, c.poster_path, c.release_year, sc.created_at AS saved_at
       FROM saved_content sc
       JOIN content c ON c.id = sc.content_id
       WHERE sc.user_id = ?
       ORDER BY sc.created_at DESC`,
      [req.user.id]
    );

    return sendOk(res, rows, { total: rows.length });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Error obteniendo guardados", "SAVED_FETCH_FAILED");
  }
}

export async function getMyLikes(req, res) {
  try {
    if (!(await tableExists("content_likes"))) {
      return sendOk(res, [], {
        total: 0,
        note: "Tabla content_likes no creada aun"
      });
    }

    const likesColumns = await getTableColumns("content_likes");
    if (!likesColumns.has("user_id") || !likesColumns.has("content_id")) {
      return sendError(
        res,
        500,
        "content_likes no tiene columnas user_id/content_id",
        "LIKES_SCHEMA_INVALID"
      );
    }

    const [rows] = await pool.query(
      `SELECT c.id, c.title, c.type, c.poster_path, c.release_year, cl.created_at AS liked_at
       FROM content_likes cl
       JOIN content c ON c.id = cl.content_id
       WHERE cl.user_id = ?
       ORDER BY cl.created_at DESC`,
      [req.user.id]
    );

    return sendOk(res, rows, { total: rows.length });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Error obteniendo me gusta", "LIKES_FETCH_FAILED");
  }
}

export async function getUserActivity(req, res) {
  try {
    const { username } = req.params;
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);

    const [[user]] = await pool.query(
      "SELECT id, username FROM users WHERE username = ?",
      [username]
    );

    if (!user) {
      return sendError(res, 404, "Usuario no encontrado", "USER_NOT_FOUND");
    }

    if (!(await tableExists("user_activity"))) {
      return sendOk(res, [], {
        total: 0,
        note: "Tabla user_activity no creada aun"
      });
    }

    const activityColumns = await getTableColumns("user_activity");
    if (!activityColumns.has("user_id")) {
      return sendError(
        res,
        500,
        "user_activity no tiene columna user_id",
        "ACTIVITY_SCHEMA_INVALID"
      );
    }

    const selectParts = ["id", "user_id"];
    if (activityColumns.has("type")) selectParts.push("type");
    if (activityColumns.has("action")) selectParts.push("action");
    if (activityColumns.has("payload")) selectParts.push("payload");
    if (activityColumns.has("content_id")) selectParts.push("content_id");
    if (activityColumns.has("created_at")) selectParts.push("created_at");

    const orderBy = activityColumns.has("created_at") ? "created_at DESC" : "id DESC";
    const [rows] = await pool.query(
      `SELECT ${selectParts.join(", ")}
       FROM user_activity
       WHERE user_id = ?
       ORDER BY ${orderBy}
       LIMIT ?`,
      [user.id, limit]
    );

    return sendOk(res, rows, { total: rows.length, limit });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Error obteniendo actividad", "ACTIVITY_FETCH_FAILED");
  }
}

export async function updateMyProfile(req, res) {
  try {
    const usersColumns = await getTableColumns("users");
    const allowed = ["username", "email", "display_name", "bio", "avatar_url", "website"];

    const entries = allowed
      .filter((field) => usersColumns.has(field) && req.body[field] !== undefined)
      .map((field) => [field, req.body[field]]);

    if (!entries.length) {
      return sendError(
        res,
        400,
        "No hay campos validos para actualizar",
        "NO_VALID_FIELDS"
      );
    }

    const setSql = entries.map(([field]) => `${field} = ?`).join(", ");
    const values = entries.map(([, value]) => value);
    values.push(req.user.id);

    await pool.query(`UPDATE users SET ${setSql} WHERE id = ?`, values);

    const [selectFields] = [allowed.filter((field) => usersColumns.has(field))];
    const [[user]] = await pool.query(
      `SELECT id, ${selectFields.join(", ")}, created_at FROM users WHERE id = ?`,
      [req.user.id]
    );

    return sendOk(res, user);
  } catch (error) {
    console.error(error);
    if (error?.code === "ER_DUP_ENTRY") {
      return sendError(res, 409, "Username o email ya en uso", "DUPLICATE_VALUE");
    }

    return sendError(res, 500, "Error actualizando perfil", "PROFILE_UPDATE_FAILED");
  }
}

export async function followUser(req, res) {
  try {
    if (!(await tableExists("user_follows"))) {
      return sendError(
        res,
        501,
        "Tabla user_follows no creada aun",
        "FOLLOWS_NOT_IMPLEMENTED"
      );
    }

    const followsColumns = await getTableColumns("user_follows");
    if (!followsColumns.has("user_id") || !followsColumns.has("followed_user_id")) {
      return sendError(
        res,
        500,
        "user_follows no tiene columnas user_id/followed_user_id",
        "FOLLOWS_SCHEMA_INVALID"
      );
    }

    const targetId = Number(req.params.id);
    if (!Number.isInteger(targetId) || targetId <= 0) {
      return sendError(res, 400, "ID de usuario invalido", "INVALID_USER_ID");
    }

    if (targetId === req.user.id) {
      return sendError(res, 400, "No podes seguirte a vos mismo", "CANNOT_FOLLOW_SELF");
    }

    const [[target]] = await pool.query("SELECT id FROM users WHERE id = ?", [targetId]);
    if (!target) {
      return sendError(res, 404, "Usuario objetivo no encontrado", "TARGET_NOT_FOUND");
    }

    await pool.query(
      `INSERT INTO user_follows (user_id, followed_user_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE user_id = user_id`,
      [req.user.id, targetId]
    );

    return sendOk(res, { following: true, target_user_id: targetId });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Error siguiendo usuario", "FOLLOW_FAILED");
  }
}

export async function unfollowUser(req, res) {
  try {
    if (!(await tableExists("user_follows"))) {
      return sendError(
        res,
        501,
        "Tabla user_follows no creada aun",
        "FOLLOWS_NOT_IMPLEMENTED"
      );
    }

    const followsColumns = await getTableColumns("user_follows");
    if (!followsColumns.has("user_id") || !followsColumns.has("followed_user_id")) {
      return sendError(
        res,
        500,
        "user_follows no tiene columnas user_id/followed_user_id",
        "FOLLOWS_SCHEMA_INVALID"
      );
    }

    const targetId = Number(req.params.id);
    if (!Number.isInteger(targetId) || targetId <= 0) {
      return sendError(res, 400, "ID de usuario invalido", "INVALID_USER_ID");
    }

    await pool.query(
      "DELETE FROM user_follows WHERE user_id = ? AND followed_user_id = ?",
      [req.user.id, targetId]
    );

    return sendOk(res, { following: false, target_user_id: targetId });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Error dejando de seguir", "UNFOLLOW_FAILED");
  }
}
