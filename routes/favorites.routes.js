import express from "express";
import {
  addFavorite,
  removeFavorite,
  getAllFavorites,
  getFavoritesByType,
  checkFavorite,
} from "../controllers/favorites.controller.js";
import { verifyUserToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Add to Favorites
router.post("/add", verifyUserToken, addFavorite);

// ✅ Remove from Favorites
router.delete("/remove/:id", verifyUserToken, removeFavorite);

// ✅ Get All Favorites for User
router.get("/all", verifyUserToken, getAllFavorites);

// ✅ Get Favorites by Exercise Type
router.get("/type", verifyUserToken, getFavoritesByType);

// ✅ Check if Exercise is Favorited
router.get("/check", verifyUserToken, checkFavorite);

export default router;
