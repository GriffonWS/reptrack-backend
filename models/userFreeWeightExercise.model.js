import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserFreeWeightExercise = sequelize.define(
  "UserFreeWeightExercise",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    exercise_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "user_free_weight_exercises",
    timestamps: false,
  }
);

export default UserFreeWeightExercise;