import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";
import "./contentDetail.css";
import "./pageShell.css";

function unwrapApi(payload) {
  if (payload && typeof payload === "object" && "ok" in payload) {
    return payload.data;
  }
  return payload;
}

function normalizePosterPath(value) {
  const trimmed = value?.trim();

  if (!trimmed) return "";

  const tmdbMatch = trimmed.match(/\/(?:original|w\d+)(\/.+)$/);
  if (tmdbMatch?.[1]) {
    return tmdbMatch[1];
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return `/${trimmed.replace(/^\/+/, "")}`;
}

export default function ContentDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [item, setItem] = useState(null);
  const [poster, setPoster] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [manualPosterPath, setManualPosterPath] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState("movie");
  const [editYear, setEditYear] = useState("");
  const [tmdbMatches, setTmdbMatches] = useState([]);
  const [editorBusy, setEditorBusy] = useState(false);
  const [editorError, setEditorError] = useState("");
  const [editorMessage, setEditorMessage] = useState("");
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [likedByMe, setLikedByMe] = useState(false);
  const [likesLoading, setLikesLoading] = useState(true);
  const [likeBusy, setLikeBusy] = useState(false);
  const [likeError, setLikeError] = useState("");
  const navigate = useNavigate();
  const canEditPoster = user?.role === "admin";

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await api(`/api/content/${id}`);
        setItem(data);
        setSearchTerm(data?.title || "");
        setManualPosterPath(data?.poster_path || "");
        setEditTitle(data?.title || "");
        setEditType(data?.type || "movie");
        setEditYear(data?.release_year ? String(data.release_year) : "");
      } catch (error) {
        console.error("Error cargando contenido", error);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  useEffect(() => {
    const fetchLikes = async () => {
      setLikesLoading(true);
      setLikeError("");

      try {
        const data = await api(`/api/content/${id}/likes`, { token });
        const parsed = unwrapApi(data);
        setLikesCount(Number(parsed?.likes_count || 0));
        setLikedByMe(Boolean(parsed?.liked_by_me));
      } catch (error) {
        setLikeError(error.message || "No se pudieron cargar los likes.");
      } finally {
        setLikesLoading(false);
      }
    };

    if (id) {
      fetchLikes();
    }
  }, [id, token]);

  useEffect(() => {
    if (!item || item.poster_path) return;

    const fetchPoster = async () => {
      try {
        const results = await api(`/api/tmdb/search?query=${encodeURIComponent(item.title)}`);

        if (Array.isArray(results) && results[0]?.poster_path) {
          const newPoster = results[0].poster_path;

          setPoster(`https://image.tmdb.org/t/p/w500${newPoster}`);
        }
      } catch (error) {
        console.error("Error buscando poster en TMDB", error);
      }
    };

    fetchPoster();
  }, [item]);

  async function savePosterPath(nextPosterPath) {
    const normalizedPath = normalizePosterPath(nextPosterPath);

    if (!normalizedPath) {
      setEditorError("Ingresa una ruta valida de TMDB.");
      return;
    }

    setEditorBusy(true);
    setEditorError("");
    setEditorMessage("");

    try {
      await api(`/api/content/${item.id}`, {
        method: "PUT",
        body: { poster_path: normalizedPath },
        token
      });

      setItem((current) =>
        current
          ? {
              ...current,
              poster_path: normalizedPath
            }
          : current
      );
      setPoster(`https://image.tmdb.org/t/p/w500${normalizedPath}`);
      setManualPosterPath(normalizedPath);
      setEditorMessage("Miniatura actualizada.");
    } catch (error) {
      setEditorError(error.message || "No se pudo actualizar la miniatura.");
    } finally {
      setEditorBusy(false);
    }
  }

  async function handleSaveMetadata() {
    const nextTitle = editTitle.trim();
    const nextType = editType.trim();
    const nextYear = editYear.trim();

    if (!nextTitle) {
      setEditorError("El titulo no puede quedar vacio.");
      return;
    }

    if (!["movie", "series"].includes(nextType)) {
      setEditorError("El tipo debe ser movie o series.");
      return;
    }

    if (nextYear && !/^\d{4}$/.test(nextYear)) {
      setEditorError("El ano debe tener 4 digitos.");
      return;
    }

    setEditorBusy(true);
    setEditorError("");
    setEditorMessage("");

    try {
      await api(`/api/content/${item.id}`, {
        method: "PUT",
        body: {
          title: nextTitle,
          type: nextType,
          release_year: nextYear || undefined
        },
        token
      });

      setItem((current) =>
        current
          ? {
              ...current,
              title: nextTitle,
              type: nextType,
              release_year: nextYear ? Number(nextYear) : current.release_year
            }
          : current
      );
      setSearchTerm(nextTitle);
      setEditorMessage("Titulo y ano actualizados.");
    } catch (error) {
      setEditorError(error.message || "No se pudieron actualizar los datos.");
    } finally {
      setEditorBusy(false);
    }
  }

  async function handleSearchPosters() {
    if (!searchTerm.trim()) {
      setEditorError("Escribe un titulo para buscar.");
      setTmdbMatches([]);
      return;
    }

    setEditorBusy(true);
    setEditorError("");
    setEditorMessage("");

    try {
      const results = await api(`/api/tmdb/search?query=${encodeURIComponent(searchTerm.trim())}`);
      const withPoster = Array.isArray(results)
        ? results.filter((result) => result.poster_path)
        : [];

      setTmdbMatches(withPoster);

      if (withPoster.length === 0) {
        setEditorMessage("No se encontraron miniaturas con imagen para ese titulo.");
      }
    } catch (error) {
      setEditorError(error.message || "No se pudo buscar en TMDB.");
      setTmdbMatches([]);
    } finally {
      setEditorBusy(false);
    }
  }

  async function handleToggleLike() {
    if (!token) {
      setLikeError("Inicia sesion para dar me gusta.");
      return;
    }

    if (!id || likeBusy) return;

    setLikeBusy(true);
    setLikeError("");

    const previousLiked = likedByMe;
    const previousCount = likesCount;
    const nextLiked = !previousLiked;

    setLikedByMe(nextLiked);
    setLikesCount((count) => (nextLiked ? count + 1 : Math.max(0, count - 1)));

    try {
      const data = await api(`/api/content/${id}/like`, {
        method: nextLiked ? "POST" : "DELETE",
        token
      });
      const parsed = unwrapApi(data);
      setLikesCount(Number(parsed?.likes_count || 0));
      setLikedByMe(Boolean(parsed?.liked_by_me));
    } catch (error) {
      setLikedByMe(previousLiked);
      setLikesCount(previousCount);
      setLikeError(error.message || "No se pudo actualizar el like.");
    } finally {
      setLikeBusy(false);
    }
  }

  async function handleDeleteContent() {
    if (!item?.id || !token || !canEditPoster || deleteBusy) return;

    const confirmed = window.confirm(
      `Vas a eliminar "${item.title}". Esta accion no se puede deshacer.`
    );

    if (!confirmed) return;

    setDeleteBusy(true);
    setDeleteError("");

    try {
      await api(`/api/content/${item.id}`, {
        method: "DELETE",
        token
      });

      navigate("/");
    } catch (error) {
      setDeleteError(error.message || "No se pudo eliminar el contenido.");
    } finally {
      setDeleteBusy(false);
    }
  }

  if (!item) {
    return (
      <div className="page-shell">
        <p className="muted-text">Cargando detalle...</p>
      </div>
    );
  }

  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : poster || "https://via.placeholder.com/500x750?text=Sin+imagen";

  return (
    <div className="page-shell">
      <button className="back-button" onClick={() => navigate(-1)}>
        Volver
      </button>

      <div className="detail-card panel">
        <img
          src={imageUrl}
          alt={item.title || "Sin titulo"}
          className="detail-poster"
        />

        <h1 className="page-title">{item.title}</h1>
        <p className="page-subtitle">{item.description || "Sin descripcion."}</p>

        <div className="likes-row">
          <button
            type="button"
            className={`like-button ${likedByMe ? "is-liked" : ""}`}
            onClick={handleToggleLike}
            disabled={likeBusy || likesLoading}
          >
            {likedByMe ? "Quitar me gusta" : "Me gusta"}
          </button>
          <span className="likes-count">
            {likesLoading ? "Cargando likes..." : `${likesCount} me gusta${likesCount === 1 ? "" : "s"}`}
          </span>
        </div>

        {!user && <p className="muted-text">Inicia sesion para dar me gusta.</p>}
        {likeError ? <p className="form-error">{likeError}</p> : null}

        {canEditPoster ? (
        <div className="poster-editor panel-soft">
          <div className="poster-editor-header">
            <div>
              <h2 className="poster-editor-title">Miniatura</h2>
              <p className="muted-text">
                Corrige la portada buscando en TMDB o pegando una ruta manual.
              </p>
            </div>
            <button
              type="button"
              className="tab-button"
              onClick={() => setEditorOpen((open) => !open)}
            >
              {editorOpen ? "Ocultar editor" : "Editar miniatura"}
            </button>
          </div>

          {editorOpen ? (
            <div className="poster-editor-body">
              <div className="poster-editor-actions">
                <input
                  type="text"
                  className="field-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Titulo"
                />
                <select
                  className="field-input poster-type-input"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                >
                  <option value="movie">Pelicula</option>
                  <option value="series">Serie</option>
                </select>
                <input
                  type="text"
                  className="field-input poster-year-input"
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  placeholder="Ano"
                  maxLength={4}
                />
                <button
                  type="button"
                  className="tab-button"
                  onClick={handleSaveMetadata}
                  disabled={editorBusy}
                >
                  Guardar datos
                </button>
              </div>

              <div className="poster-editor-actions">
                <input
                  type="text"
                  className="field-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar titulo en TMDB"
                />
                <button
                  type="button"
                  className="tab-button"
                  onClick={handleSearchPosters}
                  disabled={editorBusy}
                >
                  {editorBusy ? "Buscando..." : "Buscar"}
                </button>
              </div>

              <div className="poster-editor-actions">
                <input
                  type="text"
                  className="field-input"
                  value={manualPosterPath}
                  onChange={(e) => setManualPosterPath(e.target.value)}
                  placeholder="Ej: /abc123.jpg o URL completa de TMDB"
                />
                <button
                  type="button"
                  className="tab-button"
                  onClick={() => savePosterPath(manualPosterPath)}
                  disabled={editorBusy}
                >
                  Guardar ruta
                </button>
              </div>

              {editorError ? <p className="form-error">{editorError}</p> : null}
              {editorMessage ? <p className="muted-text">{editorMessage}</p> : null}
              {deleteError ? <p className="form-error">{deleteError}</p> : null}

              {tmdbMatches.length > 0 ? (
                <div className="poster-results">
                  {tmdbMatches.slice(0, 8).map((result) => (
                    <article key={`${result.media_type}-${result.id}`} className="poster-result-card">
                      <img
                        src={`https://image.tmdb.org/t/p/w200${result.poster_path}`}
                        alt={result.title || item.title}
                        className="poster-result-image"
                      />
                      <div className="poster-result-copy">
                        <strong>{result.title || "Sin titulo"}</strong>
                        <span className="muted-text">
                          {result.media_type === "tv" ? "Serie" : "Pelicula"}
                          {result.release_date ? ` · ${result.release_date.slice(0, 4)}` : ""}
                        </span>
                        <button
                          type="button"
                          className="tab-button"
                          onClick={() => savePosterPath(result.poster_path)}
                          disabled={editorBusy}
                        >
                          Usar esta
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}

              <div className="poster-editor-danger">
                <button
                  type="button"
                  className="danger-button"
                  onClick={handleDeleteContent}
                  disabled={deleteBusy}
                >
                  {deleteBusy ? "Eliminando..." : "Eliminar contenido"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
        ) : null}

        <div className="meta-list">
          <p className="meta-row">
            <b>Tipo:</b> {item.type || "Sin datos"}
          </p>
          <p className="meta-row">
            <b>Generos:</b>{" "}
            {item.genres?.map((g) => g.name).join(", ") || "Sin datos"}
          </p>
          <p className="meta-row">
            <b>Plataformas:</b>{" "}
            {item.platforms?.map((p) => p.name).join(", ") || "Sin datos"}
          </p>
          <p className="meta-row">
            <b>Ano:</b> {item.release_year || "Sin datos"}
          </p>
        </div>
      </div>
    </div>
  );
}
