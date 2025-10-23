import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const FreeWeight = sequelize.define(
  "FreeWeight",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    exercise_category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exercise_details: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gym_owner_id: {
      type: DataTypes.BIGINT,
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

export default FreeWeight;
