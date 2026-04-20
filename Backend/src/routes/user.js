import express from "express";
import { authRequired } from "../middleware/auth.js";
import {
  followUser,
  getMyLikes,
  getMySaved,
  getProfile,
  getPublicProfile,
  getUserActivity,
  getUserContent,
  unfollowUser,
  updateMyProfile
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authRequired, getProfile);
router.get("/me/saved", authRequired, getMySaved);
router.get("/me/likes", authRequired, getMyLikes);
router.patch("/me/profile", authRequired, updateMyProfile);

router.post("/:id/follow", authRequired, followUser);
router.delete("/:id/follow", authRequired, unfollowUser);

router.get("/:username/profile", getPublicProfile);
router.get("/:username/content", getUserContent);
router.get("/:username/activity", getUserActivity);

export default router;
