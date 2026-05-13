// Importa el componente Navigate de react-router-dom.
// Sirve para redirigir automáticamente al usuario a otra ruta.
import { Navigate } from "react-router-dom";

// Importa el hook personalizado useAuth desde AuthContext.
// Este hook probablemente expone información de autenticación global
// como el token y los datos del usuario logueado.
import { useAuth } from "./AuthContext";

// Componente de protección de rutas para administradores.
// Recibe "children", es decir, los componentes/páginas
// que queremos renderizar solamente si el usuario es admin.
export default function AdminRoute({ children }) {

  // Obtiene el token y el usuario desde el contexto de autenticación.
  const { token, user } = useAuth();

  // Si NO existe token:
  // significa que el usuario no está autenticado.
  // Entonces se redirige al login.
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si existe usuario pero su rol NO es admin:
  // se lo redirige al inicio.
  if (user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  // Si pasó ambas validaciones:
  // está autenticado y es admin.
  // Entonces renderiza el contenido protegido.
  return children;
}