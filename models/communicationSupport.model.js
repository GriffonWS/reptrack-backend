import { DataTypes } from "sequelize";
import sequelize from "../config/database.js"; // adjust path if needed

const CommunicationSupport = sequelize.define(
  "CommunicationSupport",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    query: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      // ✅ kept as in your Java entity (typo preserved intentionally)
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "communication_supports",
    timestamps: false,
  }
);

export default CommunicationSupport;
