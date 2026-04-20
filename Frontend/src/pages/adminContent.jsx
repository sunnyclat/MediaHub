import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
import "./pageShell.css";
import "./adminContent.css";

export default function AdminContent() {
  const { token } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("");
  const [sortBy, setSortBy] = useState("title-asc");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadContent() {
      setLoading(true);
      setError("");

      try {
        const query = search.trim()
          ? `/api/content?search=${encodeURIComponent(search.trim())}`
          : "/api/content";
        const data = await api(query);

        if (!controller.signal.aborted) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError.message || "No se pudo cargar el contenido.");
          setItems([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadContent();

    return () => controller.abort();
  }, [search]);

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Vas a eliminar "${item.title}". Esta accion no se puede deshacer.`
    );

    if (!confirmed) return;

    setBusyId(item.id);
    setError("");

    try {
      await api(`/api/content/${item.id}`, {
        method: "DELETE",
        token
      });

      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
    } catch (deleteError) {
      setError(deleteError.message || "No se pudo eliminar el contenido.");
    } finally {
      setBusyId(null);
    }
  }

  const filteredItems = items.filter((item) => {
    if (typeFilter === "all") return true;
    return item.type === typeFilter;
  });

  const yearFilteredItems = filteredItems.filter((item) => {
    if (!yearFilter.trim()) return true;
    return String(item.release_year || "").includes(yearFilter.trim());
  });

  const sortedItems = [...yearFilteredItems].sort((a, b) => {
    switch (sortBy) {
      case "title-desc":
        return (b.title || "").localeCompare(a.title || "");
      case "year-desc":
        return Number(b.release_year || 0) - Number(a.release_year || 0);
      case "year-asc":
        return Number(a.release_year || 0) - Number(b.release_year || 0);
      case "created-desc":
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case "created-asc":
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      default:
        return (a.title || "").localeCompare(b.title || "");
    }
  });

  return (
    <div className="page-shell">
      <div className="panel admin-content-shell">
        <div className="admin-content-header">
          <div>
            <h1 className="page-title">Panel Admin</h1>
            <p className="page-subtitle">
              Busca contenido guardado en tu base y administralo rapido.
            </p>
          </div>
          <Link to="/catalog" className="tab-button admin-content-link">
            Ver catalogo
          </Link>
        </div>

        <input
          type="text"
          className="field-input"
          placeholder="Buscar por titulo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="admin-content-toolbar">
          <input
            type="text"
            className="field-input admin-year-filter"
            placeholder="Filtrar por ano"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            maxLength={4}
          />
          <select
            className="field-input admin-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title-asc">Titulo A-Z</option>
            <option value="title-desc">Titulo Z-A</option>
            <option value="year-desc">Ano mas nuevo</option>
            <option value="year-asc">Ano mas viejo</option>
            <option value="created-desc">Cargado reciente</option>
            <option value="created-asc">Cargado antiguo</option>
          </select>
        </div>

        <div className="admin-content-filters">
          <button
            type="button"
            className={`tab-button ${typeFilter === "all" ? "is-active" : ""}`}
            onClick={() => setTypeFilter("all")}
          >
            Todos
          </button>
          <button
            type="button"
            className={`tab-button ${typeFilter === "movie" ? "is-active" : ""}`}
            onClick={() => setTypeFilter("movie")}
          >
            Peliculas
          </button>
          <button
            type="button"
            className={`tab-button ${typeFilter === "series" ? "is-active" : ""}`}
            onClick={() => setTypeFilter("series")}
          >
            Series
          </button>
        </div>

        {error ? <p className="form-error">{error}</p> : null}
        {loading ? <p className="muted-text">Cargando contenido...</p> : null}

        {!loading && sortedItems.length === 0 ? (
          <p className="muted-text">No se encontro contenido con ese criterio.</p>
        ) : null}

        {!loading && sortedItems.length > 0 ? (
          <div className="admin-content-list">
            {sortedItems.map((item) => {
              const imageUrl = item.poster_path
                ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                : "https://via.placeholder.com/120x180?text=Sin+imagen";

              return (
                <article key={item.id} className="panel-soft admin-content-row">
                <img
                  src={imageUrl}
                  alt={item.title || "Sin titulo"}
                  className="admin-content-poster"
                />

                <div className="admin-content-main">
                  <h2 className="admin-content-title">{item.title}</h2>
                  <p className="muted-text">
                    ID {item.id} · {item.type || "sin tipo"} · {item.release_year || "sin ano"}
                  </p>
                </div>

                <div className="admin-content-actions">
                  <Link to={`/content/${item.id}`} className="tab-button admin-content-link">
                    Editar
                  </Link>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDelete(item)}
                    disabled={busyId === item.id}
                  >
                    {busyId === item.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
