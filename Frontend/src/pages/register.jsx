// Hook manejo estados.
import { useState } from "react";

// Hook navegación.
import { useNavigate } from "react-router-dom";

// Helper requests backend.
import { api } from "../api";

// Contexto autenticación global.
import { useAuth } from "../auth/AuthContext";

// Estilos compartidos.
import "./pageShell.css";


// ============================================
// PAGINA REGISTER
// ============================================

export default function Register() {

  // ============================================
  // ESTADO FORMULARIO
  // ============================================

  // Guarda:
  // username
  // email
  // password
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  // Estado errores.
  const [error, setError] =
    useState(null);

  // Estado loading submit.
  const [loading, setLoading] =
    useState(false);

  // Función login desde AuthContext.
  const { login } = useAuth();

  // Hook navegación.
  const navigate = useNavigate();


  // ============================================
  // SUBMIT REGISTER
  // ============================================

  async function submit(e) {

    // Evita reload página.
    e.preventDefault();

    // Limpia errores anteriores.
    setError(null);

    // Activa loading.
    setLoading(true);

    try {

      // Request registro backend.
      const data = await api(
        "/api/auth/register",
        {
          method: "POST",

          // Envía form completo.
          body: form
        }
      );

      // Login automático post-registro.
      login(
        data.token,
        data.user
      );

      // Redirección home.
      navigate("/");

    } catch (err) {

      // Guarda mensaje error.
      setError(err.message);

    } finally {

      // Finaliza loading.
      setLoading(false);
    }
  }


  return (

    <div className="form-shell panel">

      {/* Formulario registro */}
      <form onSubmit={submit}>

        {/* ========================================
            HEADER
        ======================================== */}

        <h2 className="page-title">
          Registro
        </h2>

        <p className="page-subtitle">
          Crea tu cuenta para guardar contenido.
        </p>


        {/* ========================================
            ERROR
        ======================================== */}

        {error && (

          <p className="form-error">
            {error}
          </p>
        )}


        {/* ========================================
            USERNAME
        ======================================== */}

        <input

          className="field-input"

          placeholder="Usuario"

          value={form.username}

          // Actualiza username.
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value
            })
          }

          required
        />


        {/* ========================================
            EMAIL
        ======================================== */}

        <input

          className="field-input"

          type="email"

          placeholder="Email"

          value={form.email}

          // Actualiza email.
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }

          required
        />


        {/* ========================================
            PASSWORD
        ======================================== */}

        <input

          className="field-input"

          type="password"

          placeholder="Password"

          value={form.password}

          // Actualiza password.
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }

          required
        />


        {/* ========================================
            BOTON SUBMIT
        ======================================== */}

        <button
          className="primary-button"
          disabled={loading}
        >

          {/* Texto dinámico */}
          {loading
            ? "Creando..."
            : "Crear cuenta"}

        </button>
      </form>
    </div>
  );
}