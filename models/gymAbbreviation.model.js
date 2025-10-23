import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const GymAbbreviation = sequelize.define(
  "GymAbbreviation",
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
    tableName: "gym_abbreviation", // ✅ same as in Java entity
    timestamps: false, // we manually manage timestamp
  }
);

export default GymAbbreviation;
