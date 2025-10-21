import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PrivacyPolicy = sequelize.define(
  "PrivacyPolicy",
  {
    id: {
      type: DataTypes.BIGINT,
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
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "privacy_policy",
    timestamps: false,
  }
);

export default PrivacyPolicy;
