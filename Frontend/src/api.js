const API_BASE = import.meta.env.VITE_API_BASE;

export async function api(path, { method = "GET", body, token } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      throw new Error(
        data?.message ||
        data?.error?.message ||
        `Error ${res.status}: ${res.statusText}`
      );
    }

    return data;
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error("Error de conexión. Verifica que el servidor esté corriendo.");
    }
    throw err;
  }
}
