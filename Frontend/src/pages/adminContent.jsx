import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Función personalizada para requests al backend.
import { api } from "../api";

// Hook de autenticación para acceder al token.
import { useAuth } from "../auth/AuthContext";

// Estilos generales y específicos.
import "./pageShell.css";
import "./adminContent.css";


// Página de administración de contenido.
// Permite:
// - buscar
// - filtrar
// - ordenar
// - eliminar contenido
export default function AdminContent() {

  // Obtiene token para requests protegidas.
  const { token } = useAuth();

  // Estado de búsqueda por título.
  const [search, setSearch] = useState("");

  // Estado del filtro por tipo.
  const [typeFilter, setTypeFilter] = useState("all");

  // Estado del filtro por año.
  const [yearFilter, setYearFilter] = useState("");

  // Estado del ordenamiento.
  const [sortBy, setSortBy] = useState("title-asc");

  // Lista completa de contenidos.
  const [items, setItems] = useState([]);

  // Estado de carga.
  const [loading, setLoading] = useState(true);

  // Estado de error.
  const [error, setError] = useState("");

  // Guarda el ID del item que se está eliminando.
  // Sirve para deshabilitar el botón correspondiente.
  const [busyId, setBusyId] = useState(null);


  // useEffect que carga contenido desde backend
  // cuando cambia el search.
  useEffect(() => {

    // Controlador para cancelar requests si el componente desmonta.
    const controller = new AbortController();

    async function loadContent() {

      setLoading(true);
      setError("");

      try {

        // Construye query dependiendo si existe búsqueda.
        const query = search.trim()
          ? `/api/content?search=${encodeURIComponent(search.trim())}`
          : "/api/content";

        // Hace request.
        const data = await api(query);

        // Evita actualizar estado si request fue abortada.
        if (!controller.signal.aborted) {

          // Garantiza que items sea array.
          setItems(Array.isArray(data) ? data : []);
        }

      } catch (loadError) {

        // Manejo de errores.
        if (!controller.signal.aborted) {

          setError(
            loadError.message ||
            "No se pudo cargar el contenido."
          );

          setItems([]);
        }

      } finally {

        // Finaliza loading.
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    // Ejecuta carga.
    loadContent();

    // Cleanup del effect.
    return () => controller.abort();

  }, [search]);


  // Función para eliminar contenido.
  async function handleDelete(item) {

    // Confirmación antes de eliminar.
    const confirmed = window.confirm(
      `Vas a eliminar "${item.title}". Esta accion no se puede deshacer.`
    );

    // Si cancela, corta ejecución.
    if (!confirmed) return;

    // Marca item como ocupado.
    setBusyId(item.id);

    // Limpia errores previos.
    setError("");

    try {

      // Request DELETE al backend.
      await api(`/api/content/${item.id}`, {
        method: "DELETE",
        token
      });

      // Elimina item localmente del estado.
      setItems((current) =>
        current.filter(
          (currentItem) =>
            currentItem.id !== item.id
        )
      );

    } catch (deleteError) {

      // Error al eliminar.
      setError(
        deleteError.message ||
        "No se pudo eliminar el contenido."
      );

    } finally {

      // Libera estado busy.
      setBusyId(null);
    }
  }


  // Filtro por tipo.
  const filteredItems = items.filter((item) => {

    // "all" no filtra nada.
    if (typeFilter === "all") return true;

    // Filtra por tipo exacto.
    return item.type === typeFilter;
  });


  // Filtro por año.
  const yearFilteredItems = filteredItems.filter((item) => {

    // Si no hay filtro, deja pasar todos.
    if (!yearFilter.trim()) return true;

    // Busca coincidencia parcial.
    return String(item.release_year || "")
      .includes(yearFilter.trim());
  });


  // Ordenamiento final.
  const sortedItems = [...yearFilteredItems].sort((a, b) => {

    switch (sortBy) {

      case "title-desc":
        return (b.title || "")
          .localeCompare(a.title || "");

      case "year-desc":
        return Number(b.release_year || 0) -
               Number(a.release_year || 0);

      case "year-asc":
        return Number(a.release_year || 0) -
               Number(b.release_year || 0);

      case "created-desc":
        return new Date(b.created_at || 0).getTime() -
               new Date(a.created_at || 0).getTime();

      case "created-asc":
        return new Date(a.created_at || 0).getTime() -
               new Date(b.created_at || 0).getTime();

      // Orden por defecto.
      default:
        return (a.title || "")
          .localeCompare(b.title || "");
    }
  });


  return (
    <div className="page-shell">

      <div className="panel admin-content-shell">

        {/* Header principal */}
        <div className="admin-content-header">

          <div>
            <h1 className="page-title">
              Panel Admin
            </h1>

            <p className="page-subtitle">
              Busca contenido guardado en tu base y administralo rapido.
            </p>
          </div>

          {/* Link al catálogo */}
          <Link
            to="/catalog"
            className="tab-button admin-content-link"
          >
            Ver catalogo
          </Link>
        </div>


        {/* Input de búsqueda */}
        <input
          type="text"
          className="field-input"
          placeholder="Buscar por titulo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />


        {/* Toolbar */}
        <div className="admin-content-toolbar">

          {/* Filtro por año */}
          <input
            type="text"
            className="field-input admin-year-filter"
            placeholder="Filtrar por ano"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            maxLength={4}
          />

          {/* Selector de orden */}
          <select
            className="field-input admin-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title-asc">
              Titulo A-Z
            </option>

            <option value="title-desc">
              Titulo Z-A
            </option>

            <option value="year-desc">
              Ano mas nuevo
            </option>

            <option value="year-asc">
              Ano mas viejo
            </option>

            <option value="created-desc">
              Cargado reciente
            </option>

            <option value="created-asc">
              Cargado antiguo
            </option>
          </select>
        </div>


        {/* Filtros por tipo */}
        <div className="admin-content-filters">

          <button
            type="button"
            className={`tab-button ${
              typeFilter === "all"
                ? "is-active"
                : ""
            }`}
            onClick={() => setTypeFilter("all")}
          >
            Todos
          </button>

          <button
            type="button"
            className={`tab-button ${
              typeFilter === "movie"
                ? "is-active"
                : ""
            }`}
            onClick={() => setTypeFilter("movie")}
          >
            Peliculas
          </button>

          <button
            type="button"
            className={`tab-button ${
              typeFilter === "series"
                ? "is-active"
                : ""
            }`}
            onClick={() => setTypeFilter("series")}
          >
            Series
          </button>
        </div>


        {/* Error */}
        {error ? (
          <p className="form-error">
            {error}
          </p>
        ) : null}


        {/* Loading */}
        {loading ? (
          <p className="muted-text">
            Cargando contenido...
          </p>
        ) : null}


        {/* Estado vacío */}
        {!loading && sortedItems.length === 0 ? (
          <p className="muted-text">
            No se encontro contenido con ese criterio.
          </p>
        ) : null}


        {/* Lista de contenido */}
        {!loading && sortedItems.length > 0 ? (

          <div className="admin-content-list">

            {sortedItems.map((item) => {

              // URL del poster.
              const imageUrl = item.poster_path
                ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                : "https://via.placeholder.com/120x180?text=Sin+imagen";

              return (

                <article
                  key={item.id}
                  className="panel-soft admin-content-row"
                >

                  {/* Poster */}
                  <img
                    src={imageUrl}
                    alt={item.title || "Sin titulo"}
                    className="admin-content-poster"
                  />

                  {/* Info */}
                  <div className="admin-content-main">

                    <h2 className="admin-content-title">
                      {item.title}
                    </h2>

                    <p className="muted-text">
                      ID {item.id} ·
                      {item.type || "sin tipo"} ·
                      {item.release_year || "sin ano"}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="admin-content-actions">

                    <Link
                      to={`/content/${item.id}`}
                      className="tab-button admin-content-link"
                    >
                      Editar
                    </Link>

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDelete(item)}
                      disabled={busyId === item.id}
                    >
                      {busyId === item.id
                        ? "Eliminando..."
                        : "Eliminar"}
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