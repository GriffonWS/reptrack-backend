import Favorites from "../models/favorites.model.js";

// ✅ Add to Favorites
export const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exerciseType, equipmentNumber, exerciseName } = req.body;

    if (!exerciseType) {
      return res.status(400).json({
        success: false,
        message: "exerciseType is required",
      });
    }

    // Validate that either equipmentNumber or exerciseName is provided
    if (!equipmentNumber && !exerciseName) {
      return res.status(400).json({
        success: false,
        message: "Either equipmentNumber or exerciseName is required",
      });
    }

    // Check if favorite already exists
    const existingFavorite = await Favorites.findOne({
      where: {
        user_id: userId,
        exercise_type: exerciseType,
        equipment_number: equipmentNumber || null,
        exercise_name: exerciseName || null,
      },
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "This exercise is already in favorites",
      });
    }

    const favorite = await Favorites.create({
      user_id: userId,
      exercise_type: exerciseType,
      equipment_number: equipmentNumber || null,
      exercise_name: exerciseName || null,
    });

    res.status(201).json({
      success: true,
      message: "Added to favorites successfully",
      data: favorite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add to favorites",
      error: error.message,
    });
  }
};

// ✅ Remove from Favorites
export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const favorite = await Favorites.findByPk(id);

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    // Verify the favorite belongs to the authenticated user
    if (favorite.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own favorites.",
      });
    }

    await favorite.destroy();

    res.status(200).json({
      success: true,
      message: "Removed from favorites successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove from favorites",
      error: error.message,
    });
  }
};

// ✅ Get All Favorites by User
export const getAllFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorites.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Favorites fetched successfully",
      data: favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch favorites",
      error: error.message,
    });
  }
};

// ✅ Get Favorites by Exercise Type
export const getFavoritesByType = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exerciseType } = req.query;

    if (!exerciseType) {
      return res.status(400).json({
        success: false,
        message: "exerciseType is required",
      });
    }

    const favorites = await Favorites.findAll({
      where: { user_id: userId, exercise_type: exerciseType },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Favorites fetched successfully",
      data: favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch favorites",
      error: error.message,
    });
  }
};

// ✅ Check if Exercise is Favorited
export const checkFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { exerciseType, equipmentNumber, exerciseName } = req.query;

    if (!exerciseType) {
      return res.status(400).json({
        success: false,
        message: "exerciseType is required",
      });
    }

    const favorite = await Favorites.findOne({
      where: {
        user_id: userId,
        exercise_type: exerciseType,
        equipment_number: equipmentNumber || null,
        exercise_name: exerciseName || null,
      },
    });

    res.status(200).json({
      success: true,
      isFavorited: !!favorite,
      data: favorite || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check favorite status",
      error: error.message,
    });
  }
};
