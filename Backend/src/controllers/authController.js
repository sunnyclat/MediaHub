// Importa bcryptjs para hashear y comparar contraseñas
import bcrypt from "bcryptjs";

// Importa jsonwebtoken para generar tokens JWT
import jwt from "jsonwebtoken";

// Importa dotenv para cargar variables de entorno desde el archivo .env
import dotenv from "dotenv";

// Importa la conexión a la base de datos y una función auxiliar
import { ensureUserRolesReady, pool } from "../db.js";

// Importa una función que valida campos requeridos
import { requireFields } from "../helpers/validate.js";

// Carga las variables del archivo .env
dotenv.config();


// =========================
// REGISTRO DE USUARIO
// =========================
export async function register(req, res) {

  // Se asegura de que los roles necesarios existan en la DB
  await ensureUserRolesReady();

  // Verifica si faltan campos obligatorios en el body
  const missing = requireFields(req.body, ["username", "email", "password"]);

  // Si falta alguno, devuelve error 400
  if (missing)
    return res.status(400).json({ message: `Falta ${missing}` });

  // Extrae los datos enviados por el cliente
  const { username, email, password } = req.body;

  // Busca si ya existe un usuario con ese email o username
  const [exists] = await pool.query(
    "SELECT id FROM users WHERE email = ? OR username = ?",
    [email, username]
  );

  // Si existe al menos un resultado, devuelve conflicto
  if (exists.length)
    return res.status(409).json({ message: "Usuario ya existe" });

  // Genera un hash seguro de la contraseña
  // El número 10 son las "salt rounds"
  const hash = await bcrypt.hash(password, 10);

  // Inserta el nuevo usuario en la base de datos
  const [result] = await pool.query(
    "INSERT INTO users (username, email, password_hash, role) VALUES (?,?,?,?)",
    [username, email, hash, "user"]
  );

  // Genera un token JWT con información del usuario
  const token = jwt.sign(

    // Payload: datos que se guardan dentro del token
    {
      id: result.insertId,
      username,
      email,
      role: "user"
    },

    // Clave secreta usada para firmar el token
    process.env.JWT_SECRET,

    // Configuración del token
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  // Devuelve respuesta exitosa
  res.status(201).json({

    // Token JWT
    token,

    // Datos del usuario
    user: {
      id: result.insertId,
      username,
      email,
      role: "user"
    }
  });
}



// =========================
// LOGIN DE USUARIO
// =========================
export async function login(req, res) {

  // Asegura que los roles estén preparados
  await ensureUserRolesReady();

  // Verifica que existan email y password
  const missing = requireFields(req.body, ["email", "password"]);

  // Si falta algo, devuelve error
  if (missing)
    return res.status(400).json({ message: `Falta ${missing}` });

  // Obtiene email y password enviados
  const { email, password } = req.body;

  // Busca el usuario por email
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  // Si no existe el usuario, credenciales inválidas
  if (!rows.length)
    return res.status(401).json({ message: "Credenciales inválidas" });

  // Toma el primer usuario encontrado
  const user = rows[0];

  // Compara la contraseña enviada con el hash guardado
  const ok = await bcrypt.compare(password, user.password_hash);

  // Si la contraseña no coincide
  if (!ok)
    return res.status(401).json({ message: "Credenciales inválidas" });

  // Genera un nuevo token JWT
  const token = jwt.sign(

    // Datos incluidos en el token
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || "user"
    },

    // Clave secreta
    process.env.JWT_SECRET,

    // Tiempo de expiración
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  // Respuesta exitosa
  res.json({

    // JWT
    token,

    // Información del usuario
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role || "user"
    }
  });
}