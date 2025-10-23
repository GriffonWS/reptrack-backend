import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OtherExercise = sequelize.define(
  "OtherExercise",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    exercise_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    exercise_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    exercise_category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "other_exercises",
    timestamps: false,
  }
);

export default OtherExercise;
