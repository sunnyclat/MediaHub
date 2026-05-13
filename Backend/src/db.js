// Importa mysql2 en modo promise
//
// mysql2/promise:
// permite usar async/await
import mysql from 'mysql2/promise';

// Importa dotenv
// para cargar variables .env
import dotenv from 'dotenv';



// ======================================================
// CARGAR VARIABLES DE ENTORNO
// ======================================================

dotenv.config();



// ======================================================
// CREAR POOL DE CONEXIONES
// ======================================================

// createPool():
// crea un grupo reutilizable de conexiones MySQL
//
// Mucho mejor que crear:
// una conexión nueva por request
//
// El pool:
// - reutiliza conexiones
// - mejora performance
// - evita sobrecargar MySQL
export const pool = await mysql.createPool({

    // Host de MySQL
    host: process.env.DB_HOST,

    // Usuario de MySQL
    user: process.env.DB_USER,

    // Password de MySQL
    password: process.env.DB_PASS,

    // Nombre de la base de datos
    database: process.env.DB_NAME,

    // Puerto
    //
    // Si existe DB_PORT:
    // lo convierte a Number
    //
    // Si no:
    // usa 3306
    port: process.env.DB_PORT
      ? Number(process.env.DB_PORT)
      : 3306,



  // ======================================================
  // CONFIGURACIÓN DEL POOL
  // ======================================================

  // Espera conexiones disponibles
  waitForConnections: true,

  // Máximo de conexiones simultáneas
  connectionLimit: 10,

  // 0 = cola ilimitada
  //
  // Requests esperan turno
  queueLimit: 0
});



// ======================================================
// CACHE DE INICIALIZACIÓN
// ======================================================

// Guarda la promesa de inicialización
//
// Esto evita ejecutar:
// ALTER TABLE
//
// múltiples veces simultáneamente
let userRolesReady;



// ======================================================
// ASEGURAR COLUMNA role EN users
// ======================================================

export async function ensureUserRolesReady() {

  // ======================================================
  // SI YA SE INICIALIZÓ
  // ======================================================

  // Devuelve la promesa existente
  //
  // Evita:
  // múltiples ALTER TABLE simultáneos
  if (userRolesReady) {

    return userRolesReady;
  }



  // ======================================================
  // INICIALIZACIÓN ÚNICA
  // ======================================================

  userRolesReady = (async () => {

    // Busca si existe columna role
    const [rows] = await pool.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = DATABASE()
       AND table_name = 'users'
       AND column_name = 'role'
       LIMIT 1`
    );



    // ======================================================
    // SI NO EXISTE role
    // ======================================================

    if (rows.length === 0) {

      // Agrega columna automáticamente
      await pool.query(
        "ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user' AFTER password_hash"
      );
    }

  })();



  // ======================================================
  // DEVOLVER PROMESA
  // ======================================================

  return userRolesReady;
}