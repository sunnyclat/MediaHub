import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json(rows);

    /*
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error de DB" });
    */


  }catch (err) {
  console.error("DB ERROR:", err);
  res.status(500).json({
    error: "Error de DB",
    details: err.message
  });
}

});





export default router;