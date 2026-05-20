import { createContext, useContext, useState } from "react";

// Crea el contexto global de autenticación.
// Inicialmente arranca en null.
const AuthContext = createContext(null);

// Componente Provider.
// Envuelve la aplicación y comparte el estado de auth
// con todos los componentes hijos.
export function AuthProvider({ children }) {

  // Estado del token.
  // Se inicializa leyendo localStorage para mantener
  // la sesión incluso después de refrescar la página.
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );

  // Estado del usuario autenticado.
  // También se recupera desde localStorage.
  const [user, setUser] = useState(() => {

    // Obtiene el string JSON guardado.
    const u = localStorage.getItem("user");

    // Si existe, lo convierte nuevamente a objeto.
    // Si no existe, devuelve null.
    return u ? JSON.parse(u) : null;
  });

  // Función login.
  // Guarda token y usuario tanto en el estado
  // como en localStorage.
  function login(token, user) {

    // Actualiza estado React.
    setToken(token);
    setUser(user);

    // Persiste datos en localStorage.
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }

  // Función logout.
  // Limpia estado y almacenamiento local.
  function logout() {

    // Borra datos del estado.
    setToken(null);
    setUser(null);

    // Limpia TODO el localStorage.
    localStorage.clear();
  }

  // Expone los valores y funciones del contexto
  // a todos los componentes hijos.
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para consumir el contexto.
export function useAuth() {

  // Obtiene el contexto actual.
  const context = useContext(AuthContext);

  // Seguridad:
  // evita usar useAuth fuera del Provider.
  if (!context) {
    throw new Error(
      "useAuth debe ser usado dentro de AuthProvider"
    );
  }

  // Devuelve el contexto.
  return context;
}