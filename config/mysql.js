// config/mysql.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // ensure env variables are loaded

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST, // must be RDS host
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      // optional, if using SSL
      // ssl: { rejectUnauthorized: true },
    },
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully");
  } catch (error) {
    console.error("❌ Unable to connect to MySQL database:", error);
    throw error;
  }
};
