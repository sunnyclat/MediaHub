import ContentCard from "./contentCard";
import "./contentGrid.css";

export default function ContentGrid({ items = [] }) {

  if (items.length === 0) {
    return <p>No hay contenido disponible.</p>;
  }

  return (
    <div className="content-grid">
      {items.map((item) =>
        item ? <ContentCard key={item.id} item={item} /> : null
      )}
    </div>
  );
}
