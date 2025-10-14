import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

export const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
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
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    uniqueId: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      field: "unique_id",
    },
    gymOwnerId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: "gym_owner_id",
    },
    subscriptionType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "subscription_type",
    },
    dateOfJoining: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "date_of_joining",
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "date_of_birth",
    },
    gender: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    emergencyPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "emergency_phone",
    },
    healthInfo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "health_info",
    },
    height: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    weight: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "profile_image",
    },
    otp: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    otpTimestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "otp_timestamp",
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    deviceToken: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      field: "device_token",
    },
    firebaseToken: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      field: "firebase_token",
    },
    token: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    isProfileUpdated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_profile_updated",
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "user",
    timestamps: false,
    hooks: {
      afterCreate: async (user) => {
        // Generate uniqueId after user is created
        const uniqueId = `RTU-${String(user.id).padStart(2, "0")}`;
        await user.update({ uniqueId });
      },
    },
  }
);

export default User;
