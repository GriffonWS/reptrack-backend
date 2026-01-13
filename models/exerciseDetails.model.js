import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ExerciseDetails = sequelize.define(
  "ExerciseDetails",
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
    equipment_number: {
      type: DataTypes.INTEGER,
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
    exercise_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    free_weight_exercise: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    other_exercise: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "exercise_details",
    timestamps: false,
  }
);

export default ExerciseDetails;
