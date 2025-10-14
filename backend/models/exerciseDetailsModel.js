import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

export const ExerciseDetails = sequelize.define(
  "exercise_details",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    equipment_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    miles: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    speed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reps: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sets: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    exercise_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    free_weight_exercise: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    other_exercise: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    exercise_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "exercise_details",
    timestamps: false,
  }
);

export default ExerciseDetails;
