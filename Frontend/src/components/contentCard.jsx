import { Link } from "react-router-dom";

// Importa los estilos del componente.
import "./ContentCard.css";

// Hooks de React.
import { useEffect, useState } from "react";

// Función personalizada para hacer requests al backend/API.
import { api } from "../api";


// Componente de tarjeta de contenido.
// Recibe un objeto "item" con información de una película,
// serie u otro contenido.
export default function ContentCard({ item }) {

  // Estado local para almacenar un poster obtenido
  // dinámicamente desde TMDB.
  const [poster, setPoster] = useState(null);

  // useEffect que se ejecuta cuando cambia el item.
  useEffect(() => {

    // Si el item YA tiene poster_path,
    // no hace falta buscar imagen.
    if (item.poster_path) return;

    // Función async para buscar el poster en TMDB.
    const fetchPoster = async () => {
      try {

        // Hace búsqueda por título.
        const results = await api(
          `/api/tmdb/search?query=${item.title}`
        );

        // Si hay resultados y el primero tiene poster:
        if (
          Array.isArray(results) &&
          results[0]?.poster_path
        ) {

          // Construye URL completa de la imagen.
          setPoster(
            `https://image.tmdb.org/t/p/w500${results[0].poster_path}`
          );
        }

      } catch (err) {

        // Muestra errores en consola.
        console.error(err);
      }
    };

    // Ejecuta búsqueda.
    fetchPoster();

  }, [item]);

  // URL final de la imagen.
  // Prioriza:
  // 1. poster_path del item
  // 2. poster encontrado en TMDB
  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : poster;

  return (

    // Toda la tarjeta funciona como link
    // hacia el detalle del contenido.
    <Link
      to={`/content/${item.id}`}
      className="content-card"
    >

      {/* Imagen principal */}
      <img
        src={
          imageUrl ||

          // Imagen fallback si no existe poster.
          "https://via.placeholder.com/300x450?text=Sin+imagen"
        }

        // Texto alternativo para accesibilidad.
        alt={item.title}
      />

      {/* Overlay que aparece sobre la tarjeta */}
      <div className="overlay">

        {/* Título */}
        <h3>{item.title}</h3>

        {/* Tipo de contenido */}
        <p>{item.type}</p>

        {/* Texto de acción */}
        <span className="detail-link">
          Ver detalle
        </span>
      </div>
    </Link>
  );
}