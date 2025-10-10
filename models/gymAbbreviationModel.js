import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

export const GymAbbreviation = sequelize.define(
  "gym_abbreviation",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    abbreviation: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "gym_abbreviation",
    timestamps: false,
  }
);
