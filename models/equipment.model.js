import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Equipment = sequelize.define(
  "Equipment",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    equipment_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "equipment_name",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "category",
    },
    equipment_number: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "equipment_number",
    },
    equipment_image: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "equipment_image",
    },
    gym_owner_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "gym_owner_id",
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "user_id",
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "timestamp",
    },
  },
  {
    tableName: "equipment",
    timestamps: false,
  }
);

export default Equipment;
