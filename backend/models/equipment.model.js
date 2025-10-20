import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // adjust path if needed

const Equipment = sequelize.define(
  "Equipment",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    equipmentName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "equipment_name",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    equipmentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "equipment_number",
    },
    equipmentImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "equipment_image",
    },
    gymOwnerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: "gym_owner_id",
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "equipment",
    timestamps: false,
  }
);

export default Equipment;
