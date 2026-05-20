import { Navigate } from "react-router-dom";

// Importa el hook personalizado de autenticación.
// Permite acceder al token del usuario logueado.
import { useAuth } from "./AuthContext";

// Componente para proteger rutas privadas.
// Solo renderiza el contenido si el usuario
// está autenticado.
export default function ProtectedRoute({ children }) {

  // Obtiene el token desde el contexto global.
  const { token } = useAuth();

  // Si no existe token:
  // redirige automáticamente al login.
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si existe token:
  // renderiza el contenido protegido.
  return children;
}