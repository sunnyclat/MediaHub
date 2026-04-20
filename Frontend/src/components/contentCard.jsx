import { Link } from "react-router-dom";
import "./ContentCard.css";
import { useEffect, useState } from "react";
import {api} from "../api";


export default function ContentCard({ item }) {
  const [poster, setPoster] = useState(null);

  useEffect(() => {
  if (item.poster_path) return;

  const fetchPoster = async () => {
    try {
      const results = await api(`/api/tmdb/search?query=${item.title}`);

      if (Array.isArray(results) && results[0]?.poster_path) {
        setPoster(
          `https://image.tmdb.org/t/p/w500${results[0].poster_path}`
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchPoster();
}, [item]);

  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : poster;

  return (
    <Link to={`/content/${item.id}`} className="content-card">
      <img
        src={
          imageUrl ||
          "https://via.placeholder.com/300x450?text=Sin+imagen"
        }
        alt={item.title}
      />

      <div className="overlay">
        <h3>{item.title}</h3>
        <p>{item.type}</p>
        <span className="detail-link">Ver detalle</span>
      </div>
    </Link>
  );
}