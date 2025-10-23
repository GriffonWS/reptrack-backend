import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const GymOwner = sequelize.define('GymOwner', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  gymName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'gym_name'
  },
  ownerName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'owner_name'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    field: 'email'
  },
  phoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'phone_number'
  },
  gymLogo: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'gym_logo'
  },
  profileImage: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'profile_image'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'address'
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'admin_id'
  },
  uniqueId: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
    field: 'unique_id'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'password'
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'token'
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'active'
  },
  subscriptionType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'subscription_type'
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    field: 'timestamp'
  }
}, {
  tableName: 'gym_owners',
  timestamps: false,
  hooks: {
    beforeCreate: (gymOwner) => {
      gymOwner.timestamp = new Date();
    },
    afterCreate: async (gymOwner) => {
      // Generate unique ID like RT-01, RT-02, etc.
      gymOwner.uniqueId = `RT-${String(gymOwner.id).padStart(2, '0')}`;
      await gymOwner.save();
    }
  }
});

export default GymOwner;