// ============================================
// BASE URL API
// ============================================

// Obtiene URL backend desde variables entorno.
//
// Ejemplo:
// http://localhost:4000
const API_BASE =
  import.meta.env.VITE_API_BASE;


// ============================================
// HELPER CENTRALIZADO API
// ============================================

// Función reutilizable para requests HTTP.
//
// Permite:
// - GET
// - POST
// - PUT
// - DELETE
//
// Maneja:
// - headers
// - token auth
// - body JSON
// - parseo response
// - errores
export async function api(
  path,
  {
    method = "GET",
    body,
    token
  } = {}
) {

  // ============================================
  // HEADERS BASE
  // ============================================

  const headers = {

    // Todas requests usan JSON.
    "Content-Type":
      "application/json",
  };


  // ============================================
  // AUTH TOKEN
  // ============================================

  // Si existe token:
  // agrega Authorization header.
  if (token) {

    headers.Authorization =
      `Bearer ${token}`;
  }


  try {

    // ==========================================
    // FETCH REQUEST
    // ==========================================

    const res = await fetch(

      // URL final:
      // API_BASE + endpoint.
      `${API_BASE}${path}`,

      {
        method,
        headers,

        // Body serializado JSON.
        body: body
          ? JSON.stringify(body)
          : undefined
      }
    );


    // ==========================================
    // PARSEO RESPONSE
    // ==========================================

    let data;

    try {

      // Intenta parsear JSON.
      data = await res.json();

    } catch {

      // Si response vacía:
      // fallback objeto vacío.
      data = {};
    }


    // ==========================================
    // ERROR HANDLING
    // ==========================================

    // Si status HTTP error:
    if (!res.ok) {

      throw new Error(

        // Prioridad mensajes:
        data?.message ||

        data?.error?.message ||

        `Error ${res.status}: ${res.statusText}`
      );
    }


    // ==========================================
    // SUCCESS
    // ==========================================

    return data;

  } catch (err) {

    // ==========================================
    // ERROR CONEXION
    // ==========================================

    // TypeError suele indicar:
    // - backend apagado
    // - CORS
    // - red caída
    if (err instanceof TypeError) {

      throw new Error(
        "Error de conexión. Verifica que el servidor esté corriendo."
      );
    }

    // Re-lanza error original.
    throw err;
  }
}