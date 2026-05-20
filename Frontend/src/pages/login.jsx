// Hook de React para manejar estados.
import { useState } from "react";

// Hook navegación React Router.
import { useNavigate } from "react-router-dom";

// Helper centralizado para requests.
import { api } from "../api";

// Contexto autenticación global.
import { useAuth } from "../auth/AuthContext";

// Estilos compartidos.
import "./pageShell.css";


// Página Login.
export default function Login() {

  // Estado formulario.
  // Guarda email y password.
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  // Estado error.
  const [error, setError] = useState(null);

  // Estado loading submit.
  const [loading, setLoading] = useState(false);

  // Función login desde contexto auth.
  const { login } = useAuth();

  // Hook navegación.
  const navigate = useNavigate();


  // ============================================
  // SUBMIT LOGIN
  // ============================================

  async function submit(e) {

    // Evita reload página.
    e.preventDefault();

    // Limpia errores previos.
    setError(null);

    // Activa loading.
    setLoading(true);

    try {

      // Request login backend.
      const data = await api(
        "/api/auth/login",
        {
          method: "POST",

          // Envía form completo.
          body: form
        }
      );

      // Guarda token + user
      // en contexto/global storage.
      login(data.token, data.user);

      // Navega home.
      navigate("/");

    } catch (err) {

      // Guarda error backend/frontend.
      setError(err.message);

    } finally {

      // Finaliza loading.
      setLoading(false);
    }
  }


  return (

    <div className="form-shell panel">

      {/* Formulario login */}
      <form onSubmit={submit}>

        {/* Título */}
        <h2 className="page-title">
          Login
        </h2>

        {/* Subtítulo */}
        <p className="page-subtitle">
          Entra para seguir explorando Media Hub.
        </p>

        {/* Error visual */}
        {error && (
          <p className="form-error">
            {error}
          </p>
        )}


        {/* ============================================
            INPUT EMAIL
        ============================================ */}

        <input

          className="field-input"

          type="email"

          placeholder="Email"

          value={form.email}

          // Actualiza email manteniendo password.
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }

          required
        />


        {/* ============================================
            INPUT PASSWORD
        ============================================ */}

        <input

          className="field-input"

          type="password"

          placeholder="Password"

          value={form.password}

          // Actualiza password manteniendo email.
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }

          required
        />


        {/* ============================================
            BOTON SUBMIT
        ============================================ */}

        <button
          className="primary-button"
          disabled={loading}
        >

          {/* Texto dinámico */}
          {loading
            ? "Ingresando..."
            : "Entrar"}

        </button>
      </form>
    </div>
  );
}
