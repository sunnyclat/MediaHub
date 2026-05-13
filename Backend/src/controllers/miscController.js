// Importa la conexión a la base de datos
import { pool } from "../db.js";



// =========================
// LISTAR GÉNEROS
// =========================
export async function listGenres(req, res) {

  // Ejecuta una consulta SQL para obtener
  // todos los géneros ordenados alfabéticamente
  //
  // ORDER BY name:
  // ordena usando la columna "name"
  const [rows] = await pool.query(
    "SELECT * FROM genres ORDER BY name"
  );

  // Devuelve los géneros en formato JSON
  res.json(rows);
}



// =========================
// LISTAR PLATAFORMAS
// =========================
export async function listPlatforms(req, res) {

  // Obtiene todas las plataformas
  // ordenadas alfabéticamente
  const [rows] = await pool.query(
    "SELECT * FROM platforms ORDER BY name"
  );

  // Devuelve el resultado al cliente
  res.json(rows);
}