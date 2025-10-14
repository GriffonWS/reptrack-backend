import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.js";

const GymOwner = sequelize.define(
  "GymOwner",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    gymName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "gym_name",
    },
    ownerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "owner_name",
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      field: "phone_number",
    },
    gymLogo: {
      type: DataTypes.TEXT,
      field: "gym_logo",
    },
    profileImage: {
      type: DataTypes.TEXT,
      field: "profile_image",
    },
    address: {
      type: DataTypes.TEXT,
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "admin_id",
    },
    uniqueId: {
      type: DataTypes.STRING(50),
      unique: true,
      field: "unique_id",
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    subscriptionType: {
      type: DataTypes.STRING(50),
      field: "subscription_type",
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "gym_owners",
    timestamps: false,
    hooks: {
      beforeCreate: (gymOwner) => {
        // Set timestamp before creating
        gymOwner.timestamp = new Date();
      },
      afterCreate: async (gymOwner) => {
        // Generate uniqueId after the record is created (when id is available)
        gymOwner.uniqueId = `RT-${String(gymOwner.id).padStart(2, "0")}`;
        await gymOwner.save();
      },
    },
  }
);

export default GymOwner;
