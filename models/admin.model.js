import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "firstname",
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "lastname",
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "email",
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "password",
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: "timestamp",
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "role",
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "token",
    },
  },
  {
    tableName: "admin",
    timestamps: false,
    hooks: {
      beforeCreate: (admin) => {
        admin.timestamp = new Date();
      },
    },
  }
);

export default Admin;
