import express from "express";
import { listPlatforms } from "../controllers/miscController.js";

const router = express.Router();
router.get("/", listPlatforms);

export default router;