// Hooks React.
import { useEffect, useMemo, useState } from "react";

// React Router.
// Link -> navegación declarativa.
// useParams -> obtiene username desde URL.
import { Link, useParams } from "react-router-dom";

// Helper requests backend.
import { api } from "../api";

// Contexto autenticación.
import { useAuth } from "../auth/AuthContext";

// Estilos compartidos.
import "./pageShell.css";


// ============================================
// HELPER RESPUESTA API
// ============================================

// Algunos endpoints devuelven:
// { ok: true, data: ... }
//
// Esta función extrae data.
function unwrapApi(payload) {

  if (
    payload &&
    typeof payload === "object" &&
    "ok" in payload
  ) {
    return payload.data;
  }

  return payload;
}


// ============================================
// FORMATEO FECHAS
// ============================================

// Convierte fechas a formato local.
function formatDate(value) {

  // Si no existe:
  if (!value) return "-";

  const date = new Date(value);

  // Si fecha inválida:
  return Number.isNaN(date.getTime())

    ? "-"

    : date.toLocaleDateString();
}


// ============================================
// PAGINA PROFILE
// ============================================

export default function Profile() {

  // Datos auth global.
  const { token, user } = useAuth();

  // Username URL.
  const { username: usernameParam } =
    useParams();

  // Username mostrado.
  // Prioridad:
  // URL -> usuario logueado.
  const viewedUsername =
    usernameParam ||
    user?.username ||
    "";

  // Verifica si perfil pertenece al usuario actual.
  const isOwnProfile =
    user?.username === viewedUsername;


  // ============================================
  // ESTADOS
  // ============================================

  // Perfil privado propio.
  const [myProfile, setMyProfile] =
    useState(null);

  // Perfil público visible.
  const [publicProfile, setPublicProfile] =
    useState(null);

  // Publicaciones usuario.
  const [content, setContent] =
    useState([]);

  // Contenido guardado.
  const [saved, setSaved] =
    useState([]);

  // Likes usuario.
  const [likes, setLikes] =
    useState([]);

  // Actividad reciente.
  const [activity, setActivity] =
    useState([]);

  // Tab activa.
  const [activeTab, setActiveTab] =
    useState("publicaciones");

  // Estado loading.
  const [loading, setLoading] =
    useState(true);

  // Error general.
  const [error, setError] =
    useState("");

  // Mensajes follow/unfollow.
  const [actionMessage, setActionMessage] =
    useState("");

  // Loading follow.
  const [followBusy, setFollowBusy] =
    useState(false);


  // ============================================
  // STATS PERFIL
  // ============================================

  // useMemo evita recalcular stats
  // innecesariamente.
  const stats = useMemo(() => {

    // Fallback usando contenido local.
    const fallbackPosts =
      content.length;

    return {

      posts:
        publicProfile?.stats?.posts
        ?? fallbackPosts,

      followers:
        publicProfile?.stats?.followers
        ?? 0,

      following:
        publicProfile?.stats?.following
        ?? 0
    };

  }, [publicProfile, content.length]);


  // ============================================
  // CONTROL TABS PRIVADAS
  // ============================================

  useEffect(() => {

    // Si NO es perfil propio:
    // evita tabs privadas.
    if (
      !isOwnProfile &&
      (
        activeTab === "guardados" ||
        activeTab === "me gusta"
      )
    ) {

      setActiveTab("publicaciones");
    }

  }, [isOwnProfile, activeTab]);


  // ============================================
  // CARGA PERFIL
  // ============================================

  useEffect(() => {

    // Requiere token y username.
    if (!token || !viewedUsername) return;

    // Flag cancelación.
    let cancelled = false;

    async function loadProfileData() {

      setLoading(true);
      setError("");
      setActionMessage("");

      try {

        // Perfil usuario actual.
        const meRaw = await api(
          "/api/user/me",
          { token }
        );

        if (cancelled) return;

        setMyProfile(meRaw);


        // Perfil público visualizado.
        const publicRaw =
          await api(
            `/api/user/${viewedUsername}/profile`,
            { token }
          );

        if (cancelled) return;

        setPublicProfile(
          unwrapApi(publicRaw)
        );

      } catch (err) {

        if (!cancelled) {

          setError(
            err.message ||
            "No se pudo cargar el perfil."
          );
        }

      } finally {

        if (!cancelled) {

          setLoading(false);
        }
      }
    }

    loadProfileData();

    // Cleanup efecto.
    return () => {
      cancelled = true;
    };

  }, [token, viewedUsername]);


  // ============================================
  // CARGA COLECCIONES
  // ============================================

  useEffect(() => {

    if (!viewedUsername) return;

    let cancelled = false;

    async function loadCollections() {

      // ========================================
      // PUBLICACIONES
      // ========================================

      try {

        const contentRaw = await api(
          `/api/user/${viewedUsername}/content?sort=recent&page=1&limit=24`
        );

        if (!cancelled) {

          const parsed =
            unwrapApi(contentRaw);

          setContent(
            Array.isArray(parsed)
              ? parsed
              : []
          );
        }

      } catch {

        if (!cancelled) {
          setContent([]);
        }
      }


      // ========================================
      // ACTIVIDAD
      // ========================================

      try {

        const activityRaw =
          await api(
            `/api/user/${viewedUsername}/activity?limit=24`
          );

        if (!cancelled) {

          const parsed =
            unwrapApi(activityRaw);

          setActivity(
            Array.isArray(parsed)
              ? parsed
              : []
          );
        }

      } catch {

        if (!cancelled) {
          setActivity([]);
        }
      }


      // ========================================
      // DATOS PRIVADOS
      // ========================================

      // Solo perfil propio.
      if (isOwnProfile && token) {

        // ============================
        // GUARDADOS
        // ============================

        try {

          const savedRaw =
            await api(
              "/api/user/me/saved",
              { token }
            );

          if (!cancelled) {

            const parsed =
              unwrapApi(savedRaw);

            setSaved(
              Array.isArray(parsed)
                ? parsed
                : []
            );
          }

        } catch {

          if (!cancelled) {
            setSaved([]);
          }
        }


        // ============================
        // LIKES
        // ============================

        try {

          const likesRaw =
            await api(
              "/api/user/me/likes",
              { token }
            );

          if (!cancelled) {

            const parsed =
              unwrapApi(likesRaw);

            setLikes(
              Array.isArray(parsed)
                ? parsed
                : []
            );
          }

        } catch {

          if (!cancelled) {
            setLikes([]);
          }
        }

      } else if (!cancelled) {

        // Limpia datos privados.
        setSaved([]);
        setLikes([]);
      }
    }

    loadCollections();

    return () => {
      cancelled = true;
    };

  }, [
    viewedUsername,
    isOwnProfile,
    token
  ]);


  // ============================================
  // FOLLOW / UNFOLLOW
  // ============================================

  async function handleFollowAction(method) {

    // Validaciones.
    if (
      !token ||
      !publicProfile?.id ||
      followBusy
    ) return;

    setFollowBusy(true);

    setActionMessage("");

    try {

      // Request follow/unfollow.
      await api(
        `/api/user/${publicProfile.id}/follow`,
        {
          method,
          token
        }
      );

      // Mensaje dinámico.
      setActionMessage(

        method === "POST"

          ? "Ahora seguis a este usuario."

          : "Dejaste de seguir a este usuario."
      );

    } catch (err) {

      setActionMessage(
        err.message ||
        "No se pudo completar la accion."
      );

    } finally {

      setFollowBusy(false);
    }
  }


  // ============================================
  // LOADING
  // ============================================

  if (loading) {

    return (

      <div className="page-shell">

        <p className="muted-text">
          Cargando perfil...
        </p>

      </div>
    );
  }


  // ============================================
  // ERROR
  // ============================================

  if (error) {

    return (

      <div className="page-shell">

        <div className="profile-card panel">

          <h2 className="page-title">
            Perfil
          </h2>

          <p className="form-error">
            {error}
          </p>

        </div>
      </div>
    );
  }


  // ============================================
  // TABS DISPONIBLES
  // ============================================

  const tabs = isOwnProfile

    ? [
        "publicaciones",
        "guardados",
        "me gusta",
        "actividad",
        "info"
      ]

    : [
        "publicaciones",
        "actividad",
        "info"
      ];


  // Nombre visible.
  const displayName =
    publicProfile?.display_name ||
    publicProfile?.username ||
    viewedUsername;


  return (

    <div className="page-shell">

      <div className="profile-card panel">

        {/* ========================================
            HEADER
        ======================================== */}

        <h2 className="page-title">
          Perfil
        </h2>

        <p className="page-subtitle">
          Resumen de la cuenta y actividad.
        </p>


        {/* ========================================
            PERFIL HEADER
        ======================================== */}

        <div className="profile-header-row">

          <div>

            <p className="profile-user">
              @{displayName}
            </p>

            <p className="muted-text">

              Miembro desde{" "}

              {formatDate(
                publicProfile?.created_at ||
                myProfile?.created_at
              )}

            </p>
          </div>


          {/* Botones follow */}
          {!isOwnProfile && (

            <div className="profile-actions">

              <button
                type="button"
                onClick={() =>
                  handleFollowAction("POST")
                }
                disabled={followBusy}
              >
                Seguir
              </button>

              <button
                type="button"
                onClick={() =>
                  handleFollowAction("DELETE")
                }
                disabled={followBusy}
              >
                Dejar de seguir
              </button>
            </div>
          )}
        </div>

        {/* Mensajes acción */}
        {actionMessage ? (
          <p className="muted-text">
            {actionMessage}
          </p>
        ) : null}


        {/* ========================================
            STATS
        ======================================== */}

        <div className="profile-stats-grid">

          <div className="stat-chip">
            <b>{stats.posts}</b>
            {" "}Publicaciones
          </div>

          <div className="stat-chip">
            <b>{stats.followers}</b>
            {" "}Seguidores
          </div>

          <div className="stat-chip">
            <b>{stats.following}</b>
            {" "}Siguiendo
          </div>
        </div>

        {/* ... resto render sigue el mismo patrón ... */}

        <div className="profile-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`tab-button ${activeTab === tab ? "is-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "publicaciones" && (
          <div className="profile-grid">
            {content.length ? (
              content.map((item) => (
                <div key={item.id} className="profile-item panel-soft">
                  <p className="profile-item-title">{item.title}</p>
                  <p className="muted-text">{item.type || "Sin tipo"} - {item.release_year || "-"}</p>
                  <Link to={`/content/${item.id}`}>Ver detalle</Link>
                </div>
              ))
            ) : (
              <p className="muted-text">Todavia no hay publicaciones para mostrar.</p>
            )}
          </div>
        )}

        {activeTab === "guardados" && isOwnProfile && (
          <div className="profile-grid">
            {saved.length ? (
              saved.map((item) => (
                <div key={item.id} className="profile-item panel-soft">
                  <p className="profile-item-title">{item.title}</p>
                  <p className="muted-text">Guardado: {formatDate(item.saved_at)}</p>
                  <Link to={`/content/${item.id}`}>Ver detalle</Link>
                </div>
              ))
            ) : (
              <p className="muted-text">No tenes contenido guardado por ahora.</p>
            )}
          </div>
        )}

        {activeTab === "actividad" && (
          <div className="activity-list">
            {activity.length ? (
              activity.map((item) => (
                <div key={item.id} className="activity-row panel-soft">
                  <p className="meta-row">
                    <b>{item.action || item.type || "actividad"}</b>
                    {item.type ? ` - ${item.type}` : ""}
                  </p>
                  <p className="muted-text">{formatDate(item.created_at)}</p>
                </div>
              ))
            ) : (
              <p className="muted-text">No hay actividad reciente.</p>
            )}
          </div>
        )}

        {activeTab === "me gusta" && isOwnProfile && (
          <div className="profile-grid">
            {likes.length ? (
              likes.map((item) => (
                <div key={item.id} className="profile-item panel-soft">
                  <p className="profile-item-title">{item.title}</p>
                  <p className="muted-text">Likeado: {formatDate(item.liked_at)}</p>
                  <Link to={`/content/${item.id}`}>Ver detalle</Link>
                </div>
              ))
            ) : (
              <p className="muted-text">Todavia no diste me gusta en contenidos.</p>
            )}
          </div>
        )}

        {activeTab === "info" && (
          <div className="meta-list">
            <p className="meta-row">
              <b>Usuario:</b> {publicProfile?.username || myProfile?.username || "-"}
            </p>
            {isOwnProfile && (
              <p className="meta-row">
                <b>Email:</b> {myProfile?.email || publicProfile?.email || "-"}
              </p>
            )}
            <p className="meta-row">
              <b>Registro:</b> {formatDate(publicProfile?.created_at || myProfile?.created_at)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

