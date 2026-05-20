// Hooks de React.
import { useEffect, useState } from "react";

// Componente reutilizable para mostrar contenido en grilla.
import ContentGrid from "../components/contentGrid";

// Link de navegación React Router.
import { Link } from "react-router-dom";

// Estilos.
import "./Home.css";

// Hook navegación programática.
import { useNavigate } from "react-router-dom";

// Helper API centralizado.
import { api } from "../api";

// Contexto auth.
import { useAuth } from "../auth/AuthContext";


// Página principal Home.
export default function Home({ theme, onToggleTheme }) {

  // Debug render.
  console.log("Home renderizado");

  // Usuario autenticado.
  const { user } = useAuth();

  // Contenido completo.
  const [content, setContent] = useState([]);

  // Estado loading.
  const [loading, setLoading] = useState(true);

  // Input búsqueda.
  const [search, setSearch] = useState("");

  // Hook navegación.
  const navigate = useNavigate();

  // Contenido destacado.
  const [featured, setFeatured] = useState([]);


  // ============================================
  // ELIMINAR DUPLICADOS POR TITULO
  // ============================================

  // Convierte array a objeto agrupado por título.
  // Si encuentra duplicados:
  // prioriza el que tenga poster_path.
  const uniqueContent = Object.values(

    content.reduce((acc, item) => {

      // Usa título como clave.
      const key = item.title.toLowerCase();

      // Si no existe o el nuevo tiene imagen:
      // reemplaza el anterior.
      if (!acc[key] || item.poster_path) {
        acc[key] = item;
      }

      return acc;

    }, {}),
  );


  // ============================================
  // AGREGAR CONTENIDO DESDE TMDB
  // ============================================

  const addToDatabase = async (item) => {

    console.log("Guardando:", item);

    try {

      // Request POST backend.
      const res = await fetch(
        "http://localhost:4000/api/content/from-tmdb",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          // Convierte item TMDB al formato backend.
          body: JSON.stringify({

            title: item.title || item.name,

            description: item.overview,

            release_year:
              (
                item.release_date ||
                item.first_air_date
              )?.split("-")[0],

            type:
              item.media_type || "movie",

            // Poster TMDB.
            poster_path: item.poster_path,
          }),
        },
      );

      // Respuesta creación.
      const data = await res.json();

      // Refetch contenido actualizado.
      const updated = await fetch(
        "http://localhost:4000/api/content"
      );

      const allContent = await updated.json();

      // Actualiza estado.
      setContent(allContent);

      return data;

    } catch (err) {

      console.error(err);

      return null;
    }
  };


  // ============================================
  // SELECCIONAR RESULTADO TMDB
  // ============================================

  const handleSelectTMDB = async (item) => {

    // Obtiene título compatible movie/tv.
    const title = item.title || item.name;

    try {

      // Busca si ya existe en DB.
      const existing = content.find(
        (c) =>
          c.title.toLowerCase() ===
          title.toLowerCase(),
      );

      // Si ya existe:
      // navega directamente.
      if (existing) {

        navigate(`/content/${existing.id}`);

        return;
      }

      // Si no existe:
      // crea contenido.
      const created =
        await addToDatabase(item);

      // Si se creó correctamente:
      if (created?.id) {

        navigate(`/content/${created.id}`);
      }

    } catch (err) {

      console.error("Error:", err);
    }
  };


  // ============================================
  // FILTRADO LOCAL
  // ============================================

  const filteredContent =
    uniqueContent.filter((c) =>

      c.title
        ?.toLowerCase()
        .includes(search.toLowerCase()),
    );


  // ============================================
  // RESULTADOS TMDB
  // ============================================

  const [tmdbResults, setTmdbResults] =
    useState([]);


  // ============================================
  // CARGA CONTENIDO LOCAL
  // ============================================

  useEffect(() => {

    fetch("http://localhost:4000/api/content")

      .then((res) => res.json())

      .then((data) => {

        setContent(data);

        setLoading(false);
      })

      .catch((err) => {

        console.error(
          "FETCH ERROR:",
          err
        );

        setLoading(false);
      });

  }, []);


  // ============================================
  // CARGA DESTACADOS
  // ============================================

  useEffect(() => {

    const loadFeatured = async () => {

      try {

        // Obtiene destacados backend.
        const featuredData =
          await api("/api/content/featured");

        // Solo películas.
        const moviesOnly =
          featuredData.filter(
            (item) => item.type === "movie"
          );

        // Si ya hay suficientes:
        if (moviesOnly.length >= 8) {

          setFeatured(
            moviesOnly.slice(0, 8)
          );

          return;
        }

        // Si faltan:
        // completa desde contenido general.
        const allContent =
          await api("/api/content");

        const extraMovies =
          allContent

            .filter(
              (item) =>
                item.type === "movie" &&

                !moviesOnly.some(
                  (f) => f.id === item.id
                ),
            )

            .slice(
              0,
              8 - moviesOnly.length
            );

        // Combina destacados + extras.
        setFeatured([
          ...moviesOnly,
          ...extraMovies
        ]);

      } catch (error) {

        console.error(
          "Error cargando destacados:",
          error
        );
      }
    };

    loadFeatured();

  }, []);


  // Debug TMDB.
  console.log(
    "TMDB RESULTS:",
    tmdbResults
  );


  return (

    <div className="home-page">

      {/* ============================================
          TOOLBAR
      ============================================ */}

      <div className="home-toolbar">

        {/* Toggle tema */}
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          type="button"
        >

          {theme === "dark"
            ? "Cambiar a claro"
            : "Cambiar a oscuro"}

        </button>
      </div>


      {/* ============================================
          HERO
      ============================================ */}

      <div className="hero-banner">

        <h1>
          ¡Bienvenido a Media Hub!
        </h1>

        <p>
          Descubre y gestiona tu contenido multimedia favorito
        </p>
      </div>


      {/* ============================================
          DESTACADOS
      ============================================ */}

      <div
        id="featured-section"
        className="section-banner section-banner-featured"
      >

        <h2>Destacados</h2>

        <p>
          Lo mejor en tu biblioteca,
          seleccionado para ti
        </p>
      </div>

      {/* Grid destacados */}
      <ContentGrid items={featured} />


      {/* ============================================
          CONTENIDO
      ============================================ */}

      <div
        id="content-section"
        className="section-banner section-banner-all"
      >

        <h2>Contenido</h2>

        <p>
          Encuentra tu próxima película favorita
        </p>
      </div>


      {/* ============================================
          INPUT BUSQUEDA
      ============================================ */}

      <input

        type="text"

        placeholder="Buscar contenido..."

        className="search-input"

        value={search}

        onChange={(e) => {

          const value = e.target.value;

          setSearch(value);

          // Si búsqueda tiene más de 2 caracteres:
          if (value.length > 2) {

            // Busca en TMDB.
            api(`/api/tmdb/search?query=${value}`)

              .then((data) => {

                console.log(
                  "TMDB DATA:",
                  data
                );

                // Guarda resultados.
                if (Array.isArray(data)) {

                  setTmdbResults(data);

                } else {

                  setTmdbResults([]);
                }
              })

              .catch((err) => {

                console.error(
                  "TMDB ERROR:",
                  err
                );

                setTmdbResults([]);
              });

          } else {

            // Limpia resultados.
            setTmdbResults([]);
          }
        }}

        // Enter navega directo si hay match exacto.
        onKeyDown={(e) => {

          if (e.key === "Enter") {

            const exact =
              uniqueContent.find(
                (c) =>
                  c.title.toLowerCase() ===
                  search.toLowerCase(),
              );

            if (exact) {

              navigate(
                `/content/${exact.id}`
              );
            }
          }
        }}
      />


      {/* ============================================
          RESULTADOS TMDB
      ============================================ */}

      {Array.isArray(tmdbResults) &&
        tmdbResults.length > 0 && (

        <ul className="search-suggestions">

          {tmdbResults
            .slice(0, 5)
            .map((item) => (

            <li
              key={item.id}

              onClick={() =>
                handleSelectTMDB(item)
              }

              style={{ cursor: "pointer" }}
            >

              {item.title || item.name}

            </li>
          ))}
        </ul>
      )}


      {/* ============================================
          RESULTADOS LOCALES
      ============================================ */}

      {search &&
        filteredContent.length > 0 && (

        <ul className="search-suggestions">

          {filteredContent
            .slice(0, 5)
            .map((c) => (

            <li
              key={c.id}

              onClick={() =>
                navigate(`/content/${c.id}`)
              }
            >

              {c.title}

            </li>
          ))}
        </ul>
      )}


      {/* ============================================
          LISTA SIMPLE CONTENIDO
      ============================================ */}

      <h2 className="content-list-title">
        Contenido
      </h2>

      {/* Loading */}
      {loading && (
        <p>Cargando contenido...</p>
      )}

      {/* Estado vacío */}
      {!loading &&
        content.length === 0 && (
        <p>No hay contenido aún.</p>
      )}

      {/* Lista contenido */}
      {!loading &&
        content.length > 0 && (

        <ul className="content-list">

          {content.map((c) => (

            <li
              key={c.id}
              className="content-list-item"
            >

              <Link to={`/content/${c.id}`}>

                <strong>{c.title}</strong>
                {" — "}
                {c.type}

              </Link>
            </li>
          ))}
        </ul>
      )}


      {/* ============================================
          FOOTER
      ============================================ */}

      <footer className="app-footer">

        <div className="footer-content">

          <div className="footer-logo">
            Media Hub
          </div>

          <div className="footer-links">

            <a href="#content-section">
              Contenido
            </a>

            <a href="#featured-section">
              Destacados
            </a>

            {/* Perfil si usuario existe */}
            {user ? (

              <Link
                to={`/profile/${user.username}`}
              >
                Perfil
              </Link>

            ) : (

              <button
                type="button"
                className="footer-link-disabled"
                disabled
              >
                Perfil
              </button>
            )}
          </div>

          <div className="footer-info">
            2026 © Media Hub.
            Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}