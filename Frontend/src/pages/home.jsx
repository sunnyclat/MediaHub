import { useEffect, useState } from "react";
import ContentGrid from "../components/contentGrid";
import GlowingSphere from "../components/glowingSphere";
import { Link } from "react-router-dom";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function Home({ theme, onToggleTheme }) {
  console.log("Home renderizado");

  const { user } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const uniqueContent = Object.values(
    content.reduce((acc, item) => {
      const key = item.title.toLowerCase();

      // Si no existe o el nuevo tiene imagen, reemplaza
      if (!acc[key] || item.poster_path) {
        acc[key] = item;
      }

      return acc;
    }, {}),
  );

  const addToDatabase = async (item) => {
    console.log("Guardando:", item);

    try {
      const res = await fetch("http://localhost:4000/api/content/from-tmdb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: item.title || item.name,
          description: item.overview,
          release_year: (item.release_date || item.first_air_date)?.split(
            "-",
          )[0],
          type: item.media_type || "movie",
          poster_path: item.poster_path, // 👈 ESTO ES LO IMPORTANTE
        }),
      });

      const data = await res.json();
      const updated = await fetch("http://localhost:4000/api/content");
      const allContent = await updated.json();
      setContent(allContent);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSelectTMDB = async (item) => {
    const title = item.title || item.name;

    try {
      const existing = content.find(
        (c) => c.title.toLowerCase() === title.toLowerCase(),
      );

      if (existing) {
        navigate(`/content/${existing.id}`);
        return;
      }

      const created = await addToDatabase(item);

      if (created?.id) {
        navigate(`/content/${created.id}`);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const filteredContent = uniqueContent.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const [tmdbResults, setTmdbResults] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/content")
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const featuredData = await api("/api/content/featured");
        const moviesOnly = featuredData.filter((item) => item.type === "movie");

        if (moviesOnly.length >= 8) {
          setFeatured(moviesOnly.slice(0, 8));
          return;
        }

        const allContent = await api("/api/content");
        const extraMovies = allContent
          .filter(
            (item) =>
              item.type === "movie" &&
              !moviesOnly.some((f) => f.id === item.id),
          )
          .slice(0, 8 - moviesOnly.length);

        setFeatured([...moviesOnly, ...extraMovies]);
      } catch (error) {
        console.error("Error cargando destacados:", error);
      }
    };

    loadFeatured();
  }, []);

  console.log("TMDB RESULTS:", tmdbResults);

  return (
    <div className="home-page">
      <div className="home-toolbar">
        <button className="theme-toggle" onClick={onToggleTheme} type="button">
          {theme === "dark" ? "Cambiar a claro" : "Cambiar a oscuro"}
        </button>
      </div>

      <div className="hero-banner">
        <h1>¡Bienvenido a Media Hub!</h1>
        <p>Descubre y gestiona tu contenido multimedia favorito</p>
      </div>

      <div
        id="featured-section"
        className="section-banner section-banner-featured"
      >
        <h2>Destacados</h2>
        <p>Lo mejor en tu biblioteca, seleccionado para ti</p>
      </div>
      <ContentGrid items={featured} />

      <div id="content-section" className="section-banner section-banner-all">
        <h2>Contenido</h2>
        <p>Encuentra tu próxima película favorita</p>
      </div>

      <input
        type="text"
        placeholder="Buscar contenido..."
        className="search-input"
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);

          if (value.length > 2) {
            api(`/api/tmdb/search?query=${value}`)
              .then((data) => {
                console.log("TMDB DATA:", data);

                if (Array.isArray(data)) {
                  setTmdbResults(data);
                } else {
                  setTmdbResults([]);
                }
              })
              .catch((err) => {
                console.error("TMDB ERROR:", err);
                setTmdbResults([]);
              });
          } else {
            setTmdbResults([]);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const exact = uniqueContent.find(
              (c) => c.title.toLowerCase() === search.toLowerCase(),
            );

            if (exact) {
              navigate(`/content/${exact.id}`);
            }
          }
        }}
      />
      {Array.isArray(tmdbResults) && tmdbResults.length > 0 && (
        <ul className="search-suggestions">
          {tmdbResults.slice(0, 5).map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelectTMDB(item)}
              style={{ cursor: "pointer" }}
            >
              {item.title || item.name}
            </li>
          ))}
        </ul>
      )}

      {search && filteredContent.length > 0 && (
        <ul className="search-suggestions">
          {filteredContent.slice(0, 5).map((c) => (
            <li key={c.id} onClick={() => navigate(`/content/${c.id}`)}>
              {c.title}
            </li>
          ))}
        </ul>
      )}

      <h2 className="content-list-title">Contenido</h2>

      {loading && <p>Cargando contenido...</p>}

      {!loading && content.length === 0 && <p>No hay contenido aún.</p>}

      {!loading && content.length > 0 && (
        <ul className="content-list">
          {content.map((c) => (
            <li key={c.id} className="content-list-item">
              <Link to={`/content/${c.id}`}>
                <strong>{c.title}</strong> — {c.type}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-logo">Media Hub</div>
          <div className="footer-links">
            <a href="#content-section">Contenido</a>
            <a href="#featured-section">Destacados</a>
            {user ? (
              <Link to={`/profile/${user.username}`}>Perfil</Link>
            ) : (
              <button type="button" className="footer-link-disabled" disabled>
                Perfil
              </button>
            )}
          </div>
          <div className="footer-info">2026 © Media Hub. Todos los derechos reservados.</div>
        </div>
      </footer>
    </div>
  );
}
