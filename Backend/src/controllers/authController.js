import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ensureUserRolesReady, pool } from "../db.js";
import { requireFields } from "../helpers/validate.js";

dotenv.config();

export async function register(req, res) {
  await ensureUserRolesReady();
  const missing = requireFields(req.body, ["username", "email", "password"]);
  if (missing)
    return res.status(400).json({ message: `Falta ${missing}` });

  const { username, email, password } = req.body;

  const [exists] = await pool.query(
    "SELECT id FROM users WHERE email = ? OR username = ?",
    [email, username]
  );

  if (exists.length)
    return res.status(409).json({ message: "Usuario ya existe" });

  const hash = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO users (username, email, password_hash, role) VALUES (?,?,?,?)",
    [username, email, hash, "user"]
  );

  const token = jwt.sign(
    { id: result.insertId, username, email, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(201).json({
    token,
    user: { id: result.insertId, username, email, role: "user" }
  });
}

export async function login(req, res) {
  await ensureUserRolesReady();
  const missing = requireFields(req.body, ["email", "password"]);
  if (missing)
    return res.status(400).json({ message: `Falta ${missing}` });

  const { email, password } = req.body;

  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!rows.length)
    return res.status(401).json({ message: "Credenciales inválidas" });

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);

  if (!ok)
    return res.status(401).json({ message: "Credenciales inválidas" });

  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role || "user" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email, role: user.role || "user" }
  });
}
