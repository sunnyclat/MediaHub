import { useEffect, useState } from "react";

// Función personalizada para requests al backend.
import { api } from "../api";

// Componente reutilizable que renderiza
// una grilla de contenido.
import ContentGrid from "../components/contentGrid";

// Estilos específicos de catálogo.
import "../pages/catalog.css";

// Estilos generales de páginas.
import "./pageShell.css";


// Página principal del catálogo.
// Permite:
// - cargar contenido
// - buscar contenido
// - visualizar resultados
export default function Catalog() {

  // Estado con todo el contenido recibido del backend.
  const [content, setContent] = useState([]);

  // Estado del input de búsqueda.
  const [search, setSearch] = useState("");

  // Estado de carga.
  const [loading, setLoading] = useState(true);


  // useEffect que carga contenido una sola vez
  // al montar el componente.
  useEffect(() => {

    api("/api/content")

      // Si request sale bien:
      .then((data) => {

        // Guarda contenido.
        setContent(data);

        // Finaliza loading.
        setLoading(false);
      })

      // Si request falla:
      .catch(() => {

        // Finaliza loading igualmente.
        setLoading(false);
      });

  }, []);


  // Filtrado local por título.
  const filtered = content.filter((c) =>

    // Convierte ambos strings a minúsculas
    // para búsqueda case-insensitive.
    c.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  return (
    <>

      {/* Título principal */}
      <h2>Catálogo</h2>


      {/* Input de búsqueda */}
      <input
        placeholder="Buscar películas, series..."
        value={search}

        // Actualiza búsqueda en tiempo real.
        onChange={e => setSearch(e.target.value)}

        // Estilos inline.
        style={{
          padding: 8,
          width: "100%",
          marginBottom: 20
        }}
      />


      {/* Renderiza grilla filtrada */}
      <ContentGrid items={filtered} />
    </>
  );
}