import { useEffect, useState } from "react";
import { api } from "../api";
import ContentGrid from "../components/contentGrid";
import "../pages/catalog.css";
import "./pageShell.css";

export default function Catalog() {
  const [content, setContent] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    api("/api/content")
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = content.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );


  return (
    <>
      <h2>Catálogo</h2>

      <input
        placeholder="Buscar películas, series..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ padding: 8, width: "100%", marginBottom: 20 }}
      />

      <ContentGrid items={filtered} />
    </>
  );
}
