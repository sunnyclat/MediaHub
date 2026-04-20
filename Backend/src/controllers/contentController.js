import { pool } from "../db.js";

export async function listContent(req, res) {
  const { type } = req.query;

  const sql = type
    ? "SELECT * FROM content WHERE type = ? AND type != 'game'"
    : "SELECT * FROM content WHERE type != 'game'";

  const [rows] = await pool.query(sql, type ? [type] : []);
  res.json(rows);
}

export async function getContent(req, res) {
  const { id } = req.params;

  const [[content]] = await pool.query(
    "SELECT * FROM content WHERE id = ?",
    [id]
  );

  if (!content)
    return res.status(404).json({ message: "No encontrado" });

  const [genres] = await pool.query(
    `SELECT g.id, g.name
     FROM genres g
     JOIN content_genres cg ON g.id = cg.genre_id
     WHERE cg.content_id = ?`,
    [id]
  );

  const [platforms] = await pool.query(
    `SELECT p.id, p.name
     FROM platforms p
     JOIN content_platforms cp ON p.id = cp.platform_id
     WHERE cp.content_id = ?`,
    [id]
  );

  res.json({ ...content, genres, platforms });
}

export async function createContent(req, res) {
  const { title, description, release_year, type } = req.body;

  const [result] = await pool.query(
    "INSERT INTO content (title, description, release_year, type) VALUES (?,?,?,?)",
    [title, description, release_year, type]
  );

  res.status(201).json({ id: result.insertId });
}