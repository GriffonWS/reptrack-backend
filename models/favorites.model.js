import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Favorites = sequelize.define(
  "Favorites",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    exercise_type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "machine, aerobic, free_weight, other",
    },
    equipment_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "For machine/aerobic exercises",
    },
    exercise_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "For free_weight/other exercises",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "favorites",
    timestamps: false,
  }
);

export default Favorites;
