import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

export const Admin = sequelize.define(
  "admin",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "admin",
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW, // ✅ Auto-fill with current time
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "admin",
    timestamps: false, // ✅ Disable Sequelize's automatic timestamps
  }
);
