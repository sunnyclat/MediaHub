// ============================================
// HOOKS REACT
// ============================================

// useEffect -> efectos secundarios.
// useState -> manejo estado.
import {
  useEffect,
  useState
} from "react";


// ============================================
// REACT ROUTER
// ============================================

// Routes -> contenedor rutas.
// Route -> ruta individual.
// Link -> navegación SPA.
import {
  Routes,
  Route,
  Link
} from "react-router-dom";


// ============================================
// AUTH CONTEXT
// ============================================

// Hook autenticación global.
import { useAuth }
  from "./auth/AuthContext";


// ============================================
// PAGINAS
// ============================================

import Catalog from "./pages/catalog";

import Home from "./pages/home";

import Login from "./pages/login";

import Register from "./pages/register";

import ContentDetail from "./pages/contentDetail";

import Profile from "./pages/profile";


// ============================================
// ROUTE GUARDS
// ============================================

// Protege rutas autenticadas.
import ProtectedRoute
  from "./auth/protectedRoute";

// Protege rutas admin.
import AdminRoute
  from "./auth/AdminRoute";


// ============================================
// ADMIN PAGE
// ============================================

import AdminContent
  from "./pages/adminContent";


// ============================================
// APP ROOT
// ============================================

export default function App() {

  // ============================================
  // AUTH GLOBAL
  // ============================================

  // user -> usuario actual.
  // logout -> cierre sesión.
  const {
    user,
    logout
  } = useAuth();


  // ============================================
  // THEME STATE
  // ============================================

  const [theme, setTheme] =
    useState(() => {

      // Lee tema guardado.
      const savedTheme =
        localStorage.getItem(
          "mediahub-theme"
        );

      // Default light.
      return savedTheme === "dark"

        ? "dark"

        : "light";
    });


  // ============================================
  // APLICAR THEME
  // ============================================

  useEffect(() => {

    // Agrega atributo HTML.
    document.documentElement
      .setAttribute(
        "data-theme",
        theme
      );

    // Agrega atributo BODY.
    document.body
      .setAttribute(
        "data-theme",
        theme
      );

    // Persiste theme.
    localStorage.setItem(
      "mediahub-theme",
      theme
    );

  }, [theme]);


  // ============================================
  // TOGGLE THEME
  // ============================================

  const toggleTheme = () => {

    setTheme((currentTheme) =>

      currentTheme === "light"

        ? "dark"

        : "light"
    );
  };


  return (

    // ==========================================
    // APP LAYOUT ROOT
    // ==========================================

    <div
      style={{

        // Pantalla completa.
        width: "100vw",
        minHeight: "100vh",

        // Fuente base.
        fontFamily: "sans-serif",

        // Layout vertical.
        display: "flex",
        flexDirection: "column",

        // Variables CSS theme.
        background:
          "var(--app-surface)",

        color:
          "var(--text-primary)",

        // Animación transición.
        transition:
          "background 0.3s ease, color 0.3s ease"
      }}
    >


      {/* ======================================
          HEADER
      ====================================== */}

      <header
        style={{

          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          padding:
            "20px 40px",

          width: "100%",

          boxSizing:
            "border-box",

          background:
            "var(--header-surface)",

          borderBottom:
            "1px solid var(--border-color)",

          backdropFilter:
            "blur(12px)"
        }}
      >

        {/* LOGO */}
        <Link to="/">
          <b>MediaHub</b>
        </Link>


        {/* ====================================
            NAVIGATION
        ==================================== */}

        <nav
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center"
          }}
        >

          {/* ================================
              USUARIO LOGUEADO
          ================================ */}

          {user ? (

            <>

              {/* Perfil */}
              <Link
                to={`/profile/${user.username}`}
              >
                {user.username}
              </Link>


              {/* Catalogo */}
              <Link to="/catalog">
                Catalogo
              </Link>


              {/* Admin */}
              {user.role === "admin"

                ? (
                  <Link to="/admin/content">
                    Admin
                  </Link>
                )

                : null
              }


              {/* Logout */}
              <button onClick={logout}>
                Salir
              </button>
            </>

          ) : (

            // ================================
            // USUARIO NO LOGUEADO
            // ================================

            <>

              <Link to="/login">
                Login
              </Link>

              <Link to="/register">
                Registro
              </Link>
            </>
          )}
        </nav>
      </header>


      {/* Línea separadora */}
      <hr
        style={{
          width: "100%",
          borderColor:
            "var(--border-color)"
        }}
      />


      {/* ======================================
          CONTENIDO PRINCIPAL
      ====================================== */}

      <div
        style={{
          flex: 1,
          width: "100%"
        }}
      >

        {/* ====================================
            ROUTES
        ==================================== */}

        <Routes>

          {/* ================================
              HOME
          ================================ */}

          <Route
            path="/"

            element={
              <Home
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            }
          />


          {/* ================================
              AUTH
          ================================ */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ================================
              CONTENT
          ================================ */}

          <Route
            path="/content/:id"
            element={<ContentDetail />}
          />

          <Route
            path="/catalog"
            element={<Catalog />}
          />


          {/* ================================
              ADMIN
          ================================ */}

          <Route

            path="/admin/content"

            element={

              // Route protegida admin.
              <AdminRoute>

                <AdminContent />

              </AdminRoute>
            }
          />


          {/* ================================
              PROFILE OWN
          ================================ */}

          <Route

            path="/profile"

            element={

              // Route protegida login.
              <ProtectedRoute>

                <Profile />

              </ProtectedRoute>
            }
          />


          {/* ================================
              PROFILE USERNAME
          ================================ */}

          <Route

            path="/profile/:username"

            element={

              <ProtectedRoute>

                <Profile />

              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
