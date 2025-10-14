import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

export const PrivacyPolicy = sequelize.define(
  "privacy_policy",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // automatically sets current time
    },
  },
  {
    tableName: "privacy_policy",
    timestamps: false, // disable Sequelize's createdAt/updatedAt
  }
);
