import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function authRequired(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Token requerido" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role || "user"
    };
    next();
  } catch {
    return res.status(401).json({ message: "Token invalido o expirado" });
  }
}

export function authOptional(req, _res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role || "user"
    };
  } catch {
    req.user = null;
  }

  return next();
}

export function adminRequired(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Solo el administrador puede editar miniaturas" });
  }

  return next();
}
