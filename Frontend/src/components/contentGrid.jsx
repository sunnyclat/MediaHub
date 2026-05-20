// Importa el componente de tarjeta individual.
import ContentCard from "./contentCard";

// Importa estilos del grid.
import "./contentGrid.css";


// Componente que renderiza una grilla de contenidos.
// Recibe un array de items.
export default function ContentGrid({ items = [] }) {

  // Si el array está vacío:
  // muestra mensaje fallback.
  if (items.length === 0) {
    return <p>No hay contenido disponible.</p>;
  }

  return (

    // Contenedor principal de la grilla.
    <div className="content-grid">

      {/* Recorre todos los items */}
      {items.map((item) =>

        // Verifica que el item exista antes
        // de renderizar la card.
        item ? (

          // Renderiza una tarjeta por contenido.
          <ContentCard
            key={item.id}
            item={item}
          />

        ) : null
      )}
    </div>
  );
}