import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'firstname'
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'lastname'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'phone'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'email'
  },
  uniqueId: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'unique_id'
  },
  gymOwnerId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'gym_owner_id'
  },
  subscriptionType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'subscription_type'
  },
  dateOfJoining: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date_of_joining'
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date_of_birth'
  },
  gender: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'gender'
  },
  emergencyPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'emergency_phone'
  },
  healthInfo: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'health_info'
  },
  height: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'height'
  },
  weight: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'weight'
  },
  profileImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'profile_image'
  },
  otp: {
    type: DataTypes.STRING(4),
    allowNull: true,
    field: 'otp'
  },
  otpTimestamp: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'otp_timestamp'
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'status'
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'active'
  },
  deviceToken: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    field: 'device_token'
  },
  firebaseToken: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    field: 'firebase_token'
  },
  token: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    field: 'token'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'password'
  },
  passwordResetToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'password_reset_token'
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'password_reset_expires'
  },
  isProfileUpdated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_profile_updated'
  },
  isNewUser: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_new_user'
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    field: 'timestamp'
  }
}, {
  tableName: 'user',
  timestamps: false,
  hooks: {
    beforeCreate: (user) => {
      user.timestamp = new Date();
    },
    afterCreate: async (user) => {
      // Generate unique ID like RTU-01, RTU-02, etc.
      user.uniqueId = `RTU-${String(user.id).padStart(2, '0')}`;
      await user.save();
    }
  }
});

export default User;