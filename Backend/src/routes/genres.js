import express from "express";
import { listGenres } from "../controllers/miscController.js";

const router = express.Router();
router.get("/", listGenres);

export default router;