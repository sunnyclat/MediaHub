// Importa Express
import express from "express";

// Importa conexión MySQL
import { pool } from "../db.js";

// Importa middlewares de autenticación
import {
  adminRequired,
  authOptional,
  authRequired
} from "../middleware/auth.js";



// ======================================================
// CREAR ROUTER
// ======================================================

const router = express.Router();



// ======================================================
// VERIFICAR SI EXISTE UNA TABLA
// ======================================================

async function tableExists(tableName) {

  // Consulta information_schema.tables
  //
  // Verifica si existe la tabla
  const [rows] = await pool.query(
    `SELECT 1
     FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = ?
     LIMIT 1`,
    [tableName]
  );

  // true si existe
  return rows.length > 0;
}



// ======================================================
// VERIFICAR SI EXISTE CONTENIDO
// ======================================================

async function contentExists(contentId) {

  // Busca contenido por ID
  const [[row]] = await pool.query(
    "SELECT id FROM content WHERE id = ?",
    [contentId]
  );

  // Convierte resultado a boolean
  return !!row;
}



// ======================================================
// OBTENER TOTAL DE LIKES
// ======================================================

async function getLikesCount(contentId) {

  // Cuenta likes asociados al contenido
  const [[row]] = await pool.query(
    "SELECT COUNT(*) AS total FROM content_likes WHERE content_id = ?",
    [contentId]
  );

  return Number(row?.total || 0);
}



// ======================================================
// VERIFICAR SI EL USUARIO DIO LIKE
// ======================================================

async function likedByUser(contentId, userId) {

  // Si no hay usuario logueado
  if (!userId) return false;

  // Busca relación like
  const [[row]] = await pool.query(
    "SELECT 1 AS liked FROM content_likes WHERE content_id = ? AND user_id = ? LIMIT 1",
    [contentId, userId]
  );

  return !!row;
}



// ======================================================
// ELIMINAR RELACIONES SI EXISTE LA TABLA
// ======================================================

async function deleteIfTableExists(tableName, contentId) {

  // Si la tabla no existe
  if (!(await tableExists(tableName))) return;

  // Elimina relaciones asociadas
  await pool.query(
    `DELETE FROM ${tableName} WHERE content_id = ?`,
    [contentId]
  );
}



// ======================================================
// LISTAR CONTENIDO
// ======================================================

router.get("/", async (req, res) => {

  // Query string de búsqueda
  const search = req.query.search;

  try {

    // ======================================================
    // BÚSQUEDA POR TEXTO
    // ======================================================

    if (search) {

      // LOWER():
      // hace búsqueda case insensitive
      const [rows] = await pool.query(
        "SELECT * FROM content WHERE LOWER(title) LIKE LOWER(?) AND type != 'game'",
        [`%${search}%`]
      );

      return res.json(rows);
    }



    // ======================================================
    // LISTADO GENERAL
    // ======================================================

    const [rows] = await pool.query(
      "SELECT * FROM content WHERE type != 'game'"
    );

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Error en el servidor"
    });
  }
});



// ======================================================
// CONTENIDO DESTACADO
// ======================================================

router.get("/featured", async (req, res) => {

  try {

    // Busca películas con poster
    const [rowsWithPoster] = await pool.query(
      "SELECT * FROM content WHERE type = 'movie' AND poster_path IS NOT NULL AND poster_path != '' AND title NOT IN ('Better Call Saul', 'Hollow Knight') ORDER BY created_at DESC LIMIT 8"
    );



    // ======================================================
    // SI YA HAY 8 RESULTADOS
    // ======================================================

    if (rowsWithPoster.length >= 8) {
      return res.json(rowsWithPoster);
    }



    // ======================================================
    // COMPLETAR FALTANTES
    // ======================================================

    // Busca películas sin poster
    const [rowsFallback] = await pool.query(
      "SELECT * FROM content WHERE type = 'movie' AND title NOT IN ('Better Call Saul', 'Hollow Knight') AND (poster_path IS NULL OR poster_path = '') ORDER BY created_at DESC LIMIT ?",
      [8 - rowsWithPoster.length]
    );

    // Combina ambos arrays
    res.json([
      ...rowsWithPoster,
      ...rowsFallback
    ]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Error obteniendo destacados"
    });
  }
});



// ======================================================
// OBTENER LIKES DE CONTENIDO
// ======================================================

router.get("/:id/likes", authOptional, async (req, res) => {

  // Convierte ID a número
  const contentId = Number(req.params.id);



  // ======================================================
  // VALIDAR ID
  // ======================================================

  if (!Number.isInteger(contentId) || contentId <= 0) {

    return res.status(400).json({
      message: "ID de contenido invalido"
    });
  }

  try {

    // Verifica si existe contenido
    const exists = await contentExists(contentId);

    if (!exists) {

      return res.status(404).json({
        message: "Contenido no encontrado"
      });
    }



    // ======================================================
    // VALIDAR TABLA content_likes
    // ======================================================

    const likesTableExists =
      await tableExists("content_likes");

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



    // ======================================================
    // EJECUTAR CONSULTAS EN PARALELO
    // ======================================================

    // Promise.all:
    // ejecuta ambas consultas al mismo tiempo
    const [count, liked] = await Promise.all([

      getLikesCount(contentId),

      likedByUser(contentId, req.user?.id)
    ]);



    // ======================================================
    // RESPUESTA
    // ======================================================

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

    return res.status(500).json({
      message: "Error obteniendo likes"
    });
  }
});



// ======================================================
// DAR LIKE
// ======================================================

router.post("/:id/like", authRequired, async (req, res) => {

  // authRequired:
  // exige usuario autenticado

  const contentId = Number(req.params.id);



  // ======================================================
  // VALIDAR ID
  // ======================================================

  if (!Number.isInteger(contentId) || contentId <= 0) {

    return res.status(400).json({
      message: "ID de contenido invalido"
    });
  }

  try {

    // Verifica existencia
    const exists = await contentExists(contentId);

    if (!exists) {

      return res.status(404).json({
        message: "Contenido no encontrado"
      });
    }



    // ======================================================
    // VALIDAR TABLA
    // ======================================================

    const likesTableExists =
      await tableExists("content_likes");

    if (!likesTableExists) {

      return res.status(501).json({
        message: "Tabla content_likes no creada aun"
      });
    }



    // ======================================================
    // INSERTAR LIKE
    // ======================================================

    // INSERT IGNORE:
    // evita error si ya existe
    await pool.query(
      "INSERT IGNORE INTO content_likes (content_id, user_id) VALUES (?, ?)",
      [contentId, req.user.id]
    );



    // ======================================================
    // CONTAR LIKES ACTUALIZADOS
    // ======================================================

    const count = await getLikesCount(contentId);



    // ======================================================
    // RESPUESTA
    // ======================================================

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

    return res.status(500).json({
      message: "Error guardando like"
    });
  }
});



// ======================================================
// ELIMINAR LIKE
// ======================================================

router.delete("/:id/like", authRequired, async (req, res) => {

  // Similar al POST like
  // pero elimina la relación

  const contentId = Number(req.params.id);

  if (!Number.isInteger(contentId) || contentId <= 0) {

    return res.status(400).json({
      message: "ID de contenido invalido"
    });
  }

  try {

    const exists = await contentExists(contentId);

    if (!exists) {

      return res.status(404).json({
        message: "Contenido no encontrado"
      });
    }

    const likesTableExists =
      await tableExists("content_likes");

    if (!likesTableExists) {

      return res.status(501).json({
        message: "Tabla content_likes no creada aun"
      });
    }



    // ======================================================
    // BORRAR LIKE
    // ======================================================

    await pool.query(
      "DELETE FROM content_likes WHERE content_id = ? AND user_id = ?",
      [contentId, req.user.id]
    );



    // ======================================================
    // NUEVO TOTAL
    // ======================================================

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

    return res.status(500).json({
      message: "Error eliminando like"
    });
  }
});