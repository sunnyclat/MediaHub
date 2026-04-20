import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ensureUserRolesReady } from "./db.js";

import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import genresRoutes from "./routes/genres.js";
import platformsRoutes from "./routes/platforms.js";
import testRoutes from "./routes/test.js";
import tmdbRoutes from "./routes/tmdb.js";
import userRoutes from "./routes/user.js";

dotenv.config();
await ensureUserRolesReady();

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true
}));

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/genres", genresRoutes);
app.use("/api/platforms", platformsRoutes);
app.use("/api/test", testRoutes);
app.use("/api/tmdb", tmdbRoutes);
app.use("/api/user", userRoutes);
app.use("/api/users", userRoutes);

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `No se pudo iniciar el backend porque el puerto ${port} ya esta en uso. Cambia PORT en el .env o cierra el proceso que lo esta usando.`,
    );
    process.exit(1);
  }

  console.error("Error iniciando el servidor:", error);
  process.exit(1);
});
