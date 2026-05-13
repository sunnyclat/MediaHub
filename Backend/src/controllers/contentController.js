// Importa la conexión a la base de datos
import { pool } from "../db.js";



// =========================
// LISTAR CONTENIDO
// =========================
export async function listContent(req, res) {

  // Obtiene el parámetro "type" desde la query string
  // Ejemplo:
  // /content?type=movie
  const { type } = req.query;

  // Si existe type:
  // selecciona solo ese tipo de contenido
  // y excluye los juegos
  //
  // Si NO existe type:
  // devuelve todo excepto juegos
  const sql = type
    ? "SELECT * FROM content WHERE type = ? AND type != 'game'"
    : "SELECT * FROM content WHERE type != 'game'";

  // Ejecuta la consulta SQL
  //
  // Si hay type:
  // envía [type] como parámetro
  //
  // Si no hay type:
  // envía un array vacío
  const [rows] = await pool.query(sql, type ? [type] : []);

  // Devuelve todos los resultados en formato JSON
  res.json(rows);
}



// =========================
// OBTENER UN CONTENIDO
// =========================
export async function getContent(req, res) {

  // Obtiene el id desde la URL
  // Ejemplo:
  // /content/5
  const { id } = req.params;

  // Busca el contenido por id
  const [[content]] = await pool.query(
    "SELECT * FROM content WHERE id = ?",
    [id]
  );

  // Si no existe contenido con ese id
  if (!content)

    // Devuelve error 404
    return res.status(404).json({
      message: "No encontrado"
    });



  // =========================
  // OBTENER GÉNEROS
  // =========================

  // Busca los géneros relacionados con ese contenido
  //
  // JOIN conecta:
  // genres
  // con
  // content_genres
  //
  // content_genres funciona como tabla intermedia
  // para relaciones muchos a muchos
  const [genres] = await pool.query(
    `SELECT g.id, g.name
     FROM genres g
     JOIN content_genres cg ON g.id = cg.genre_id
     WHERE cg.content_id = ?`,
    [id]
  );



  // =========================
  // OBTENER PLATAFORMAS
  // =========================

  // Busca las plataformas asociadas al contenido
  //
  // Otra relación muchos a muchos:
  // content_platforms
  const [platforms] = await pool.query(
    `SELECT p.id, p.name
     FROM platforms p
     JOIN content_platforms cp ON p.id = cp.platform_id
     WHERE cp.content_id = ?`,
    [id]
  );



  // =========================
  // RESPUESTA FINAL
  // =========================

  // Devuelve:
  // - datos del contenido
  // - géneros
  // - plataformas
  //
  // El operador ...content copia todas las propiedades
  // del objeto content
  res.json({
    ...content,
    genres,
    platforms
  });
}



// =========================
// CREAR CONTENIDO
// =========================
export async function createContent(req, res) {

  // Extrae los datos enviados desde el frontend
  const {
    title,
    description,
    release_year,
    type
  } = req.body;

  // Inserta el contenido en la base de datos
  const [result] = await pool.query(
    "INSERT INTO content (title, description, release_year, type) VALUES (?,?,?,?)",
    [title, description, release_year, type]
  );

  // Devuelve el id del contenido creado
  res.status(201).json({
    id: result.insertId
  });
}