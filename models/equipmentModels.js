import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

export const Equipment = sequelize.define(
  "equipment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    equipment_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    equipment_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    equipment_image: {
      type: DataTypes.TEXT, // Use TEXT to store full S3 URLs
      allowNull: true,
    },
    gym_owner_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "equipment",
    timestamps: false,
  }
);
