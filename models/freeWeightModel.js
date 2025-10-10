import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

export const FreeWeight = sequelize.define(
  "free_weights",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    exercise_category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exercise_details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gym_owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "free_weights",
    timestamps: false,
  }
);
