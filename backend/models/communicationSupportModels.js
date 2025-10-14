import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

export const CommunicationSupport = sequelize.define(
  "communication_support",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    query: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW, // ✅ Auto-fill with current time
    },
  },
  {
    tableName: "communication_supports",
    timestamps: false,
  }
);
