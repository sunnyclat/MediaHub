import { pool } from "../db.js";

export async function listGenres(req, res) {
  const [rows] = await pool.query("SELECT * FROM genres ORDER BY name");
  res.json(rows);
}

export async function listPlatforms(req, res) {
  const [rows] = await pool.query("SELECT * FROM platforms ORDER BY name");
  res.json(rows);
}