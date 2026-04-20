import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

import Catalog from "./pages/catalog";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import ContentDetail from "./pages/contentDetail";
import Profile from "./pages/profile";
import ProtectedRoute from "./auth/protectedRoute";
import AdminRoute from "./auth/AdminRoute";
import AdminContent from "./pages/adminContent";

export default function App() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("mediahub-theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("mediahub-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        background: "var(--app-surface)",
        color: "var(--text-primary)",
        transition: "background 0.3s ease, color 0.3s ease"
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          width: "100%",
          boxSizing: "border-box",
          background: "var(--header-surface)",
          borderBottom: "1px solid var(--border-color)",
          backdropFilter: "blur(12px)"
        }}
      >
        <Link to="/">
          <b>MediaHub</b>
        </Link>

        <nav style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {user ? (
            <>
              <Link to={`/profile/${user.username}`}>{user.username}</Link>
              <Link to="/catalog">Catalogo</Link>
              {user.role === "admin" ? <Link to="/admin/content">Admin</Link> : null}
              <button onClick={logout}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Registro</Link>
            </>
          )}
        </nav>
      </header>

      <hr style={{ width: "100%", borderColor: "var(--border-color)" }} />

      <div style={{ flex: 1, width: "100%" }}>
        <Routes>
          <Route
            path="/"
            element={<Home theme={theme} onToggleTheme={toggleTheme} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/content/:id" element={<ContentDetail />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route
            path="/admin/content"
            element={
              <AdminRoute>
                <AdminContent />
              </AdminRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
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

