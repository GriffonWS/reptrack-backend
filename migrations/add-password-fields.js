import sequelize from "../config/database.js";

const migrate = async () => {
  try {
    console.log("🔄 Running migration: Adding password fields to user table...");

    // Add password column
    await sequelize.query(`
      ALTER TABLE user ADD COLUMN password VARCHAR(255) NULL DEFAULT NULL AFTER token
    `);
    console.log("✅ Added password column");

    // Add passwordResetToken column
    await sequelize.query(`
      ALTER TABLE user ADD COLUMN password_reset_token VARCHAR(255) NULL DEFAULT NULL AFTER password
    `);
    console.log("✅ Added password_reset_token column");

    // Add passwordResetExpires column
    await sequelize.query(`
      ALTER TABLE user ADD COLUMN password_reset_expires DATETIME NULL DEFAULT NULL AFTER password_reset_token
    `);
    console.log("✅ Added password_reset_expires column");

    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

migrate();
