import express from "express";
import fetch from "node-fetch";

const router = express.Router();

function normalizeResults(results = []) {
  return results
    .filter((item) => ["movie", "tv"].includes(item.media_type))
    .map((item) => ({
      ...item,
      title: item.title || item.name,
      release_date: item.release_date || item.first_air_date || null,
      type: item.media_type === "tv" ? "series" : "movie"
    }));
}

router.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    if (!query?.trim()) {
      return res.json([]);
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query.trim())}`
    );

    const data = await response.json();

    res.json(normalizeResults(data.results));
  } catch (error) {
    res.status(500).json({ error: "Error TMDB" });
  }
});


export default router;
