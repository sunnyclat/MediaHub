import express from "express";
import { pool } from "../db.js";
import { adminRequired, authOptional, authRequired } from "../middleware/auth.js";

const router = express.Router();

async function tableExists(tableName) {
  const [rows] = await pool.query(
    `SELECT 1
     FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = ?
     LIMIT 1`,
    [tableName]
  );

  return rows.length > 0;
}

async function contentExists(contentId) {
  const [[row]] = await pool.query("SELECT id FROM content WHERE id = ?", [contentId]);
  return !!row;
}

async function getLikesCount(contentId) {
  const [[row]] = await pool.query(
    "SELECT COUNT(*) AS total FROM content_likes WHERE content_id = ?",
    [contentId]
  );
  return Number(row?.total || 0);
}

async function likedByUser(contentId, userId) {
  if (!userId) return false;
  const [[row]] = await pool.query(
    "SELECT 1 AS liked FROM content_likes WHERE content_id = ? AND user_id = ? LIMIT 1",
    [contentId, userId]
  );
  return !!row;
}

async function deleteIfTableExists(tableName, contentId) {
  if (!(await tableExists(tableName))) return;

  await pool.query(`DELETE FROM ${tableName} WHERE content_id = ?`, [contentId]);
}

router.get("/", async (req, res) => {
  const search = req.query.search;

  try {
    if (search) {
      const [rows] = await pool.query(
        "SELECT * FROM content WHERE LOWER(title) LIKE LOWER(?) AND type != 'game'",
        [`%${search}%`]
      );

      return res.json(rows);
    }

    const [rows] = await pool.query("SELECT * FROM content WHERE type != 'game'");

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const [rowsWithPoster] = await pool.query(
      "SELECT * FROM content WHERE type = 'movie' AND poster_path IS NOT NULL AND poster_path != '' AND title NOT IN ('Better Call Saul', 'Hollow Knight') ORDER BY created_at DESC LIMIT 8"
    );

    if (rowsWithPoster.length >= 8) {
      return res.json(rowsWithPoster);
    }

    const [rowsFallback] = await pool.query(
      "SELECT * FROM content WHERE type = 'movie' AND title NOT IN ('Better Call Saul', 'Hollow Knight') AND (poster_path IS NULL OR poster_path = '') ORDER BY created_at DESC LIMIT ?",
      [8 - rowsWithPoster.length]
    );

    res.json([...rowsWithPoster, ...rowsFallback]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo destacados" });
  }
});

router.get("/:id/likes", authOptional, async (req, res) => {
  const contentId = Number(req.params.id);

  if (!Number.isInteger(contentId) || contentId <= 0) {
    return res.status(400).json({ message: "ID de contenido invalido" });
  }

  try {
    const exists = await contentExists(contentId);
    if (!exists) {
      return res.status(404).json({ message: "Contenido no encontrado" });
    }

    const likesTableExists = await tableExists("content_likes");
    if (!likesTableExists) {
      return res.json({
        ok: true,
        data: {
          content_id: contentId,
          likes_count: 0,
          liked_by_me: false
        },
        meta: {
          note: "Tabla content_likes no creada aun"
        }
      });
    }

    const [count, liked] = await Promise.all([
      getLikesCount(contentId),
      likedByUser(contentId, req.user?.id)
    ]);

    return res.json({
      ok: true,
      data: {
        content_id: contentId,
        likes_count: count,
        liked_by_me: liked
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error obteniendo likes" });
  }
});

router.post("/:id/like", authRequired, async (req, res) => {
  const contentId = Number(req.params.id);

  if (!Number.isInteger(contentId) || contentId <= 0) {
    return res.status(400).json({ message: "ID de contenido invalido" });
  }

  try {
    const exists = await contentExists(contentId);
    if (!exists) {
      return res.status(404).json({ message: "Contenido no encontrado" });
    }

    const likesTableExists = await tableExists("content_likes");
    if (!likesTableExists) {
      return res.status(501).json({ message: "Tabla content_likes no creada aun" });
    }

    await pool.query(
      "INSERT IGNORE INTO content_likes (content_id, user_id) VALUES (?, ?)",
      [contentId, req.user.id]
    );

    const count = await getLikesCount(contentId);

    return res.json({
      ok: true,
      data: {
        content_id: contentId,
        likes_count: count,
        liked_by_me: true
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error guardando like" });
  }
});

router.delete("/:id/like", authRequired, async (req, res) => {
  const contentId = Number(req.params.id);

  if (!Number.isInteger(contentId) || contentId <= 0) {
    return res.status(400).json({ message: "ID de contenido invalido" });
  }

  try {
    const exists = await contentExists(contentId);
    if (!exists) {
      return res.status(404).json({ message: "Contenido no encontrado" });
    }

    const likesTableExists = await tableExists("content_likes");
    if (!likesTableExists) {
      return res.status(501).json({ message: "Tabla content_likes no creada aun" });
    }

    await pool.query(
      "DELETE FROM content_likes WHERE content_id = ? AND user_id = ?",
      [contentId, req.user.id]
    );

    const count = await getLikesCount(contentId);

    return res.json({
      ok: true,
      data: {
        content_id: contentId,
        likes_count: count,
        liked_by_me: false
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error eliminando like" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query("SELECT * FROM content WHERE id = ?", [id]);

  res.json(rows[0]);
});

router.post("/from-tmdb", async (req, res) => {
  const { title, description, release_year, type, poster_path } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO content (title, description, release_year, type, poster_path) VALUES (?, ?, ?, ?, ?)",
      [title, description, release_year, type, poster_path]
    );

    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error guardando contenido" });
  }
});

router.put("/:id", authRequired, adminRequired, async (req, res) => {
  const { id } = req.params;
  const { poster_path, title, release_year, type } = req.body;

  const updates = [];
  const values = [];

  if (typeof poster_path === "string") {
    updates.push("poster_path = ?");
    values.push(poster_path);
  }

  if (typeof title === "string" && title.trim()) {
    updates.push("title = ?");
    values.push(title.trim());
  }

  if (typeof type === "string" && type.trim()) {
    const normalizedType = type.trim().toLowerCase();

    if (!["movie", "series"].includes(normalizedType)) {
      return res.status(400).json({ error: "Tipo invalido" });
    }

    updates.push("type = ?");
    values.push(normalizedType);
  }

  if (!(release_year === null || release_year === "" || release_year === undefined)) {
    const parsedYear = Number(release_year);

    if (!Number.isInteger(parsedYear) || parsedYear < 1888 || parsedYear > 2100) {
      return res.status(400).json({ error: "Ano invalido" });
    }

    updates.push("release_year = ?");
    values.push(parsedYear);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No hay cambios para guardar" });
  }

  try {
    values.push(id);
    await pool.query(`UPDATE content SET ${updates.join(", ")} WHERE id = ?`, values);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error actualizando poster" });
  }
});

router.delete("/:id", authRequired, adminRequired, async (req, res) => {
  const contentId = Number(req.params.id);

  if (!Number.isInteger(contentId) || contentId <= 0) {
    return res.status(400).json({ message: "ID de contenido invalido" });
  }

  try {
    const exists = await contentExists(contentId);
    if (!exists) {
      return res.status(404).json({ message: "Contenido no encontrado" });
    }

    await deleteIfTableExists("content_likes", contentId);
    await deleteIfTableExists("saved_content", contentId);
    await deleteIfTableExists("content_genres", contentId);
    await deleteIfTableExists("content_platforms", contentId);

    await pool.query("DELETE FROM content WHERE id = ?", [contentId]);

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error eliminando contenido" });
  }
});

export default router;
